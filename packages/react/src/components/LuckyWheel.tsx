import React, { useRef, useEffect, useState, useCallback } from 'react';
import { LuckyWheelProps, LuckyWheelResult } from '../types';
import { RandBox } from 'randbox';

/**
 * Canvas版幸运大转盘组件
 * 基于Canvas的抽奖转盘实现，支持带权重的随机抽奖和流畅动画效果
 */
export const LuckyWheel: React.FC<LuckyWheelProps> = ({
  prizes,
  weights,
  colors,
  animationDuration = 4000,
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

  const [isSpinning, setIsSpinning] = useState(false);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [round, setRound] = useState(0);

  // Canvas配置
  const canvasWidth = 500;
  const canvasHeight = 500;
  const centerX = canvasWidth / 2;
  const centerY = canvasHeight / 2;
  const wheelRadius = 200;
  const buttonRadius = 40;

  // 默认颜色方案 - 柔和的蓝色/紫色系
  const defaultColors = [
    '#A8B9F5', '#C9D5F7', '#A8B9F5', '#C9D5F7',
    '#A8B9F5', '#C9D5F7', '#A8B9F5', '#C9D5F7'
  ];

  const prizeColors = colors || defaultColors;
  const prizeCount = prizes.length;
  const anglePerPrize = (Math.PI * 2) / prizeCount;

  /**
   * 绘制Canvas内容
   */
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 清空画布
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(currentRotation);

    // 绘制转盘扇形
    for (let i = 0; i < prizeCount; i++) {
      const startAngle = i * anglePerPrize - Math.PI / 2;
      const endAngle = (i + 1) * anglePerPrize - Math.PI / 2;
      const color = prizeColors[i % prizeColors.length];

      // 绘制扇形主体
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, wheelRadius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();

      // 绘制白色边框
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4;
      ctx.stroke();

      // 在扇形边缘绘制编号
      ctx.save();
      const numberAngle = startAngle + anglePerPrize / 2;
      ctx.rotate(numberAngle + Math.PI / 2);

      // 绘制编号背景圆
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, -wheelRadius + 25, 18, 0, Math.PI * 2);
      ctx.fill();

      // 绘制编号文字
      ctx.fillStyle = '#5B6E99';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(i.toString(), 0, -wheelRadius + 25);

      ctx.restore();

      // 绘制奖品文字（在中间区域）
      ctx.save();
      const textAngle = startAngle + anglePerPrize / 2;
      ctx.rotate(textAngle + Math.PI / 2);
      ctx.fillStyle = '#4A5B7F';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // 文字换行处理
      const prize = prizes[i];
      const maxWidth = wheelRadius * 0.5;
      const words = prize.split('');
      let line = '';
      const lines: string[] = [];

      for (const word of words) {
        const testLine = line + word;
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && line.length > 0) {
          lines.push(line);
          line = word;
        } else {
          line = testLine;
        }
      }
      lines.push(line);

      const lineHeight = 18;
      const totalHeight = lines.length * lineHeight;
      lines.forEach((textLine, index) => {
        const y = wheelRadius * 0.5 - totalHeight / 2 + index * lineHeight;
        ctx.fillText(textLine, 0, y);
      });

      ctx.restore();
    }

    ctx.restore();

    // 绘制外圈主边框
    ctx.beginPath();
    ctx.arc(centerX, centerY, wheelRadius + 5, 0, Math.PI * 2);
    ctx.strokeStyle = '#5B7DBF';
    ctx.lineWidth = 10;
    ctx.stroke();

    // 绘制外圈装饰
    ctx.beginPath();
    ctx.arc(centerX, centerY, wheelRadius + 15, 0, Math.PI * 2);
    ctx.strokeStyle = '#7A95D6';
    ctx.lineWidth = 3;
    ctx.stroke();

    // 绘制指针
    drawPointer(ctx);

    // 绘制中心按钮
    drawButton(ctx);
  }, [currentRotation, prizes, prizeColors, prizeCount, anglePerPrize]);

  /**
   * 绘制指针
   */
  const drawPointer = (ctx: CanvasRenderingContext2D) => {
    ctx.save();
    ctx.translate(centerX, centerY);

    // 指针三角形
    ctx.beginPath();
    ctx.moveTo(0, -wheelRadius - 20);
    ctx.lineTo(-15, -wheelRadius - 5);
    ctx.lineTo(15, -wheelRadius - 5);
    ctx.closePath();

    // 使用蓝色渐变
    const gradient = ctx.createLinearGradient(0, -wheelRadius - 20, 0, -wheelRadius - 5);
    gradient.addColorStop(0, '#5B7DBF');
    gradient.addColorStop(1, '#7A95D6');
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 指针装饰圆
    ctx.beginPath();
    ctx.arc(0, -wheelRadius - 5, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = '#5B7DBF';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.restore();
  };

  /**
   * 绘制中心按钮
   */
  const drawButton = (ctx: CanvasRenderingContext2D) => {
    // 按钮外圈装饰
    ctx.beginPath();
    ctx.arc(centerX, centerY, buttonRadius + 5, 0, Math.PI * 2);
    ctx.strokeStyle = '#7A95D6';
    ctx.lineWidth = 3;
    ctx.stroke();

    // 按钮主体 - 使用蓝色渐变
    const gradient = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, buttonRadius
    );
    gradient.addColorStop(0, '#A8B9F5');
    gradient.addColorStop(1, '#7A95D6');

    ctx.beginPath();
    ctx.arc(centerX, centerY, buttonRadius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.stroke();

    // 按钮文字
    ctx.fillStyle = '#2C3E5B';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(isSpinning ? '抽奖中' : buttonText, centerX, centerY);

    // 按钮高光效果
    if (!isSpinning) {
      ctx.save();
      ctx.globalAlpha = 0.4;
      ctx.beginPath();
      ctx.arc(centerX - 8, centerY - 8, buttonRadius * 0.4, 0, Math.PI * 2);
      const highlightGradient = ctx.createRadialGradient(
        centerX - 8, centerY - 8, 0,
        centerX - 8, centerY - 8, buttonRadius * 0.4
      );
      highlightGradient.addColorStop(0, '#ffffff');
      highlightGradient.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = highlightGradient;
      ctx.fill();
      ctx.restore();
    }
  };

  /**
   * 开始抽奖
   */
  const startSpin = useCallback(() => {
    if (isSpinning || disabled || prizeCount === 0) return;

    onGameStart?.();
    setIsSpinning(true);

    // 使用 randBox.weighted 进行带权重的随机选择
    const prizeIndices = prizes.map((_, index) => index);
    const prizeWeights = weights || prizes.map(() => 1);
    const selectedIndex = randBox.weighted(prizeIndices, prizeWeights);

    // 计算目标角度
    const targetPrizeAngle = selectedIndex * anglePerPrize;
    const extraRotations = 5 + Math.random() * 3; // 5-8圈
    const randomOffset = (Math.random() - 0.5) * anglePerPrize * 0.3; // 随机偏移
    const targetAngle = extraRotations * Math.PI * 2 + targetPrizeAngle + randomOffset;

    // 开始动画
    const startTime = Date.now();
    const startRotation = currentRotation % (Math.PI * 2);

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);

      // 使用缓动函数
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const rotation = startRotation + targetAngle * easeOut;

      setCurrentRotation(rotation);

      if (progress >= 1) {
        // 动画结束
        setIsSpinning(false);

        // 计算最终停止的奖品位置
        const finalRotation = rotation % (Math.PI * 2);
        const normalizedRotation = (Math.PI * 2 - finalRotation + Math.PI / 2) % (Math.PI * 2);
        const finalPrizeIndex = Math.floor(normalizedRotation / anglePerPrize) % prizeCount;

        const result: LuckyWheelResult = {
          prizeIndex: selectedIndex,
          prize: prizes[selectedIndex],
          angle: rotation,
          round: round + 1,
        };

        setRound(prev => prev + 1);
        onResult?.(result);
        onGameEnd?.(result);
        return;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
  }, [
    isSpinning,
    disabled,
    prizeCount,
    prizes,
    weights,
    currentRotation,
    round,
    animationDuration,
    anglePerPrize,
    onGameStart,
    onResult,
    onGameEnd,
  ]);

  /**
   * 处理点击事件
   */
  const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (isSpinning || disabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // 计算点击位置到中心的距离
    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // 如果点击在中心按钮区域内，开始抽奖
    if (distance <= buttonRadius) {
      startSpin();
    }
  }, [isSpinning, disabled, startSpin]);

  /**
   * 重置游戏
   */
  const resetWheel = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setIsSpinning(false);
    setCurrentRotation(0);
    setRound(0);
  }, []);

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
      className={`canvas-lucky-wheel ${className}`}
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
        width={canvasWidth}
        height={canvasHeight}
        onClick={handleCanvasClick}
        style={{
          border: '4px solid #7A95D6',
          borderRadius: '20px',
          background: '#ffffff',
          cursor: isSpinning || disabled ? 'not-allowed' : 'pointer',
          maxWidth: '100%',
          height: 'auto',
          boxShadow: '0 4px 20px rgba(90, 125, 191, 0.2)',
        }}
      />
    </div>
  );
};

export default LuckyWheel;
