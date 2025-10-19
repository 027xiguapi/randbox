# @randbox/react

轻量级、高性能的React游戏组件库，基于Canvas渲染，由RandBox随机数生成器驱动。

## ✨ 特性

- 🎮 **5个核心游戏组件**：九宫格抽奖、滚动抽奖、刮刮卡、骰子游戏、石头剪刀布
- 🚀 **高性能**：基于Canvas渲染，流畅的动画效果
- 📦 **轻量级**：优化后的打包大小（ES模块：~109KB，UMD：~45KB）
- 🎨 **无需CSS**：所有样式都通过Canvas渲染，无外部依赖
- 📱 **响应式**：自适应不同屏幕尺寸
- 🔧 **TypeScript**：完整的类型定义支持
- 🎲 **真实随机**：基于RandBox的高质量随机数生成

## 📦 安装

```bash
npm install @randbox/react randbox
# 或
yarn add @randbox/react randbox
# 或
pnpm add @randbox/react randbox
```

## 🚀 快速开始

```typescript
import { GridLottery, DiceGame, ScratchCard } from '@randbox/react';

function App() {
  return (
    <div>
      {/* 九宫格抽奖 */}
      <GridLottery
        prizes={['奖品1', '奖品2', '奖品3', '谢谢参与']}
        onResult={(result) => console.log('中奖:', result)}
      />

      {/* 骰子游戏 */}
      <DiceGame
        diceCount={2}
        gameMode="sum"
        targetSum={7}
        onResult={(result) => console.log('投掷结果:', result)}
      />

      {/* 刮刮卡 */}
      <ScratchCard
        rows={3}
        cols={3}
        symbols={['🍎', '🍌', '🍇']}
        onScratch={(result) => console.log('刮奖结果:', result)}
      />
    </div>
  );
}
```

## 🎮 组件列表

### GridLottery - 九宫格抽奖
经典的九宫格转盘抽奖，支持自定义奖品和权重。

### SlotMachine - 滚动抽奖
多滚轴老虎机风格的抽奖组件，支持自定义符号和中奖规则。

### ScratchCard - 刮刮卡
真实的刮除体验，支持多种中奖模式（横排、竖排、对角线）。

### DiceGame - 骰子游戏
3D效果的骰子游戏，支持多种游戏模式（简单、和值、大小、猜测等）。

### RockPaperScissors - 石头剪刀布
经典的石头剪刀布游戏，支持多种AI策略和统计功能。

## 📚 文档

完整的文档和API参考请访问：[https://randbox.js.org](https://randbox.js.org)

## 🔧 开发

```bash
# 克隆项目
git clone https://github.com/your-username/randbox.git
cd randbox/packages/react

# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 构建
pnpm build

# 测试
pnpm test
```

## 🎯 性能优化

- **Tree-shaking**: 支持按需导入，未使用的组件不会被打包
- **代码压缩**: 生产环境自动移除console.log和调试代码
- **外部依赖**: React和RandBox作为外部依赖，避免重复打包
- **类型优化**: 仅为核心组件生成类型定义

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件。

## 🤝 贡献

欢迎贡献代码！请查看 [CONTRIBUTING.md](CONTRIBUTING.md) 了解详细信息。

---

由 ❤️ 和 RandBox 驱动