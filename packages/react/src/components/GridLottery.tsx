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
   * 绘制圆角矩形
   */
  const roundedRect = (
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
   * 绘制单个小方块
   */
  const drawCell = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    prize: string,
    isActive: boolean
  ) => {
    const radius = 15;
    const shadowColor = 'rgba(0, 0, 0, 0.3)';
    const bgColor = isActive ? '#667eea' : '#ffffff';
    const txtColor = isActive ? '#ffffff' : '#333333';
    const txtSize = 'bold 20px Arial, sans-serif';

    // 绘制方块（带阴影）
    ctx.save();
    ctx.fillStyle = bgColor;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 4;
    ctx.shadowBlur = isActive ? 20 : 8;
    ctx.shadowColor = isActive ? '#667eea' : shadowColor;
    roundedRect(ctx, x + 5, y + 5, size - 10, size - 10, radius);
    ctx.fill();
    ctx.restore();

    // 绘制边框
    ctx.save();
    ctx.strokeStyle = isActive ? '#667eea' : '#e9ecef';
    ctx.lineWidth = isActive ? 4 : 2;
    roundedRect(ctx, x + 5, y + 5, size - 10, size - 10, radius);
    ctx.stroke();
    ctx.restore();

    // 绘制奖品文本或图片
    if (prize) {
      // 检查是否为图片（以 'img-' 开头）
      if (prize.substr(0, 3) === 'img') {
        const textFormat = prize.replace('img-', '');
        const image = new Image();
        image.src = textFormat;

        // 图片绘制函数
        const drawImage = () => {
          try {
            ctx.drawImage(
              image,
              x + (size * 0.2 / 2),
              y + (size * 0.2 / 2),
              size * 0.8,
              size * 0.8
            );
          } catch (error) {
            console.warn('Failed to draw image:', error);
          }
        };

        // 如果图片已经加载完成，直接绘制
        if (image.complete) {
          drawImage();
        } else {
          // 否则等待加载完成再绘制
          image.onload = drawImage;
          image.onerror = () => {
            console.warn('Failed to load image:', textFormat);
          };
        }
      } else {
        // 绘制文字
        ctx.save();
        ctx.fillStyle = txtColor;
        ctx.font = txtSize;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // 计算居中位置
        const centerX = x + size / 2;
        const centerY = y + size / 2;

        // 测量文本宽度以确保居中
        const textWidth = ctx.measureText(prize).width;
        const translateX = centerX - textWidth / 2;
        const translateY = centerY + 6; // 微调垂直位置

        ctx.translate(translateX, translateY);
        ctx.fillText(prize, 0, 0);
        ctx.restore();
      }
    }
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