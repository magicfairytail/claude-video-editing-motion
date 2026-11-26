import React from 'react';
import {DirectorState} from '../config/timeline';
import {FONTS, lerp, PALETTE} from '../utils/motion';

const PencilIcon: React.FC<{x: number; y: number; angle?: number}> = ({
  x,
  y,
  angle = -38,
}) => (
  <g transform={`translate(${x}, ${y}) rotate(${angle})`}>
    <polygon points="0,0 10,-5 10,5" fill="#F2D7B6" stroke={PALETTE.ink} strokeWidth="1.8" />
    <polygon points="0,0 4,-2 4,2" fill={PALETTE.ink} />
    <rect x="10" y="-5" width="32" height="10" fill="#F1C64E" stroke={PALETTE.ink} strokeWidth="1.8" />
    <rect x="42" y="-5" width="8" height="10" rx="2" fill="#F39CA8" stroke={PALETTE.ink} strokeWidth="1.8" />
  </g>
);

export const IntroTerminal: React.FC<{state: DirectorState}> = ({state}) => {
  const {showIntro, introTerminalProgress, introZipProgress, editorDrawProgress, frame} = state;

  if (!showIntro && editorDrawProgress >= 1) return null;

  const line1Full = 'const 剪辑软件 = Gemini.写代码()';
  const line2Full = '剪辑软件.画出(时间轴, 预览, 面板)';
  const line3Full = 'Gemini.钻进去()';

  const totalChars = line1Full.length + line2Full.length + line3Full.length;
  const shownChars = Math.floor(introTerminalProgress * totalChars);

  const l1 = line1Full.slice(0, Math.min(line1Full.length, shownChars));
  const l2 =
    shownChars > line1Full.length
      ? line2Full.slice(0, Math.min(line2Full.length, shownChars - line1Full.length))
      : '';
  const l3 =
    shownChars > line1Full.length + line2Full.length
      ? line3Full.slice(0, shownChars - line1Full.length - line2Full.length)
      : '';

  const cursorBlink = Math.floor(frame / 4) % 2 === 0;

  // Zip terminal to top-left while editor frame draws around the canvas
  const termScale = lerp(1, 0.45, introZipProgress);
  const termX = lerp(640, 220, introZipProgress);
  const termY = lerp(360, 48, introZipProgress);
  const termOpacity = introZipProgress > 0.72 ? lerp(1, 0, (introZipProgress - 0.72) / 0.28) : 1;

  // Outer perimeter progress for pencil trace
  const perimeter = 2 * (1252 + 704);
  const dashOffset = perimeter * (1 - editorDrawProgress);

  // Pencil position traveling clockwise along the outer rect
  let pencilX = 14;
  let pencilY = 8;
  const dist = editorDrawProgress * perimeter;
  if (dist < 1252) {
    pencilX = 14 + dist;
    pencilY = 8;
  } else if (dist < 1252 + 704) {
    pencilX = 1266;
    pencilY = 8 + (dist - 1252);
  } else if (dist < 2 * 1252 + 704) {
    pencilX = 1266 - (dist - 1252 - 704);
    pencilY = 712;
  } else {
    pencilX = 14;
    pencilY = 712 - (dist - 2 * 1252 - 704);
  }

  return (
    <g>
      {/* Animated outer frame sketch trace */}
      {editorDrawProgress > 0 && editorDrawProgress < 1 && (
        <g>
          <rect
            x="14"
            y="8"
            width="1252"
            height="704"
            rx="18"
            fill="none"
            stroke={PALETTE.ink}
            strokeWidth="3.5"
            strokeDasharray={perimeter}
            strokeDashoffset={dashOffset}
          />
          <PencilIcon x={pencilX} y={pencilY} />
        </g>
      )}

      {/* Terminal card */}
      {termOpacity > 0.01 && (
        <g
          transform={`translate(${termX}, ${termY}) scale(${termScale}) translate(-330, -108)`}
          opacity={termOpacity}
        >
          {/* Soft drop shadow */}
          <rect x="6" y="8" width="660" height="216" rx="14" fill="rgba(43,37,35,0.08)" />
          <rect
            x="0"
            y="0"
            width="660"
            height="216"
            rx="14"
            fill={PALETTE.paperCard}
            stroke={PALETTE.ink}
            strokeWidth="3"
          />
          {/* Title bar */}
          <path
            d="M 0 14 Q 0 0 14 0 L 646 0 Q 660 0 660 14 L 660 36 L 0 36 Z"
            fill="#EFE9DD"
            stroke={PALETTE.ink}
            strokeWidth="2.4"
          />
          <circle cx="24" cy="18" r="6" fill="#E55A52" stroke={PALETTE.ink} strokeWidth="1.8" />
          <circle cx="44" cy="18" r="6" fill="#F1C64E" stroke={PALETTE.ink} strokeWidth="1.8" />
          <circle cx="64" cy="18" r="6" fill="#72B97C" stroke={PALETTE.ink} strokeWidth="1.8" />
          <text
            x="330"
            y="24"
            textAnchor="middle"
            fill={PALETTE.inkMuted}
            fontSize="16"
            fontFamily={FONTS.hand}
          >
            Gemini.js — 终端
          </text>

          {/* Code lines */}
          {[1, 2, 3].map((num, idx) => (
            <text
              key={num}
              x="24"
              y={84 + idx * 46}
              fill="#B3ABA2"
              fontSize="20"
              fontFamily={FONTS.mono}
            >
              {num}
            </text>
          ))}

          {/* Line 1 syntax highlighted */}
          <text x="64" y="84" fontSize="26" fontWeight="700" fontFamily={FONTS.hand}>
            <tspan fill="#755CC2">{l1.slice(0, 6)}</tspan>
            <tspan fill="#429E8F">{l1.slice(6, 11)}</tspan>
            <tspan fill={PALETTE.ink}>{l1.slice(11, 13)}</tspan>
            <tspan fill={PALETTE.geminiBlue}>{l1.slice(13, 19)}</tspan>
            <tspan fill={PALETTE.ink}>{l1.slice(19)}</tspan>
          </text>

          {/* Line 2 */}
          {l2 && (
            <text x="64" y="130" fontSize="26" fontWeight="700" fontFamily={FONTS.hand}>
              <tspan fill="#429E8F">{l2.slice(0, 4)}</tspan>
              <tspan fill={PALETTE.ink}>{l2.slice(4, 8)}</tspan>
              <tspan fill="#C98A2E">{l2.slice(8)}</tspan>
            </text>
          )}

          {/* Line 3 */}
          {l3 && (
            <text x="64" y="176" fontSize="26" fontWeight="700" fontFamily={FONTS.hand}>
              <tspan fill={PALETTE.geminiBlue}>{l3.slice(0, 6)}</tspan>
              <tspan fill={PALETTE.ink}>{l3.slice(6)}</tspan>
            </text>
          )}

          {/* Blinking block cursor */}
          {cursorBlink && (
            <rect
              x={l3 ? 64 + l3.length * 19 : l2 ? 64 + l2.length * 21 : 64 + l1.length * 19}
              y={l3 ? 152 : l2 ? 106 : 60}
              width="12"
              height="28"
              rx="2"
              fill={PALETTE.geminiBlue}
            />
          )}
        </g>
      )}
    </g>
  );
};
