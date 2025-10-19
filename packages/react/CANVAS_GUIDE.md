# Canvas组件使用指南

## 📖 概述

RandBox React包现在提供了基于Canvas的高性能游戏组件，与传统的HTML/CSS组件相比，Canvas版本提供了更流畅的动画效果和更好的性能表现。

## 🚀 Canvas版本优势

### 性能优化
- **60fps流畅动画**：基于requestAnimationFrame的高性能渲染
- **GPU加速**：利用浏览器硬件加速能力
- **低CPU占用**：相比DOM操作更高效的渲染方式

### 视觉效果
- **高级特效**：支持渐变、阴影、发光等视觉效果
- **像素级控制**：精确的图形绘制和交互检测
- **3D立体效果**：真实的立体渲染（如3D骰子）

### 交互体验
- **精确交互**：像素级精度的鼠标和触摸事件处理
- **真实物理**：模拟真实的物理动画效果
- **跨平台兼容**：完美支持桌面和移动端

## 📦 组件列表

### Canvas组件
- `CanvasGridLottery` - Canvas九宫格抽奖
- `CanvasScratchCard` - Canvas刮刮卡抽奖
- `CanvasSlotMachine` - Canvas老虎机
- `CanvasDiceGame` - Canvas骰子游戏

### 传统HTML组件
- `GridLottery` - HTML九宫格抽奖
- `ScratchCard` - HTML刮刮卡抽奖
- `SlotMachine` - HTML老虎机
- `DiceGame` - HTML骰子游戏
- `RockPaperScissors` - 石头剪刀布

## 🛠 安装与使用

### 安装
```bash
npm install @randbox/react
```

### 基础使用
```tsx
import React from 'react';
import { CanvasGridLottery } from '@randbox/react';

function App() {
  return (
    <CanvasGridLottery
      prizes={[
        '🎁 iPhone 14',
        '💰 现金100元',
        '😭 谢谢参与',
        '🎧 AirPods',
        '💰 现金50元',
        '😭 谢谢参与',
        '🎫 优惠券',
        '💰 现金10元',
        '😭 谢谢参与'
      ]}
      weights={[0.01, 0.1, 0.4, 0.05, 0.15, 0.4, 0.2, 0.25, 0.4]}
      onResult={(result) => {
        console.log('抽奖结果:', result);
      }}
    />
  );
}
```

## 🎯 组件详细说明

### CanvasGridLottery - Canvas九宫格抽奖

高性能的九宫格抽奖组件，支持流畅的转动动画和发光效果。

```tsx
<CanvasGridLottery
  prizes={string[]}              // 奖品列表
  weights={number[]}             // 权重配置
  gridSize={9}                   // 网格大小
  animationDuration={3000}       // 动画时长
  buttonText="开始抽奖"          // 按钮文字
  onResult={(result) => {...}}   // 结果回调
/>
```

**特色功能：**
- 发光高亮效果
- 缓动动画函数
- 实时进度显示
- 像素完美的圆角渲染

### CanvasScratchCard - Canvas刮刮卡抽奖

真实的刮刮卡体验，支持精确的像素级刮除检测。

```tsx
<CanvasScratchCard
  rows={3}                       // 行数
  cols={3}                       // 列数
  symbols={string[]}             // 符号列表
  winProbability={30}            // 中奖概率
  onScratch={(result) => {...}}  // 刮卡回调
/>
```

**特色功能：**
- 双层Canvas渲染
- 像素级刮除检测
- 实时进度计算
- 支持鼠标和触摸操作
- 自动揭晓功能

### CanvasSlotMachine - Canvas老虎机

专业级老虎机实现，支持多滚轴动画和支付线检测。

```tsx
<CanvasSlotMachine
  reels={string[][]}             // 滚轴配置
  weights={number[][]}           // 权重配置
  animationDuration={3000}       // 动画时长
  onResult={(result) => {...}}   // 结果回调
/>
```

**特色功能：**
- 5滚轴独立动画
- 支付线可视化
- 梯度停止效果
- Jackpot检测
- 符号价值显示

### CanvasDiceGame - Canvas骰子游戏

3D风格的骰子游戏，支持多种游戏模式。

```tsx
<CanvasDiceGame
  diceCount={2}                  // 骰子数量
  gameMode="sum"                 // 游戏模式
  targetSum={7}                  // 目标点数
  onResult={(result) => {...}}   // 结果回调
/>
```

**特色功能：**
- 3D立体渲染
- 真实阴影效果
- 多种游戏模式
- 统计功能
- 物理动画

## 🎨 性能对比

| 特性 | HTML版本 | Canvas版本 |
|------|----------|------------|
| 渲染方式 | DOM操作 | Canvas 2D API |
| 动画性能 | CSS动画 | 60fps requestAnimationFrame |
| CPU占用 | 较高 | 较低 |
| 内存占用 | 中等 | 低 |
| 特效支持 | 有限 | 丰富 |
| 交互精度 | 元素级 | 像素级 |
| 移动端表现 | 良好 | 优秀 |

## 🔧 开发建议

### 选择指南
- **Canvas版本**：适用于对动画性能要求高、需要复杂视觉效果的场景
- **HTML版本**：适用于简单交互、需要快速定制样式的场景

### 最佳实践
1. **性能优化**：Canvas组件会自动优化渲染，无需额外配置
2. **响应式设计**：Canvas会自动适配容器大小
3. **事件处理**：Canvas组件内部处理所有交互逻辑
4. **样式定制**：通过组件props控制外观，而非CSS

### 注意事项
- Canvas组件不支持CSS样式定制
- 某些浏览器可能需要硬件加速支持
- 移动端需要处理触摸事件

## 📱 移动端支持

所有Canvas组件都完美支持移动端：
- 自动检测触摸事件
- 响应式Canvas尺寸
- 适配高DPI屏幕
- 优化触摸交互体验

## 🐛 故障排除

### 常见问题
1. **Canvas模糊**：检查设备像素比设置
2. **动画卡顿**：确保浏览器硬件加速开启
3. **触摸无响应**：检查touch-action CSS属性

### 调试技巧
- 使用浏览器开发者工具的Performance面板
- 检查Canvas元素的实际尺寸
- 监控requestAnimationFrame调用频率

## 📚 示例代码

查看 `src/examples/CanvasExamples.tsx` 文件获取完整的使用示例和对比演示。

## 🤝 贡献

欢迎提交Issues和Pull Requests来改进Canvas组件的功能和性能。