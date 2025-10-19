import React, { useRef, useEffect, useState, useCallback } from 'react';
import { SlotMachineProps, SlotMachineResult } from '../types';
import { RandBox } from 'randbox';

/**
 * Canvas版老虎机组件
 * 基于Canvas的高性能老虎机实现，支持多滚轴动画和支付线检测
 */
export const SlotMachine: React.FC<SlotMachineProps> = ({
  reels,
  weights,
  animationDuration = 3000,
  buttonText = '开始旋转',
  className = '',
  style,
  disabled = false,
  onGameStart,
  onGameEnd,
  onResult,
}) => {
  const randBox = new RandBox();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<SlotMachineResult | null>(null);
  const [spinProgress, setSpinProgress] = useState(0);

  // Canvas配置
  const canvasWidth = 750;
  const canvasHeight = 300;
  const reelWidth = canvasWidth / reels.length;
  const symbolHeight = canvasHeight / 3; // 显示3个符号
  const numVisibleSymbols = 3;

  // 滚轴状态
  const [reelStates, setReelStates] = useState<Array<{
    symbols: string[];
    position: number;
    speed: number;
    isSpinning: boolean;
  }>>([]);

  // 支付线配置
  const paylines = [
    [1, 1, 1, 1, 1], // 中间行
    [0, 0, 0, 0, 0], // 上行
    [2, 2, 2, 2, 2], // 下行
    [0, 1, 2, 1, 0], // V形
    [2, 1, 0, 1, 2], // 倒V形
  ];

  // 符号配置
  const symbols = [
    { symbol: '🍒', weight: 15, value: 2, color: '#e74c3c' },
    { symbol: '🍋', weight: 12, value: 3, color: '#f1c40f' },
    { symbol: '🍊', weight: 10, value: 4, color: '#e67e22' },
    { symbol: '🍇', weight: 8, value: 5, color: '#9b59b6' },
    { symbol: '🔔', weight: 6, value: 8, color: '#f39c12' },
    { symbol: '⭐', weight: 4, value: 10, color: '#f1c40f' },
    { symbol: '💎', weight: 2, value: 20, color: '#3498db' },
    { symbol: '🎰', weight: 1, value: 50, color: '#e74c3c' },
  ];

  /**
   * 初始化滚轴状态
   */
  const initializeReels = useCallback(() => {
    const newReelStates = reels.map((reel, index) => ({
      symbols: generateExtendedSymbols(reel),
      position: 0,
      speed: 0,
      isSpinning: false,
    }));
    setReelStates(newReelStates);
  }, [reels]);

  /**
   * 生成扩展的符号列表（用于无缝循环）
   */
  const generateExtendedSymbols = (reel: string[]): string[] => {
    const extended = [...reel];
    // 添加额外的符号用于动画
    for (let i = 0; i < numVisibleSymbols + 2; i++) {
      extended.push(reel[i % reel.length]);
    }
    return extended;
  };

  /**
   * 获取随机符号
   */
  const getRandomSymbol = useCallback(() => {
    const symbolList = symbols.map(s => s.symbol);
    const symbolWeights = symbols.map(s => s.weight);
    return randBox.weighted(symbolList, symbolWeights);
  }, []);

  /**
   * 绘制Canvas内容
   */
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || reelStates.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 清空画布
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制每个滚轴
    reelStates.forEach((reel, reelIndex) => {
      drawReel(ctx, reel, reelIndex);
    });

    // 绘制分隔线
    drawDividers(ctx);

    // 绘制支付线（如果有结果）
    if (result && result.isJackpot) {
      drawPaylines(ctx);
    }
  }, [reelStates, result]);

  /**
   * 绘制单个滚轴
   */
  const drawReel = (
    ctx: CanvasRenderingContext2D,
    reel: { symbols: string[]; position: number },
    reelIndex: number
  ) => {
    const x = reelIndex * reelWidth;

    for (let i = 0; i < reel.symbols.length; i++) {
      const y = (i * symbolHeight) - reel.position;

      // 只绘制可见的符号
      if (y > -symbolHeight && y < canvasHeight) {
        const symbolData = symbols.find(s => s.symbol === reel.symbols[i]);
        if (symbolData) {
          drawSymbol(ctx, symbolData, x, y, reelWidth, symbolHeight);
        }
      }
    }
  };

  /**
   * 绘制单个符号
   */
  const drawSymbol = (
    ctx: CanvasRenderingContext2D,
    symbolData: { symbol: string; color: string; value: number },
    x: number,
    y: number,
    width: number,
    height: number
  ) => {
    // 绘制符号背景
    const gradient = ctx.createLinearGradient(x, y, x, y + height);
    gradient.addColorStop(0, symbolData.color + '20');
    gradient.addColorStop(1, symbolData.color + '40');

    ctx.fillStyle = gradient;
    ctx.fillRect(x + 2, y + 2, width - 4, height - 4);

    // 绘制符号边框
    ctx.strokeStyle = symbolData.color;
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 2, y + 2, width - 4, height - 4);

    // 绘制符号
    ctx.fillStyle = symbolData.color;
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(symbolData.symbol, x + width / 2, y + height / 2);

    // 绘制价值文本
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px Arial';
    ctx.fillText(symbolData.value + 'x', x + width / 2, y + height - 15);
  };

  /**
   * 绘制分隔线
   */
  const drawDividers = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = '#f39c12';
    ctx.lineWidth = 3;

    // 垂直分隔线
    for (let i = 1; i < reels.length; i++) {
      const x = i * reelWidth;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvasHeight);
      ctx.stroke();
    }

    // 水平分隔线
    for (let i = 1; i < numVisibleSymbols; i++) {
      const y = i * symbolHeight;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvasWidth, y);
      ctx.stroke();
    }
  };

  /**
   * 绘制支付线
   */
  const drawPaylines = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = '#ffff00';
    ctx.lineWidth = 4;
    ctx.shadowColor = '#ffff00';
    ctx.shadowBlur = 10;

    paylines.forEach((payline, lineIndex) => {
      ctx.beginPath();
      for (let reelIndex = 0; reelIndex < payline.length; reelIndex++) {
        const x = reelIndex * reelWidth + reelWidth / 2;
        const y = payline[reelIndex] * symbolHeight + symbolHeight / 2;

        if (reelIndex === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    });

    ctx.shadowBlur = 0;
  };

  /**
   * 开始旋转
   */
  const startSpin = useCallback(() => {
    if (isSpinning || disabled) return;

    onGameStart?.();
    setIsSpinning(true);
    setResult(null);
    setSpinProgress(0);

    // 设置滚轴旋转速度
    const newReelStates = reelStates.map((reel, index) => ({
      ...reel,
      speed: randBox.natural({ min: 15, max: 25 }),
      isSpinning: true,
    }));
    setReelStates(newReelStates);

    // 生成最终结果
    const finalResults = reels.map((reel, index) => {
      const reelWeights = weights?.[index] || Array(reel.length).fill(1);
      return randBox.weighted(reel, reelWeights);
    });

    // 开始动画
    const startTime = Date.now();
    let animationStates = [...newReelStates];

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);
      setSpinProgress(progress);

      let stillSpinning = false;

      // 更新每个滚轴
      animationStates = animationStates.map((reel, index) => {
        if (reel.isSpinning) {
          const stopDelay = index * 500; // 每个滚轴延迟500ms停止

          if (elapsed > 2000 + stopDelay) {
            // 开始减速
            const newSpeed = Math.max(0, reel.speed - 1);
            if (newSpeed === 0) {
              // 停止并对齐到最终结果
              const targetSymbol = finalResults[index];
              const targetIndex = reel.symbols.indexOf(targetSymbol);
              const alignedPosition = targetIndex * symbolHeight - symbolHeight;

              return {
                ...reel,
                speed: 0,
                isSpinning: false,
                position: alignedPosition,
              };
            } else {
              stillSpinning = true;
              return {
                ...reel,
                speed: newSpeed,
                position: reel.position + newSpeed,
              };
            }
          } else {
            stillSpinning = true;
            let newPosition = reel.position + reel.speed;

            // 循环滚动
            if (newPosition >= reel.symbols.length * symbolHeight) {
              newPosition -= symbolHeight;
              // 重新随机化符号
              const newSymbols = [...reel.symbols];
              newSymbols.shift();
              newSymbols.push(getRandomSymbol());

              return {
                ...reel,
                symbols: newSymbols,
                position: newPosition,
              };
            }

            return {
              ...reel,
              position: newPosition,
            };
          }
        }
        return reel;
      });

      setReelStates(animationStates);

      if (stillSpinning) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // 动画结束，检查结果
        setIsSpinning(false);
        setSpinProgress(1);
        checkResults(finalResults);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  }, [
    isSpinning,
    disabled,
    reelStates,
    reels,
    weights,
    animationDuration,
    onGameStart,
    getRandomSymbol,
  ]);

  /**
   * 检查结果
   */
  const checkResults = useCallback((results: string[]) => {
    // 检查是否为jackpot（所有符号相同）
    const isJackpot = results.every(symbol => symbol === results[0]);

    // 组合名称
    const combination = isJackpot ? `${results[0]} x${results.length}` : results.join(' - ');

    const slotResult: SlotMachineResult = {
      results,
      isJackpot,
      combination,
    };

    setResult(slotResult);
    onResult?.(slotResult);
    onGameEnd?.(slotResult);
  }, [onResult, onGameEnd]);

  /**
   * 重置游戏
   */
  const resetGame = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    setIsSpinning(false);
    setResult(null);
    setSpinProgress(0);
    initializeReels();
  }, [initializeReels]);

  // 初始化
  useEffect(() => {
    initializeReels();
  }, [initializeReels]);

  // 绘制Canvas
  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // 清理动画
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div
      className={`canvas-slot-machine ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        ...style,
      }}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, #2c3e50, #34495e)',
          borderRadius: '20px',
          padding: '20px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        }}
      >
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          style={{
            border: '5px solid #f39c12',
            borderRadius: '15px',
            background: '#000',
            display: 'block',
            maxWidth: '100%',
            height: 'auto',
          }}
        />
      </div>

      {/* 进度条 */}
      {isSpinning && (
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <div
            style={{
              width: '100%',
              height: '8px',
              background: '#e9ecef',
              borderRadius: '4px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                width: `${spinProgress * 100}%`,
                transition: 'width 0.3s ease',
              }}
            />
          </div>
          <div style={{ textAlign: 'center', marginTop: '5px', color: '#666' }}>
            旋转进度：{Math.round(spinProgress * 100)}%
          </div>
        </div>
      )}

      {/* 控制按钮 */}
      <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={startSpin}
          disabled={disabled || isSpinning}
          style={{
            background: 'linear-gradient(45deg, #e74c3c, #c0392b)',
            color: 'white',
            border: 'none',
            padding: '20px 40px',
            borderRadius: '25px',
            fontSize: '1.3rem',
            fontWeight: 'bold',
            cursor: disabled || isSpinning ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            opacity: disabled || isSpinning ? 0.6 : 1,
          }}
        >
          {isSpinning ? '🎰 旋转中...' : `🎰 ${buttonText}`}
        </button>

        <button
          onClick={resetGame}
          disabled={isSpinning}
          style={{
            background: 'linear-gradient(45deg, #95a5a6, #7f8c8d)',
            color: 'white',
            border: 'none',
            padding: '15px 30px',
            borderRadius: '25px',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            cursor: isSpinning ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            opacity: isSpinning ? 0.6 : 1,
          }}
        >
          重置
        </button>
      </div>

      {/* 支付线显示 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
          gap: '10px',
          width: '100%',
          maxWidth: '500px',
          fontSize: '0.9rem',
        }}
      >
        {paylines.map((_, index) => (
          <div
            key={index}
            style={{
              background: result?.isJackpot ? 'rgba(102, 126, 234, 0.3)' : 'rgba(102, 126, 234, 0.1)',
              padding: '10px',
              borderRadius: '8px',
              textAlign: 'center',
              color: result?.isJackpot ? '#667eea' : '#666',
              fontWeight: result?.isJackpot ? 'bold' : 'normal',
            }}
          >
            支付线 {index + 1}
          </div>
        ))}
      </div>

      {/* 结果显示 */}
      {result && (
        <div
          style={{
            background: result.isJackpot
              ? 'linear-gradient(135deg, #27ae60, #2ecc71)'
              : 'linear-gradient(135deg, #667eea, #764ba2)',
            color: 'white',
            padding: '20px',
            borderRadius: '15px',
            fontSize: '1.2rem',
            textAlign: 'center',
            boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
          }}
        >
          <div style={{ fontSize: '1.5rem', marginBottom: '10px' }}>
            {result.isJackpot ? '🎉 JACKPOT！' : '🎰 旋转完成'}
          </div>
          <div>组合：{result.combination}</div>
          {result.isJackpot && (
            <div style={{ marginTop: '10px', fontSize: '1rem' }}>
              恭喜获得大奖！所有滚轴符号匹配！
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SlotMachine;