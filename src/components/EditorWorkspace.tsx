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
}> = ({kind, x, y, r = 14}) => (
  <g transform={`translate(${x}, ${y})`}>
    <circle cx="0" cy="0" r={r} fill="#FFFDF8" stroke={PALETTE.ink} strokeWidth="2.4" />
    {kind === 'spin' && (
      <path
        d="M -5 -2 A 6 6 0 1 1 2 6 M -6 -5 L -5 -1 L -1 -2"
        fill="none"
        stroke="#4B8E82"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    )}
    {kind === 'flip' && (
      <g stroke={PALETTE.ink} strokeWidth="1.8" fill="#D5F0E3">
        <rect x="-6" y="-7" width="12" height="14" rx="1.5" />
        <line x1="-3" y1="-3" x2="3" y2="-3" />
        <line x1="-3" y1="1" x2="3" y2="1" />
      </g>
    )}
    {kind === 'glitch' && (
      <g>
        <rect x="-7" y="-5" width="14" height="10" rx="2" fill="#A999E8" stroke={PALETTE.ink} strokeWidth="1.8" />
        <line x1="-8" y1="-1" x2="8" y2="-1" stroke="#FF5E99" strokeWidth="2" />
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
    isPlaying,
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
          <rect x={x} y={y} width={w} height={h} rx="7" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <g transform={`translate(${x}, ${y}) scale(${w / 200}, ${h / 320})`}>
          <SceneArtwork kind={kind} frame={frame} flashPct={flashPct} />
        </g>
      </g>
      <rect x={x} y={y} width={w} height={h} rx="7" fill="none" stroke={PALETTE.ink} strokeWidth="2.4" />
    </g>
  );

  // Timeline clip X calculation
  const cutShift = ramenCutDone ? lerp(0, 130, ramenCutGapProgress) : 0;
  const playheadX = 110 + playheadSec * 68;

  // Export button styling
  const exportBg =
    exportState === 'done'
      ? '#8EDB97'
      : exportState === 'rendering' || exportState === 'stalled'
        ? '#FFFDF8'
        : PALETTE.teal;

  return (
    <g opacity={uiOpacity}>
      {/* Main Window Shell */}
      <g opacity={bgFade}>
        <rect
          x="14"
          y="8"
          width="1252"
          height="704"
          rx="18"
          fill={PALETTE.paperLight}
          stroke={PALETTE.ink}
          strokeWidth="3.2"
        />

        {/* Top Bar */}
        <path
          d="M 14 26 Q 14 8 32 8 L 1248 8 Q 1266 8 1266 26 L 1266 56 L 14 56 Z"
          fill="#FAF6EE"
          stroke={PALETTE.ink}
          strokeWidth="2.6"
        />
        {/* Traffic light buttons */}
        <circle cx="38" cy="32" r="5.5" fill="#E55A52" stroke={PALETTE.ink} strokeWidth="1.8" />
        <circle cx="56" cy="32" r="5.5" fill="#F1C64E" stroke={PALETTE.ink} strokeWidth="1.8" />
        <circle cx="74" cy="32" r="5.5" fill="#72B97C" stroke={PALETTE.ink} strokeWidth="1.8" />

        {/* Clapperboard icon */}
        <g transform="translate(94, 21)">
          <rect x="0" y="6" width="22" height="16" rx="2" fill={PALETTE.robot} stroke={PALETTE.ink} strokeWidth="2" />
          <path d="M 0 6 L 22 2 L 24 7 L 2 11 Z" fill="#FFFDF8" stroke={PALETTE.ink} strokeWidth="1.8" />
        </g>

        {/* Project filename */}
        <text x="128" y="38" fill={PALETTE.ink} fontSize="19" fontWeight="700" fontFamily={FONTS.hand}>
          小克剪辑_最终版_打死不改(3).mp4
        </text>

        {/* Center Timecode Pill */}
        <rect x="564" y="16" width="152" height="32" rx="8" fill={PALETTE.ink} />
        <text
          x="640"
          y="38"
          textAnchor="middle"
          fill="#FFFDF8"
          fontSize="18"
          fontWeight="700"
          fontFamily={FONTS.mono}
        >
          {formatTimecode(frame)}
        </text>
        <text x="734" y="37" fill="#A0968E" fontSize="14" fontFamily={FONTS.hand}>
          · 已自动保存
        </text>

        {/* 1080p Badge */}
        <rect x="988" y="16" width="64" height="32" rx="8" fill="#FFFDF8" stroke={PALETTE.ink} strokeWidth="2.2" />
        <text x="1020" y="37" textAnchor="middle" fill={PALETTE.ink} fontSize="15" fontWeight="700" fontFamily={FONTS.hand}>
          1080p
        </text>

        {/* Export Button */}
        <g>
          <rect x="1064" y="16" width="184" height="32" rx="9" fill={exportBg} stroke={PALETTE.ink} strokeWidth="2.4" />
          {(exportState === 'rendering' || exportState === 'stalled') && (
            <rect
              x="1066"
              y="18"
              width={Math.max(8, (180 * exportProgressPct) / 100)}
              height="28"
              rx="7"
              fill={PALETTE.yellow}
            />
          )}
          <text
            x="1156"
            y="38"
            textAnchor="middle"
            fill={exportState === 'rendering' || exportState === 'stalled' ? PALETTE.ink : '#FFFFFF'}
            fontSize="17"
            fontWeight="800"
            fontFamily={FONTS.comic}
          >
            {exportState === 'idle' ? '↑ 导出' : exportProgressText}
          </text>
        </g>

        {/* LEFT PANEL: 素材 / 转场 / 文字 */}
        <g>
          <rect
            x="24"
            y="64"
            width="256"
            height="318"
            rx="14"
            fill={PALETTE.paperCard}
            stroke={PALETTE.ink}
            strokeWidth="2.6"
          />
          {/* Tabs */}
          {[
            {id: 'media' as const, label: '素材', x: 34},
            {id: 'transitions' as const, label: '转场', x: 114},
            {id: 'text' as const, label: '文字', x: 194},
          ].map((tab) => {
            const active = leftTab === tab.id;
            return (
              <g key={tab.id}>
                <rect
                  x={tab.x}
                  y="73"
                  width="74"
                  height="28"
                  rx="7"
                  fill={active ? PALETTE.yellow : '#F3EEE4'}
                  stroke={PALETTE.ink}
                  strokeWidth={active ? '2.4' : '1.6'}
                />
                <text
                  x={tab.x + 37}
                  y="93"
                  textAnchor="middle"
                  fill={active ? PALETTE.ink : PALETTE.inkMuted}
                  fontSize="15"
                  fontWeight={active ? '800' : '600'}
                  fontFamily={FONTS.hand}
                >
                  {tab.label}
                </text>
              </g>
            );
          })}

          {/* Tab Body: Media */}
          {leftTab === 'media' && (
            <g>
              {[
                {id: 'night' as const, name: '夜景.mp4', dur: '2.4s', x: 36, y: 112},
                {id: 'ramen' as const, name: '拉面.mp4', dur: '4.6s', x: 158, y: 112},
                {id: 'shiba' as const, name: '柴犬.mov', dur: '2.4s', x: 36, y: 202},
                {id: 'disco' as const, name: '小克蹦迪.mp4', dur: '2.8s', x: 158, y: 202},
              ].map((item) => (
                <g key={item.id}>
                  {renderThumbnail(item.id, item.x, item.y, 110, 64, `asset-${item.id}`)}
                  <rect x={item.x + 76} y={item.y + 46} width="30" height="14" rx="4" fill="rgba(28,26,25,0.75)" />
                  <text x={item.x + 91} y={item.y + 57} textAnchor="middle" fill="#FFFFFF" fontSize="10" fontFamily={FONTS.mono}>
                    {item.dur}
                  </text>
                  <text
                    x={item.x + 55}
                    y={item.y + 80}
                    textAnchor="middle"
                    fill={PALETTE.ink}
                    fontSize="13"
                    fontWeight="600"
                    fontFamily={FONTS.hand}
                  >
                    {item.name}
                  </text>
                </g>
              ))}
              {/* Dashed import placeholders */}
              {[36, 158].map((px, idx) => (
                <g key={idx}>
                  <rect
                    x={px}
                    y="296"
                    width="110"
                    height="62"
                    rx="8"
                    fill="#FAF7F0"
                    stroke="#C4BCB2"
                    strokeWidth="2"
                    strokeDasharray="6 5"
                  />
                  <text x={px + 55} y="334" textAnchor="middle" fill="#B8B0A6" fontSize="28">
                    +
                  </text>
                  <text x={px + 55} y="373" textAnchor="middle" fill="#B8B0A6" fontSize="12" fontFamily={FONTS.hand}>
                    导入素材
                  </text>
                </g>
              ))}
            </g>
          )}

          {/* Tab Body: Transitions */}
          {leftTab === 'transitions' && (
            <g>
              {[
                {label: '旋转', bg: '#E3DFF8', kind: 'spin' as const, x: 36, y: 112},
                {label: '翻页', bg: '#DAF2E6', kind: 'flip' as const, x: 158, y: 112},
                {label: '故障', bg: '#FCE2EC', kind: 'glitch' as const, x: 36, y: 196},
                {label: '缩放', bg: '#DCEEFB', kind: 'spin' as const, x: 158, y: 196},
                {label: '滑动', bg: '#FEF4D1', kind: 'flip' as const, x: 36, y: 280},
                {label: '溶解', bg: '#EEECE7', kind: 'glitch' as const, x: 158, y: 280},
              ].map((t) => (
                <g key={t.label}>
                  <rect x={t.x} y={t.y} width="110" height="62" rx="8" fill={t.bg} stroke={PALETTE.ink} strokeWidth="2.2" />
                  <TransitionBadgeIcon kind={t.kind} x={t.x + 55} y={t.y + 31} r={16} />
                  <text x={t.x + 55} y={t.y + 77} textAnchor="middle" fill={PALETTE.ink} fontSize="13" fontWeight="600" fontFamily={FONTS.hand}>
                    {t.label}
                  </text>
                </g>
              ))}
            </g>
          )}

          {/* Tab Body: Text */}
          {leftTab === 'text' && (
            <g>
              <rect x="36" y="114" width="232" height="74" rx="10" fill={PALETTE.yellowSoft} stroke={PALETTE.ink} strokeWidth="2.4" />
              <text
                x="152"
                y="162"
                textAnchor="middle"
                fill="#F7CD46"
                stroke={PALETTE.ink}
                strokeWidth="5"
                paintOrder="stroke"
                fontSize="28"
                fontWeight="900"
                fontFamily={FONTS.comic}
              >
                前方高能
              </text>

              <rect x="36" y="200" width="232" height="74" rx="10" fill={PALETTE.blush} stroke={PALETTE.ink} strokeWidth="2.2" />
              <rect x="86" y="218" width="132" height="38" rx="19" fill="#FFFDF8" stroke="#E57A9B" strokeWidth="2.4" />
              <text x="152" y="244" textAnchor="middle" fill="#D85B83" fontSize="22" fontWeight="800" fontFamily={FONTS.hand}>
                好耶~
              </text>

              <rect x="36" y="286" width="232" height="76" rx="10" fill="#2A2438" stroke={PALETTE.ink} strokeWidth="2.2" />
              <text
                x="152"
                y="334"
                textAnchor="middle"
                fill="#FFFFFF"
                stroke="#DF7BFF"
                strokeWidth="3"
                paintOrder="stroke"
                fontSize="25"
                fontWeight="800"
                fontFamily={FONTS.comic}
              >
                霓虹 NEON
              </text>
            </g>
          )}
        </g>

        {/* RIGHT PANEL: 调整 ✨ */}
        <g>
          <rect
            x="996"
            y="64"
            width="258"
            height="318"
            rx="14"
            fill={PALETTE.paperCard}
            stroke={PALETTE.ink}
            strokeWidth="2.6"
          />
          <text x="1016" y="102" fill={PALETTE.ink} fontSize="22" fontWeight="800" fontFamily={FONTS.hand}>
            调整 ✨
          </text>
          {[
            {
              label: '闪光',
              valText: `${flashPct}%`,
              ratio: flashPct / 100,
              y: 154,
              warn: false,
            },
            {
              label: '饱和度',
              valText: saturationOverload ? '爆表!!' : `${saturationPct}%`,
              ratio: clamp(saturationPct / 250, 0, 1),
              y: 216,
              warn: saturationOverload,
            },
            {
              label: '缩放冲击',
              valText: `${zoomImpactPct}%`,
              ratio: zoomImpactPct / 100,
              y: 278,
              warn: false,
            },
            {
              label: '速度',
              valText: `${speedVal.toFixed(1)}x`,
              ratio: 0.45,
              y: 340,
              warn: false,
            },
          ].map((sl) => {
            const knobX = 1016 + sl.ratio * 218;
            return (
              <g key={sl.label}>
                <text x="1016" y={sl.y - 16} fill={PALETTE.ink} fontSize="16" fontWeight="700" fontFamily={FONTS.hand}>
                  {sl.label}
                </text>
                <text
                  x="1234"
                  y={sl.y - 16}
                  textAnchor="end"
                  fill={sl.warn ? '#E53935' : PALETTE.inkMuted}
                  fontSize="16"
                  fontWeight={sl.warn ? '900' : '700'}
                  fontFamily={FONTS.mono}
                >
                  {sl.valText}
                </text>
                {/* Track */}
                <rect x="1016" y={sl.y - 4} width="218" height="8" rx="4" fill="#EFEAE0" stroke={PALETTE.ink} strokeWidth="2" />
                {/* Active Fill */}
                <rect
                  x="1016"
                  y={sl.y - 4}
                  width={Math.max(4, sl.ratio * 218)}
                  height="8"
                  rx="4"
                  fill={sl.warn ? '#FF5252' : PALETTE.teal}
                  stroke={PALETTE.ink}
                  strokeWidth="1.8"
                />
                {/* Knob */}
                <circle
                  cx={knobX}
                  cy={sl.y}
                  r="10"
                  fill={sl.warn ? '#FFE066' : '#FFFDF8'}
                  stroke={PALETTE.ink}
                  strokeWidth="2.6"
                />
              </g>
            );
          })}
        </g>

        {/* BOTTOM PANEL: TIMELINE */}
        <g>
          <rect
            x="24"
            y="392"
            width="1230"
            height="310"
            rx="14"
            fill={PALETTE.paperCard}
            stroke={PALETTE.ink}
            strokeWidth="2.6"
          />

          {/* Ruler line */}
          <line x1="24" y1="436" x2="1254" y2="436" stroke={PALETTE.ink} strokeWidth="1.6" opacity="0.45" />
          {Array.from({length: 9}).map((_, idx) => {
            const sec = idx * 2;
            const rx = 110 + sec * 68;
            return (
              <g key={sec}>
                <line x1={rx} y1="424" x2={rx} y2="436" stroke={PALETTE.inkMuted} strokeWidth="1.8" />
                <line x1={rx + 68} y1="430" x2={rx + 68} y2="436" stroke={PALETTE.inkMuted} strokeWidth="1.2" opacity="0.6" />
                <text x={rx} y="418" textAnchor="middle" fill={PALETTE.inkMuted} fontSize="13" fontFamily={FONTS.mono}>
                  0:{String(sec).padStart(2, '0')}
                </text>
              </g>
            );
          })}

          {/* Track Header Badges */}
          <rect x="38" y="450" width="38" height="34" rx="8" fill={PALETTE.yellowSoft} stroke={PALETTE.ink} strokeWidth="2.2" />
          <text x="57" y="473" textAnchor="middle" fill={PALETTE.ink} fontSize="18" fontWeight="800" fontFamily={FONTS.comic}>
            T
          </text>

          <rect x="38" y="498" width="38" height="78" rx="10" fill={PALETTE.mint} stroke={PALETTE.ink} strokeWidth="2.2" />
          <polygon points="52,528 52,548 66,538" fill={PALETTE.ink} />

          <rect x="38" y="590" width="38" height="48" rx="10" fill={PALETTE.lavender} stroke={PALETTE.ink} strokeWidth="2.2" />
          <text x="57" y="622" textAnchor="middle" fill={PALETTE.ink} fontSize="22" fontWeight="800">
            ♪
          </text>

          {/* Subtle track lane guides */}
          <line x1="92" y1="490" x2="1244" y2="490" stroke="#EAE4D8" strokeWidth="1.4" />
          <line x1="92" y1="584" x2="1244" y2="584" stroke="#EAE4D8" strokeWidth="1.4" />

          {/* TEXT TRACK CLIP */}
          {subtitleVisible && (
            <g>
              <rect x="454" y="450" width="184" height="34" rx="8" fill={PALETTE.yellow} stroke={PALETTE.ink} strokeWidth="2.4" />
              <text x="468" y="473" fill={PALETTE.ink} fontSize="15" fontWeight="800" fontFamily={FONTS.hand}>
                T {subtitleText}
              </text>
            </g>
          )}

          {/* VIDEO TRACK CLIPS */}
          {/* Clip 1: Night */}
          {placedClipsCount >= 1 && (
            <g transform={`translate(0, ${-beatPulse * 2})`}>
              {renderThumbnail('night', 110, 502, 163, 70, 'tl-night')}
              <rect x="116" y="508" width="62" height="16" rx="5" fill="rgba(255,253,248,0.9)" />
              <text x="147" y="520" textAnchor="middle" fill={PALETTE.ink} fontSize="11" fontWeight="700" fontFamily={FONTS.hand}>
                夜景.mp4
              </text>
            </g>
          )}

          {/* Clip 2: Ramen (before or after cutting defocused middle) */}
          {placedClipsCount >= 2 && (
            <g transform={`translate(0, ${-beatPulse * 2})`}>
              {!ramenCutDone ? (
                <g>
                  {renderThumbnail('ramen', 277, 502, 313, 70, 'tl-ramen-full')}
                  {/* Blurry hatched middle segment */}
                  <rect x="390" y="504" width="130" height="66" fill="#787570" opacity="0.82" />
                  <path
                    d="M 390 504 L 520 570 M 420 504 L 520 554 M 390 524 L 490 570"
                    stroke="#55524E"
                    strokeWidth="2"
                    opacity="0.5"
                  />
                  <text x="455" y="542" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="700" fontFamily={FONTS.hand}>
                    对焦中...
                  </text>
                  <rect x="283" y="508" width="62" height="16" rx="5" fill="rgba(255,253,248,0.9)" />
                  <text x="314" y="520" textAnchor="middle" fill={PALETTE.ink} fontSize="11" fontWeight="700" fontFamily={FONTS.hand}>
                    拉面.mp4
                  </text>
                </g>
              ) : (
                <g>
                  {renderThumbnail('ramen', 277, 502, 111, 70, 'tl-ramen-1')}
                  <rect x="283" y="508" width="62" height="16" rx="5" fill="rgba(255,253,248,0.9)" />
                  <text x="314" y="520" textAnchor="middle" fill={PALETTE.ink} fontSize="11" fontWeight="700" fontFamily={FONTS.hand}>
                    拉面.mp4
                  </text>
                  {renderThumbnail('ramen', 522 - cutShift, 502, 68, 70, 'tl-ramen-2')}
                </g>
              )}
            </g>
          )}

          {/* Falling discarded blurry block into trash */}
          {fallingDefocusProgress > 0 && fallingDefocusProgress < 1 && (
            <g
              transform={`translate(${lerp(455, 610, fallingDefocusProgress)}, ${lerp(536, 650, fallingDefocusProgress)}) rotate(${fallingDefocusProgress * 165}) scale(${1 - fallingDefocusProgress * 0.45})`}
            >
              <rect x="-56" y="-28" width="112" height="56" rx="6" fill="#7C7974" stroke={PALETTE.ink} strokeWidth="2.4" />
              <text x="0" y="5" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontFamily={FONTS.hand}>
                对焦中...
              </text>
            </g>
          )}

          {/* Clip 3: Shiba */}
          {placedClipsCount >= 3 && (
            <g transform={`translate(0, ${-beatPulse * 2})`}>
              {renderThumbnail('shiba', 594 - cutShift, 502, 163, 70, 'tl-shiba')}
              <rect x={600 - cutShift} y="508" width="62" height="16" rx="5" fill="rgba(255,253,248,0.9)" />
              <text x={631 - cutShift} y="520" textAnchor="middle" fill={PALETTE.ink} fontSize="11" fontWeight="700" fontFamily={FONTS.hand}>
                柴犬.mov
              </text>
            </g>
          )}

          {/* Clip 4: Disco */}
          {placedClipsCount >= 4 && (
            <g transform={`translate(0, ${-beatPulse * 2})`}>
              {renderThumbnail('disco', 761 - cutShift, 502, 190, 70, 'tl-disco')}
              <rect x={767 - cutShift} y="508" width="76" height="16" rx="5" fill="rgba(255,253,248,0.9)" />
              <text x={805 - cutShift} y="520" textAnchor="middle" fill={PALETTE.ink} fontSize="11" fontWeight="700" fontFamily={FONTS.hand}>
                小克蹦迪.mp4
              </text>
            </g>
          )}

          {/* Placed Transition Badges */}
          {placedTransitions >= 1 && <TransitionBadgeIcon kind="spin" x={275} y={537} />}
          {placedTransitions >= 2 && <TransitionBadgeIcon kind="flip" x={462} y={537} />}
          {placedTransitions >= 3 && <TransitionBadgeIcon kind="glitch" x={629} y={537} />}

          {/* Audio Track & Waveform */}
          {audioTrackOpacity > 0.01 && (
            <g opacity={audioTrackOpacity}>
              <rect x="110" y="592" width="1026" height="44" rx="10" fill="#ECE9FB" stroke={PALETTE.ink} strokeWidth="2.2" />
              <text x="122" y="608" fill="#5D538A" fontSize="12" fontWeight="700" fontFamily={FONTS.hand}>
                ♪ bgm_小克.wav
              </text>
              {Array.from({length: 142}).map((_, idx) => {
                const bx = 118 + idx * 7.1;
                const amp = 6 + seededRandom(idx * 17 + 3) * 20;
                const pulseAdd = beatMarkersCount > 0 && idx % 4 === 0 ? beatPulse * 6 : 0;
                const h = Math.min(30, amp + pulseAdd);
                return (
                  <rect
                    key={idx}
                    x={bx}
                    y={617 - h / 2}
                    width="3"
                    height={h}
                    rx="1.5"
                    fill={beatMarkersCount > 0 && idx % 4 === 0 ? '#7866D4' : '#9B90D8'}
                  />
                );
              })}

              {/* Beat Sync Button ("▼ 卡点") */}
              <g transform={`translate(1146, ${592 + (beatButtonPressed ? 3 : 0)})`}>
                <rect
                  x="0"
                  y="0"
                  width="96"
                  height="44"
                  rx="10"
                  fill={PALETTE.yellow}
                  stroke={PALETTE.ink}
                  strokeWidth="2.5"
                />
                <text x="48" y="29" textAnchor="middle" fill={PALETTE.ink} fontSize="18" fontWeight="900" fontFamily={FONTS.comic}>
                  ▼ 卡点
                </text>
              </g>
            </g>
          )}

          {/* Cascading Golden Beat Triangles */}
          {beatMarkersCount > 0 && (
            <g>
              {Array.from({length: beatMarkersCount}).map((_, i) => {
                const tx = 118 + i * 32;
                return (
                  <polygon
                    key={i}
                    points={`${tx - 6},646 ${tx + 6},646 ${tx},658`}
                    fill={PALETTE.yellow}
                    stroke={PALETTE.ink}
                    strokeWidth="1.8"
                  />
                );
              })}
            </g>
          )}

          {/* Bottom Timeline Zoom Bar & Stats */}
          <line x1="60" y1="684" x2="156" y2="684" stroke="#B7AEA4" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="102" cy="684" r="5.5" fill="#FFFDF8" stroke="#9C9288" strokeWidth="2" />
          <text x="45" y="689" fill="#9C9288" fontSize="16" fontWeight="700">-</text>
          <text x="166" y="689" fill="#9C9288" fontSize="16" fontWeight="700">+</text>
          <text x="1240" y="688" textAnchor="end" fill="#A0968E" fontSize="13" fontFamily={FONTS.hand}>
            片段 {placedClipsCount} · 总时长 {ramenCutDone ? '0:10.4' : placedClipsCount === 4 ? '0:12.2' : '0:00.0'}
          </text>

          {/* Red Playhead Needle */}
          <g transform={`translate(${playheadX}, 0)`}>
            <polygon points="-9,404 9,404 9,418 0,426 -9,418" fill={PALETTE.coral} stroke={PALETTE.ink} strokeWidth="2" />
            <line x1="0" y1="426" x2="0" y2="664" stroke={PALETTE.coral} strokeWidth="2.4" />
          </g>
        </g>

        {/* Flying dragged media card */}
        {draggingClip && (
          <g transform={`translate(${draggingClip.x - 55}, ${draggingClip.y - 32}) rotate(-4)`}>
            {renderThumbnail(draggingClip.id, 0, 0, 110, 64, 'dragging-clip')}
          </g>
        )}

        {/* Flying transition badge */}
        {flyingTransition && (
          <TransitionBadgeIcon kind={flyingTransition.kind} x={flyingTransition.x} y={flyingTransition.y} r={17} />
        )}
      </g>

      {/* CENTER SMARTPHONE PREVIEW (rendered separately during ending so it stays crisp & zooms up!) */}
      {!hidePhone && (
        <PhoneFrame state={state} x={640} y={216} scale={1} />
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
      {/* Soft phone drop shadow */}
      <rect x="-94" y="-148" width="194" height="304" rx="28" fill="rgba(43,37,35,0.14)" />
      {/* Side hardware buttons */}
      <rect x="-100" y="-82" width="4" height="22" rx="2" fill="#231F20" />
      <rect x="-100" y="-50" width="4" height="32" rx="2" fill="#231F20" />
      <rect x="96" y="-66" width="4" height="38" rx="2" fill="#231F20" />
      {/* Outer Black Phone Bezel */}
      <rect x="-96" y="-152" width="192" height="304" rx="28" fill="#231F20" stroke={PALETTE.ink} strokeWidth="2.5" />

      {/* Screen Viewport */}
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

      {/* Dynamic Island Pill */}
      <rect x="-16" y="-134" width="32" height="9" rx="4.5" fill="#181615" />

      {/* Transport Controls below phone (hidden during ending zoom) */}
      {endingProgress < 0.3 && (
        <g transform="translate(0, 166)" opacity={1 - endingProgress * 3}>
          {/* Prev */}
          <path d="M -36 -5 L -36 5 M -28 -5 L -35 0 L -28 5 Z" fill={PALETTE.inkMuted} stroke={PALETTE.inkMuted} strokeWidth="1.5" />
          {/* Play / Pause circle */}
          <circle cx="0" cy="0" r="11" fill="#FFFDF8" stroke={PALETTE.ink} strokeWidth="2" />
          {isPlaying ? (
            <g fill={PALETTE.ink}>
              <rect x="-4" y="-5" width="3" height="10" rx="1" />
              <rect x="1.5" y="-5" width="3" height="10" rx="1" />
            </g>
          ) : (
            <polygon points="-3,-5 -3,5 5,0" fill={PALETTE.ink} />
          )}
          {/* Next */}
          <path d="M 36 -5 L 36 5 M 28 -5 L 35 0 L 28 5 Z" fill={PALETTE.inkMuted} stroke={PALETTE.inkMuted} strokeWidth="1.5" />
        </g>
      )}
    </g>
  );
};
