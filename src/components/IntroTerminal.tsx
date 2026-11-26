import React from 'react';
import {DirectorState} from '../config/timeline';
import {FONTS, lerp, PALETTE} from '../utils/motion';

const PencilIcon: React.FC<{x: number; y: number; angle?: number}> = ({
  x,
  y,
  angle = -38,
}) => (
  <g transform={`translate(${x}, ${y}) rotate(${angle}) scale(1.35)`}>
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

  // Center on 1080x1920 vertical canvas and zip upward as vertical frame draws
  const termScale = lerp(1.18, 0.5, introZipProgress);
  const termX = lerp(540, 260, introZipProgress);
  const termY = lerp(920, 120, introZipProgress);
  const termOpacity = introZipProgress > 0.72 ? lerp(1, 0, (introZipProgress - 0.72) / 0.28) : 1;

  // Vertical outer frame rect: x=24, y=24, w=1032, h=1872
  const fw = 1032;
  const fh = 1872;
  const perimeter = 2 * (fw + fh);
  const dashOffset = perimeter * (1 - editorDrawProgress);

  let pencilX = 24;
  let pencilY = 24;
  const dist = editorDrawProgress * perimeter;
  if (dist < fw) {
    pencilX = 24 + dist;
    pencilY = 24;
  } else if (dist < fw + fh) {
    pencilX = 24 + fw;
    pencilY = 24 + (dist - fw);
  } else if (dist < 2 * fw + fh) {
    pencilX = 24 + fw - (dist - fw - fh);
    pencilY = 24 + fh;
  } else {
    pencilX = 24;
    pencilY = 24 + fh - (dist - 2 * fw - fh);
  }

  return (
    <g>
      {editorDrawProgress > 0 && editorDrawProgress < 1 && (
        <g>
          <rect
            x="24"
            y="24"
            width={fw}
            height={fh}
            rx="28"
            fill="none"
            stroke={PALETTE.ink}
            strokeWidth="4.2"
            strokeDasharray={perimeter}
            strokeDashoffset={dashOffset}
          />
          <PencilIcon x={pencilX} y={pencilY} />
        </g>
      )}

      {termOpacity > 0.01 && (
        <g
          transform={`translate(${termX}, ${termY}) scale(${termScale}) translate(-350, -120)`}
          opacity={termOpacity}
        >
          <rect x="8" y="10" width="700" height="240" rx="18" fill="rgba(43,37,35,0.09)" />
          <rect
            x="0"
            y="0"
            width="700"
            height="240"
            rx="18"
            fill={PALETTE.paperCard}
            stroke={PALETTE.ink}
            strokeWidth="3.2"
          />
          <path
            d="M 0 18 Q 0 0 18 0 L 682 0 Q 700 0 700 18 L 700 42 L 0 42 Z"
            fill="#EFE9DD"
            stroke={PALETTE.ink}
            strokeWidth="2.6"
          />
          <circle cx="28" cy="21" r="7" fill="#E55A52" stroke={PALETTE.ink} strokeWidth="2" />
          <circle cx="52" cy="21" r="7" fill="#F1C64E" stroke={PALETTE.ink} strokeWidth="2" />
          <circle cx="76" cy="21" r="7" fill="#72B97C" stroke={PALETTE.ink} strokeWidth="2" />
          <text
            x="350"
            y="28"
            textAnchor="middle"
            fill={PALETTE.inkMuted}
            fontSize="19"
            fontFamily={FONTS.hand}
          >
            Gemini.js — 终端
          </text>

          {[1, 2, 3].map((num, idx) => (
            <text
              key={num}
              x="28"
              y={96 + idx * 52}
              fill="#B3ABA2"
              fontSize="22"
              fontFamily={FONTS.mono}
            >
              {num}
            </text>
          ))}

          <text x="72" y="96" fontSize="29" fontWeight="700" fontFamily={FONTS.hand}>
            <tspan fill="#755CC2">{l1.slice(0, 6)}</tspan>
            <tspan fill="#429E8F">{l1.slice(6, 11)}</tspan>
            <tspan fill={PALETTE.ink}>{l1.slice(11, 13)}</tspan>
            <tspan fill={PALETTE.geminiBlue}>{l1.slice(13, 19)}</tspan>
            <tspan fill={PALETTE.ink}>{l1.slice(19)}</tspan>
          </text>

          {l2 && (
            <text x="72" y="148" fontSize="29" fontWeight="700" fontFamily={FONTS.hand}>
              <tspan fill="#429E8F">{l2.slice(0, 4)}</tspan>
              <tspan fill={PALETTE.ink}>{l2.slice(4, 8)}</tspan>
              <tspan fill="#C98A2E">{l2.slice(8)}</tspan>
            </text>
          )}

          {l3 && (
            <text x="72" y="200" fontSize="29" fontWeight="700" fontFamily={FONTS.hand}>
              <tspan fill={PALETTE.geminiBlue}>{l3.slice(0, 6)}</tspan>
              <tspan fill={PALETTE.ink}>{l3.slice(6)}</tspan>
            </text>
          )}

          {cursorBlink && (
            <rect
              x={l3 ? 72 + l3.length * 21 : l2 ? 72 + l2.length * 23 : 72 + l1.length * 21}
              y={l3 ? 172 : l2 ? 120 : 68}
              width="13"
              height="32"
              rx="2"
              fill={PALETTE.geminiBlue}
            />
          )}
        </g>
      )}
    </g>
  );
};
