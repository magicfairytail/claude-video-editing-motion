import React from 'react';
import {DirectorState} from '../config/timeline';
import {easeOutBack, FONTS, HEIGHT, lerp, PALETTE, remap, seededRandom, WIDTH} from '../utils/motion';
import {geminiStarPath} from './Robot';

export const EffectsOverlay: React.FC<{state: DirectorState}> = ({state}) => {
  const {
    frame,
    trashCanProgress,
    fixedStampProgress,
    callouts,
    screenFlashOpacity,
    screenDimOpacity,
    endingProgress,
    confettiProgress,
  } = state;

  const noteOpacity = remap(frame, 808, 822, 0, 1);
  const line1Chars = Math.floor(remap(frame, 816, 842, 0, 6));
  const line2Progress = remap(frame, 842, 868, 0, 1, easeOutBack);
  const underlineProgress = remap(frame, 856, 876, 0, 1);
  const sigOpacity = remap(frame, 870, 886, 0, 1);

  return (
    <g>
      {/* Bouncing Trash Can during Ramen Cut */}
      {trashCanProgress > 0.02 && (
        <g transform={`translate(610, 1745) scale(${trashCanProgress * 1.35})`}>
          <path
            d="M -28 -26 L 28 -26 L 22 34 L -22 34 Z"
            fill="#C7C2BA"
            stroke={PALETTE.ink}
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <rect x="-32" y="-36" width="64" height="10" rx="4" fill="#B5AFA6" stroke={PALETTE.ink} strokeWidth="2.8" />
          <rect x="-12" y="-44" width="24" height="8" rx="3" fill="#B5AFA6" stroke={PALETTE.ink} strokeWidth="2.4" />
          <line x1="-12" y1="-16" x2="-10" y2="24" stroke={PALETTE.ink} strokeWidth="2.2" strokeLinecap="round" />
          <line x1="0" y1="-16" x2="0" y2="24" stroke={PALETTE.ink} strokeWidth="2.2" strokeLinecap="round" />
          <line x1="12" y1="-16" x2="10" y2="24" stroke={PALETTE.ink} strokeWidth="2.2" strokeLinecap="round" />
        </g>
      )}

      {/* Green Tilted Stamp ("已修正") on right side of hero phone */}
      {fixedStampProgress > 0.02 && (
        <g
          transform={`translate(868, 430) rotate(-13) scale(${0.95 + fixedStampProgress * 0.25})`}
          opacity={fixedStampProgress}
        >
          <rect x="-98" y="-38" width="196" height="76" rx="12" fill="rgba(255,253,248,0.9)" stroke={PALETTE.greenStamp} strokeWidth="5" strokeDasharray="10 3" />
          <rect x="-88" y="-29" width="176" height="58" rx="7" fill="none" stroke={PALETTE.greenStamp} strokeWidth="2.2" />
          <text
            x="0"
            y="14"
            textAnchor="middle"
            fill={PALETTE.greenStamp}
            fontSize="42"
            fontWeight="900"
            fontFamily={FONTS.comic}
            letterSpacing="6"
          >
            已修正
          </text>
        </g>
      )}

      {/* Comic SFX Popouts */}
      {callouts.map((c, idx) => (
        <g
          key={`${c.text}-${idx}`}
          transform={`translate(${c.x}, ${c.y}) rotate(${c.rotate}) scale(${c.scale})`}
          opacity={c.opacity}
        >
          <text
            x="0"
            y="0"
            textAnchor="middle"
            fill={c.color}
            stroke={PALETTE.ink}
            strokeWidth="12"
            paintOrder="stroke"
            strokeLinejoin="round"
            fontSize="64"
            fontWeight="900"
            fontFamily={FONTS.comic}
          >
            {c.text}
          </text>
        </g>
      ))}

      {/* Saturation Overload Screen Flash / Dim */}
      {screenFlashOpacity > 0.01 && (
        <rect x="0" y="0" width={WIDTH} height={HEIGHT} fill="#FFF9E6" opacity={screenFlashOpacity} />
      )}
      {screenDimOpacity > 0.01 && (
        <rect x="0" y="0" width={WIDTH} height={HEIGHT} fill="#181615" opacity={screenDimOpacity} />
      )}

      {/* Vertical Ending Taped Sticky Note (bottom-left below hero phone) */}
      {endingProgress > 0.05 && noteOpacity > 0.01 && (
        <g
          transform={`translate(362, 1490) rotate(-1.8) scale(${lerp(0.92, 1.15, noteOpacity)})`}
          opacity={noteOpacity}
        >
          <rect x="-214" y="-168" width="436" height="344" rx="12" fill="rgba(43,37,35,0.13)" />
          <rect x="-218" y="-174" width="436" height="344" rx="10" fill="#FFFDF8" stroke={PALETTE.ink} strokeWidth="3.2" />
          {[-96, -36, 24, 84, 132].map((ly, idx) => (
            <line key={idx} x1="-202" y1={ly} x2="202" y2={ly} stroke="#ECE7DC" strokeWidth="1.6" />
          ))}
          <rect x="-56" y="-188" width="112" height="28" rx="4" fill="#F2CD5C" opacity="0.88" stroke="#D1AB42" strokeWidth="1.4" />

          <text
            x="-182"
            y="-108"
            fill={PALETTE.ink}
            fontSize="36"
            fontWeight="700"
            fontFamily={FONTS.hand}
          >
            {'30 秒剪完，'.slice(0, line1Chars)}
          </text>

          {line2Progress > 0.01 && (
            <g transform={`translate(-10, 12) scale(${line2Progress})`}>
              <defs>
                <linearGradient id="noteGeminiGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#4285F4" />
                  <stop offset="55%" stopColor="#7C6AF6" />
                  <stop offset="100%" stopColor="#C46EF4" />
                </linearGradient>
              </defs>
              <text
                x="0"
                y="0"
                textAnchor="middle"
                fill="url(#noteGeminiGrad)"
                stroke={PALETTE.ink}
                strokeWidth="2.4"
                paintOrder="stroke"
                fontSize="76"
                fontWeight="900"
                fontFamily={FONTS.comic}
              >
                Gemini
              </text>
              <path
                transform="translate(142, -36)"
                d={geminiStarPath(21)}
                fill="url(#noteGeminiGrad)"
                stroke={PALETTE.ink}
                strokeWidth="2.4"
              />
            </g>
          )}

          {underlineProgress > 0.01 && (
            <path
              d="M -170 36 Q 0 18 172 32"
              fill="none"
              stroke="url(#noteGeminiGrad)"
              strokeWidth="9"
              strokeLinecap="round"
              strokeDasharray="360"
              strokeDashoffset={360 * (1 - underlineProgress)}
            />
          )}

          {sigOpacity > 0.01 && (
            <text
              x="0"
              y="118"
              textAnchor="middle"
              fill={PALETTE.inkMuted}
              fontSize="32"
              fontWeight="700"
              fontFamily={FONTS.hand}
              opacity={sigOpacity}
            >
              — Gemini ✨
            </text>
          )}
        </g>
      )}

      {/* Celebratory Confetti across 1080x1920 vertical frame */}
      {confettiProgress > 0 && (
        <g>
          {Array.from({length: 42}).map((_, i) => {
            const colors = ['#4285F4', '#8B6CF6', '#67D9F6', '#F1C64E', '#FF85A1'];
            const startX = 920 + (seededRandom(i * 19 + 1) - 0.65) * 680;
            const startY = 40 + seededRandom(i * 23 + 2) * 180;
            const vx = (seededRandom(i * 31 + 3) - 0.55) * 420;
            const vy = 260 + seededRandom(i * 37 + 4) * 1450;
            const cx = startX + vx * confettiProgress;
            const cy = startY + vy * confettiProgress;
            const rot = (seededRandom(i * 41 + 5) * 360 + confettiProgress * 540) % 360;
            const alpha = confettiProgress > 0.85 ? (1 - confettiProgress) / 0.15 : 0.92;
            return (
              <rect
                key={i}
                x={cx}
                y={cy}
                width={i % 2 === 0 ? 15 : 11}
                height={i % 2 === 0 ? 8 : 11}
                rx="2"
                fill={colors[i % colors.length]}
                stroke={PALETTE.ink}
                strokeWidth="1.5"
                opacity={alpha}
                transform={`rotate(${rot} ${cx} ${cy})`}
              />
            );
          })}
        </g>
      )}
    </g>
  );
};
