import React from 'react';
import {DirectorState} from '../config/timeline';
import {
  clamp,
  FONTS,
  formatTimecode,
  lerp,
  PALETTE,
  seededRandom,
} from '../utils/motion';
import {PhoneScreenView, SceneArtwork} from './Scenes';

const TransitionBadgeIcon: React.FC<{
  kind: 'spin' | 'flip' | 'glitch';
  x: number;
  y: number;
  r?: number;
}> = ({kind, x, y, r = 18}) => (
  <g transform={`translate(${x}, ${y})`}>
    <circle cx="0" cy="0" r={r} fill="#FFFDF8" stroke={PALETTE.ink} strokeWidth="2.8" />
    {kind === 'spin' && (
      <path
        d="M -6 -2 A 7.5 7.5 0 1 1 2.5 7.5 M -7.5 -6 L -6 -1.5 L -1.5 -2.5"
        fill="none"
        stroke="#4B8E82"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    )}
    {kind === 'flip' && (
      <g stroke={PALETTE.ink} strokeWidth="2" fill="#D5F0E3">
        <rect x="-7.5" y="-9" width="15" height="18" rx="2" />
        <line x1="-4" y1="-3.5" x2="4" y2="-3.5" />
        <line x1="-4" y1="1.5" x2="4" y2="1.5" />
      </g>
    )}
    {kind === 'glitch' && (
      <g>
        <rect x="-8.5" y="-6" width="17" height="12" rx="2.5" fill="#A999E8" stroke={PALETTE.ink} strokeWidth="2" />
        <line x1="-10" y1="-1" x2="10" y2="-1" stroke="#FF5E99" strokeWidth="2.4" />
      </g>
    )}
  </g>
);

export const EditorWorkspace: React.FC<{
  state: DirectorState;
  hidePhone?: boolean;
}> = ({state, hidePhone = false}) => {
  const {
    frame,
    editorDrawProgress,
    leftTab,
    placedClipsCount,
    draggingClip,
    audioTrackOpacity,
    ramenCutDone,
    ramenCutGapProgress,
    fallingDefocusProgress,
    placedTransitions,
    flyingTransition,
    subtitleVisible,
    subtitleText,
    flashPct,
    saturationPct,
    saturationOverload,
    zoomImpactPct,
    speedVal,
    beatButtonPressed,
    beatMarkersCount,
    beatPulse,
    exportState,
    exportProgressPct,
    exportProgressText,
    playheadSec,
    endingProgress,
  } = state;

  if (editorDrawProgress <= 0.1) return null;

  const uiOpacity = clamp((editorDrawProgress - 0.1) / 0.5, 0, 1);
  const bgFade = lerp(1, 0.34, endingProgress);

  const renderThumbnail = (
    kind: 'night' | 'ramen' | 'shiba' | 'disco',
    x: number,
    y: number,
    w: number,
    h: number,
    clipId: string,
  ) => (
    <g>
      <defs>
        <clipPath id={clipId}>
          <rect x={x} y={y} width={w} height={h} rx="10" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <g transform={`translate(${x}, ${y}) scale(${w / 200}, ${h / 320})`}>
          <SceneArtwork kind={kind} frame={frame} flashPct={flashPct} />
        </g>
      </g>
      <rect x={x} y={y} width={w} height={h} rx="10" fill="none" stroke={PALETTE.ink} strokeWidth="2.8" />
    </g>
  );

  // Timeline clip X calculation (scale = 72 px/s starting at x=136)
  const cutShift = ramenCutDone ? lerp(0, 134, ramenCutGapProgress) : 0;
  const playheadX = 136 + playheadSec * 72;

  const exportBg =
    exportState === 'done'
      ? '#8EDB97'
      : exportState === 'rendering' || exportState === 'stalled'
        ? '#FFFDF8'
        : PALETTE.teal;

  return (
    <g opacity={uiOpacity}>
      <g opacity={bgFade}>
        {/* Main 9:16 Vertical Editor Window Shell */}
        <rect
          x="24"
          y="24"
          width="1032"
          height="1872"
          rx="28"
          fill={PALETTE.paperLight}
          stroke={PALETTE.ink}
          strokeWidth="3.8"
        />

        {/* 1. TOP BAR (y=24..116) */}
        <path
          d="M 24 52 Q 24 24 52 24 L 1028 24 Q 1056 24 1056 52 L 1056 116 L 24 116 Z"
          fill="#FAF6EE"
          stroke={PALETTE.ink}
          strokeWidth="3"
        />
        <circle cx="58" cy="70" r="8" fill="#E55A52" stroke={PALETTE.ink} strokeWidth="2.2" />
        <circle cx="84" cy="70" r="8" fill="#F1C64E" stroke={PALETTE.ink} strokeWidth="2.2" />
        <circle cx="110" cy="70" r="8" fill="#72B97C" stroke={PALETTE.ink} strokeWidth="2.2" />

        {/* Clapperboard icon */}
        <g transform="translate(134, 54) scale(1.25)">
          <rect x="0" y="6" width="22" height="16" rx="2" fill={PALETTE.geminiBlue} stroke={PALETTE.ink} strokeWidth="2" />
          <path d="M 0 6 L 22 2 L 24 7 L 2 11 Z" fill="#FFFDF8" stroke={PALETTE.ink} strokeWidth="1.8" />
        </g>

        <text x="176" y="79" fill={PALETTE.ink} fontSize="24" fontWeight="700" fontFamily={FONTS.hand}>
          Gemini剪辑_最终版.mp4
        </text>

        {/* Timecode Pill */}
        <rect x="504" y="46" width="186" height="48" rx="12" fill={PALETTE.ink} />
        <text
          x="597"
          y="78"
          textAnchor="middle"
          fill="#FFFDF8"
          fontSize="23"
          fontWeight="700"
          fontFamily={FONTS.mono}
        >
          {formatTimecode(frame)}
        </text>

        {/* 1080p Badge */}
        <rect x="706" y="46" width="88" height="48" rx="12" fill="#FFFDF8" stroke={PALETTE.ink} strokeWidth="2.6" />
        <text x="750" y="78" textAnchor="middle" fill={PALETTE.ink} fontSize="20" fontWeight="700" fontFamily={FONTS.hand}>
          1080p
        </text>

        {/* Export Button (center 921, 70) */}
        <g>
          <rect x="808" y="46" width="226" height="48" rx="13" fill={exportBg} stroke={PALETTE.ink} strokeWidth="2.8" />
          {(exportState === 'rendering' || exportState === 'stalled') && (
            <rect
              x="811"
              y="49"
              width={Math.max(10, (220 * exportProgressPct) / 100)}
              height="42"
              rx="10"
              fill={PALETTE.yellow}
            />
          )}
          <text
            x="921"
            y="78"
            textAnchor="middle"
            fill={exportState === 'rendering' || exportState === 'stalled' ? PALETTE.ink : '#FFFFFF'}
            fontSize="23"
            fontWeight="800"
            fontFamily={FONTS.comic}
          >
            {exportState === 'idle' ? '↑ 导出' : exportProgressText}
          </text>
        </g>

        {/* 3. MIDDLE SPLIT TOOL DECK (y=790..1246) */}
        {/* LEFT TOOL PANEL: 素材 / 转场 / 文字 */}
        <g>
          <rect
            x="44"
            y="790"
            width="504"
            height="456"
            rx="20"
            fill={PALETTE.paperCard}
            stroke={PALETTE.ink}
            strokeWidth="3"
          />
          {[
            {id: 'media' as const, label: '素材', x: 60},
            {id: 'transitions' as const, label: '转场', x: 223},
            {id: 'text' as const, label: '文字', x: 386},
          ].map((tab) => {
            const active = leftTab === tab.id;
            return (
              <g key={tab.id}>
                <rect
                  x={tab.x}
                  y="806"
                  width="146"
                  height="44"
                  rx="11"
                  fill={active ? PALETTE.yellow : '#F3EEE4'}
                  stroke={PALETTE.ink}
                  strokeWidth={active ? '2.8' : '2'}
                />
                <text
                  x={tab.x + 73}
                  y="836"
                  textAnchor="middle"
                  fill={active ? PALETTE.ink : PALETTE.inkMuted}
                  fontSize="22"
                  fontWeight={active ? '800' : '600'}
                  fontFamily={FONTS.hand}
                >
                  {tab.label}
                </text>
              </g>
            );
          })}

          {leftTab === 'media' && (
            <g>
              {[
                {id: 'night' as const, name: '夜景.mp4', dur: '2.4s', x: 60, y: 868},
                {id: 'ramen' as const, name: '拉面.mp4', dur: '4.6s', x: 306, y: 868},
                {id: 'shiba' as const, name: '柴犬.mov', dur: '2.4s', x: 60, y: 1036},
                {id: 'disco' as const, name: 'Gemini蹦迪.mp4', dur: '2.8s', x: 306, y: 1036},
              ].map((item) => (
                <g key={item.id}>
                  {renderThumbnail(item.id, item.x, item.y, 224, 126, `asset-${item.id}`)}
                  <rect x={item.x + 162} y={item.y + 96} width="54" height="24" rx="6" fill="rgba(28,26,25,0.78)" />
                  <text x={item.x + 189} y={item.y + 113} textAnchor="middle" fill="#FFFFFF" fontSize="15" fontFamily={FONTS.mono}>
                    {item.dur}
                  </text>
                  <text
                    x={item.x + 112}
                    y={item.y + 154}
                    textAnchor="middle"
                    fill={PALETTE.ink}
                    fontSize="21"
                    fontWeight="700"
                    fontFamily={FONTS.hand}
                  >
                    {item.name}
                  </text>
                </g>
              ))}
            </g>
          )}

          {leftTab === 'transitions' && (
            <g>
              {[
                {label: '旋转', bg: '#E3DFF8', kind: 'spin' as const, x: 60, y: 868},
                {label: '翻页', bg: '#DAF2E6', kind: 'flip' as const, x: 306, y: 868},
                {label: '故障', bg: '#FCE2EC', kind: 'glitch' as const, x: 60, y: 990},
                {label: '缩放', bg: '#DCEEFB', kind: 'spin' as const, x: 306, y: 990},
                {label: '滑动', bg: '#FEF4D1', kind: 'flip' as const, x: 60, y: 1112},
                {label: '溶解', bg: '#EEECE7', kind: 'glitch' as const, x: 306, y: 1112},
              ].map((t) => (
                <g key={t.label}>
                  <rect x={t.x} y={t.y} width="224" height="86" rx="12" fill={t.bg} stroke={PALETTE.ink} strokeWidth="2.6" />
                  <TransitionBadgeIcon kind={t.kind} x={t.x + 112} y={t.y + 43} r={22} />
                  <text x={t.x + 112} y={t.y + 112} textAnchor="middle" fill={PALETTE.ink} fontSize="20" fontWeight="700" fontFamily={FONTS.hand}>
                    {t.label}
                  </text>
                </g>
              ))}
            </g>
          )}

          {leftTab === 'text' && (
            <g>
              <rect x="60" y="868" width="470" height="104" rx="14" fill={PALETTE.yellowSoft} stroke={PALETTE.ink} strokeWidth="2.8" />
              <text
                x="295"
                y="935"
                textAnchor="middle"
                fill="#F7CD46"
                stroke={PALETTE.ink}
                strokeWidth="7"
                paintOrder="stroke"
                fontSize="42"
                fontWeight="900"
                fontFamily={FONTS.comic}
              >
                前方高能
              </text>

              <rect x="60" y="988" width="470" height="104" rx="14" fill={PALETTE.blush} stroke={PALETTE.ink} strokeWidth="2.6" />
              <rect x="176" y="1012" width="238" height="56" rx="28" fill="#FFFDF8" stroke="#E57A9B" strokeWidth="2.8" />
              <text x="295" y="1051" textAnchor="middle" fill="#D85B83" fontSize="34" fontWeight="800" fontFamily={FONTS.hand}>
                好耶~
              </text>

              <rect x="60" y="1108" width="470" height="108" rx="14" fill="#2A2438" stroke={PALETTE.ink} strokeWidth="2.6" />
              <text
                x="295"
                y="1176"
                textAnchor="middle"
                fill="#FFFFFF"
                stroke="#DF7BFF"
                strokeWidth="4"
                paintOrder="stroke"
                fontSize="38"
                fontWeight="800"
                fontFamily={FONTS.comic}
              >
                霓虹 NEON
              </text>
            </g>
          )}
        </g>

        {/* RIGHT INSPECTOR PANEL: 调整 ✨ */}
        <g>
          <rect
            x="566"
            y="790"
            width="470"
            height="456"
            rx="20"
            fill={PALETTE.paperCard}
            stroke={PALETTE.ink}
            strokeWidth="3"
          />
          <text x="596" y="844" fill={PALETTE.ink} fontSize="30" fontWeight="800" fontFamily={FONTS.hand}>
            调整 ✨
          </text>
          {[
            {
              label: '闪光',
              valText: `${flashPct}%`,
              ratio: flashPct / 100,
              y: 912,
              warn: false,
            },
            {
              label: '饱和度',
              valText: saturationOverload ? '爆表!!' : `${saturationPct}%`,
              ratio: clamp(saturationPct / 250, 0, 1),
              y: 1004,
              warn: saturationOverload,
            },
            {
              label: '缩放冲击',
              valText: `${zoomImpactPct}%`,
              ratio: zoomImpactPct / 100,
              y: 1096,
              warn: false,
            },
            {
              label: '速度',
              valText: `${speedVal.toFixed(1)}x`,
              ratio: 0.45,
              y: 1188,
              warn: false,
            },
          ].map((sl) => {
            const knobX = 596 + sl.ratio * 408;
            return (
              <g key={sl.label}>
                <text x="596" y={sl.y - 22} fill={PALETTE.ink} fontSize="24" fontWeight="700" fontFamily={FONTS.hand}>
                  {sl.label}
                </text>
                <text
                  x="1004"
                  y={sl.y - 22}
                  textAnchor="end"
                  fill={sl.warn ? '#E53935' : PALETTE.inkMuted}
                  fontSize="24"
                  fontWeight={sl.warn ? '900' : '700'}
                  fontFamily={FONTS.mono}
                >
                  {sl.valText}
                </text>
                <rect x="596" y={sl.y - 6} width="408" height="12" rx="6" fill="#EFEAE0" stroke={PALETTE.ink} strokeWidth="2.4" />
                <rect
                  x="596"
                  y={sl.y - 6}
                  width={Math.max(8, sl.ratio * 408)}
                  height="12"
                  rx="6"
                  fill={sl.warn ? '#FF5252' : PALETTE.teal}
                  stroke={PALETTE.ink}
                  strokeWidth="2.2"
                />
                <circle
                  cx={knobX}
                  cy={sl.y}
                  r="15"
                  fill={sl.warn ? '#FFE066' : '#FFFDF8'}
                  stroke={PALETTE.ink}
                  strokeWidth="3.2"
                />
              </g>
            );
          })}
        </g>

        {/* 4. BOTTOM MULTI-TRACK TIMELINE PANEL (y=1266..1872) */}
        <g>
          <rect
            x="44"
            y="1266"
            width="992"
            height="606"
            rx="20"
            fill={PALETTE.paperCard}
            stroke={PALETTE.ink}
            strokeWidth="3"
          />

          {/* Ruler line */}
          <line x1="44" y1="1336" x2="1036" y2="1336" stroke={PALETTE.ink} strokeWidth="2" opacity="0.45" />
          {Array.from({length: 7}).map((_, idx) => {
            const sec = idx * 2;
            const rx = 136 + sec * 72;
            return (
              <g key={sec}>
                <line x1={rx} y1="1318" x2={rx} y2="1336" stroke={PALETTE.inkMuted} strokeWidth="2.2" />
                <line x1={rx + 72} y1="1326" x2={rx + 72} y2="1336" stroke={PALETTE.inkMuted} strokeWidth="1.5" opacity="0.6" />
                <text x={rx} y="1308" textAnchor="middle" fill={PALETTE.inkMuted} fontSize="18" fontFamily={FONTS.mono}>
                  0:{String(sec).padStart(2, '0')}
                </text>
              </g>
            );
          })}

          {/* Track Header Badges */}
          <rect x="62" y="1358" width="54" height="56" rx="12" fill={PALETTE.yellowSoft} stroke={PALETTE.ink} strokeWidth="2.6" />
          <text x="89" y="1396" textAnchor="middle" fill={PALETTE.ink} fontSize="26" fontWeight="800" fontFamily={FONTS.comic}>
            T
          </text>

          <rect x="62" y="1436" width="54" height="124" rx="13" fill={PALETTE.mint} stroke={PALETTE.ink} strokeWidth="2.6" />
          <polygon points="82,1484 82,1512 102,1498" fill={PALETTE.ink} />

          <rect x="62" y="1584" width="54" height="76" rx="13" fill={PALETTE.lavender} stroke={PALETTE.ink} strokeWidth="2.6" />
          <text x="89" y="1634" textAnchor="middle" fill={PALETTE.ink} fontSize="32" fontWeight="800">
            ♪
          </text>

          {/* Lane dividers */}
          <line x1="126" y1="1424" x2="1020" y2="1424" stroke="#EAE4D8" strokeWidth="1.8" />
          <line x1="126" y1="1572" x2="1020" y2="1572" stroke="#EAE4D8" strokeWidth="1.8" />

          {/* TEXT TRACK CLIP */}
          {subtitleVisible && (
            <g>
              <rect x="496" y="1358" width="252" height="56" rx="12" fill={PALETTE.yellow} stroke={PALETTE.ink} strokeWidth="2.8" />
              <text x="516" y="1395" fill={PALETTE.ink} fontSize="23" fontWeight="800" fontFamily={FONTS.hand}>
                T {subtitleText}
              </text>
            </g>
          )}

          {/* VIDEO TRACK CLIPS */}
          {placedClipsCount >= 1 && (
            <g transform={`translate(0, ${-beatPulse * 3})`}>
              {renderThumbnail('night', 136, 1442, 172, 112, 'tl-night')}
              <rect x="144" y="1450" width="84" height="24" rx="7" fill="rgba(255,253,248,0.92)" />
              <text x="186" y="1468" textAnchor="middle" fill={PALETTE.ink} fontSize="15" fontWeight="700" fontFamily={FONTS.hand}>
                夜景.mp4
              </text>
            </g>
          )}

          {placedClipsCount >= 2 && (
            <g transform={`translate(0, ${-beatPulse * 3})`}>
              {!ramenCutDone ? (
                <g>
                  {renderThumbnail('ramen', 314, 1442, 330, 112, 'tl-ramen-full')}
                  <rect x="434" y="1445" width="134" height="106" fill="#787570" opacity="0.82" />
                  <path
                    d="M 434 1445 L 568 1551 M 464 1445 L 568 1525 M 434 1471 L 538 1551"
                    stroke="#55524E"
                    strokeWidth="2.5"
                    opacity="0.5"
                  />
                  <text x="501" y="1505" textAnchor="middle" fill="#FFFFFF" fontSize="18" fontWeight="700" fontFamily={FONTS.hand}>
                    对焦中...
                  </text>
                  <rect x="322" y="1450" width="84" height="24" rx="7" fill="rgba(255,253,248,0.92)" />
                  <text x="364" y="1468" textAnchor="middle" fill={PALETTE.ink} fontSize="15" fontWeight="700" fontFamily={FONTS.hand}>
                    拉面.mp4
                  </text>
                </g>
              ) : (
                <g>
                  {renderThumbnail('ramen', 314, 1442, 118, 112, 'tl-ramen-1')}
                  <rect x="322" y="1450" width="84" height="24" rx="7" fill="rgba(255,253,248,0.92)" />
                  <text x="364" y="1468" textAnchor="middle" fill={PALETTE.ink} fontSize="15" fontWeight="700" fontFamily={FONTS.hand}>
                    拉面.mp4
                  </text>
                  {renderThumbnail('ramen', 572 - cutShift, 1442, 72, 112, 'tl-ramen-2')}
                </g>
              )}
            </g>
          )}

          {/* Falling discarded blurry block into trash */}
          {fallingDefocusProgress > 0 && fallingDefocusProgress < 1 && (
            <g
              transform={`translate(${lerp(501, 610, fallingDefocusProgress)}, ${lerp(1498, 1730, fallingDefocusProgress)}) rotate(${fallingDefocusProgress * 165}) scale(${1 - fallingDefocusProgress * 0.45})`}
            >
              <rect x="-64" y="-42" width="128" height="84" rx="8" fill="#7C7974" stroke={PALETTE.ink} strokeWidth="2.8" />
              <text x="0" y="6" textAnchor="middle" fill="#FFFFFF" fontSize="16" fontFamily={FONTS.hand}>
                对焦中...
              </text>
            </g>
          )}

          {placedClipsCount >= 3 && (
            <g transform={`translate(0, ${-beatPulse * 3})`}>
              {renderThumbnail('shiba', 650 - cutShift, 1442, 172, 112, 'tl-shiba')}
              <rect x={658 - cutShift} y="1450" width="84" height="24" rx="7" fill="rgba(255,253,248,0.92)" />
              <text x={700 - cutShift} y="1468" textAnchor="middle" fill={PALETTE.ink} fontSize="15" fontWeight="700" fontFamily={FONTS.hand}>
                柴犬.mov
              </text>
            </g>
          )}

          {placedClipsCount >= 4 && (
            <g transform={`translate(0, ${-beatPulse * 3})`}>
              {renderThumbnail('disco', 828 - cutShift, 1442, 188, 112, 'tl-disco')}
              <rect x={836 - cutShift} y="1450" width="122" height="24" rx="7" fill="rgba(255,253,248,0.92)" />
              <text x={897 - cutShift} y="1468" textAnchor="middle" fill={PALETTE.ink} fontSize="15" fontWeight="700" fontFamily={FONTS.hand}>
                Gemini蹦迪.mp4
              </text>
            </g>
          )}

          {/* Placed Transition Badges */}
          {placedTransitions >= 1 && <TransitionBadgeIcon kind="spin" x={311} y={1498} />}
          {placedTransitions >= 2 && <TransitionBadgeIcon kind="flip" x={513} y={1498} />}
          {placedTransitions >= 3 && <TransitionBadgeIcon kind="glitch" x={691} y={1498} />}

          {/* Audio Track & Waveform */}
          {audioTrackOpacity > 0.01 && (
            <g opacity={audioTrackOpacity}>
              <rect x="136" y="1584" width="732" height="76" rx="13" fill="#ECE9FB" stroke={PALETTE.ink} strokeWidth="2.6" />
              <text x="152" y="1608" fill="#5D538A" fontSize="17" fontWeight="700" fontFamily={FONTS.hand}>
                ♪ bgm_gemini.wav
              </text>
              {Array.from({length: 88}).map((_, idx) => {
                const bx = 148 + idx * 8.1;
                const amp = 10 + seededRandom(idx * 17 + 3) * 28;
                const pulseAdd = beatMarkersCount > 0 && idx % 4 === 0 ? beatPulse * 10 : 0;
                const h = Math.min(44, amp + pulseAdd);
                return (
                  <rect
                    key={idx}
                    x={bx}
                    y={1628 - h / 2}
                    width="3.8"
                    height={h}
                    rx="1.9"
                    fill={beatMarkersCount > 0 && idx % 4 === 0 ? '#7866D4' : '#9B90D8'}
                  />
                );
              })}

              {/* Beat Sync Button ("▼ 卡点", center 950, 1622) */}
              <g transform={`translate(882, ${1584 + (beatButtonPressed ? 4 : 0)})`}>
                <rect
                  x="0"
                  y="0"
                  width="136"
                  height="76"
                  rx="14"
                  fill={PALETTE.yellow}
                  stroke={PALETTE.ink}
                  strokeWidth="2.8"
                />
                <text x="68" y="48" textAnchor="middle" fill={PALETTE.ink} fontSize="26" fontWeight="900" fontFamily={FONTS.comic}>
                  ▼ 卡点
                </text>
              </g>
            </g>
          )}

          {/* Cascading Golden Beat Triangles */}
          {beatMarkersCount > 0 && (
            <g>
              {Array.from({length: beatMarkersCount}).map((_, i) => {
                const tx = 148 + i * 34;
                return (
                  <polygon
                    key={i}
                    points={`${tx - 8},1676 ${tx + 8},1676 ${tx},1694`}
                    fill={PALETTE.yellow}
                    stroke={PALETTE.ink}
                    strokeWidth="2.2"
                  />
                );
              })}
            </g>
          )}

          {/* Bottom Timeline Zoom Bar & Stats */}
          <line x1="92" y1="1822" x2="230" y2="1822" stroke="#B7AEA4" strokeWidth="3" strokeLinecap="round" />
          <circle cx="152" cy="1822" r="8" fill="#FFFDF8" stroke="#9C9288" strokeWidth="2.5" />
          <text x="68" y="1830" fill="#9C9288" fontSize="24" fontWeight="700">-</text>
          <text x="246" y="1830" fill="#9C9288" fontSize="24" fontWeight="700">+</text>
          <text x="1016" y="1828" textAnchor="end" fill="#A0968E" fontSize="20" fontFamily={FONTS.hand}>
            片段 {placedClipsCount} · 总时长 {ramenCutDone ? '0:10.4' : placedClipsCount === 4 ? '0:12.2' : '0:00.0'}
          </text>

          {/* Red Playhead Needle */}
          <g transform={`translate(${playheadX}, 0)`}>
            <polygon points="-12,1284 12,1284 12,1304 0,1316 -12,1304" fill={PALETTE.coral} stroke={PALETTE.ink} strokeWidth="2.4" />
            <line x1="0" y1="1316" x2="0" y2="1712" stroke={PALETTE.coral} strokeWidth="3" />
          </g>
        </g>

        {/* Flying dragged media card */}
        {draggingClip && (
          <g transform={`translate(${draggingClip.x - 112}, ${draggingClip.y - 63}) rotate(-4)`}>
            {renderThumbnail(draggingClip.id, 0, 0, 224, 126, 'dragging-clip')}
          </g>
        )}

        {/* Flying transition badge */}
        {flyingTransition && (
          <TransitionBadgeIcon kind={flyingTransition.kind} x={flyingTransition.x} y={flyingTransition.y} r={24} />
        )}
      </g>

      {/* 2. HERO SMARTPHONE PREVIEW (centered at 540, 424) */}
      {!hidePhone && (
        <PhoneFrame state={state} x={540} y={424} scale={1.86} />
      )}
    </g>
  );
};

export const PhoneFrame: React.FC<{
  state: DirectorState;
  x: number;
  y: number;
  scale: number;
}> = ({state, x, y, scale}) => {
  const {
    frame,
    phoneScene,
    phonePrevScene,
    phoneTransition,
    phoneTransitionProgress,
    flashPct,
    saturationPct,
    zoomImpactPct,
    beatPulse,
    phoneSubtitle,
    phoneSubtitleGlitchy,
    phoneSocialMode,
    phoneHeadline,
    isPlaying,
    endingProgress,
  } = state;

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <rect x="-94" y="-148" width="194" height="304" rx="28" fill="rgba(43,37,35,0.14)" />
      <rect x="-100" y="-82" width="4" height="22" rx="2" fill="#231F20" />
      <rect x="-100" y="-50" width="4" height="32" rx="2" fill="#231F20" />
      <rect x="96" y="-66" width="4" height="38" rx="2" fill="#231F20" />
      <rect x="-96" y="-152" width="192" height="304" rx="28" fill="#231F20" stroke={PALETTE.ink} strokeWidth="2.5" />

      <defs>
        <clipPath id="phone-viewport">
          <rect x="-86" y="-142" width="172" height="284" rx="20" />
        </clipPath>
      </defs>
      <g clipPath="url(#phone-viewport)">
        <g transform="translate(-86, -142) scale(0.86, 0.8875)">
          <PhoneScreenView
            scene={phoneScene}
            prevScene={phonePrevScene}
            transition={phoneTransition}
            transitionProgress={phoneTransitionProgress}
            frame={frame}
            flashPct={flashPct}
            saturationPct={saturationPct}
            zoomImpactPct={zoomImpactPct}
            beatPulse={beatPulse}
            subtitle={phoneSubtitle}
            subtitleGlitchy={phoneSubtitleGlitchy}
            socialMode={phoneSocialMode}
            headline={phoneHeadline}
          />
        </g>
      </g>

      <rect x="-16" y="-134" width="32" height="9" rx="4.5" fill="#181615" />

      {endingProgress < 0.3 && (
        <g transform="translate(0, 168)" opacity={1 - endingProgress * 3}>
          <path d="M -36 -5 L -36 5 M -28 -5 L -35 0 L -28 5 Z" fill={PALETTE.inkMuted} stroke={PALETTE.inkMuted} strokeWidth="1.5" />
          <circle cx="0" cy="0" r="11" fill="#FFFDF8" stroke={PALETTE.ink} strokeWidth="2" />
          {isPlaying ? (
            <g fill={PALETTE.ink}>
              <rect x="-4" y="-5" width="3" height="10" rx="1" />
              <rect x="1.5" y="-5" width="3" height="10" rx="1" />
            </g>
          ) : (
            <polygon points="-3,-5 -3,5 5,0" fill={PALETTE.ink} />
          )}
          <path d="M 36 -5 L 36 5 M 28 -5 L 35 0 L 28 5 Z" fill={PALETTE.inkMuted} stroke={PALETTE.inkMuted} strokeWidth="1.5" />
        </g>
      )}
    </g>
  );
};
