import React, { useRef, useEffect, useState, useCallback } from 'react';
import { GridLotteryProps, GridLotteryResult, AnimationState } from '../types';
import { RandBox } from 'randbox';

/**
 * Canvas版九宫格抽奖组件
 * 基于高性能Canvas渲染的九宫格抽奖，支持流畅的动画效果
 */
export const GridLottery: React.FC<GridLotteryProps> = ({
  prizes,
  weights,
  gridSize = 9,
  animationDuration = 3000,
  buttonText = '开始抽奖',
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

  const [animationState, setAnimationState] = useState<AnimationState>({
    isAnimating: false,
    currentStep: 0,
    totalSteps: 0,
  });

  const [result, setResult] = useState<GridLotteryResult | null>(null);
  const [currentPosition, setCurrentPosition] = useState<number>(0);
  const [targetPosition, setTargetPosition] = useState<number>(0);

  // Canvas相关状态
  const canvasSize = 600;
  const cellSize = 180;
  const padding = 30;

  // 确保奖品数量与网格大小匹配
  const actualPrizes = prizes.slice(0, gridSize).concat(
    Array(Math.max(0, gridSize - prizes.length)).fill('谢谢参与')
  );
  const actualWeights = weights || Array(actualPrizes.length).fill(1);

  /**
   * 绘制Canvas内容
   */
  const drawCanvas = useCallback((highlightPosition: number = -1) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制背景
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#f8f9fa');
    gradient.addColorStop(1, '#e9ecef');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制九宫格
    const cols = 3;
    const rows = Math.ceil(gridSize / cols);

    for (let i = 0; i < gridSize; i++) {
      const row = Math.floor(i / cols);
      const col = i % cols;
      const x = padding + col * cellSize;
      const y = padding + row * cellSize;

      const isActive = i === highlightPosition;

      // 绘制单元格
      drawCell(ctx, x, y, cellSize, actualPrizes[i], isActive);
    }
  }, [actualPrizes, gridSize, cellSize, padding]);

  /**
   * 绘制单个单元格
   */
  const drawCell = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    prize: string,
    isActive: boolean
  ) => {
    // 绘制背景
    ctx.save();
    if (isActive) {
      // 活跃状态 - 发光效果
      ctx.shadowColor = '#667eea';
      ctx.shadowBlur = 20;
      ctx.fillStyle = '#667eea';
    } else {
      ctx.fillStyle = '#ffffff';
    }

    drawRoundedRect(ctx, x + 5, y + 5, size - 10, size - 10, 15);
    ctx.fill();
    ctx.restore();

    // 绘制边框
    ctx.strokeStyle = isActive ? '#667eea' : '#e9ecef';
    ctx.lineWidth = isActive ? 4 : 2;
    drawRoundedRect(ctx, x + 5, y + 5, size - 10, size - 10, 15);
    ctx.stroke();

    // 绘制奖品文本
    ctx.fillStyle = isActive ? '#ffffff' : '#333333';
    ctx.font = 'bold 18px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const lines = wrapText(ctx, prize, size - 20);
    const lineHeight = 25;
    const startY = y + size / 2 - (lines.length - 1) * lineHeight / 2;

    lines.forEach((line, index) => {
      ctx.fillText(line, x + size / 2, startY + index * lineHeight);
    });
  };

  /**
   * 绘制圆角矩形
   */
  const drawRoundedRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  };

  /**
   * 文本换行
   */
  const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] => {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(currentLine + ' ' + word).width;
      if (width < maxWidth) {
        currentLine += ' ' + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  };

  /**
   * 开始抽奖
   */
  const startLottery = useCallback(() => {
    if (animationState.isAnimating || disabled) return;

    onGameStart?.();

    // 使用加权随机选择目标位置
    const targetIndex = randBox.weighted(
      actualPrizes.map((_, index) => index),
      actualWeights
    );

    const target = targetIndex;
    setTargetPosition(target);

    // 生成动画路径
    const minSteps = 20;
    const extraSteps = randBox.natural({ min: 5, max: 15 });
    const totalSteps = minSteps + extraSteps;

    const animationPath: number[] = [];
    for (let i = 0; i < totalSteps; i++) {
      animationPath.push(i % gridSize);
    }
    animationPath.push(target);

    setAnimationState({
      isAnimating: true,
      currentStep: 0,
      totalSteps: animationPath.length,
    });

    // 开始动画
    let currentStep = 0;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / animationDuration;

      if (progress >= 1 || currentStep >= animationPath.length) {
        // 动画结束
        setCurrentPosition(target);
        setAnimationState({
          isAnimating: false,
          currentStep: animationPath.length,
          totalSteps: animationPath.length,
        });

        const lotteryResult: GridLotteryResult = {
          position: target,
          prize: actualPrizes[target],
          animation: animationPath,
        };

        setResult(lotteryResult);
        onResult?.(lotteryResult);
        onGameEnd?.(lotteryResult);

        drawCanvas(target);
        return;
      }

      // 计算当前步骤（使用缓动函数）
      const easedProgress = easeOutQuart(progress);
      const stepIndex = Math.floor(easedProgress * (animationPath.length - 1));
      const currentPos = animationPath[stepIndex];

      setCurrentPosition(currentPos);
      setAnimationState(prev => ({ ...prev, currentStep: stepIndex }));

      drawCanvas(currentPos);

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
  }, [
    animationState.isAnimating,
    disabled,
    actualPrizes,
    actualWeights,
    gridSize,
    animationDuration,
    onGameStart,
    onResult,
    onGameEnd,
    drawCanvas,
  ]);

  /**
   * 缓动函数 - 四次方缓出
   */
  const easeOutQuart = (t: number): number => {
    return 1 - Math.pow(1 - t, 4);
  };

  /**
   * 重置游戏
   */
  const resetGame = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    setAnimationState({
      isAnimating: false,
      currentStep: 0,
      totalSteps: 0,
    });
    setResult(null);
    setCurrentPosition(0);
    setTargetPosition(0);

    drawCanvas();
  }, [drawCanvas]);

  // 初始化Canvas
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
      className={`canvas-grid-lottery ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        ...style,
      }}
    >
      <canvas
        ref={canvasRef}
        width={canvasSize}
        height={canvasSize}
        style={{
          border: '3px solid #667eea',
          borderRadius: '15px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          cursor: animationState.isAnimating ? 'default' : 'pointer',
          maxWidth: '100%',
          height: 'auto',
        }}
        onClick={startLottery}
      />

      <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={startLottery}
          disabled={disabled || animationState.isAnimating}
          style={{
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            color: 'white',
            border: 'none',
            padding: '15px 30px',
            borderRadius: '25px',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            cursor: disabled || animationState.isAnimating ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            opacity: disabled || animationState.isAnimating ? 0.6 : 1,
          }}
        >
          {animationState.isAnimating ? '抽奖中...' : buttonText}
        </button>

        <button
          onClick={resetGame}
          disabled={animationState.isAnimating}
          style={{
            background: 'linear-gradient(45deg, #95a5a6, #7f8c8d)',
            color: 'white',
            border: 'none',
            padding: '15px 30px',
            borderRadius: '25px',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            cursor: animationState.isAnimating ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            opacity: animationState.isAnimating ? 0.6 : 1,
          }}
        >
          重置
        </button>
      </div>

      {result && (
        <div
          style={{
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            color: 'white',
            padding: '20px',
            borderRadius: '15px',
            fontSize: '1.2rem',
            textAlign: 'center',
            boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)',
          }}
        >
          <div style={{ fontSize: '1.5rem', marginBottom: '10px' }}>
            {result.prize.includes('谢谢参与') ? '😅 再接再厉！' : '🎉 恭喜中奖！'}
          </div>
          <div>您抽中了：{result.prize}</div>
        </div>
      )}

      {animationState.isAnimating && (
        <div style={{ textAlign: 'center', color: '#666' }}>
          <div>动画进度：{Math.round((animationState.currentStep / animationState.totalSteps) * 100)}%</div>
        </div>
      )}
    </div>
  );
};

export default GridLottery;