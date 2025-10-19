import React, { useState, useCallback } from 'react';
import { RandBox } from 'randbox';
import {
  DiceGamePreview,
  GridLotteryPreview,
  SlotMachinePreview,
  ScratchCardPreview
} from './previews';
import './PreviewShowcase.css';

interface ShowcaseSection {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType;
  category: 'canvas';
}

const showcaseSections: ShowcaseSection[] = [
  {
    id: 'dice-game',
    title: '骰子游戏',
    description: 'Canvas 渲染的高性能骰子游戏',
    component: DiceGamePreview,
    category: 'canvas'
  },
  {
    id: 'grid-lottery',
    title: '九宫格抽奖',
    description: 'Canvas 渲染的九宫格抽奖',
    component: GridLotteryPreview,
    category: 'canvas'
  },
  {
    id: 'slot-machine',
    title: '老虎机',
    description: 'Canvas 渲染的老虎机',
    component: SlotMachinePreview,
    category: 'canvas'
  },
  {
    id: 'scratch-card',
    title: '刮刮卡',
    description: 'Canvas 渲染的刮刮卡',
    component: ScratchCardPreview,
    category: 'canvas'
  }
];

/**
 * Canvas组件预览展示页面
 * 展示所有 @randbox/react Canvas 组件的预览和使用示例
 */
export const PreviewShowcase: React.FC = () => {
  const randBox = new RandBox();
  const [randomHighlight, setRandomHighlight] = useState<string | null>(null);
  const [showcaseTheme, setShowcaseTheme] = useState<string>('default');
  const [autoTourActive, setAutoTourActive] = useState(false);

  // 生成随机主题
  const generateShowcaseTheme = useCallback(() => {
    const themes = ['default', 'galaxy', 'sunset', 'ocean', 'forest', 'neon'];
    return randBox.pickone(themes.filter(t => t !== showcaseTheme));
  }, [showcaseTheme]);

  // 自动游览功能
  const startAutoTour = useCallback(() => {
    setAutoTourActive(true);
    let currentIndex = 0;

    const tourInterval = setInterval(() => {
      if (currentIndex >= showcaseSections.length) {
        setAutoTourActive(false);
        setRandomHighlight(null);
        clearInterval(tourInterval);
        return;
      }

      const section = showcaseSections[currentIndex];
      setRandomHighlight(section.id);

      // 滚动到该组件
      const element = document.getElementById(section.id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      currentIndex++;
    }, 3000); // 每3秒切换一次
  }, []);

  // 随机高亮一个组件
  const highlightRandomComponent = useCallback(() => {
    const randomSection = randBox.pickone(showcaseSections);
    setRandomHighlight(randomSection.id);

    // 3秒后取消高亮
    setTimeout(() => {
      setRandomHighlight(null);
    }, 3000);

    // 滚动到该组件
    const element = document.getElementById(randomSection.id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  // 生成随机颜色主题
  const getRandomTheme = useCallback(() => {
    const themes = [
      { primary: '#007bff', secondary: '#6c757d' },
      { primary: '#28a745', secondary: '#6f42c1' },
      { primary: '#dc3545', secondary: '#fd7e14' },
      { primary: '#17a2b8', secondary: '#e83e8c' },
      { primary: '#6f42c1', secondary: '#20c997' }
    ];
    return randBox.pickone(themes);
  }, []);

  return (
    <div className={`preview-showcase preview-showcase--${showcaseTheme}`}>
      <header className="preview-showcase__header">
        <div className="preview-showcase__title-section">
          <h1 className="preview-showcase__title">
            🎨 RandBox Canvas 组件预览
          </h1>
          <p className="preview-showcase__subtitle">
            基于 RandBox 随机引擎和 Canvas 渲染的高性能游戏组件库预览展示
          </p>
        </div>

        <div className="preview-showcase__controls">
          <div className="preview-showcase__filters">
            <button className="preview-showcase__filter preview-showcase__filter--active">
              Canvas 组件 ({showcaseSections.length})
            </button>
          </div>

          <div className="preview-showcase__action-buttons">
            <button
              className="preview-showcase__random-button"
              onClick={highlightRandomComponent}
              disabled={autoTourActive}
            >
              🎯 随机浏览
            </button>

            <button
              className="preview-showcase__tour-button"
              onClick={startAutoTour}
              disabled={autoTourActive}
            >
              🚀 自动游览
            </button>

            <button
              className="preview-showcase__theme-button"
              onClick={() => setShowcaseTheme(generateShowcaseTheme())}
            >
              🎨 切换主题
            </button>
          </div>
        </div>
      </header>

      <div className="preview-showcase__stats">
        <div className="preview-showcase__stat">
          <span className="preview-showcase__stat-value">{showcaseSections.length}</span>
          <span className="preview-showcase__stat-label">Canvas 组件</span>
        </div>
        <div className="preview-showcase__stat">
          <span className="preview-showcase__stat-value">🎨</span>
          <span className="preview-showcase__stat-label">高性能渲染</span>
        </div>
        <div className="preview-showcase__stat">
          <span className="preview-showcase__stat-value">⚡</span>
          <span className="preview-showcase__stat-label">流畅动画</span>
        </div>
        <div className="preview-showcase__stat">
          <span className="preview-showcase__stat-value">∞</span>
          <span className="preview-showcase__stat-label">随机可能性</span>
        </div>
      </div>

      <nav className="preview-showcase__nav">
        <h3>快速导航 - Canvas 组件</h3>
        <div className="preview-showcase__nav-links">
          {showcaseSections.map(section => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={`preview-showcase__nav-link ${randomHighlight === section.id ? 'preview-showcase__nav-link--highlight' : ''}`}
            >
              <span className="preview-showcase__nav-category">🎨</span>
              {section.title}
            </a>
          ))}
        </div>
      </nav>

      <main className="preview-showcase__content">
        {showcaseSections.map(section => {
          const Component = section.component;
          return (
            <section
              key={section.id}
              id={section.id}
              className={`preview-showcase__section ${randomHighlight === section.id ? 'preview-showcase__section--highlight' : ''}`}
            >
              <Component />
            </section>
          );
        })}
      </main>

      <footer className="preview-showcase__footer">
        <div className="preview-showcase__footer-content">
          <div className="preview-showcase__info">
            <h3>关于 RandBox Canvas 组件</h3>
            <p>
              RandBox Canvas 组件库是基于 RandBox 随机引擎和 Canvas 渲染技术的高性能游戏组件库，
              提供了丰富的游戏和抽奖组件，支持高度自定义和扩展。
            </p>
            <ul>
              <li>🎯 基于强大的 RandBox 随机引擎</li>
              <li>🎨 Canvas 高性能渲染</li>
              <li>⚡ 流畅的动画效果</li>
              <li>⚛️ 完整的 TypeScript 支持</li>
              <li>🔧 高度可配置和可扩展</li>
              <li>📱 响应式设计</li>
            </ul>
          </div>

          <div className="preview-showcase__usage">
            <h3>快速开始</h3>
            <pre className="preview-showcase__code">
{`npm install @randbox/react

import { CanvasDiceGame, CanvasGridLottery } from '@randbox/react';

function App() {
  return (
    <div>
      <CanvasDiceGame
        width={400}
        height={300}
        gameMode="bigSmall"
      />
      <CanvasGridLottery
        width={400}
        height={400}
        prizes={['奖品1', '奖品2']}
      />
    </div>
  );
}`}
            </pre>
          </div>
        </div>

        <div className="preview-showcase__credits">
          <p>
            Powered by{' '}
            <a href="https://randbox.top" target="_blank" rel="noopener noreferrer">
              RandBox
            </a>
            {' '}• Canvas 渲染技术 • Made with ❤️ for developers
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PreviewShowcase;