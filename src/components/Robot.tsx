import React from 'react';
import {DirectorState} from '../config/timeline';
import {buildArmPath, FONTS, PALETTE} from '../utils/motion';

/** Reusable 4-point Gemini sparkle path centered at (0,0) */
export function geminiStarPath(r: number, innerRatio = 0.28): string {
  const ir = r * innerRatio;
  return `M 0 ${-r} Q ${ir * 0.4} ${-ir * 0.4} ${r} 0 Q ${ir * 0.4} ${ir * 0.4} 0 ${r} Q ${-ir * 0.4} ${ir * 0.4} ${-r} 0 Q ${-ir * 0.4} ${-ir * 0.4} 0 ${-r} Z`;
}

/** Mini Gemini sprite used in DiscoScene and Avatar */
export const MiniGeminiCharacter: React.FC<{
  frame: number;
  bounce?: number;
  armWave?: number;
}> = ({frame, bounce = 0, armWave = 0}) => {
  const starBob = Math.sin(frame * 0.28) * 2.5;
  return (
    <g transform={`translate(100, ${202 - bounce})`}>
      <defs>
        <linearGradient id="miniGeminiBody" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#67D4FA" />
          <stop offset="48%" stopColor="#5882F7" />
          <stop offset="100%" stopColor="#9A6DF7" />
        </linearGradient>
        <linearGradient id="miniGeminiStar" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="55%" stopColor="#9AE8FF" />
          <stop offset="100%" stopColor="#C8A2FF" />
        </linearGradient>
      </defs>

      {/* Left arm raised */}
      <path
        d={`M -28 -4 L ${-48} ${-24 + armWave * 0.5}`}
        stroke={PALETTE.ink}
        strokeWidth="11"
        strokeLinecap="round"
      />
      <path
        d={`M -28 -4 L ${-48} ${-24 + armWave * 0.5}`}
        stroke="#6393FA"
        strokeWidth="6.5"
        strokeLinecap="round"
      />
      {/* Right arm raised */}
      <path
        d={`M 28 -4 L ${48} ${-24 - armWave * 0.5}`}
        stroke={PALETTE.ink}
        strokeWidth="11"
        strokeLinecap="round"
      />
      <path
        d={`M 28 -4 L ${48} ${-24 - armWave * 0.5}`}
        stroke="#8F73F7"
        strokeWidth="6.5"
        strokeLinecap="round"
      />

      {/* Legs */}
      <rect x="-18" y="23" width="10" height="15" rx="5" fill="#465BC8" stroke={PALETTE.ink} strokeWidth="2.4" />
      <rect x="8" y="23" width="10" height="15" rx="5" fill="#465BC8" stroke={PALETTE.ink} strokeWidth="2.4" />

      {/* Floating Gemini 4-point star antenna */}
      <line x1="0" y1="-26" x2="0" y2={-35 + starBob} stroke={PALETTE.ink} strokeWidth="2.2" strokeLinecap="round" />
      <path
        transform={`translate(0, ${-43 + starBob})`}
        d={geminiStarPath(12)}
        fill="url(#miniGeminiStar)"
        stroke={PALETTE.ink}
        strokeWidth="2.2"
        strokeLinejoin="round"
      />

      {/* Rounded pillow-star torso */}
      <rect
        x="-31"
        y="-25"
        width="62"
        height="52"
        rx="20"
        fill="url(#miniGeminiBody)"
        stroke={PALETTE.ink}
        strokeWidth="2.8"
      />
      {/* Top specular highlight */}
      <ellipse cx="-10" cy="-14" rx="12" ry="4.5" fill="#FFFFFF" opacity="0.35" transform="rotate(-12 -10 -14)" />
      {/* Mini chest sparkle */}
      <path transform="translate(0, 14)" d={geminiStarPath(5.5)} fill="#FFFFFF" opacity="0.88" />

      {/* Happy ^ ^ eyes */}
      <path d="M -16 -2 Q -11 -9 -6 -2" fill="none" stroke={PALETTE.ink} strokeWidth="3" strokeLinecap="round" />
      <path d="M 6 -2 Q 11 -9 16 -2" fill="none" stroke={PALETTE.ink} strokeWidth="3" strokeLinecap="round" />
      {/* Rosy cheeks */}
      <ellipse cx="-20" cy="6" rx="5" ry="3" fill="#FFA6D5" opacity="0.75" />
      <ellipse cx="20" cy="6" rx="5" ry="3" fill="#FFA6D5" opacity="0.75" />
    </g>
  );
};

export const RobotCharacter: React.FC<{state: DirectorState}> = ({state}) => {
  if (!state.robotVisible) return null;

  const {
    robotX: x,
    robotY: y,
    robotScaleX: sx,
    robotScaleY: sy,
    robotExpression: expr,
    robotSunglasses: shades,
    robotDust: dust,
    robotSpeech: speech,
    robotArm: arm,
    showCtrlZ,
    ctrlZPress,
    frame,
  } = state;

  const starFloat = Math.sin(frame * 0.22) * 3;
  const starSpin = Math.sin(frame * 0.14) * 8;

  const renderEyes = () => {
    switch (expr) {
      case 'sparkle':
        return (
          <g>
            <path transform="translate(-14, -3)" d={geminiStarPath(9)} fill="#FFF7A8" stroke={PALETTE.ink} strokeWidth="2" />
            <path transform="translate(14, -3)" d={geminiStarPath(9)} fill="#FFF7A8" stroke={PALETTE.ink} strokeWidth="2" />
          </g>
        );
      case 'happy':
        return (
          <g stroke={PALETTE.ink} strokeWidth="3.4" fill="none" strokeLinecap="round">
            <path d="M -20 -1 Q -13 -11 -6 -1" />
            <path d="M 6 -1 Q 13 -11 20 -1" />
          </g>
        );
      case 'squint':
        return (
          <g fill={PALETTE.ink}>
            <rect x="-20" y="-6" width="13" height="5" rx="2.5" />
            <rect x="7" y="-6" width="13" height="5" rx="2.5" />
          </g>
        );
      case 'shock':
        return (
          <g stroke={PALETTE.ink} strokeWidth="3.4" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M -18 -9 L -10 -4 L -18 1" />
            <path d="M 18 -9 L 10 -4 L 18 1" />
          </g>
        );
      case 'wink':
        return (
          <g>
            <rect x="-17" y="-11" width="7.5" height="15" rx="3.75" fill={PALETTE.ink} />
            <path transform="translate(-14.5, -7)" d={geminiStarPath(3)} fill="#FFFFFF" />
            <path d="M 6 -2 Q 13 -10 20 -2" fill="none" stroke={PALETTE.ink} strokeWidth="3.4" strokeLinecap="round" />
            <ellipse cx="-24" cy="8" rx="6.5" ry="3.8" fill="#FFA6D5" opacity="0.82" />
            <ellipse cx="24" cy="8" rx="6.5" ry="3.8" fill="#FFA6D5" opacity="0.82" />
          </g>
        );
      case 'normal':
      default:
        return (
          <g>
            <rect x="-17" y="-11" width="7.5" height="15" rx="3.75" fill={PALETTE.ink} />
            <rect x="9.5" y="-11" width="7.5" height="15" rx="3.75" fill={PALETTE.ink} />
            {/* Star-shaped catchlights inside eyes */}
            <path transform="translate(-14.5, -7)" d={geminiStarPath(2.8)} fill="#FFFFFF" />
            <path transform="translate(12, -7)" d={geminiStarPath(2.8)} fill="#FFFFFF" />
            <ellipse cx="-24" cy="7" rx="5.5" ry="3.2" fill="#FFA6D5" opacity="0.6" />
            <ellipse cx="24" cy="7" rx="5.5" ry="3.2" fill="#FFA6D5" opacity="0.6" />
          </g>
        );
    }
  };

  const armOriginX = arm ? x + (arm.side === 'left' ? -36 : 36) : x;
  const armOriginY = y - 2;
  const armPath = arm
    ? buildArmPath(armOriginX, armOriginY, arm.targetX, arm.targetY, arm.sag ?? 18)
    : '';

  const waveEnding = frame >= 868;

  return (
    <g>
      <defs>
        <linearGradient id="geminiBodyGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#65D6FA" />
          <stop offset="46%" stopColor="#5584F7" />
          <stop offset="100%" stopColor="#9B6DF7" />
        </linearGradient>
        <linearGradient id="geminiArmGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#5B89F7" />
          <stop offset="100%" stopColor="#8E70F7" />
        </linearGradient>
        <linearGradient id="geminiCrestGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="45%" stopColor="#91E8FF" />
          <stop offset="100%" stopColor="#C198FF" />
        </linearGradient>
      </defs>

      {/* Giant Ctrl+Z keycap underneath character */}
      {showCtrlZ && (
        <g transform={`translate(355, ${616 + ctrlZPress * 10})`}>
          <rect x="-92" y="-36" width="184" height="94" rx="18" fill="#D5CEC2" stroke={PALETTE.ink} strokeWidth="3.5" />
          <rect x="-86" y="-44" width="172" height="82" rx="15" fill="#FFFDF8" stroke={PALETTE.ink} strokeWidth="3.2" />
          <text
            x="0"
            y="10"
            textAnchor="middle"
            fill={PALETTE.ink}
            fontSize="40"
            fontWeight="800"
            fontFamily={FONTS.comic}
          >
            Ctrl+Z
          </text>
        </g>
      )}

      {/* Stretchy elastic Gemini arm */}
      {arm && (
        <g>
          <path
            d={armPath}
            fill="none"
            stroke={PALETTE.ink}
            strokeWidth="15"
            strokeLinecap="round"
          />
          <path
            d={armPath}
            fill="none"
            stroke="url(#geminiArmGrad)"
            strokeWidth="9.5"
            strokeLinecap="round"
          />
          {arm.tool === 'hand' && (
            <circle
              cx={arm.targetX}
              cy={arm.targetY}
              r="9.5"
              fill="#7CC5FF"
              stroke={PALETTE.ink}
              strokeWidth="2.8"
            />
          )}
          {arm.tool === 'knife' && (
            <g transform={`translate(${arm.targetX}, ${arm.targetY}) rotate(-32)`}>
              <rect x="-12" y="-7" width="24" height="14" rx="4" fill="#F1C64E" stroke={PALETTE.ink} strokeWidth="2.5" />
              <polygon points="12,-5 38,-5 44,5 12,5" fill="#F2F6FA" stroke={PALETTE.ink} strokeWidth="2.2" />
            </g>
          )}
        </g>
      )}

      {/* Gemini Little Mascot Body */}
      <g transform={`translate(${x}, ${y}) scale(${sx}, ${sy})`}>
        {/* Dust puffs */}
        {dust > 0.02 && (
          <g opacity={dust}>
            <circle cx="-36" cy="36" r={10 + (1 - dust) * 6} fill="#FFFDF8" stroke={PALETTE.ink} strokeWidth="2.2" />
            <circle cx="-22" cy="40" r={8 + (1 - dust) * 5} fill="#FFFDF8" stroke={PALETTE.ink} strokeWidth="2.2" />
            <circle cx="34" cy="36" r={10 + (1 - dust) * 6} fill="#FFFDF8" stroke={PALETTE.ink} strokeWidth="2.2" />
            <circle cx="20" cy="40" r={8 + (1 - dust) * 5} fill="#FFFDF8" stroke={PALETTE.ink} strokeWidth="2.2" />
          </g>
        )}

        {/* Rounded Stubby Legs */}
        <rect x="-24" y="24" width="12" height="18" rx="6" fill="#445AC6" stroke={PALETTE.ink} strokeWidth="2.8" />
        <rect x="12" y="24" width="12" height="18" rx="6" fill="#445AC6" stroke={PALETTE.ink} strokeWidth="2.8" />

        {/* Left stubby arm */}
        {(!arm || arm.side !== 'left') && (
          <rect x="-48" y="-3" width="15" height="12" rx="6" fill="#63A8FA" stroke={PALETTE.ink} strokeWidth="2.8" />
        )}
        {/* Right stubby arm (or waving in ending) */}
        {(!arm || arm.side !== 'right') &&
          (waveEnding ? (
            <g transform={`translate(35, 1) rotate(${-38 + Math.sin(frame * 0.4) * 16})`}>
              <rect x="0" y="-6" width="28" height="12" rx="6" fill="#8D71F7" stroke={PALETTE.ink} strokeWidth="2.8" />
              <circle cx="28" cy="0" r="7.5" fill="#7CC5FF" stroke={PALETTE.ink} strokeWidth="2.6" />
              {/* Tiny sparkle next to waving hand */}
              <path
                transform="translate(38, -16)"
                d={geminiStarPath(6.5)}
                fill="#FFE66D"
                stroke={PALETTE.ink}
                strokeWidth="1.4"
              />
            </g>
          ) : (
            <rect x="33" y="-3" width="15" height="12" rx="6" fill="#8C71F7" stroke={PALETTE.ink} strokeWidth="2.8" />
          ))}

        {/* Floating Gemini 4-point Star Antenna / Crest */}
        <g transform={`translate(0, ${shades ? -6 : 0})`}>
          <line x1="0" y1="-29" x2="0" y2={-38 + starFloat * 0.5} stroke={PALETTE.ink} strokeWidth="2.6" strokeLinecap="round" />
          <g transform={`translate(0, ${-49 + starFloat}) rotate(${starSpin})`}>
            <path
              d={geminiStarPath(15)}
              fill="url(#geminiCrestGrad)"
              stroke={PALETTE.ink}
              strokeWidth="2.6"
              strokeLinejoin="round"
            />
          </g>
        </g>

        {/* Soft Rounded-Pillow Gemini Torso */}
        <rect
          x="-38"
          y="-30"
          width="76"
          height="60"
          rx="23"
          fill="url(#geminiBodyGrad)"
          stroke={PALETTE.ink}
          strokeWidth="3.2"
        />

        {/* Soft white glossy highlight on top-left */}
        <ellipse
          cx="-14"
          cy="-18"
          rx="14"
          ry="5"
          fill="#FFFFFF"
          opacity="0.38"
          transform="rotate(-14 -14 -18)"
        />
        {/* Subtle bottom indigo rim shade */}
        <path
          d="M -28 21 Q 0 28 28 21"
          fill="none"
          stroke="#3E4EB8"
          strokeWidth="4.5"
          strokeLinecap="round"
          opacity="0.38"
        />

        {/* Small white Gemini star emblem on lower belly */}
        <path transform="translate(0, 16)" d={geminiStarPath(6.2)} fill="#FFFFFF" opacity="0.92" />

        {/* Expressive Eyes */}
        {renderEyes()}

        {/* Cool Sunglasses perched on forehead */}
        {shades && (
          <g transform="translate(0, -28) rotate(-4)">
            <rect x="-26" y="-6" width="22" height="12" rx="4" fill="#231F20" stroke={PALETTE.ink} strokeWidth="2" />
            <rect x="4" y="-6" width="22" height="12" rx="4" fill="#231F20" stroke={PALETTE.ink} strokeWidth="2" />
            <line x1="-4" y1="-2" x2="4" y2="-2" stroke={PALETTE.ink} strokeWidth="3" />
            <line x1="-22" y1="-2" x2="-14" y2="2" stroke="#7AE4FF" strokeWidth="1.8" opacity="0.7" />
            <line x1="8" y1="-2" x2="16" y2="2" stroke="#C49BFF" strokeWidth="1.8" opacity="0.7" />
          </g>
        )}

        {/* Speech bubble */}
        {speech && (
          <g transform="translate(22, -88)">
            <rect
              x="-44"
              y="-26"
              width="88"
              height="42"
              rx="14"
              fill="#FFFDF8"
              stroke={PALETTE.ink}
              strokeWidth="2.8"
            />
            <polygon points="-8,16 0,28 8,16" fill="#FFFDF8" stroke={PALETTE.ink} strokeWidth="2.6" strokeLinejoin="round" />
            <line x1="-7" y1="16" x2="7" y2="16" stroke="#FFFDF8" strokeWidth="4" />
            <text
              x="0"
              y="3"
              textAnchor="middle"
              fill={PALETTE.ink}
              fontSize="22"
              fontWeight="800"
              fontFamily={FONTS.hand}
            >
              {speech}
            </text>
          </g>
        )}
      </g>
    </g>
  );
};
