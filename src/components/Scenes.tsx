import React from 'react';
import {SceneKind, TransitionKind} from '../config/timeline';
import {FONTS, PALETTE, seededRandom} from '../utils/motion';

interface SceneProps {
  kind: SceneKind;
  frame: number;
  flashPct?: number;
  zoomImpactPct?: number;
  beatPulse?: number;
  compact?: boolean;
}

const NightSkyScene: React.FC<{frame: number}> = ({frame}) => {
  const buildings = [
    {x: 6, w: 30, h: 120, c: '#303463'},
    {x: 32, w: 26, h: 150, c: '#3A3E73'},
    {x: 54, w: 34, h: 112, c: '#262A54'},
    {x: 84, w: 28, h: 146, c: '#34396B'},
    {x: 108, w: 36, h: 132, c: '#282C59'},
    {x: 140, w: 28, h: 158, c: '#383D70'},
    {x: 164, w: 32, h: 128, c: '#252951'},
  ];
  const stars = [
    {x: 24, y: 42, r: 2.2},
    {x: 54, y: 66, r: 3.1},
    {x: 88, y: 36, r: 1.8},
    {x: 152, y: 95, r: 2.4},
    {x: 126, y: 120, r: 3.6},
    {x: 36, y: 108, r: 2.0},
  ];
  const moonY = 58 + Math.sin(frame * 0.08) * 2.5;

  return (
    <g>
      <defs>
        <linearGradient id="nightGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#262A56" />
          <stop offset="60%" stopColor="#464A88" />
          <stop offset="100%" stopColor="#22254B" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="200" height="320" fill="url(#nightGrad)" />
      {stars.map((s, idx) => {
        const twinkle = 0.55 + 0.45 * Math.sin(frame * 0.25 + idx * 1.9);
        return (
          <g key={idx} opacity={twinkle} transform={`translate(${s.x}, ${s.y})`}>
            <path
              d={`M 0 ${-s.r * 1.7} L ${s.r * 0.55} ${-s.r * 0.55} L ${s.r * 1.7} 0 L ${s.r * 0.55} ${s.r * 0.55} L 0 ${s.r * 1.7} L ${-s.r * 0.55} ${s.r * 0.55} L ${-s.r * 1.7} 0 L ${-s.r * 0.55} ${-s.r * 0.55} Z`}
              fill="#FFF9DB"
            />
          </g>
        );
      })}
      {/* Crescent moon */}
      <g transform={`translate(136, ${moonY})`}>
        <path
          d="M 8 -22 A 22 22 0 1 0 24 14 A 16 16 0 1 1 8 -22 Z"
          fill="#F9D857"
          stroke={PALETTE.ink}
          strokeWidth="2.4"
          strokeLinejoin="round"
        />
        <path d="M -8 4 Q -3 8 1 4" stroke={PALETTE.ink} strokeWidth="1.8" fill="none" strokeLinecap="round" />
      </g>
      {/* City skyline */}
      {buildings.map((b, bi) => {
        const top = 320 - b.h;
        const rows = Math.floor((b.h - 18) / 15);
        return (
          <g key={bi}>
            <rect
              x={b.x}
              y={top}
              width={b.w}
              height={b.h + 4}
              fill={b.c}
              stroke={PALETTE.ink}
              strokeWidth="2.2"
            />
            {Array.from({length: rows}).map((_, ri) =>
              [0, 1].map((ci) => {
                const lit = seededRandom(bi * 31 + ri * 7 + ci * 13) > 0.36;
                if (!lit) return null;
                const blink =
                  seededRandom(bi * 11 + ri * 5 + ci) > 0.88
                    ? Math.sin(frame * 0.2 + bi + ri) > 0
                    : true;
                if (!blink) return null;
                return (
                  <rect
                    key={`${ri}-${ci}`}
                    x={b.x + 6 + ci * 11}
                    y={top + 10 + ri * 15}
                    width={6}
                    height={8}
                    rx={1}
                    fill="#F8D866"
                  />
                );
              }),
            )}
          </g>
        );
      })}
    </g>
  );
};

const RamenScene: React.FC<{frame: number; defocused?: boolean}> = ({
  frame,
  defocused = false,
}) => {
  const liftY = Math.sin(frame * 0.16) * 5;
  const steamShift = (frame * 1.4) % 24;

  const content = (
    <g>
      <rect x="0" y="0" width="200" height="320" fill={PALETTE.ramenWall} />
      {/* Wooden counter */}
      <rect x="0" y="232" width="200" height="90" fill="#D4A36A" stroke={PALETTE.ink} strokeWidth="2.2" />
      <line x1="0" y1="258" x2="200" y2="258" stroke="#BC8A52" strokeWidth="1.5" />
      <line x1="0" y1="286" x2="200" y2="286" stroke="#BC8A52" strokeWidth="1.5" />
      {/* Dark blue Noren banner */}
      <g>
        <rect x="8" y="8" width="42" height="54" fill="#324685" stroke={PALETTE.ink} strokeWidth="2.2" />
        <rect x="54" y="8" width="92" height="54" fill="#324685" stroke={PALETTE.ink} strokeWidth="2.2" />
        <rect x="150" y="8" width="42" height="54" fill="#324685" stroke={PALETTE.ink} strokeWidth="2.2" />
        <circle cx="29" cy="36" r="5" fill="#FFFDF8" />
        <circle cx="171" cy="36" r="5" fill="#FFFDF8" />
        <text
          x="100"
          y="44"
          textAnchor="middle"
          fill="#FFFDF8"
          fontSize="24"
          fontWeight="800"
          fontFamily={FONTS.hand}
          letterSpacing="6"
        >
          拉面
        </text>
      </g>
      {/* Steam wisps */}
      <g opacity="0.65" stroke="#FFFDF8" strokeWidth="3.2" fill="none" strokeLinecap="round">
        <path d={`M 68 ${168 - steamShift * 0.5} Q 60 ${150 - steamShift * 0.5} 70 ${132 - steamShift * 0.5}`} />
        <path d={`M 102 ${162 - steamShift * 0.5} Q 112 ${144 - steamShift * 0.5} 100 ${126 - steamShift * 0.5}`} />
        <path d={`M 134 ${170 - steamShift * 0.5} Q 126 ${152 - steamShift * 0.5} 136 ${134 - steamShift * 0.5}`} />
      </g>
      {/* Ramen bowl */}
      <g transform="translate(100, 212)">
        {/* Foot */}
        <path d="M -28 38 L 28 38 L 32 48 L -32 48 Z" fill="#F2ECE0" stroke={PALETTE.ink} strokeWidth="2.4" />
        {/* Main bowl */}
        <path
          d="M -72 -10 Q -68 42 0 42 Q 68 42 72 -10 Z"
          fill="#FFFDF8"
          stroke={PALETTE.ink}
          strokeWidth="2.6"
        />
        {/* Red decorative band */}
        <path
          d="M -68 2 Q 0 18 68 2"
          fill="none"
          stroke="#C84644"
          strokeWidth="6"
          strokeDasharray="6 4"
        />
        {/* Soup ellipse */}
        <ellipse cx="0" cy="-10" rx="70" ry="20" fill="#E9B85B" stroke={PALETTE.ink} strokeWidth="2.5" />
        {/* Nori sheet */}
        <rect
          x="16"
          y="-36"
          width="24"
          height="28"
          rx="2"
          transform="rotate(8 28 -22)"
          fill="#263B2D"
          stroke={PALETTE.ink}
          strokeWidth="2.2"
        />
        {/* Chashu */}
        <ellipse cx="-26" cy="-12" rx="18" ry="11" fill="#D5736A" stroke={PALETTE.ink} strokeWidth="2.2" />
        <ellipse cx="-26" cy="-12" rx="10" ry="5" fill="#F4C7BE" />
        {/* Egg */}
        <ellipse cx="-42" cy="-2" rx="12" ry="9" fill="#FFFDF8" stroke={PALETTE.ink} strokeWidth="2.2" />
        <circle cx="-42" cy="-2" r="5" fill="#F29B2E" />
        {/* Narutomaki */}
        <circle cx="32" cy="-4" r="10" fill="#FFFDF8" stroke={PALETTE.ink} strokeWidth="2.2" />
        <path d="M 32 -4 m -5 0 a 5 5 0 1 1 8 2 a 3 3 0 1 1 -5 -2" fill="none" stroke="#E87A90" strokeWidth="2.2" />
        {/* Chopsticks & lifted noodles */}
        <g transform={`translate(0, ${liftY})`}>
          <path d="M -8 -12 Q -10 -46 -4 -66" stroke="#F8DF8C" strokeWidth="4.5" fill="none" />
          <path d="M 0 -10 Q 0 -46 4 -66" stroke="#F4D36A" strokeWidth="4.5" fill="none" />
          <path d="M 8 -12 Q 10 -46 10 -66" stroke="#F8DF8C" strokeWidth="4.5" fill="none" />
          <path d="M -8 -12 Q -10 -46 -4 -66 M 0 -10 Q 0 -46 4 -66 M 8 -12 Q 10 -46 10 -66" stroke={PALETTE.ink} strokeWidth="1.2" fill="none" />
          {/* Chopsticks */}
          <line x1="-6" y1="-64" x2="104" y2="-136" stroke="#8C5932" strokeWidth="5.5" strokeLinecap="round" />
          <line x1="-6" y1="-64" x2="104" y2="-136" stroke={PALETTE.ink} strokeWidth="1.4" strokeLinecap="round" />
          <line x1="-2" y1="-56" x2="108" y2="-122" stroke="#A66D3E" strokeWidth="5.5" strokeLinecap="round" />
          <line x1="-2" y1="-56" x2="108" y2="-122" stroke={PALETTE.ink} strokeWidth="1.4" strokeLinecap="round" />
        </g>
      </g>
    </g>
  );

  if (!defocused) return content;

  const spinDeg = (frame * 12) % 360;
  return (
    <g>
      <defs>
        <filter id="defocusBlur">
          <feColorMatrix type="saturate" values="0.12" />
          <feGaussianBlur stdDeviation="4.5" />
        </filter>
      </defs>
      <g filter="url(#defocusBlur)">{content}</g>
      <rect x="0" y="0" width="200" height="320" fill="#2B2523" opacity="0.28" />
      {/* Camera focus brackets */}
      <g stroke="#FFFFFF" strokeWidth="4" fill="none" strokeLinecap="round">
        <path d="M 24 68 L 24 44 L 48 44" />
        <path d="M 152 44 L 176 44 L 176 68" />
        <path d="M 24 216 L 24 240 L 48 240" />
        <path d="M 152 240 L 176 240 L 176 216" />
      </g>
      {/* Spinning loader */}
      <g transform={`translate(100, 126) rotate(${spinDeg})`}>
        <circle cx="0" cy="0" r="22" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="6" />
        <path d="M 0 -22 A 22 22 0 0 1 22 0" fill="none" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />
      </g>
      <text
        x="100"
        y="188"
        textAnchor="middle"
        fill="#FFFFFF"
        stroke={PALETTE.ink}
        strokeWidth="4"
        paintOrder="stroke"
        fontSize="24"
        fontWeight="800"
        fontFamily={FONTS.comic}
      >
        对焦中...
      </text>
    </g>
  );
};

const ShibaScene: React.FC<{frame: number}> = ({frame}) => {
  const headTilt = Math.sin(frame * 0.14) * 5;
  const heartBob = Math.sin(frame * 0.2) * 5;

  return (
    <g>
      <rect x="0" y="0" width="200" height="320" fill={PALETTE.shibaBg} />
      {/* Subtle polka dots */}
      {[34, 88, 146, 178].map((x, i) =>
        [44, 108, 176, 250].map((y, j) => (
          <circle
            key={`${i}-${j}`}
            cx={x + (j % 2) * 12}
            cy={y}
            r="6"
            fill="#FFFFFF"
            opacity="0.32"
          />
        )),
      )}
      {/* Body */}
      <path
        d="M 28 320 L 28 246 Q 28 198 100 198 Q 172 198 172 246 L 172 320 Z"
        fill="#D68345"
        stroke={PALETTE.ink}
        strokeWidth="3"
      />
      {/* White belly */}
      <ellipse cx="100" cy="272" rx="40" ry="44" fill="#FFFDF8" />
      {/* Tail wag */}
      <path
        d={`M 154 214 Q ${184 + Math.sin(frame * 0.4) * 6} 188 164 176`}
        fill="none"
        stroke="#D68345"
        strokeWidth="18"
        strokeLinecap="round"
      />
      <path
        d={`M 154 214 Q ${184 + Math.sin(frame * 0.4) * 6} 188 164 176`}
        fill="none"
        stroke={PALETTE.ink}
        strokeWidth="2.8"
        strokeLinecap="round"
      />
      {/* Red collar & golden bell */}
      <path d="M 52 204 Q 100 222 148 204" fill="none" stroke="#D94D4A" strokeWidth="10" strokeLinecap="round" />
      <path d="M 52 204 Q 100 222 148 204" fill="none" stroke={PALETTE.ink} strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="100" cy="222" r="8" fill="#F6CA48" stroke={PALETTE.ink} strokeWidth="2.2" />

      {/* Shiba Head */}
      <g transform={`translate(100, 146) rotate(${headTilt})`}>
        {/* Ears */}
        <path d="M -52 -24 L -40 -76 L -6 -44 Z" fill="#D68345" stroke={PALETTE.ink} strokeWidth="3" strokeLinejoin="round" />
        <path d="M -42 -32 L -36 -60 L -16 -42 Z" fill="#F4A8B8" />
        <path d="M 52 -24 L 40 -76 L 6 -44 Z" fill="#D68345" stroke={PALETTE.ink} strokeWidth="3" strokeLinejoin="round" />
        <path d="M 42 -32 L 36 -60 L 16 -42 Z" fill="#F4A8B8" />
        {/* Face round */}
        <ellipse cx="0" cy="4" rx="58" ry="50" fill="#D68345" stroke={PALETTE.ink} strokeWidth="3" />
        {/* White lower face */}
        <path d="M -56 12 Q -36 -6 0 4 Q 36 -6 56 12 Q 52 52 0 54 Q -52 52 -56 12 Z" fill="#FFFDF8" />
        {/* Eyebrow dots */}
        <ellipse cx="-20" cy="-18" rx="6" ry="4" fill="#FFFDF8" />
        <ellipse cx="20" cy="-18" rx="6" ry="4" fill="#FFFDF8" />
        {/* Happy curved eyes */}
        <path d="M -28 -2 Q -21 -10 -14 -2" fill="none" stroke={PALETTE.ink} strokeWidth="3.2" strokeLinecap="round" />
        <path d="M 14 -2 Q 21 -10 28 -2" fill="none" stroke={PALETTE.ink} strokeWidth="3.2" strokeLinecap="round" />
        {/* Blush */}
        <ellipse cx="-35" cy="14" rx="9" ry="5" fill="#F7A7B8" opacity="0.7" />
        <ellipse cx="35" cy="14" rx="9" ry="5" fill="#F7A7B8" opacity="0.7" />
        {/* Nose & mouth */}
        <ellipse cx="0" cy="8" rx="6" ry="4.5" fill={PALETTE.ink} />
        <path d="M -10 18 Q -4 25 0 18 Q 4 25 10 18" fill="none" stroke={PALETTE.ink} strokeWidth="2.8" strokeLinecap="round" />
      </g>

      {/* Floating pink hearts */}
      <g transform={`translate(152, ${78 + heartBob})`}>
        <path
          d="M 0 10 C -12 0 -14 -12 -6 -14 C -2 -15 0 -10 0 -10 C 0 -10 2 -15 6 -14 C 14 -12 12 0 0 10 Z"
          fill="#F06B93"
          stroke={PALETTE.ink}
          strokeWidth="2.4"
        />
      </g>
      <g transform={`translate(42, ${94 - heartBob * 0.7}) scale(0.75)`}>
        <path
          d="M 0 10 C -12 0 -14 -12 -6 -14 C -2 -15 0 -10 0 -10 C 0 -10 2 -15 6 -14 C 14 -12 12 0 0 10 Z"
          fill="#F48FB1"
          stroke={PALETTE.ink}
          strokeWidth="2.4"
        />
      </g>
    </g>
  );
};

const DiscoScene: React.FC<{frame: number; flashPct?: number}> = ({frame, flashPct = 0}) => {
  const bounce = Math.abs(Math.sin(frame * 0.35)) * 12;
  const armWave = Math.sin(frame * 0.35) * 18;
  const rayAngle = Math.sin(frame * 0.1) * 14;
  const tileColors = ['#FF6B9E', '#5CE1E6', '#FFD95A', '#9D7BFF', '#57D68D'];

  return (
    <g>
      <defs>
        <linearGradient id="discoSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6D58A8" />
          <stop offset="62%" stopColor="#A676B8" />
          <stop offset="100%" stopColor="#3B3B6B" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="200" height="320" fill="url(#discoSky)" />
      {/* Disco light rays */}
      <g transform={`translate(100, 62) rotate(${rayAngle})`} opacity={0.22 + (flashPct / 100) * 0.25}>
        <polygon points="0,0 -110,210 -50,220" fill="#FFE6FA" />
        <polygon points="0,0 45,220 115,200" fill="#CCF8FF" />
        <polygon points="0,0 -20,230 22,230" fill="#FFF7C4" />
      </g>
      {/* Horizon & perspective dance floor */}
      <rect x="0" y="200" width="200" height="120" fill="#2A284F" stroke={PALETTE.ink} strokeWidth="2" />
      {[0, 1, 2, 3].map((row) => {
        const y0 = 204 + row * 28;
        const y1 = y0 + 26;
        return [0, 1, 2, 3, 4].map((col) => {
          const topX0 = 24 + col * 30;
          const topX1 = topX0 + 30;
          const spread = 1 + row * 0.24;
          const botX0 = 100 + (topX0 - 100) * spread;
          const botX1 = 100 + (topX1 - 100) * spread;
          const colorIdx = (row + col + Math.floor(frame / 6)) % tileColors.length;
          return (
            <polygon
              key={`${row}-${col}`}
              points={`${topX0},${y0} ${topX1},${y0} ${botX1},${y1} ${botX0},${y1}`}
              fill={tileColors[colorIdx]}
              opacity="0.72"
              stroke="#2D274E"
              strokeWidth="1.5"
            />
          );
        });
      })}
      {/* Disco ball */}
      <line x1="100" y1="0" x2="100" y2="42" stroke={PALETTE.ink} strokeWidth="2.4" />
      <g transform="translate(100, 62)">
        <circle cx="0" cy="0" r="20" fill="#D9DDF0" stroke={PALETTE.ink} strokeWidth="2.6" />
        <ellipse cx="0" cy="0" rx="10" ry="20" fill="none" stroke="#8C92B5" strokeWidth="1.4" />
        <line x1="-20" y1="0" x2="20" y2="0" stroke="#8C92B5" strokeWidth="1.4" />
        <line x1="-17" y1="-10" x2="17" y2="-10" stroke="#8C92B5" strokeWidth="1.2" />
        <line x1="-17" y1="10" x2="17" y2="10" stroke="#8C92B5" strokeWidth="1.2" />
        <rect x="-7" y="-10" width="7" height="7" fill="#FFFFFF" opacity="0.85" />
        <rect x="4" y="2" width="6" height="6" fill="#FFE66D" opacity="0.85" />
      </g>
      {/* Dancing mini Xiaoke */}
      <g transform={`translate(100, ${204 - bounce})`}>
        {/* Left arm raised */}
        <path
          d={`M -30 -8 L ${-48} ${-26 + armWave * 0.5}`}
          stroke={PALETTE.ink}
          strokeWidth="11"
          strokeLinecap="round"
        />
        <path
          d={`M -30 -8 L ${-48} ${-26 + armWave * 0.5}`}
          stroke={PALETTE.robot}
          strokeWidth="6.5"
          strokeLinecap="round"
        />
        {/* Right arm raised */}
        <path
          d={`M 30 -8 L ${48} ${-26 - armWave * 0.5}`}
          stroke={PALETTE.ink}
          strokeWidth="11"
          strokeLinecap="round"
        />
        <path
          d={`M 30 -8 L ${48} ${-26 - armWave * 0.5}`}
          stroke={PALETTE.robot}
          strokeWidth="6.5"
          strokeLinecap="round"
        />
        {/* Legs */}
        <rect x="-20" y="24" width="10" height="16" rx="3" fill={PALETTE.robotShade} stroke={PALETTE.ink} strokeWidth="2.4" />
        <rect x="10" y="24" width="10" height="16" rx="3" fill={PALETTE.robotShade} stroke={PALETTE.ink} strokeWidth="2.4" />
        {/* Boxy body */}
        <rect x="-32" y="-22" width="64" height="50" rx="5" fill={PALETTE.robot} stroke={PALETTE.ink} strokeWidth="2.8" />
        {/* Happy ^ ^ eyes */}
        <path d="M -16 0 Q -11 -7 -6 0" fill="none" stroke={PALETTE.ink} strokeWidth="3" strokeLinecap="round" />
        <path d="M 6 0 Q 11 -7 16 0" fill="none" stroke={PALETTE.ink} strokeWidth="3" strokeLinecap="round" />
      </g>
      {/* Sparkles scaled by flashPct */}
      {flashPct > 5 &&
        [
          {x: 34, y: 112},
          {x: 164, y: 128},
          {x: 56, y: 174},
          {x: 152, y: 244},
          {x: 92, y: 108},
        ].map((sp, i) => {
          const s = (0.5 + 0.5 * Math.sin(frame * 0.32 + i * 1.4)) * (flashPct / 70);
          return (
            <path
              key={i}
              transform={`translate(${sp.x}, ${sp.y}) scale(${s})`}
              d="M 0 -10 L 3 -3 L 10 0 L 3 3 L 0 10 L -3 3 L -10 0 L -3 -3 Z"
              fill={i % 2 === 0 ? '#FFFDF2' : '#FFE36E'}
              stroke={PALETTE.ink}
              strokeWidth="1.2"
            />
          );
        })}
    </g>
  );
};

export const SceneArtwork: React.FC<SceneProps> = ({
  kind,
  frame,
  flashPct = 0,
}) => {
  switch (kind) {
    case 'night':
      return <NightSkyScene frame={frame} />;
    case 'ramen':
      return <RamenScene frame={frame} />;
    case 'ramenDefocus':
      return <RamenScene frame={frame} defocused />;
    case 'shiba':
      return <ShibaScene frame={frame} />;
    case 'disco':
      return <DiscoScene frame={frame} flashPct={flashPct} />;
    case 'blank':
    default:
      return <rect x="0" y="0" width="200" height="320" fill="#1C1A19" />;
  }
};

export const PhoneScreenView: React.FC<{
  scene: SceneKind;
  prevScene: SceneKind;
  transition: TransitionKind;
  transitionProgress: number;
  frame: number;
  flashPct: number;
  saturationPct: number;
  zoomImpactPct: number;
  beatPulse: number;
  subtitle: string | null;
  subtitleGlitchy: boolean;
  socialMode: boolean;
  headline: string | null;
}> = ({
  scene,
  prevScene,
  transition,
  transitionProgress,
  frame,
  flashPct,
  saturationPct,
  zoomImpactPct,
  beatPulse,
  subtitle,
  subtitleGlitchy,
  socialMode,
  headline,
}) => {
  const satFilter =
    saturationPct !== 100
      ? `saturate(${(saturationPct / 100).toFixed(2)}) ${
          saturationPct > 180 ? 'contrast(1.35) brightness(1.12)' : ''
        }`
      : undefined;

  const zoomBump =
    zoomImpactPct > 0
      ? 1 + (zoomImpactPct / 100) * 0.14 * (0.3 + 0.7 * Math.max(beatPulse, Math.abs(Math.sin(frame * 0.25))))
      : 1;

  const renderCore = () => {
    if (transition === 'spin' && transitionProgress < 1) {
      const p = transitionProgress;
      const angle = p < 0.5 ? p * 360 : (p - 1) * 360;
      const scale = 1 - Math.sin(p * Math.PI) * 0.42;
      const activeKind = p < 0.5 ? prevScene : scene;
      return (
        <g>
          <rect x="0" y="0" width="200" height="320" fill="#1D1B2B" />
          <g transform={`translate(100, 160) rotate(${angle}) scale(${scale}) translate(-100, -160)`}>
            <SceneArtwork kind={activeKind} frame={frame} flashPct={flashPct} />
          </g>
          {/* Swirl motion lines */}
          <circle cx="100" cy="160" r="82" fill="none" stroke="#F8E28A" strokeWidth="3" strokeDasharray="55 70" opacity={Math.sin(p * Math.PI)} />
          <circle cx="100" cy="160" r="64" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="40 80" opacity={Math.sin(p * Math.PI)} />
        </g>
      );
    }

    if (transition === 'flip' && transitionProgress < 1) {
      const p = transitionProgress;
      const scaleX = Math.max(0.05, Math.abs(Math.cos(p * Math.PI)));
      const activeKind = p < 0.5 ? prevScene : scene;
      return (
        <g>
          <rect x="0" y="0" width="200" height="320" fill="#2B2523" />
          <g transform={`translate(100, 0) scale(${scaleX}, 1) translate(-100, 0)`}>
            <SceneArtwork kind={activeKind} frame={frame} flashPct={flashPct} />
          </g>
        </g>
      );
    }

    if (transition === 'glitch' && transitionProgress < 1) {
      const p = transitionProgress;
      const offset = Math.sin(p * Math.PI * 5) * 12;
      return (
        <g>
          <SceneArtwork kind={p < 0.45 ? prevScene : scene} frame={frame} flashPct={flashPct} />
          <g transform={`translate(${offset}, 0)`} opacity="0.55">
            <rect x="0" y="64" width="200" height="24" fill="#FF3B8D" />
            <rect x="0" y="176" width="200" height="18" fill="#3DF2FF" />
          </g>
        </g>
      );
    }

    return <SceneArtwork kind={scene} frame={frame} flashPct={flashPct} />;
  };

  return (
    <g style={{filter: satFilter}}>
      <g transform={`translate(100, 160) scale(${zoomBump.toFixed(3)}) translate(-100, -160)`}>
        {renderCore()}
      </g>

      {/* Subtitle overlay */}
      {subtitle && (
        <g transform={`translate(100, 232) ${subtitleGlitchy ? `translate(${Math.sin(frame * 2.1) * 4}, 0)` : ''}`}>
          {subtitleGlitchy && (
            <text
              x="3"
              y="0"
              textAnchor="middle"
              fill="#FF4B7D"
              fontSize="24"
              fontWeight="900"
              fontFamily={FONTS.comic}
              opacity="0.7"
            >
              {subtitle}
            </text>
          )}
          <text
            x="0"
            y="0"
            textAnchor="middle"
            fill="#F9D54E"
            stroke={PALETTE.ink}
            strokeWidth="5"
            paintOrder="stroke"
            fontSize="24"
            fontWeight="900"
            fontFamily={FONTS.comic}
          >
            {subtitle}
          </text>
        </g>
      )}

      {/* Headline punch ("拿捏了!") */}
      {headline && (
        <g transform="translate(96, 134) rotate(-5)">
          <text
            x="0"
            y="0"
            textAnchor="middle"
            fill="#F9D54E"
            stroke={PALETTE.ink}
            strokeWidth="7"
            paintOrder="stroke"
            fontSize="36"
            fontWeight="900"
            fontFamily={FONTS.comic}
          >
            {headline}
          </text>
        </g>
      )}

      {/* TikTok / Douyin Showcase Overlay during Ending */}
      {socialMode && (
        <g>
          {/* Right action column */}
          <g transform="translate(174, 108)">
            <circle cx="0" cy="0" r="14" fill={PALETTE.robot} stroke="#FFFFFF" strokeWidth="2.2" />
            <rect x="-5" y="-5" width="3" height="6" rx="1" fill={PALETTE.ink} />
            <rect x="2" y="-5" width="3" height="6" rx="1" fill={PALETTE.ink} />
            <circle cx="0" cy="13" r="5" fill="#FF4B6E" />
            <text x="0" y="16" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="900">
              +
            </text>

            {/* Like */}
            <g transform="translate(0, 44)">
              <path
                d="M 0 10 C -11 2 -12 -9 -5 -11 C -2 -12 0 -7 0 -7 C 0 -7 2 -12 5 -11 C 12 -9 11 2 0 10 Z"
                fill="#F06B93"
                stroke={PALETTE.ink}
                strokeWidth="2"
              />
              <text x="0" y="23" textAnchor="middle" fill="#FFFFFF" stroke={PALETTE.ink} strokeWidth="2.2" paintOrder="stroke" fontSize="10" fontWeight="800" fontFamily={FONTS.hand}>
                10.2w
              </text>
            </g>

            {/* Comment */}
            <g transform="translate(0, 92)">
              <rect x="-11" y="-10" width="22" height="17" rx="6" fill="#FFFFFF" stroke={PALETTE.ink} strokeWidth="2" />
              <circle cx="-5" cy="-2" r="1.5" fill={PALETTE.ink} />
              <circle cx="0" cy="-2" r="1.5" fill={PALETTE.ink} />
              <circle cx="5" cy="-2" r="1.5" fill={PALETTE.ink} />
              <text x="0" y="20" textAnchor="middle" fill="#FFFFFF" stroke={PALETTE.ink} strokeWidth="2.2" paintOrder="stroke" fontSize="10" fontWeight="800" fontFamily={FONTS.hand}>
                2333
              </text>
            </g>

            {/* Share */}
            <g transform="translate(0, 138)">
              <path d="M -9 4 Q -7 -7 4 -7 L 4 -12 L 13 -3 L 4 6 L 4 1 Q -3 1 -9 4 Z" fill="#FFFFFF" stroke={PALETTE.ink} strokeWidth="2" />
              <text x="0" y="20" textAnchor="middle" fill="#FFFFFF" stroke={PALETTE.ink} strokeWidth="2.2" paintOrder="stroke" fontSize="10" fontWeight="800" fontFamily={FONTS.hand}>
                分享
              </text>
            </g>
          </g>

          {/* Bottom caption */}
          <g transform="translate(12, 286)">
            <text
              x="0"
              y="0"
              fill="#FFFFFF"
              stroke={PALETTE.ink}
              strokeWidth="3"
              paintOrder="stroke"
              fontSize="13"
              fontWeight="800"
              fontFamily={FONTS.hand}
            >
              @小克 · Opus 5.5
            </text>
            <text
              x="0"
              y="18"
              fill="#F2ECE0"
              stroke={PALETTE.ink}
              strokeWidth="2.5"
              paintOrder="stroke"
              fontSize="11"
              fontWeight="700"
              fontFamily={FONTS.hand}
            >
              #AI剪辑 #卡点 #code2video
            </text>
          </g>
        </g>
      )}
    </g>
  );
};
