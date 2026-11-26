import React from 'react';
import {Composition} from 'remotion';
import {FPS, HEIGHT, TOTAL_FRAMES, WIDTH} from './utils/motion';
import {VideoEditingMotion} from './VideoEditingMotion';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="ClaudeVideoEditingMotion"
      component={VideoEditingMotion}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  );
};
