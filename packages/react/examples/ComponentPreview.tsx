import React, { useState, useCallback, useEffect } from 'react';
import { RandBox } from 'randbox';
import './ComponentPreview.css';

export interface PreviewConfig {
  autoPlay?: boolean;
  interval?: number;
  showSettings?: boolean;
  randomizeProps?: boolean;
}

export interface ComponentPreviewProps {
  component: React.ComponentType<any>;
  componentName: string;
  defaultProps: any;
  propVariations?: Array<{ name: string; props: any }>;
  config?: PreviewConfig;
  description?: string;
}

/**
 * 组件预览包装器
 * 使用 randbox 实现随机演示功能
 */
export const ComponentPreview: React.FC<ComponentPreviewProps> = ({
  component: Component,
  componentName,
  defaultProps,
  propVariations = [],
  config = {},
  description
}) => {
  const {
    autoPlay = false,
    interval = 3000,
    showSettings = true,
    randomizeProps = false
  } = config;
  const randBox = new RandBox();

  const [currentProps, setCurrentProps] = useState(defaultProps);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);
  const [currentVariationIndex, setCurrentVariationIndex] = useState(0);
  const [gameResults, setGameResults] = useState<any[]>([]);
  const [animatingAction, setAnimatingAction] = useState(false);
  const [randomTheme, setRandomTheme] = useState<string>('');

  // 生成随机主题
  const generateRandomTheme = useCallback(() => {
    const themes = [
      'theme-blue',
      'theme-green',
      'theme-purple',
      'theme-orange',
      'theme-pink',
      'theme-teal',
      'theme-indigo',
      'theme-red'
    ];
    return randBox.pickone(themes);
  }, []);

  // 初始化随机主题
  useEffect(() => {
    setRandomTheme(generateRandomTheme());
  }, [generateRandomTheme]);

  // 随机切换属性变体
  const randomizeComponentProps = useCallback(() => {
    if (!randomizeProps || propVariations.length === 0) return;

    const randomIndex = randBox.natural({ min: 0, max: propVariations.length - 1 });
    setCurrentVariationIndex(randomIndex);
    setCurrentProps({ ...defaultProps, ...propVariations[randomIndex].props });
  }, [defaultProps, propVariations, randomizeProps]);

  // 随机触发组件动作
  const triggerRandomAction = useCallback(() => {
    setAnimatingAction(true);

    // 根据组件类型触发不同的随机动作
    const actions = [
      () => randomizeComponentProps(),
      () => {
        // 随机切换到不同的变体
        if (propVariations.length > 0) {
          const randomIndex = randBox.natural({ min: 0, max: propVariations.length - 1 });
          switchToVariation(randomIndex);
        }
      },
      () => {
        // 模拟随机用户交互
        if (typeof currentProps.onStart === 'function') {
          currentProps.onStart();
        }
      },
      () => {
        // 触发随机配置变更
        if (propVariations.length > 0) {
          const randomVariation = randBox.pickone(propVariations);
          const mixedProps = { ...defaultProps };

          // 随机混合不同变体的属性
          Object.keys(randomVariation.props).forEach(key => {
            if (randBox.bool({ likelihood: 50 })) {
              mixedProps[key] = randomVariation.props[key];
            }
          });

          setCurrentProps(mixedProps);
        }
      },
      () => {
        // 随机切换主题
        setRandomTheme(generateRandomTheme());
      }
    ];

    const randomAction = randBox.pickone(actions);
    randomAction();

    // 动画效果持续时间
    setTimeout(() => {
      setAnimatingAction(false);
    }, 500);
  }, [randomizeComponentProps, propVariations, currentProps, defaultProps, generateRandomTheme]);

  // 自动播放效果
  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setInterval(() => {
      triggerRandomAction();
    }, interval);

    return () => clearInterval(timer);
  }, [isAutoPlaying, interval, triggerRandomAction]);

  // 手动切换变体
  const switchToVariation = useCallback((index: number) => {
    if (index >= 0 && index < propVariations.length) {
      setCurrentVariationIndex(index);
      setCurrentProps({ ...defaultProps, ...propVariations[index].props });
    }
  }, [defaultProps, propVariations]);

  // 重置为默认状态
  const resetToDefault = useCallback(() => {
    setCurrentProps(defaultProps);
    setCurrentVariationIndex(0);
    setGameResults([]);
  }, [defaultProps]);

  // 记录游戏结果
  const handleGameResult = useCallback((result: any) => {
    setGameResults(prev => [result, ...prev.slice(0, 4)]); // 保留最近5个结果
  }, []);

  // 生成增强的props，添加结果处理
  const enhancedProps = {
    ...currentProps,
    onResult: (result: any) => {
      handleGameResult(result);
      currentProps.onResult?.(result);
    },
    onGameEnd: (result: any) => {
      handleGameResult(result);
      currentProps.onGameEnd?.(result);
    }
  };

  return (
    <div className={`component-preview ${randomTheme} ${animatingAction ? 'component-preview--animating' : ''}`}>
      <div className="component-preview__header">
        <h3 className="component-preview__title">{componentName}</h3>
        {description && (
          <p className="component-preview__description">{description}</p>
        )}
        {randomTheme && (
          <div className="component-preview__theme-indicator">
            <span className="component-preview__theme-label">当前主题:</span>
            <span className={`component-preview__theme-badge ${randomTheme}`}>
              {randomTheme.replace('theme-', '').toUpperCase()}
            </span>
          </div>
        )}
      </div>

      <div className="component-preview__content">
        <div className="component-preview__component">
          <Component {...enhancedProps} />
        </div>

        {showSettings && (
          <div className="component-preview__controls">
            <div className="component-preview__actions">
              <button
                className="component-preview__button"
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              >
                {isAutoPlaying ? '⏸️ 停止自动演示' : '▶️ 开始自动演示'}
              </button>

              <button
                className="component-preview__button"
                onClick={triggerRandomAction}
                disabled={isAutoPlaying || animatingAction}
              >
                🎲 随机演示
              </button>

              <button
                className="component-preview__button"
                onClick={() => setRandomTheme(generateRandomTheme())}
                disabled={animatingAction}
              >
                🎨 随机主题
              </button>

              <button
                className="component-preview__button component-preview__button--secondary"
                onClick={resetToDefault}
              >
                🔄 重置
              </button>
            </div>

            {propVariations.length > 0 && (
              <div className="component-preview__variations">
                <span className="component-preview__label">预设变体:</span>
                <div className="component-preview__variation-buttons">
                  <button
                    className={`component-preview__variation-button ${
                      currentVariationIndex === 0 ? 'component-preview__variation-button--active' : ''
                    }`}
                    onClick={() => switchToVariation(0)}
                  >
                    默认
                  </button>
                  {propVariations.map((variation, index) => (
                    <button
                      key={index}
                      className={`component-preview__variation-button ${
                        currentVariationIndex === index + 1 ? 'component-preview__variation-button--active' : ''
                      }`}
                      onClick={() => switchToVariation(index)}
                    >
                      {variation.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {gameResults.length > 0 && (
              <div className="component-preview__results">
                <span className="component-preview__label">
                  🎯 最近结果 ({gameResults.length}):
                </span>
                <div className="component-preview__result-list">
                  {gameResults.map((result, index) => (
                    <div key={index} className="component-preview__result-item">
                      {typeof result === 'object' ? (
                        <pre>{JSON.stringify(result, null, 2)}</pre>
                      ) : (
                        <span>{String(result)}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="component-preview__stats">
              <div className="component-preview__stat">
                <span className="component-preview__stat-label">演示次数:</span>
                <span className="component-preview__stat-value">{gameResults.length}</span>
              </div>
              <div className="component-preview__stat">
                <span className="component-preview__stat-label">当前变体:</span>
                <span className="component-preview__stat-value">
                  {currentVariationIndex === 0 ? '默认' :
                   propVariations[currentVariationIndex - 1]?.name || '自定义'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComponentPreview;