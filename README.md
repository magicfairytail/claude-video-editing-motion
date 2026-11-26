# claude-video-editing-motion

使用 **Remotion + React + TypeScript + 纯矢量 SVG** 复刻的 30 秒手绘风 AI 剪辑动画（`1280×720`, `30 FPS`, `900` 帧）。

对应动效片段：[claude_剪视频过程motion](https://motionface.cc/?recording=e3ee409a-50f7-4b4a-af27-288226e47a57)（片段 ID：`e3ee409a-50f7-4b4a-af27-288226e47a57`）。

## 动画分镜拆解（30 秒 / 900 帧）

| 时间 | 帧区间 | 画面与交互内容 |
| --- | --- | --- |
| `00:00 – 00:01.8` | `0 – 54` | 终端打字 `const 剪辑软件 = Gemini.写代码()` → 铅笔沿外框手绘勾勒剪辑器界面 |
| `00:01.8 – 00:05.0` | `54 – 148` | Gemini 星芒小人从上方跳落喊出「开工!」，伸长手臂依次将 `夜景.mp4`、`拉面.mp4`、`柴犬.mov`、`Gemini蹦迪.mp4` 拖入时间轴并加载音轨 `bgm_gemini.wav` |
| `00:05.0 – 00:08.5` | `148 – 254` | 预览到拉面片段中失焦段「对焦中...」，Gemini 小人持美工刀「唰!」切出废片扔进垃圾桶「哐当!」，拼接清爽片段 |
| `00:08.5 – 00:11.8` | `254 – 354` | 切换「转场」面板，将旋转、翻页、故障转场投掷到三处接缝（「空心入网!」），手机实时预览转场效果 |
| `00:11.8 – 00:15.5` | `354 – 466` | 切换「文字」面板添加字幕，出现错别字后 Gemini 小人喊「撤销!」踩下巨型 `Ctrl+Z` 键帽修正为「前方高能预警」并盖上绿色「已修正」印章 |
| `00:15.5 – 00:20.2` | `466 – 606` | 镜头右移至「调整 ✨」面板：拉升闪光至 `70%`，饱和度拉过头触发「爆表!! / 饱和度:拉满」，回调至 `110%` 戴上墨镜，拉升缩放冲击至 `60%` |
| `00:20.2 – 00:23.8` | `606 – 714` | 点击音轨右侧「▼ 卡点」按钮，金色节拍三角逐一铺满音轨，素材块随鼓点律动 |
| `00:23.8 – 00:26.8` | `714 – 806` | 点击「↑ 导出」进入渲染进度条，卡在 `99.99%` 后 Gemini 小人跃起 `BONK!` 触发「叮! / 完成 ✓」与彩纸爆发 |
| `00:26.8 – 00:30.0` | `806 – 900` | 编辑器背景退暗，手机居中放大播放成片快剪与短视频互动信息栏（「拿捏了!」），左侧贴出便利贴「30 秒剪完，Gemini — Gemini ✨」 |

## 目录结构

```text
src/
├── index.ts                     # Remotion 入口注册
├── Root.tsx                     # Composition 定义（1280×720, 30fps, 900 frames）
├── VideoEditingMotion.tsx       # 主合成：相机调度、前景/背景图层与音轨
├── config/
│   └── timeline.ts              # 900 帧纯函数状态机与运镜关键帧
├── utils/
│   └── motion.ts                # 缓动函数、确定性伪随机、配色与字体配置
└── components/
    ├── IntroTerminal.tsx        # 开场代码终端与手绘铅笔描边
    ├── EditorWorkspace.tsx      # 手绘剪辑器 UI、参数面板、时间轴与手机画框
    ├── Scenes.tsx               # 夜景、拉面、柴犬、蹦迪矢量场景与转场合成
    ├── Robot.tsx                # 机器人「小克」表情、伸长手臂、墨镜与 Ctrl+Z 键帽
    └── EffectsOverlay.tsx       # 漫画拟声词、垃圾桶、印章、便利贴与彩纸
public/
└── audio/
    └── soundtrack.m4a           # 参考音轨（仅用于对齐节奏与本地渲染预览）
```

## 快速开始

需要 **Node.js 20+** 与 **npm**。

### 1. 安装依赖

```bash
npm ci
```

### 2. 类型检查

```bash
npm run typecheck
```

### 3. 启动 Remotion Studio 实时预览

```bash
npm run dev
```

### 4. 渲染 MP4 成片

```bash
npm run render
```

默认输出到 `out/claude-video-editing-motion.mp4`（`1280×720`、30fps、H.264、`crf=18`）。如需指定本机 Chrome 可执行文件，可附加参数：

```bash
npm run render -- --browser-executable="/path/to/chrome"
```

### 5. 导出单帧预览图

```bash
npm run still
```

## 许可说明

- 本仓库全部源代码与矢量组件采用 **MIT License**。
- `public/audio/soundtrack.m4a` 源自参考动效片段原音轨，仅用于动画节奏同步演示，其版权归原权利人所有。
