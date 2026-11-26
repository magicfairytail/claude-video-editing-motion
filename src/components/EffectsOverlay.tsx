import React from 'react';
import {DirectorState} from '../config/timeline';
import {easeOutBack, FONTS, lerp, PALETTE, remap, seededRandom} from '../utils/motion';

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

  // Sticky note progressive text reveal during ending (810..885)
  const noteOpacity = remap(frame, 808, 822, 0, 1);
  const line1Chars = Math.floor(remap(frame, 816, 842, 0, 6));
  const line2Progress = remap(frame, 842, 868, 0, 1, easeOutBack);
  const underlineProgress = remap(frame, 856, 876, 0, 1);
  const sigOpacity = remap(frame, 870, 886, 0, 1);

  return (
    <g>
      {/* Bouncing Trash Can during Ramen Cut */}
      {trashCanProgress > 0.02 && (
        <g
          transform={`translate(610, 650) scale(${trashCanProgress})`}
        >
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

      {/* Green Tilted Stamp ("已修正") */}
      {fixedStampProgress > 0.02 && (
        <g
          transform={`translate(888, 224) rotate(-13) scale(${0.8 + fixedStampProgress * 0.25})`}
          opacity={fixedStampProgress}
        >
          <rect x="-92" y="-36" width="184" height="72" rx="10" fill="rgba(255,253,248,0.85)" stroke={PALETTE.greenStamp} strokeWidth="4.5" strokeDasharray="10 3" />
          <rect x="-84" y="-28" width="168" height="56" rx="6" fill="none" stroke={PALETTE.greenStamp} strokeWidth="2" />
          <text
            x="0"
            y="14"
            textAnchor="middle"
            fill={PALETTE.greenStamp}
            fontSize="40"
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
            strokeWidth="10"
            paintOrder="stroke"
            strokeLinejoin="round"
            fontSize="50"
            fontWeight="900"
            fontFamily={FONTS.comic}
          >
            {c.text}
          </text>
        </g>
      ))}

      {/* Saturation Overload Screen Flash / Dim */}
      {screenFlashOpacity > 0.01 && (
        <rect x="0" y="0" width="1280" height="720" fill="#FFF9E6" opacity={screenFlashOpacity} />
      )}
      {screenDimOpacity > 0.01 && (
        <rect x="0" y="0" width="1280" height="720" fill="#181615" opacity={screenDimOpacity} />
      )}

      {/* Ending Taped Sticky Note on Left */}
      {endingProgress > 0.05 && noteOpacity > 0.01 && (
        <g
          transform={`translate(226, 336) rotate(-1.6) scale(${lerp(0.92, 1, noteOpacity)})`}
          opacity={noteOpacity}
        >
          {/* Paper shadow */}
          <rect x="-176" y="-154" width="360" height="316" rx="10" fill="rgba(43,37,35,0.12)" />
          {/* Sticky note sheet */}
          <rect x="-180" y="-160" width="360" height="316" rx="8" fill="#FFFDF8" stroke={PALETTE.ink} strokeWidth="2.8" />
          {/* Subtle ruled paper lines */}
          {[-86, -32, 22, 76, 120].map((ly, idx) => (
            <line key={idx} x1="-166" y1={ly} x2="166" y2={ly} stroke="#ECE7DC" strokeWidth="1.4" />
          ))}
          {/* Top yellow masking tape */}
          <rect x="-48" y="-172" width="96" height="24" rx="3" fill="#F2CD5C" opacity="0.88" stroke="#D1AB42" strokeWidth="1.2" />

          {/* Line 1: 30 秒剪完， */}
          <text
            x="-150"
            y="-96"
            fill={PALETTE.ink}
            fontSize="32"
            fontWeight="700"
            fontFamily={FONTS.hand}
          >
            {'30 秒剪完，'.slice(0, line1Chars)}
          </text>

          {/* Line 2: Opus 5.5 */}
          {line2Progress > 0.01 && (
            <g transform={`translate(0, 12) scale(${line2Progress})`}>
              <text
                x="0"
                y="0"
                textAnchor="middle"
                fill={PALETTE.ink}
                fontSize="66"
                fontWeight="900"
                fontFamily={FONTS.comic}
              >
                Opus 5.5
              </text>
            </g>
          )}

          {/* Coral hand-drawn brush underline */}
          {underlineProgress > 0.01 && (
            <path
              d="M -146 34 Q 0 18 148 30"
              fill="none"
              stroke={PALETTE.robot}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray="300"
              strokeDashoffset={300 * (1 - underlineProgress)}
            />
          )}

          {/* Signature */}
          {sigOpacity > 0.01 && (
            <text
              x="0"
              y="108"
              textAnchor="middle"
              fill={PALETTE.inkMuted}
              fontSize="28"
              fontWeight="700"
              fontFamily={FONTS.hand}
              opacity={sigOpacity}
            >
              — 小克 ✨
            </text>
          )}
        </g>
      )}

      {/* Celebratory Confetti */}
      {confettiProgress > 0 && (
        <g>
          {Array.from({length: 34}).map((_, i) => {
            const colors = ['#F1C64E', '#E55A52', '#65B6A7', '#9D7BFF', '#FF85A1'];
            const startX = 1150 + (seededRandom(i * 19 + 1) - 0.5) * 420;
            const startY = 20 + seededRandom(i * 23 + 2) * 80;
            const vx = (seededRandom(i * 31 + 3) - 0.55) * 320;
            const vy = 120 + seededRandom(i * 37 + 4) * 520;
            const cx = startX + vx * confettiProgress;
            const cy = startY + vy * confettiProgress;
            const rot = (seededRandom(i * 41 + 5) * 360 + confettiProgress * 540) % 360;
            const alpha = confettiProgress > 0.85 ? (1 - confettiProgress) / 0.15 : 0.92;
            return (
              <rect
                key={i}
                x={cx}
                y={cy}
                width={i % 2 === 0 ? 11 : 8}
                height={i % 2 === 0 ? 6 : 8}
                rx="1.5"
                fill={colors[i % colors.length]}
                stroke={PALETTE.ink}
                strokeWidth="1.2"
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
