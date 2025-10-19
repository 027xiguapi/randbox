# React组件预览示例

此目录包含@randbox/react组件库的预览和演示组件。这些组件主要用于展示和测试目的，不包含在主要的组件库打包中。

## 包含的文件

### ComponentPreview.tsx
组件预览容器，提供：
- 组件属性动态调整
- 随机演示功能
- 主题切换
- 自动播放模式

### PreviewShowcase.tsx
展示页面组件，提供：
- 所有游戏组件的统一展示
- 自动游览功能
- 主题切换
- 交互式演示

### previews.tsx
预设的组件预览配置，包含：
- 各个游戏组件的预览版本
- 预定义的属性变体
- 演示配置

## 使用方法

```typescript
import { ComponentPreview, PreviewShowcase } from './examples/ComponentPreview';
import { DiceGamePreview } from './examples/previews';
import { DiceGame } from '@randbox/react';

// 使用预览组件
<ComponentPreview
  component={DiceGame}
  defaultProps={{ diceCount: 2, gameMode: 'sum' }}
  propVariations={[
    { name: '简单模式', props: { gameMode: 'simple' } },
    { name: '和值模式', props: { gameMode: 'sum', targetSum: 7 } }
  ]}
/>

// 使用展示页面
<PreviewShowcase />
```

## 核心组件

主要的游戏组件包括：

- **GridLottery** - 九宫格抽奖
- **SlotMachine** - 滚动抽奖
- **ScratchCard** - 刮刮卡
- **DiceGame** - 骰子游戏
- **RockPaperScissors** - 石头剪刀布

## 安装和使用

确保已正确安装主要的组件库：

```bash
npm install @randbox/react randbox
```

所有组件都基于Canvas渲染，提供高性能的游戏体验，无需额外的CSS样式。