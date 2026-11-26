import React from 'react';
import {DirectorState} from '../config/timeline';
import {buildArmPath, FONTS, PALETTE} from '../utils/motion';

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

  const renderEyes = () => {
    switch (expr) {
      case 'sparkle':
        return (
          <g>
            <path d="M -15 -6 L -12 -13 L -9 -6 L -12 1 Z" fill="#FFE66D" stroke={PALETTE.ink} strokeWidth="2" />
            <path d="M 9 -6 L 12 -13 L 15 -6 L 12 1 Z" fill="#FFE66D" stroke={PALETTE.ink} strokeWidth="2" />
          </g>
        );
      case 'happy':
        return (
          <g stroke={PALETTE.ink} strokeWidth="3.2" fill="none" strokeLinecap="round">
            <path d="M -18 -3 Q -12 -12 -6 -3" />
            <path d="M 6 -3 Q 12 -12 18 -3" />
          </g>
        );
      case 'squint':
        return (
          <g fill={PALETTE.ink}>
            <rect x="-18" y="-9" width="12" height="5" rx="2" />
            <rect x="6" y="-9" width="12" height="5" rx="2" />
          </g>
        );
      case 'shock':
        return (
          <g stroke={PALETTE.ink} strokeWidth="3.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M -17 -11 L -9 -6 L -17 -1" />
            <path d="M 17 -11 L 9 -6 L 17 -1" />
          </g>
        );
      case 'wink':
        return (
          <g>
            <rect x="-15" y="-12" width="6.5" height="14" rx="3" fill={PALETTE.ink} />
            <circle cx="-13" cy="-9" r="1.4" fill="#FFFFFF" />
            <path d="M 6 -4 Q 12 -11 18 -4" fill="none" stroke={PALETTE.ink} strokeWidth="3.2" strokeLinecap="round" />
            <ellipse cx="-22" cy="5" rx="6" ry="3.5" fill="#F58D99" opacity="0.7" />
            <ellipse cx="22" cy="5" rx="6" ry="3.5" fill="#F58D99" opacity="0.7" />
          </g>
        );
      case 'normal':
      default:
        return (
          <g>
            <rect x="-16" y="-13" width="6.5" height="14" rx="3" fill={PALETTE.ink} />
            <rect x="9.5" y="-13" width="6.5" height="14" rx="3" fill={PALETTE.ink} />
            <circle cx="-14" cy="-9.5" r="1.4" fill="#FFFFFF" />
            <circle cx="11.5" cy="-9.5" r="1.4" fill="#FFFFFF" />
          </g>
        );
    }
  };

  const armOriginX = arm ? x + (arm.side === 'left' ? -36 : 36) : x;
  const armOriginY = y - 4;
  const armPath = arm
    ? buildArmPath(armOriginX, armOriginY, arm.targetX, arm.targetY, arm.sag ?? 18)
    : '';

  // Wave arm during ending wink
  const waveEnding = frame >= 868;

  return (
    <g>
      {/* Giant Ctrl+Z keycap underneath robot */}
      {showCtrlZ && (
        <g transform={`translate(355, ${616 + ctrlZPress * 10})`}>
          {/* Base shadow */}
          <rect x="-92" y="-36" width="184" height="94" rx="18" fill="#D5CEC2" stroke={PALETTE.ink} strokeWidth="3.5" />
          {/* Top cap */}
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

      {/* Stretchy elastic arm */}
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
            stroke={PALETTE.robot}
            strokeWidth="9.5"
            strokeLinecap="round"
          />
          {arm.tool === 'hand' && (
            <circle
              cx={arm.targetX}
              cy={arm.targetY}
              r="9"
              fill={PALETTE.robotHighlight}
              stroke={PALETTE.ink}
              strokeWidth="2.8"
            />
          )}
          {arm.tool === 'knife' && (
            <g transform={`translate(${arm.targetX}, ${arm.targetY}) rotate(-32)`}>
              {/* Utility knife handle */}
              <rect x="-12" y="-7" width="24" height="14" rx="4" fill="#F1C64E" stroke={PALETTE.ink} strokeWidth="2.5" />
              {/* Blade */}
              <polygon points="12,-5 38,-5 44,5 12,5" fill="#F2F6FA" stroke={PALETTE.ink} strokeWidth="2.2" />
            </g>
          )}
        </g>
      )}

      {/* Robot main body */}
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

        {/* Legs */}
        <rect x="-25" y="25" width="12" height="18" rx="3" fill={PALETTE.robotShade} stroke={PALETTE.ink} strokeWidth="2.8" />
        <rect x="13" y="25" width="12" height="18" rx="3" fill={PALETTE.robotShade} stroke={PALETTE.ink} strokeWidth="2.8" />

        {/* Stubby left arm (unless stretched) */}
        {(!arm || arm.side !== 'left') && (
          <rect x="-48" y="-4" width="14" height="11" rx="4" fill={PALETTE.robot} stroke={PALETTE.ink} strokeWidth="2.8" />
        )}
        {/* Stubby right arm (or waving in ending) */}
        {(!arm || arm.side !== 'right') &&
          (waveEnding ? (
            <g transform={`translate(36, 0) rotate(${-35 + Math.sin(frame * 0.4) * 16})`}>
              <rect x="0" y="-6" width="28" height="11" rx="5" fill={PALETTE.robot} stroke={PALETTE.ink} strokeWidth="2.8" />
              <circle cx="28" cy="-0.5" r="7" fill={PALETTE.robotHighlight} stroke={PALETTE.ink} strokeWidth="2.6" />
            </g>
          ) : (
            <rect x="34" y="-4" width="14" height="11" rx="4" fill={PALETTE.robot} stroke={PALETTE.ink} strokeWidth="2.8" />
          ))}

        {/* Boxy terracotta torso */}
        <rect
          x="-38"
          y="-28"
          width="76"
          height="56"
          rx="6"
          fill={PALETTE.robot}
          stroke={PALETTE.ink}
          strokeWidth="3.2"
        />
        {/* Subtle bottom shading */}
        <rect x="-35" y="19" width="70" height="6" rx="2" fill={PALETTE.robotShade} opacity="0.45" />

        {/* Eyes */}
        {renderEyes()}

        {/* Cool sunglasses perched on forehead */}
        {shades && (
          <g transform="translate(0, -29) rotate(-4)">
            <rect x="-26" y="-6" width="22" height="12" rx="3" fill="#231F20" stroke={PALETTE.ink} strokeWidth="2" />
            <rect x="4" y="-6" width="22" height="12" rx="3" fill="#231F20" stroke={PALETTE.ink} strokeWidth="2" />
            <line x1="-4" y1="-2" x2="4" y2="-2" stroke={PALETTE.ink} strokeWidth="3" />
            <line x1="-22" y1="-2" x2="-14" y2="2" stroke="#FFFFFF" strokeWidth="1.8" opacity="0.6" />
            <line x1="8" y1="-2" x2="16" y2="2" stroke="#FFFFFF" strokeWidth="1.8" opacity="0.6" />
          </g>
        )}

        {/* Speech bubble */}
        {speech && (
          <g transform="translate(18, -72)">
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
