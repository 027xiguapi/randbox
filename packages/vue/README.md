# @randbox/vue

Vue 3 游戏组件库，基于 RandBox 随机数生成库。

## 特性

- 🎮 **丰富的游戏组件** - 九宫格抽奖、滚动抽奖、刮刮卡、石头剪刀布、骰子游戏、老虎机
- 🎨 **精美的界面设计** - 现代化渐变色彩和动画效果
- 📱 **响应式设计** - 支持移动端和桌面端
- 🛠 **TypeScript 支持** - 完整的类型定义
- 🎯 **高度可定制** - 丰富的配置选项
- ⚡ **轻量级** - 基于 Vue 3 Composition API

## 安装

```bash
npm install @randbox/vue
# 或
yarn add @randbox/vue
# 或
pnpm add @randbox/vue
```

## 使用

### 全局注册

```typescript
import { createApp } from 'vue'
import VueRandboxGames from '@randbox/vue'
import '@randbox/vue/dist/style.css'

const app = createApp(App)
app.use(VueRandboxGames)
app.mount('#app')
```

### 按需导入

```vue
<template>
  <div>
    <GridLottery
      :prizes="['一等奖', '二等奖', '三等奖', '谢谢参与']"
      @result="onResult"
    />
  </div>
</template>

<script setup>
import { GridLottery } from '@randbox/vue'

const onResult = (result) => {
  console.log('抽奖结果:', result)
}
</script>
```

## 组件

### 九宫格抽奖 (GridLottery)

经典的九宫格抽奖组件，支持自定义奖品和权重。

```vue
<GridLottery
  :prizes="['iPhone', 'iPad', 'MacBook', '谢谢参与']"
  :weights="[0.01, 0.05, 0.02, 0.92]"
  :animation-duration="3000"
  @result="onGridResult"
/>
```

**属性**
- `prizes` - 奖品列表
- `weights` - 奖品权重（可选）
- `animationDuration` - 动画时长（毫秒）
- `disabled` - 是否禁用

### 滚动抽奖 (ScrollLottery)

垂直滚动的抽奖组件，视觉效果炫酷。

```vue
<ScrollLottery
  :prizes="['1000元', '500元', '100元', '谢谢参与']"
  :visible-count="3"
  @result="onScrollResult"
/>
```

**属性**
- `prizes` - 奖品列表
- `weights` - 奖品权重（可选）
- `visibleCount` - 可见奖品数量
- `animationDuration` - 动画时长

### 刮刮卡 (ScratchCard)

互动式刮刮卡组件，支持鼠标和触摸操作。

```vue
<ScratchCard
  :prizes="['100元', '50元', '10元', '谢谢参与']"
  :card-width="300"
  :card-height="200"
  @scratch="onScratch"
  @reveal="onReveal"
/>
```

**属性**
- `prizes` - 奖品列表
- `weights` - 奖品权重
- `cardWidth` - 卡片宽度
- `cardHeight` - 卡片高度
- `threshold` - 自动揭示阈值（百分比）

### 石头剪刀布 (RockPaperScissors)

经典的石头剪刀布游戏，支持统计功能。

```vue
<RockPaperScissors
  :show-stats="true"
  @result="onRPSResult"
/>
```

**属性**
- `showStats` - 是否显示统计信息
- `disabled` - 是否禁用

### 骰子游戏 (DiceGame)

可配置的骰子游戏，支持多种游戏模式。

```vue
<DiceGame
  :default-dice-count="2"
  :default-mode="'guess'"
  :show-stats="true"
  @result="onDiceResult"
/>
```

**属性**
- `defaultDiceCount` - 默认骰子数量
- `defaultMode` - 默认游戏模式
- `showStats` - 是否显示统计

### 老虎机 (SlotMachine)

经典老虎机游戏，支持积分系统和奖励表。

```vue
<SlotMachine
  :initial-credits="100"
  :show-pay-table="true"
  @spin="onSpin"
  @jackpot="onJackpot"
/>
```

**属性**
- `initialCredits` - 初始积分
- `showPayTable` - 是否显示奖励表
- `reelSymbols` - 自定义转轮符号

## Composables

每个组件都提供对应的 Composable 函数，方便在其他场景中使用：

```typescript
import { useGridLottery, useSlotMachine, useDiceGame } from '@randbox/vue'

// 在组件中使用
const { isAnimating, start, result } = useGridLottery(prizes, weights)
```

## 开发

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 构建
pnpm build

# 类型检查
pnpm type-check
```

## 许可证

MIT License