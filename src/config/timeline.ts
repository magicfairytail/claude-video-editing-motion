import {
  clamp,
  easeInOutCubic,
  easeOutBack,
  easeOutBounce,
  easeOutCubic,
  lerp,
  remap,
} from '../utils/motion';

export type LeftTab = 'media' | 'transitions' | 'text';
export type SceneKind = 'blank' | 'night' | 'ramen' | 'ramenDefocus' | 'shiba' | 'disco';
export type TransitionKind = 'none' | 'spin' | 'flip' | 'glitch';
export type RobotExpression = 'normal' | 'sparkle' | 'happy' | 'squint' | 'shock' | 'wink';
export type ExportState = 'idle' | 'rendering' | 'stalled' | 'done';
export type SunglassesMode = 'hidden' | 'puttingOn' | 'wearing' | 'takingOff';

export interface CameraState {
  scale: number;
  tx: number;
  ty: number;
}

export interface DraggingClip {
  id: 'night' | 'ramen' | 'shiba' | 'disco';
  label: string;
  duration: string;
  x: number;
  y: number;
}

export interface ComicCallout {
  text: string;
  x: number;
  y: number;
  color: string;
  rotate: number;
  scale: number;
  opacity: number;
}

export interface DirectorState {
  frame: number;
  /** Intro terminal progress */
  showIntro: boolean;
  introTerminalProgress: number;
  introZipProgress: number;
  editorDrawProgress: number;
  /** Camera transform applied to editor canvas */
  camera: CameraState;
  /** Active left tab */
  leftTab: LeftTab;
  /** Which media clips are placed on timeline (0..4) */
  placedClipsCount: number;
  /** Currently dragged clip flying from asset panel to timeline */
  draggingClip: DraggingClip | null;
  /** Audio track visibility */
  audioTrackOpacity: number;
  /** Ramen cut sequence */
  ramenCutDone: boolean;
  ramenCutGapProgress: number;
  trashCanProgress: number;
  fallingDefocusProgress: number;
  /** Transitions placed on seams (0..3) */
  placedTransitions: number;
  flyingTransition: {kind: 'spin' | 'flip' | 'glitch'; x: number; y: number} | null;
  /** Text track */
  subtitleVisible: boolean;
  subtitleText: string;
  subtitleGlitchy: boolean;
  showCtrlZ: boolean;
  ctrlZPress: number;
  fixedStampProgress: number;
  /** Inspector sliders */
  flashPct: number;
  saturationPct: number;
  saturationOverload: boolean;
  zoomImpactPct: number;
  speedVal: number;
  /** Beat sync */
  beatButtonPressed: boolean;
  beatMarkersCount: number;
  beatPulse: number;
  /** Export button */
  exportState: ExportState;
  exportProgressPct: number;
  exportProgressText: string;
  /** Playhead time in seconds along timeline (0..11) */
  playheadSec: number;
  isPlaying: boolean;
  /** Phone preview state */
  phoneScene: SceneKind;
  phonePrevScene: SceneKind;
  phoneTransition: TransitionKind;
  phoneTransitionProgress: number;
  phoneSubtitle: string | null;
  phoneSubtitleGlitchy: boolean;
  phoneSocialMode: boolean;
  phoneHeadline: string | null;
  /** Gemini character state */
  robotVisible: boolean;
  robotX: number;
  robotY: number;
  robotScaleX: number;
  robotScaleY: number;
  robotExpression: RobotExpression;
  sunglassesMode: SunglassesMode;
  sunglassesProgress: number;
  robotDust: number;
  robotSpeech: string | null;
  robotArm: {
    side: 'left' | 'right';
    targetX: number;
    targetY: number;
    tool: 'hand' | 'knife' | 'none';
    sag?: number;
  } | null;
  /** Comic popouts & overlays */
  callouts: ComicCallout[];
  screenFlashOpacity: number;
  screenDimOpacity: number;
  /** Ending showcase */
  endingProgress: number;
  confettiProgress: number;
}

interface CamKey {
  f: number;
  s: number;
  tx: number;
  ty: number;
}

/** Gentle 9:16 vertical camera pan/zoom to spotlight active action while keeping phone & timeline visible */
const CAMERA_KEYS: CamKey[] = [
  {f: 0, s: 1, tx: 0, ty: 0},
  {f: 72, s: 1, tx: 0, ty: 0},
  {f: 94, s: 1.07, tx: 22, ty: -48},
  {f: 152, s: 1.09, tx: 18, ty: -85},
  {f: 250, s: 1.09, tx: 16, ty: -82},
  {f: 270, s: 1.07, tx: 26, ty: -42},
  {f: 350, s: 1.06, tx: 22, ty: -40},
  {f: 372, s: 1.08, tx: 12, ty: -62},
  {f: 458, s: 1.08, tx: 12, ty: -62},
  {f: 478, s: 1.12, tx: -36, ty: -24},
  {f: 590, s: 1.12, tx: -36, ty: -24},
  {f: 612, s: 1.04, tx: 0, ty: -56},
  {f: 706, s: 1.04, tx: 0, ty: -52},
  {f: 726, s: 1.08, tx: -28, ty: 68},
  {f: 798, s: 1.08, tx: -28, ty: 68},
  {f: 818, s: 1, tx: 0, ty: 0},
  {f: 900, s: 1, tx: 0, ty: 0},
];

function sampleCamera(frame: number): CameraState {
  for (let i = 0; i < CAMERA_KEYS.length - 1; i++) {
    const a = CAMERA_KEYS[i];
    const b = CAMERA_KEYS[i + 1];
    if (frame >= a.f && frame <= b.f) {
      const t = easeInOutCubic((frame - a.f) / Math.max(1, b.f - a.f));
      return {
        scale: lerp(a.s, b.s, t),
        tx: lerp(a.tx, b.tx, t),
        ty: lerp(a.ty, b.ty, t),
      };
    }
  }
  return {scale: 1, tx: 0, ty: 0};
}

export function getDirectorState(frame: number): DirectorState {
  const f = clamp(frame, 0, 899);
  const camera = sampleCamera(f);

  // 1. Intro & Editor sketch-in (0..54)
  const showIntro = f < 46;
  const introTerminalProgress = remap(f, 0, 22, 0, 1);
  const introZipProgress = remap(f, 22, 34, 0, 1, easeInOutCubic);
  const editorDrawProgress = remap(f, 24, 52, 0, 1, easeOutCubic);

  // 2. Left Tab
  let leftTab: LeftTab = 'media';
  if (f >= 256 && f < 354) leftTab = 'transitions';
  else if (f >= 354) leftTab = 'text';

  // 3. Dragging 4 clips into vertical timeline (68..146)
  // Media card centers: (172, 931), (418, 931), (172, 1099), (418, 1099)
  // Timeline clip centers (y=1498): 222, 479, 736, 922
  const clipSpecs = [
    {id: 'night' as const, label: '夜景.mp4', duration: '2.4s', sx: 172, sy: 931, tx: 222, ty: 1498, start: 68, end: 86},
    {id: 'ramen' as const, label: '拉面.mp4', duration: '4.6s', sx: 418, sy: 931, tx: 479, ty: 1498, start: 86, end: 106},
    {id: 'shiba' as const, label: '柴犬.mov', duration: '2.4s', sx: 172, sy: 1099, tx: 736, ty: 1498, start: 106, end: 126},
    {id: 'disco' as const, label: 'Gemini蹦迪.mp4', duration: '2.8s', sx: 418, sy: 1099, tx: 922, ty: 1498, start: 126, end: 146},
  ];
  let placedClipsCount = 0;
  let draggingClip: DraggingClip | null = null;
  for (let i = 0; i < clipSpecs.length; i++) {
    const c = clipSpecs[i];
    if (f >= c.end) {
      placedClipsCount = i + 1;
    } else if (f >= c.start) {
      const t = remap(f, c.start, c.end, 0, 1, easeInOutCubic);
      const arcX = Math.sin(t * Math.PI) * 32;
      draggingClip = {
        id: c.id,
        label: c.label,
        duration: c.duration,
        x: lerp(c.sx, c.tx, t) + arcX,
        y: lerp(c.sy, c.ty, t),
      };
      break;
    }
  }
  const audioTrackOpacity = remap(f, 118, 134, 0, 1, easeOutCubic);

  // 4. Cut out blurry defocused ramen section (148..252)
  const ramenCutDone = f >= 204;
  const ramenCutGapProgress = remap(f, 224, 240, 0, 1, easeOutCubic);
  const trashCanProgress =
    f >= 200 && f <= 254
      ? f < 214
        ? remap(f, 200, 214, 0, 1, easeOutBack)
        : f > 242
          ? remap(f, 242, 254, 1, 0, easeInOutCubic)
          : 1
      : 0;
  const fallingDefocusProgress = f >= 204 && f <= 232 ? remap(f, 204, 232, 0, 1, easeInOutCubic) : 0;

  // 5. Transitions (264..348)
  // Transition card centers: spin (172, 915), flip (418, 915), glitch (172, 1037)
  // Seams after cut: (311, 1498), (513, 1498), (691, 1498)
  const transSpecs = [
    {kind: 'spin' as const, sx: 172, sy: 915, tx: 311, ty: 1498, start: 268, end: 292},
    {kind: 'flip' as const, sx: 418, sy: 915, tx: 513, ty: 1498, start: 300, end: 320},
    {kind: 'glitch' as const, sx: 172, sy: 1037, tx: 691, ty: 1498, start: 324, end: 344},
  ];
  let placedTransitions = 0;
  let flyingTransition: {kind: 'spin' | 'flip' | 'glitch'; x: number; y: number} | null = null;
  for (let i = 0; i < transSpecs.length; i++) {
    const tr = transSpecs[i];
    if (f >= tr.end) {
      placedTransitions = i + 1;
    } else if (f >= tr.start) {
      const t = remap(f, tr.start, tr.end, 0, 1, easeInOutCubic);
      flyingTransition = {
        kind: tr.kind,
        x: lerp(tr.sx, tr.tx, t) + Math.sin(t * Math.PI) * 55,
        y: lerp(tr.sy, tr.ty, t) - Math.sin(t * Math.PI) * 70,
      };
      break;
    }
  }

  // 6. Subtitle + Typo Undo (368..465)
  const subtitleVisible = f >= 370;
  let subtitleText = '前方高能预警';
  let subtitleGlitchy = false;
  if (f >= 370 && f < 438) {
    const typedLen = Math.floor(remap(f, 370, 398, 1, 6));
    const rawTypo = '前方高能预敬';
    subtitleText = rawTypo.slice(0, typedLen);
    subtitleGlitchy = f >= 402 && f < 438;
  } else if (f >= 438) {
    subtitleText = '前方高能预警';
  }
  const showCtrlZ = f >= 412 && f <= 462;
  const ctrlZPress =
    f >= 426 && f <= 442
      ? Math.sin(remap(f, 426, 442, 0, Math.PI))
      : 0;
  const fixedStampProgress =
    f >= 440 && f <= 466
      ? f < 452
        ? remap(f, 440, 452, 0, 1, easeOutBack)
        : remap(f, 458, 466, 1, 0)
      : 0;

  // 7. Inspector Adjustments (475..595) + Sunglasses Put-On when Maxed & Take-Off when Lowered!
  let flashPct = 0;
  if (f >= 475) flashPct = Math.round(remap(f, 475, 496, 0, 70, easeOutCubic));

  let saturationPct = 100;
  if (f >= 500 && f < 538) {
    saturationPct = Math.round(remap(f, 500, 520, 100, 260, easeInOutCubic));
  } else if (f >= 538 && f < 556) {
    saturationPct = Math.round(remap(f, 538, 554, 260, 110, easeOutCubic));
  } else if (f >= 556) {
    saturationPct = 110;
  }
  const saturationOverload = f >= 514 && f < 542;

  // Sunglasses choreography tied directly to saturation overload:
  // 512..522: Gemini raises left hand to put sunglasses ON its eyes!
  // 522..544: Gemini wears sunglasses over its eyes to shield from blinding saturation!
  // 544..558: As saturation lowers back to 110%, Gemini raises left hand to take sunglasses OFF!
  let sunglassesMode: SunglassesMode = 'hidden';
  let sunglassesProgress = 0;
  if (f >= 512 && f < 522) {
    sunglassesMode = 'puttingOn';
    sunglassesProgress = remap(f, 512, 522, 0, 1, easeOutBack);
  } else if (f >= 522 && f < 544) {
    sunglassesMode = 'wearing';
    sunglassesProgress = 1;
  } else if (f >= 544 && f < 558) {
    sunglassesMode = 'takingOff';
    sunglassesProgress = remap(f, 544, 558, 0, 1, easeInOutCubic);
  }

  let zoomImpactPct = 0;
  if (f >= 564) zoomImpactPct = Math.round(remap(f, 564, 586, 0, 60, easeOutCubic));
  const speedVal = 1.0;

  // 8. Beat Sync (618..710)
  const beatButtonPressed = f >= 632 && f <= 646;
  const beatMarkersCount = f >= 636 ? Math.floor(remap(f, 636, 684, 0, 26, easeOutCubic)) : 0;
  const beatActive = f >= 636;
  const beatPhase = (f % 12) / 12;
  const beatPulse = beatActive ? Math.pow(1 - beatPhase, 2.6) : 0;

  // 9. Export & 99.99% Stall + BONK! (726..804)
  let exportState: ExportState = 'idle';
  let exportProgressPct = 0;
  let exportProgressText = '导出';
  if (f >= 726 && f < 752) {
    exportState = 'rendering';
    exportProgressPct = remap(f, 726, 752, 8, 99.9, easeOutCubic);
    exportProgressText = `渲染中 ${Math.round(exportProgressPct)}%`;
  } else if (f >= 752 && f < 782) {
    exportState = 'stalled';
    exportProgressPct = 99.99;
    exportProgressText = '渲染中 99.99%';
  } else if (f >= 782) {
    exportState = 'done';
    exportProgressPct = 100;
    exportProgressText = '完成 ✓';
  }

  // 10. Ending Showcase (804..900)
  const endingProgress = remap(f, 804, 830, 0, 1, easeOutCubic);
  const confettiProgress = f >= 782 ? remap(f, 782, 899, 0, 1) : 0;

  // Playhead & Phone Preview Choreography
  let playheadSec = 0;
  let isPlaying = false;
  let phoneScene: SceneKind = 'blank';
  let phonePrevScene: SceneKind = 'blank';
  let phoneTransition: TransitionKind = 'none';
  let phoneTransitionProgress = 1;
  let phoneSubtitle: string | null = null;
  let phoneSubtitleGlitchy = false;
  let phoneSocialMode = false;
  let phoneHeadline: string | null = null;

  if (f < 86) {
    playheadSec = 0;
    phoneScene = 'blank';
  } else if (f < 148) {
    playheadSec = 0.4;
    phoneScene = 'night';
  } else if (f < 164) {
    playheadSec = remap(f, 148, 164, 0.4, 3.6);
    phoneScene = playheadSec < 2.4 ? 'night' : 'ramen';
    isPlaying = true;
  } else if (f < 218) {
    playheadSec = remap(f, 164, 218, 3.9, 4.9);
    phoneScene = 'ramenDefocus';
  } else if (f < 268) {
    playheadSec = 3.2;
    phoneScene = 'ramen';
  } else if (f < 306) {
    playheadSec = remap(f, 268, 306, 2.0, 2.8);
    if (f >= 288 && f <= 306) {
      phonePrevScene = 'night';
      phoneScene = 'ramen';
      phoneTransition = 'spin';
      phoneTransitionProgress = remap(f, 288, 306, 0, 1, easeInOutCubic);
      isPlaying = true;
    } else {
      phoneScene = 'night';
    }
  } else if (f < 354) {
    playheadSec = remap(f, 306, 354, 4.7, 5.8);
    if (f >= 318 && f <= 334) {
      phonePrevScene = 'ramen';
      phoneScene = 'shiba';
      phoneTransition = 'flip';
      phoneTransitionProgress = remap(f, 318, 334, 0, 1, easeInOutCubic);
      isPlaying = true;
    } else {
      phoneScene = 'shiba';
    }
  } else if (f < 466) {
    playheadSec = 6.2;
    phoneScene = 'shiba';
    isPlaying = true;
    if (subtitleVisible) {
      phoneSubtitle = subtitleText;
      phoneSubtitleGlitchy = subtitleGlitchy;
    }
  } else if (f < 806) {
    playheadSec = remap(f, 466, 726, 8.2, 10.4);
    phoneScene = 'disco';
    isPlaying = f < 726;
  } else {
    phoneSocialMode = true;
    isPlaying = true;
    if (f < 824) {
      phoneScene = 'night';
      playheadSec = remap(f, 806, 824, 0.2, 2.3);
    } else if (f < 844) {
      phonePrevScene = 'night';
      phoneScene = 'ramen';
      phoneTransition = f < 832 ? 'spin' : 'none';
      phoneTransitionProgress = remap(f, 824, 832, 0, 1, easeOutCubic);
      playheadSec = remap(f, 824, 844, 2.5, 4.8);
    } else if (f < 864) {
      phonePrevScene = 'ramen';
      phoneScene = 'shiba';
      phoneTransition = f < 852 ? 'flip' : 'none';
      phoneTransitionProgress = remap(f, 844, 852, 0, 1, easeOutCubic);
      phoneSubtitle = '前方高能预警';
      playheadSec = remap(f, 844, 864, 5.1, 7.2);
    } else {
      phonePrevScene = 'shiba';
      phoneScene = 'disco';
      phoneTransition = f < 872 ? 'glitch' : 'none';
      phoneTransitionProgress = remap(f, 864, 872, 0, 1, easeOutCubic);
      phoneHeadline = f >= 872 ? '拿捏了!' : null;
      playheadSec = remap(f, 864, 900, 7.5, 10.4);
    }
  }

  // Gemini Mascot Choreography (scaled nicely at ~1.25x on 1080x1920!)
  const robotVisible = f >= 46;
  let robotX = 246;
  let robotY = 1386;
  let robotScaleX = 1.24;
  let robotScaleY = 1.24;
  let robotExpression: RobotExpression = 'normal';
  let robotDust = 0;
  let robotSpeech: string | null = null;
  let robotArm: DirectorState['robotArm'] = null;

  if (f >= 46 && f < 68) {
    const dropT = remap(f, 46, 62, 0, 1, easeOutBounce);
    robotX = 246;
    robotY = lerp(820, 1386, dropT);
    robotExpression = f >= 56 ? 'sparkle' : 'normal';
    if (f >= 58 && f <= 74) robotDust = remap(f, 58, 74, 1, 0);
    if (f >= 58 && f <= 80) robotSpeech = '开工!';
  } else if (f >= 68 && f < 148) {
    robotX = 246;
    robotY = 1386 + Math.sin(f * 0.3) * 3;
    robotExpression = f < 86 ? 'sparkle' : 'normal';
    if (f <= 80) robotSpeech = '开工!';
    if (draggingClip) {
      robotArm = {
        side: draggingClip.x < robotX ? 'left' : 'right',
        targetX: draggingClip.x,
        targetY: draggingClip.y,
        tool: 'hand',
        sag: -16,
      };
    }
  } else if (f >= 148 && f < 254) {
    robotX = 258;
    robotY = 1386;
    if (f >= 178 && f < 214) {
      robotExpression = 'squint';
      const cutX =
        f < 194
          ? remap(f, 178, 194, 380, 434, easeOutCubic)
          : remap(f, 194, 212, 434, 568, easeInOutCubic);
      const cutY =
        f < 194
          ? remap(f, 178, 194, 1418, 1482)
          : 1478 + Math.sin((f - 194) * 0.8) * 24;
      robotArm = {
        side: 'right',
        targetX: cutX,
        targetY: cutY,
        tool: 'knife',
        sag: 22,
      };
    } else if (f >= 214 && f < 254) {
      robotExpression = 'happy';
      if (f >= 230 && f <= 254) robotSpeech = '清爽！';
    }
  } else if (f >= 254 && f < 354) {
    robotX = 258;
    robotY = 1386;
    robotExpression = f >= 292 && f <= 316 ? 'squint' : 'normal';
    if (flyingTransition) {
      robotArm = {
        side: flyingTransition.x < robotX ? 'left' : 'right',
        targetX: flyingTransition.x,
        targetY: flyingTransition.y,
        tool: 'hand',
        sag: -18,
      };
    } else if (f >= 292 && f <= 306) {
      robotArm = {
        side: 'right',
        targetX: 325,
        targetY: 1324,
        tool: 'hand',
        sag: -10,
      };
    }
  } else if (f >= 354 && f < 466) {
    robotX = lerp(258, 360, remap(f, 354, 412, 0, 1, easeInOutCubic));
    robotY = 1386;
    if (f >= 412 && f <= 462) {
      robotX = 360;
      const jump =
        f >= 420 && f <= 436
          ? -Math.sin(remap(f, 420, 436, 0, Math.PI)) * 46
          : 0;
      robotY = 1612 + jump + ctrlZPress * 14;
      robotScaleY = 1.24 * (1 - ctrlZPress * 0.14);
      robotScaleX = 1.24 * (1 + ctrlZPress * 0.12);
      robotDust = f >= 426 && f <= 442 ? 1 - Math.abs(remap(f, 426, 442, -1, 1)) : 0;
      robotExpression = f < 438 ? 'normal' : 'happy';
    }
  } else if (f >= 466 && f < 606) {
    // Perched below inspector sliders on timeline, stretching right arm to sliders
    // Slider track X: 596..1004; Y: flash 912, sat 1004, zoom 1096
    robotX = lerp(360, 410, remap(f, 466, 480, 0, 1, easeOutCubic));
    robotY = 1384;
    if (f >= 472 && f < 498) {
      const knobX = lerp(596, 1004, flashPct / 100);
      robotArm = {side: 'right', targetX: knobX, targetY: 912, tool: 'hand', sag: 16};
      robotExpression = 'sparkle';
    } else if (f >= 498 && f < 558) {
      const knobX = lerp(596, 1004, clamp(saturationPct / 250, 0, 1));
      robotArm = {side: 'right', targetX: knobX, targetY: 1004, tool: 'hand', sag: 18};
      // Shocked right before putting on glasses, cool/squinting behind glasses, relieved happy when taking off!
      if (f >= 510 && f < 520) robotExpression = 'shock';
      else if (f >= 520 && f < 548) robotExpression = 'squint';
      else robotExpression = 'happy';
    } else if (f >= 560 && f < 596) {
      const knobX = lerp(596, 1004, zoomImpactPct / 100);
      robotArm = {side: 'right', targetX: knobX, targetY: 1096, tool: 'hand', sag: 20};
      robotExpression = 'sparkle';
    }
  } else if (f >= 606 && f < 714) {
    robotX = lerp(410, 460, remap(f, 606, 620, 0, 1, easeOutCubic));
    robotY = 1480 - beatPulse * 14;
    if (f >= 622 && f <= 648) {
      const reach = remap(f, 622, 634, 0, 1, easeOutCubic);
      robotArm = {
        side: 'right',
        targetX: lerp(robotX + 60, 950, reach),
        targetY: lerp(robotY, 1622, reach),
        tool: 'hand',
        sag: 24,
      };
    }
    robotExpression = beatMarkersCount > 0 ? 'happy' : 'normal';
  } else if (f >= 714 && f < 806) {
    // Reaching way up to hit Export button at (921, 70)!
    robotX = lerp(460, 760, remap(f, 714, 726, 0, 1, easeOutCubic));
    robotY = 1384;
    if (f >= 722 && f < 752) {
      robotArm = {side: 'right', targetX: 921, targetY: 70, tool: 'hand', sag: -28};
      robotExpression = 'sparkle';
    } else if (f >= 752 && f < 774) {
      robotExpression = 'squint';
      robotSpeech = '...';
    } else if (f >= 774 && f < 806) {
      const hop = f < 792 ? -Math.sin(remap(f, 774, 792, 0, Math.PI)) * 62 : 0;
      robotY = 1384 + hop;
      robotDust = f >= 786 && f <= 804 ? remap(f, 786, 804, 1, 0) : 0;
      robotExpression = 'happy';
    }
  } else {
    // Ending celebration on bottom-right beside sticky note!
    robotX = lerp(760, 845, remap(f, 806, 826, 0, 1, easeOutCubic));
    const bounce = Math.abs(Math.sin((f - 806) * 0.22)) * 16;
    robotY = 1524 - bounce;
    robotScaleX = 1.42;
    robotScaleY = 1.42;
    robotExpression = f >= 870 ? 'wink' : 'happy';
    robotDust = f >= 816 && f <= 838 ? remap(f, 816, 838, 1, 0) : 0;
  }

  // Comic Callouts positioned cleanly in 1080x1920 vertical space
  const callouts: ComicCallout[] = [];
  const pushCallout = (
    start: number,
    end: number,
    text: string,
    x: number,
    y: number,
    color: string,
    rotate: number,
  ) => {
    if (f >= start && f <= end) {
      const enter = remap(f, start, start + 8, 0, 1, easeOutBack);
      const exit = f > end - 8 ? remap(f, end - 8, end, 1, 0) : 1;
      callouts.push({text, x, y, color, rotate, scale: enter, opacity: exit});
    }
  };

  pushCallout(192, 224, '唰!', 510, 1340, '#F6A6B2', -6);
  pushCallout(218, 252, '哐当!', 710, 1730, '#F5C451', 4);
  pushCallout(286, 318, '空心入网!', 215, 650, '#6AC4B3', -6);
  pushCallout(414, 444, '撤销!', 360, 1460, '#72C2B4', -5);
  pushCallout(514, 540, '饱和度:拉满', 540, 210, '#FF5A52', -3);
  pushCallout(634, 672, '卡点!', 250, 1345, '#6EC7B7', -5);
  pushCallout(778, 806, 'BONK!', 760, 1180, '#F7CA4D', -7);
  pushCallout(782, 808, '叮!', 885, 220, '#7AD192', 6);

  // Screen flash / dim for saturation overload gag
  const screenFlashOpacity =
    f >= 516 && f <= 526 ? Math.sin(remap(f, 516, 526, 0, Math.PI)) * 0.45 : 0;
  const screenDimOpacity =
    f >= 530 && f <= 544 ? Math.sin(remap(f, 530, 544, 0, Math.PI)) * 0.35 : 0;

  return {
    frame: f,
    showIntro,
    introTerminalProgress,
    introZipProgress,
    editorDrawProgress,
    camera,
    leftTab,
    placedClipsCount,
    draggingClip,
    audioTrackOpacity,
    ramenCutDone,
    ramenCutGapProgress,
    trashCanProgress,
    fallingDefocusProgress,
    placedTransitions,
    flyingTransition,
    subtitleVisible,
    subtitleText,
    subtitleGlitchy,
    showCtrlZ,
    ctrlZPress,
    fixedStampProgress,
    flashPct,
    saturationPct,
    saturationOverload,
    zoomImpactPct,
    speedVal,
    beatButtonPressed,
    beatMarkersCount,
    beatPulse,
    exportState,
    exportProgressPct,
    exportProgressText,
    playheadSec,
    isPlaying,
    phoneScene,
    phonePrevScene,
    phoneTransition,
    phoneTransitionProgress,
    phoneSubtitle,
    phoneSubtitleGlitchy,
    phoneSocialMode,
    phoneHeadline,
    robotVisible,
    robotX,
    robotY,
    robotScaleX,
    robotScaleY,
    robotExpression,
    sunglassesMode,
    sunglassesProgress,
    robotDust,
    robotSpeech,
    robotArm,
    callouts,
    screenFlashOpacity,
    screenDimOpacity,
    endingProgress,
    confettiProgress,
  };
}
