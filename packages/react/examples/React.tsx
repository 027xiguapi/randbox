import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { PreviewShowcase } from './PreviewShowcase';
import {
  DiceGamePreview,
  GridLotteryPreview,
  SlotMachinePreview,
  ScratchCardPreview,
  LuckyWheelPreview,
  CoinFlipPreview
} from './previews';

/**
 * @randbox/react 组件预览示例
 * 展示如何使用 @randbox/react 库中的各种组件和预览功能
 */
const RandBoxReactPreview: React.FC = () => {
  const [viewMode, setViewMode] = useState<'showcase' | 'examples'>('showcase');

  return (
    <div style={{
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      {/* 顶部导航 */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '30px',
        gap: '20px'
      }}>
        <h1 style={{
          color: 'white',
          textAlign: 'center',
          fontSize: '2.5em',
          margin: 0,
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
        }}>
          🎲 @randbox/react 组件预览
        </h1>
      </div>

      {/* 切换按钮 */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '30px',
        gap: '10px'
      }}>
        <button
          onClick={() => setViewMode('showcase')}
          style={{
            padding: '12px 24px',
            border: 'none',
            borderRadius: '25px',
            backgroundColor: viewMode === 'showcase' ? '#fff' : 'rgba(255,255,255,0.2)',
            color: viewMode === 'showcase' ? '#667eea' : 'white',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '16px',
            transition: 'all 0.3s ease',
            boxShadow: viewMode === 'showcase' ? '0 4px 12px rgba(0,0,0,0.15)' : 'none'
          }}
        >
          🎨 PreviewShowcase 组件
        </button>
        <button
          onClick={() => setViewMode('examples')}
          style={{
            padding: '12px 24px',
            border: 'none',
            borderRadius: '25px',
            backgroundColor: viewMode === 'examples' ? '#fff' : 'rgba(255,255,255,0.2)',
            color: viewMode === 'examples' ? '#667eea' : 'white',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '16px',
            transition: 'all 0.3s ease',
            boxShadow: viewMode === 'examples' ? '0 4px 12px rgba(0,0,0,0.15)' : 'none'
          }}
        >
          🎯 组件预览集合
        </button>
      </div>

      {/* 内容区域 */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        minHeight: '80vh'
      }}>
        {viewMode === 'showcase' && (
          <div>
            <div style={{
              padding: '30px',
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white',
              textAlign: 'center'
            }}>
              <h2 style={{ margin: '0 0 10px 0', fontSize: '1.8em' }}>
                🎨 PreviewShowcase 组件演示
              </h2>
              <p style={{ margin: 0, fontSize: '1.1em', opacity: 0.9 }}>
                这是一个专业的组件预览展示页面，包含导航、主题切换、自动游览等高级功能
              </p>
            </div>
            <PreviewShowcase />
          </div>
        )}

        {viewMode === 'examples' && (
          <div>
            <div style={{
              padding: '30px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              textAlign: 'center'
            }}>
              <h2 style={{ margin: '0 0 10px 0', fontSize: '1.8em' }}>
                🎯 组件预览集合演示
              </h2>
              <p style={{ margin: 0, fontSize: '1.1em', opacity: 0.9 }}>
                这是各个组件预览的集合，展示所有游戏组件的详细配置和变体
              </p>
            </div>
            <div style={{ padding: '30px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                <LuckyWheelPreview />
                <CoinFlipPreview />
                <DiceGamePreview />
                <GridLotteryPreview />
                <SlotMachinePreview />
                <ScratchCardPreview />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 底部信息 */}
      <div style={{
        textAlign: 'center',
        marginTop: '30px',
        color: 'white',
        opacity: 0.8
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          padding: '20px',
          borderRadius: '15px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <h3 style={{ margin: '0 0 15px 0' }}>🚀 @randbox/react 特性</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px',
            textAlign: 'left'
          }}>
            <div>
              <strong>🎨 Canvas 渲染</strong>
              <br />高性能GPU加速渲染
            </div>
            <div>
              <strong>⚡ 流畅动画</strong>
              <br />60fps 稳定帧率
            </div>
            <div>
              <strong>🎯 TypeScript</strong>
              <br />完整类型支持
            </div>
            <div>
              <strong>🔧 可定制</strong>
              <br />丰富的配置选项
            </div>
          </div>
          <div style={{ marginTop: '20px', fontSize: '0.9em' }}>
            <code style={{
              background: 'rgba(0,0,0,0.2)',
              padding: '8px 12px',
              borderRadius: '8px',
              fontFamily: 'Monaco, Consolas, monospace'
            }}>
              npm install @randbox/react
            </code>
          </div>
        </div>
      </div>
    </div>
  );
};

// 渲染到 DOM
const container = document.getElementById('app');
if (container) {
  const root = createRoot(container);
  root.render(<RandBoxReactPreview />);
} else {
  console.error('找不到应用容器元素 #app');
}