import React from 'react';
import {DirectorState} from '../config/timeline';
import {buildArmPath, clamp, FONTS, lerp, PALETTE} from '../utils/motion';

/** Reusable 4-point Gemini sparkle path centered at (0,0) */
export function geminiStarPath(r: number, innerRatio = 0.28): string {
  const ir = r * innerRatio;
  return `M 0 ${-r} Q ${ir * 0.4} ${-ir * 0.4} ${r} 0 Q ${ir * 0.4} ${ir * 0.4} 0 ${r} Q ${-ir * 0.4} ${ir * 0.4} ${-r} 0 Q ${-ir * 0.4} ${-ir * 0.4} 0 ${-r} Z`;
}

/** Mini Gemini sprite used in DiscoScene */
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

      <rect x="-18" y="23" width="10" height="15" rx="5" fill="#465BC8" stroke={PALETTE.ink} strokeWidth="2.4" />
      <rect x="8" y="23" width="10" height="15" rx="5" fill="#465BC8" stroke={PALETTE.ink} strokeWidth="2.4" />

      <line x1="0" y1="-26" x2="0" y2={-35 + starBob} stroke={PALETTE.ink} strokeWidth="2.2" strokeLinecap="round" />
      <path
        transform={`translate(0, ${-43 + starBob})`}
        d={geminiStarPath(12)}
        fill="url(#miniGeminiStar)"
        stroke={PALETTE.ink}
        strokeWidth="2.2"
        strokeLinejoin="round"
      />

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
      <ellipse cx="-10" cy="-14" rx="12" ry="4.5" fill="#FFFFFF" opacity="0.35" transform="rotate(-12 -10 -14)" />
      <path transform="translate(0, 14)" d={geminiStarPath(5.5)} fill="#FFFFFF" opacity="0.88" />

      <path d="M -16 -2 Q -11 -9 -6 -2" fill="none" stroke={PALETTE.ink} strokeWidth="3" strokeLinecap="round" />
      <path d="M 6 -2 Q 11 -9 16 -2" fill="none" stroke={PALETTE.ink} strokeWidth="3" strokeLinecap="round" />
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
    sunglassesMode,
    sunglassesProgress,
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
            <path transform="translate(-14.5, -7)" d={geminiStarPath(2.8)} fill="#FFFFFF" />
            <path transform="translate(12, -7)" d={geminiStarPath(2.8)} fill="#FFFFFF" />
            <ellipse cx="-24" cy="7" rx="5.5" ry="3.2" fill="#FFA6D5" opacity="0.6" />
            <ellipse cx="24" cy="7" rx="5.5" ry="3.2" fill="#FFA6D5" opacity="0.6" />
          </g>
        );
    }
  };

  // Compute animated sunglasses transform (placed directly over EYES at y=-4!)
  const hasSunglasses = sunglassesMode !== 'hidden';
  let glassesX = 0;
  let glassesY = -4;
  let glassesRot = 0;
  let glassesOpacity = 1;
  let leftHandHoldingGlasses = false;

  if (sunglassesMode === 'puttingOn') {
    const t = clamp(sunglassesProgress, 0, 1.15);
    glassesX = lerp(-46, 0, Math.min(1, t));
    glassesY = lerp(-32, -4, t);
    glassesRot = lerp(-26, 0, Math.min(1, t));
    glassesOpacity = clamp(sunglassesProgress * 3.5, 0, 1);
    leftHandHoldingGlasses = true;
  } else if (sunglassesMode === 'wearing') {
    glassesX = 0;
    glassesY = -4;
    glassesRot = 0;
    glassesOpacity = 1;
  } else if (sunglassesMode === 'takingOff') {
    const t = clamp(sunglassesProgress, 0, 1);
    glassesX = lerp(0, -52, t);
    glassesY = lerp(-4, -30, t);
    glassesRot = lerp(0, -30, t);
    glassesOpacity = t > 0.7 ? lerp(1, 0, (t - 0.7) / 0.3) : 1;
    leftHandHoldingGlasses = true;
  }

  // Animated glint sweep across dark lenses while wearing
  const glintShift = ((frame * 3.5) % 44) - 18;

  const armOriginX = arm ? x + (arm.side === 'left' ? -36 * sx : 36 * sx) : x;
  const armOriginY = y - 2 * sy;
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

      {/* Giant Ctrl+Z keycap underneath character (9:16 position) */}
      {showCtrlZ && (
        <g transform={`translate(360, ${1732 + ctrlZPress * 14}) scale(1.22)`}>
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
            strokeWidth="18"
            strokeLinecap="round"
          />
          <path
            d={armPath}
            fill="none"
            stroke="url(#geminiArmGrad)"
            strokeWidth="11.5"
            strokeLinecap="round"
          />
          {arm.tool === 'hand' && (
            <circle
              cx={arm.targetX}
              cy={arm.targetY}
              r="12"
              fill="#7CC5FF"
              stroke={PALETTE.ink}
              strokeWidth="3.2"
            />
          )}
          {arm.tool === 'knife' && (
            <g transform={`translate(${arm.targetX}, ${arm.targetY}) rotate(-32) scale(1.25)`}>
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

        {/* Left stubby arm (hidden when stretched OR when lifting sunglasses) */}
        {(!arm || arm.side !== 'left') && !leftHandHoldingGlasses && (
          <rect x="-48" y="-3" width="15" height="12" rx="6" fill="#63A8FA" stroke={PALETTE.ink} strokeWidth="2.8" />
        )}

        {/* Right stubby arm (or waving in ending) */}
        {(!arm || arm.side !== 'right') &&
          (waveEnding ? (
            <g transform={`translate(35, 1) rotate(${-38 + Math.sin(frame * 0.4) * 16})`}>
              <rect x="0" y="-6" width="28" height="12" rx="6" fill="#8D71F7" stroke={PALETTE.ink} strokeWidth="2.8" />
              <circle cx="28" cy="0" r="7.5" fill="#7CC5FF" stroke={PALETTE.ink} strokeWidth="2.6" />
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
        <g>
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

        {/* Glossy highlight & bottom rim shade */}
        <ellipse
          cx="-14"
          cy="-18"
          rx="14"
          ry="5"
          fill="#FFFFFF"
          opacity="0.38"
          transform="rotate(-14 -14 -18)"
        />
        <path
          d="M -28 21 Q 0 28 28 21"
          fill="none"
          stroke="#3E4EB8"
          strokeWidth="4.5"
          strokeLinecap="round"
          opacity="0.38"
        />

        {/* Small white Gemini star emblem on belly */}
        <path transform="translate(0, 16)" d={geminiStarPath(6.2)} fill="#FFFFFF" opacity="0.92" />

        {/* Expressive Eyes */}
        {renderEyes()}

        {/* Sleek Dark Sunglasses worn OVER EYES when Saturation is Maxed! */}
        {hasSunglasses && (
          <g
            transform={`translate(${glassesX}, ${glassesY}) rotate(${glassesRot})`}
            opacity={glassesOpacity}
          >
            {/* Temple arms */}
            <line x1="-35" y1="-3" x2="-27" y2="-3" stroke={PALETTE.ink} strokeWidth="3.5" strokeLinecap="round" />
            <line x1="27" y1="-3" x2="35" y2="-3" stroke={PALETTE.ink} strokeWidth="3.5" strokeLinecap="round" />
            {/* Left & Right dark shaded lenses */}
            <rect x="-29" y="-10" width="25" height="17" rx="5.5" fill="#18171C" stroke={PALETTE.ink} strokeWidth="2.4" />
            <rect x="4" y="-10" width="25" height="17" rx="5.5" fill="#18171C" stroke={PALETTE.ink} strokeWidth="2.4" />
            {/* Bridge */}
            <path d="M -4 -4 Q 0 -7 4 -4" fill="none" stroke={PALETTE.ink} strokeWidth="3.2" strokeLinecap="round" />
            {/* Animated cool cyan/magenta lens reflections */}
            <line
              x1={-24 + clamp(glintShift, -4, 14) * 0.4}
              y1="-7"
              x2={-15 + clamp(glintShift, -4, 14) * 0.4}
              y2="4"
              stroke="#7AE4FF"
              strokeWidth="2.8"
              strokeLinecap="round"
              opacity="0.82"
            />
            <line
              x1={9 + clamp(glintShift, -4, 14) * 0.4}
              y1="-7"
              x2={18 + clamp(glintShift, -4, 14) * 0.4}
              y2="4"
              stroke="#D29BFF"
              strokeWidth="2.8"
              strokeLinecap="round"
              opacity="0.82"
            />
          </g>
        )}

        {/* Raised Left Arm gripping the sunglasses to put them ON / take them OFF */}
        {leftHandHoldingGlasses && (
          <g>
            <path
              d={buildArmPath(-36, 2, glassesX - 28, glassesY - 2, 10)}
              fill="none"
              stroke={PALETTE.ink}
              strokeWidth="12.5"
              strokeLinecap="round"
            />
            <path
              d={buildArmPath(-36, 2, glassesX - 28, glassesY - 2, 10)}
              fill="none"
              stroke="#63A8FA"
              strokeWidth="7.5"
              strokeLinecap="round"
            />
            <circle
              cx={glassesX - 28}
              cy={glassesY - 2}
              r="7.5"
              fill="#7CC5FF"
              stroke={PALETTE.ink}
              strokeWidth="2.5"
            />
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
