import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {EditorWorkspace, PhoneFrame} from './components/EditorWorkspace';
import {EffectsOverlay} from './components/EffectsOverlay';
import {IntroTerminal} from './components/IntroTerminal';
import {RobotCharacter} from './components/Robot';
import {getDirectorState} from './config/timeline';
import {HEIGHT, lerp, PALETTE, WIDTH} from './utils/motion';

export const VideoEditingMotion: React.FC = () => {
  const frame = useCurrentFrame();
  const state = getDirectorState(frame);
  const {camera, endingProgress} = state;

  const isEndingShowcase = endingProgress > 0.01;
  const phoneX = lerp(640, 616, endingProgress);
  const phoneY = lerp(216, 360, endingProgress);
  const phoneScale = lerp(1, 1.54, endingProgress);

  return (
    <AbsoluteFill style={{backgroundColor: PALETTE.paper}}>
      <Audio src={staticFile('audio/soundtrack.m4a')} />

      <svg
        width={WIDTH}
        height={HEIGHT}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        style={{display: 'block'}}
      >
        {/* Warm paper background */}
        <rect x="0" y="0" width={WIDTH} height={HEIGHT} fill={PALETTE.paper} />

        {/* Camera-controlled Editor Stage */}
        <g
          transform={`translate(${WIDTH / 2 + camera.tx}, ${HEIGHT / 2 + camera.ty}) scale(${camera.scale}) translate(${-WIDTH / 2}, ${-HEIGHT / 2})`}
        >
          <EditorWorkspace state={state} hidePhone={isEndingShowcase} />
          <IntroTerminal state={state} />
          {!isEndingShowcase && <RobotCharacter state={state} />}
        </g>

        {/* Ending Showcase Foreground Layer (unscaled crisp phone, sticky note, celebrating robot) */}
        {isEndingShowcase && (
          <g>
            <PhoneFrame state={state} x={phoneX} y={phoneY} scale={phoneScale} />
            <RobotCharacter state={state} />
          </g>
        )}

        {/* Screen-space Comic Callouts, Stamps, Sticky Note & Confetti */}
        <EffectsOverlay state={state} />
      </svg>
    </AbsoluteFill>
  );
};
