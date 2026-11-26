export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const TOTAL_FRAMES = 900;

export const PALETTE = {
  paper: '#F4EFE6',
  paperLight: '#FAF7F0',
  paperCard: '#FFFDF8',
  ink: '#2B2523',
  inkMuted: '#786E68',
  robot: '#5A7DF6',
  robotShade: '#4258C9',
  robotHighlight: '#85B3FF',
  geminiBlue: '#4B8BF5',
  geminiViolet: '#8B6CF6',
  geminiCyan: '#67D9F6',
  geminiPink: '#D97AF0',
  yellow: '#F1C64E',
  yellowSoft: '#FEF4D1',
  teal: '#65B6A7',
  tealDark: '#479486',
  mint: '#D5F0E3',
  lavender: '#DCD7F4',
  blush: '#FCE4EC',
  coral: '#E55A52',
  greenStamp: '#49A36B',
  nightDeep: '#1E2046',
  nightMid: '#373B75',
  ramenWall: '#F7E7A9',
  shibaBg: '#D4F1E3',
  discoBg: '#6B4E9B',
} as const;

export const FONTS = {
  hand: "'LXGW WenKai', 'STKaiti', 'KaiTi', 'YouYuan', 'PingFang SC', 'Microsoft YaHei', sans-serif",
  comic: "'YouYuan', 'Microsoft YaHei', 'PingFang SC', 'Noto Sans SC', sans-serif",
  mono: "'Cascadia Code', 'JetBrains Mono', 'Consolas', 'STKaiti', monospace",
} as const;

export function clamp(v: number, min = 0, max = 1): number {
  return Math.max(min, Math.min(max, v));
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function remap(
  value: number,
  inMin: number,
  inMax: number,
  outMin = 0,
  outMax = 1,
  ease?: (t: number) => number,
): number {
  if (inMax === inMin) return outMax;
  const raw = clamp((value - inMin) / (inMax - inMin), 0, 1);
  const eased = ease ? ease(raw) : raw;
  return lerp(outMin, outMax, eased);
}

export const easeOutCubic = (t: number): number => 1 - Math.pow(1 - clamp(t), 3);
export const easeInOutCubic = (t: number): number => {
  const x = clamp(t);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};
export const easeOutBack = (t: number): number => {
  const x = clamp(t);
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};
export const easeOutBounce = (t: number): number => {
  let x = clamp(t);
  const n1 = 7.5625;
  const d1 = 2.75;
  if (x < 1 / d1) return n1 * x * x;
  if (x < 2 / d1) return n1 * (x -= 1.5 / d1) * x + 0.75;
  if (x < 2.5 / d1) return n1 * (x -= 2.25 / d1) * x + 0.9375;
  return n1 * (x -= 2.625 / d1) * x + 0.984375;
};

/** Deterministic pseudo-random generator in [0, 1) */
export function seededRandom(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453123;
  return x - Math.floor(x);
}

/** Formats frame index as HH:MM:SS:FF (30fps) */
export function formatTimecode(frame: number): string {
  const f = Math.max(0, Math.floor(frame));
  const ff = f % FPS;
  const totalSec = Math.floor(f / FPS);
  const ss = totalSec % 60;
  const mm = Math.floor(totalSec / 60) % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `00:${pad(mm)}:${pad(ss)}:${pad(ff)}`;
}

/** Computes a subtle quadratic bezier curve string for stretchy robot arm */
export function buildArmPath(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  sag = 18,
): string {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2 + sag;
  return `M ${x1.toFixed(1)} ${y1.toFixed(1)} Q ${mx.toFixed(1)} ${my.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
}
