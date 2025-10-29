# @randbox/react

Lightweight, high-performance React game components library with Canvas rendering, powered by RandBox random number generator.

## ✨ Features

- 🎮 **Rich Component Collection**: Grid lottery, slot machine, scratch card, dice game, rock-paper-scissors, and more
- 🚀 **High Performance**: Canvas-based rendering with 60fps smooth animations
- 📦 **Lightweight**: Optimized bundle size (ES module: ~109KB, UMD: ~45KB)
- 🎨 **Zero CSS Dependencies**: All styles rendered via Canvas with no external dependencies
- 📱 **Responsive**: Adaptive to different screen sizes
- 🔧 **TypeScript**: Full type definition support
- 🎲 **True Randomness**: High-quality random number generation based on RandBox
- ⚡ **GPU Acceleration**: Leverages browser hardware acceleration for optimal performance

## 📦 Installation

```bash
npm install @randbox/react randbox
# or
yarn add @randbox/react randbox
# or
pnpm add @randbox/react randbox
```

## 🚀 Quick Start

```typescript
import { CanvasGridLottery, CanvasDiceGame, CanvasScratchCard } from '@randbox/react';

function App() {
  return (
    <div>
      {/* Grid Lottery */}
      <CanvasGridLottery
        prizes={['Prize 1', 'Prize 2', 'Prize 3', 'Try Again']}
        onResult={(result) => console.log('Winner:', result)}
      />

      {/* Dice Game */}
      <CanvasDiceGame
        diceCount={2}
        gameMode="sum"
        targetSum={7}
        onResult={(result) => console.log('Roll result:', result)}
      />

      {/* Scratch Card */}
      <CanvasScratchCard
        rows={3}
        cols={3}
        symbols={['🍎', '🍌', '🍇']}
        onScratch={(result) => console.log('Scratch result:', result)}
      />
    </div>
  );
}
```

## 🎮 Components

### Canvas Components (Recommended)

High-performance Canvas-based components with advanced visual effects and smooth animations.

#### CanvasGridLottery
Classic 9-grid lottery with customizable prizes and weights.

```tsx
<CanvasGridLottery
  prizes={string[]}              // Prize list
  weights={number[]}             // Weight configuration
  gridSize={9}                   // Grid size
  animationDuration={3000}       // Animation duration
  buttonText="Start"             // Button text
  onResult={(result) => {...}}   // Result callback
/>
```

**Key Features:**
- Glowing highlight effects
- Easing animation functions
- Real-time progress display
- Pixel-perfect rounded corners

#### CanvasScratchCard
Realistic scratch card experience with pixel-level scratch detection.

```tsx
<CanvasScratchCard
  rows={3}                       // Number of rows
  cols={3}                       // Number of columns
  symbols={string[]}             // Symbol list
  winProbability={30}            // Win probability (%)
  onScratch={(result) => {...}}  // Scratch callback
/>
```

**Key Features:**
- Dual-layer Canvas rendering
- Pixel-level scratch detection
- Real-time progress calculation
- Mouse and touch support
- Auto-reveal functionality

#### CanvasSlotMachine
Professional slot machine implementation with multi-reel animations.

```tsx
<CanvasSlotMachine
  reels={string[][]}             // Reel configuration
  weights={number[][]}           // Weight configuration
  animationDuration={3000}       // Animation duration
  onResult={(result) => {...}}   // Result callback
/>
```

**Key Features:**
- 5-reel independent animations
- Payline visualization
- Cascading stop effects
- Jackpot detection
- Symbol value display

#### CanvasDiceGame
3D-style dice game with multiple game modes.

```tsx
<CanvasDiceGame
  diceCount={2}                  // Number of dice
  gameMode="sum"                 // Game mode
  targetSum={7}                  // Target sum
  onResult={(result) => {...}}   // Result callback
/>
```

**Key Features:**
- 3D perspective rendering
- Realistic shadow effects
- Multiple game modes
- Statistics tracking
- Physics-based animation

### HTML Components

Traditional HTML/CSS components for simple interactions and quick customization.

#### GridLottery
HTML-based 9-grid lottery component.

#### SlotMachine
HTML-based multi-reel slot machine.

#### ScratchCard
HTML-based scratch card component.

#### DiceGame
HTML-based dice game.

#### RockPaperScissors
Classic rock-paper-scissors game with multiple AI strategies and statistics.

## 🎨 Performance Comparison

| Feature | HTML Version | Canvas Version |
|---------|-------------|----------------|
| Rendering | DOM Manipulation | Canvas 2D API |
| Animation | CSS Animation | 60fps requestAnimationFrame |
| CPU Usage | Higher | Lower |
| Memory Usage | Medium | Low |
| Visual Effects | Limited | Rich |
| Interaction Precision | Element-level | Pixel-level |
| Mobile Performance | Good | Excellent |

## 🚀 Canvas Advantages

### Performance Optimization
- **60fps Smooth Animation**: High-performance rendering based on requestAnimationFrame
- **GPU Acceleration**: Leverages browser hardware acceleration
- **Low CPU Usage**: More efficient rendering compared to DOM manipulation

### Visual Effects
- **Advanced Effects**: Support for gradients, shadows, glowing effects
- **Pixel-level Control**: Precise graphics drawing and interaction detection
- **3D Perspective**: Realistic 3D rendering (e.g., 3D dice)

### Interactive Experience
- **Precise Interaction**: Pixel-level precision for mouse and touch events
- **Realistic Physics**: Simulated real-world physics animation
- **Cross-platform**: Perfect support for desktop and mobile

## 📱 Mobile Support

All Canvas components fully support mobile devices:
- Auto-detection of touch events
- Responsive Canvas sizing
- High-DPI screen adaptation
- Optimized touch interaction experience

## 🔧 Development

```bash
# Clone the repository
git clone https://github.com/your-username/randbox.git
cd randbox/packages/react

# Install dependencies
pnpm install

# Development mode
pnpm dev

# Build
pnpm build

# Test
pnpm test
```

## 🎯 Optimization

- **Tree-shaking**: Supports on-demand imports, unused components won't be bundled
- **Code Minification**: Automatically removes console.log and debug code in production
- **External Dependencies**: React and RandBox as external dependencies to avoid duplicate bundling
- **Type Optimization**: Type definitions generated only for core components

## 🛠 Best Practices

### Component Selection Guide
- **Canvas Version**: For scenarios requiring high animation performance and complex visual effects
- **HTML Version**: For simple interactions and quick style customization

### Development Tips
1. **Performance**: Canvas components automatically optimize rendering, no extra configuration needed
2. **Responsive Design**: Canvas automatically adapts to container size
3. **Event Handling**: Canvas components handle all interaction logic internally
4. **Style Customization**: Control appearance through component props, not CSS

### Considerations
- Canvas components don't support CSS style customization
- Some browsers may require hardware acceleration support
- Mobile devices need touch event handling

## 🐛 Troubleshooting

### Common Issues
1. **Blurry Canvas**: Check device pixel ratio settings
2. **Animation Lag**: Ensure browser hardware acceleration is enabled
3. **Touch Not Responding**: Check touch-action CSS property

### Debugging Tips
- Use browser DevTools Performance panel
- Check actual Canvas element dimensions
- Monitor requestAnimationFrame call frequency

## 📚 Documentation

Complete documentation and API reference: [https://randbox.js.org](https://randbox.js.org)

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please check [CONTRIBUTING.md](CONTRIBUTING.md) for details.

---

Powered by ❤️ and RandBox
