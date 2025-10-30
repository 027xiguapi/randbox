import React, { useRef, useEffect, useState, useCallback } from 'react';
import { CoinFlipProps, CoinFlipResult, CoinFlipStats } from '../types';
import { RandBox } from 'randbox';

/**
 * Canvas版抛硬币组件
 * 基于Canvas的3D硬币抛掷游戏实现，支持动画效果和统计数据
 */
export const CoinFlip: React.FC<CoinFlipProps> = ({
  className = '',
  style,
  disabled = false,
  animationDuration = 2000,
  showStats = true,
  onGameStart,
  onGameEnd,
  onResult,
}) => {
  const randBox = new RandBox();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState<CoinFlipResult | null>(null);
  const [flipProgress, setFlipProgress] = useState(0);
  const [stats, setStats] = useState<CoinFlipStats>({
    totalFlips: 0,
    heads: 0,
    tails: 0,
    headsRate: '0',
    tailsRate: '0',
  });

  // Canvas配置
  const canvasWidth = 500;
  const canvasHeight = 500;
  const coinRadius = 100;

  // 硬币状态
  const [coin, setCoin] = useState<{
    x: number;
    y: number;
    rotation: number;
    scale: number;
    currentSide: 'heads' | 'tails';
  }>({
    x: canvasWidth / 2,
    y: canvasHeight / 2,
    rotation: 0,
    scale: 1,
    currentSide: 'heads',
  });

  /**
   * 绘制Canvas内容
   */
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 清空画布
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制背景光晕
    drawGlow(ctx);

    // 绘制硬币
    drawCoin(ctx);
  }, [coin, isFlipping]);

  /**
   * 绘制背景光晕效果
   */
  const drawGlow = (ctx: CanvasRenderingContext2D) => {
    const gradient = ctx.createRadialGradient(
      canvasWidth / 2, canvasHeight / 2, 0,
      canvasWidth / 2, canvasHeight / 2, canvasWidth / 2
    );
    gradient.addColorStop(0, 'rgba(255, 215, 0, 0.2)');
    gradient.addColorStop(0.5, 'rgba(255, 215, 0, 0.05)');
    gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  };

  /**
   * 绘制3D硬币
   */
  const drawCoin = (ctx: CanvasRenderingContext2D) => {
    const { x, y, rotation, scale, currentSide } = coin;

    ctx.save();
    ctx.translate(x, y);

    // 绘制阴影
    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.ellipse(0, 120, coinRadius * 0.8, coinRadius * 0.2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 计算3D效果的缩放
    const scaleY = Math.abs(Math.cos(rotation)) * scale;

    // 绘制硬币主体
    ctx.save();
    ctx.scale(scale, scaleY);

    // 硬币外圈
    const gradient = ctx.createLinearGradient(-coinRadius, -coinRadius, coinRadius, coinRadius);
    gradient.addColorStop(0, '#FFD700');
    gradient.addColorStop(0.5, '#FFF4A3');
    gradient.addColorStop(1, '#FFD700');

    ctx.fillStyle = gradient;
    ctx.strokeStyle = '#B8860B';
    ctx.lineWidth = 4;

    ctx.beginPath();
    ctx.arc(0, 0, coinRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // 硬币内圈
    ctx.strokeStyle = '#DAA520';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, coinRadius * 0.85, 0, Math.PI * 2);
    ctx.stroke();

    // 绘制硬币图案
    if (scaleY > 0.1) {
      drawCoinPattern(ctx, currentSide, scaleY);
    } else {
      // 在翻转的侧面显示厚度
      ctx.fillStyle = '#B8860B';
      ctx.fillRect(-coinRadius, -10 / scaleY, coinRadius * 2, 20 / scaleY);
    }

    ctx.restore();

    // 添加高光效果
    if (!isFlipping || flipProgress < 0.2 || flipProgress > 0.8) {
      ctx.save();
      ctx.scale(scale, scaleY);
      const highlightGradient = ctx.createRadialGradient(
        -coinRadius * 0.3, -coinRadius * 0.3, 0,
        -coinRadius * 0.3, -coinRadius * 0.3, coinRadius * 0.6
      );
      highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
      highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = highlightGradient;
      ctx.beginPath();
      ctx.arc(0, 0, coinRadius * 0.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    ctx.restore();
  };

  /**
   * 绘制硬币图案（正面/反面）
   */
  const drawCoinPattern = (
    ctx: CanvasRenderingContext2D,
    side: 'heads' | 'tails',
    scaleY: number
  ) => {
    ctx.save();

    if (side === 'heads') {
      // 正面 - 绘制"H"或头像图案
      ctx.fillStyle = '#B8860B';
      ctx.font = `bold ${80 / scaleY}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('H', 0, 0);

      // 绘制装饰圆圈
      ctx.strokeStyle = '#B8860B';
      ctx.lineWidth = 3 / scaleY;
      ctx.beginPath();
      ctx.arc(0, 0, coinRadius * 0.6, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      // 反面 - 绘制"T"或数字图案
      ctx.fillStyle = '#B8860B';
      ctx.font = `bold ${80 / scaleY}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('T', 0, 0);

      // 绘制装饰星星
      drawStar(ctx, 0, 0, 5, coinRadius * 0.4, coinRadius * 0.2, scaleY);
    }

    ctx.restore();
  };

  /**
   * 绘制星形装饰
   */
  const drawStar = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    spikes: number,
    outerRadius: number,
    innerRadius: number,
    scaleY: number
  ) => {
    let rot = Math.PI / 2 * 3;
    const step = Math.PI / spikes;

    ctx.strokeStyle = '#B8860B';
    ctx.lineWidth = 2 / scaleY;
    ctx.beginPath();
    ctx.moveTo(x, y - outerRadius);

    for (let i = 0; i < spikes; i++) {
      ctx.lineTo(x + Math.cos(rot) * outerRadius, y + Math.sin(rot) * outerRadius);
      rot += step;
      ctx.lineTo(x + Math.cos(rot) * innerRadius, y + Math.sin(rot) * innerRadius);
      rot += step;
    }

    ctx.lineTo(x, y - outerRadius);
    ctx.closePath();
    ctx.stroke();
  };

  /**
   * 抛硬币
   */
  const flipCoin = useCallback(() => {
    if (isFlipping || disabled) return;

    onGameStart?.();
    setIsFlipping(true);
    setResult(null);
    setFlipProgress(0);

    // 使用 randBox.coin() 生成最终结果
    const finalResult = randBox.coin() as 'heads' | 'tails';

    // 计算旋转次数（至少旋转5圈）
    const minRotations = 5;
    const maxRotations = 8;
    const rotations = minRotations + Math.random() * (maxRotations - minRotations);

    // 计算最终角度（确保停在正确的面）
    const baseRotations = Math.floor(rotations);
    const finalAngle = finalResult === 'heads' ? 0 : Math.PI;
    const totalRotation = baseRotations * Math.PI * 2 + finalAngle;

    // 开始动画
    const startTime = Date.now();
    const startRotation = coin.rotation;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);
      setFlipProgress(progress);

      // 使用缓动函数
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentRotation = startRotation + totalRotation * easeOut;

      // 添加Y轴跳跃效果
      const jumpHeight = Math.sin(progress * Math.PI) * 80;

      // 添加缩放效果
      const scaleEffect = 1 + Math.sin(progress * Math.PI) * 0.2;

      // 确定当前显示的面
      const normalizedRotation = currentRotation % (Math.PI * 2);
      const currentSide = (Math.cos(normalizedRotation) > 0) ? 'heads' : 'tails';

      setCoin({
        x: canvasWidth / 2,
        y: canvasHeight / 2 - jumpHeight,
        rotation: currentRotation,
        scale: scaleEffect,
        currentSide,
      });

      if (progress >= 1) {
        // 动画结束
        setIsFlipping(false);

        // 确保最终状态正确
        setCoin({
          x: canvasWidth / 2,
          y: canvasHeight / 2,
          rotation: finalAngle,
          scale: 1,
          currentSide: finalResult,
        });

        // 处理结果
        processResult(finalResult);
        return;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
  }, [isFlipping, disabled, coin.rotation, animationDuration, onGameStart]);

  /**
   * 处理抛硬币结果
   */
  const processResult = useCallback((finalResult: 'heads' | 'tails') => {
    const newStats: CoinFlipStats = {
      totalFlips: stats.totalFlips + 1,
      heads: stats.heads + (finalResult === 'heads' ? 1 : 0),
      tails: stats.tails + (finalResult === 'tails' ? 1 : 0),
      headsRate: '0',
      tailsRate: '0',
    };

    // 计算概率
    newStats.headsRate = ((newStats.heads / newStats.totalFlips) * 100).toFixed(1);
    newStats.tailsRate = ((newStats.tails / newStats.totalFlips) * 100).toFixed(1);

    setStats(newStats);

    const coinResult: CoinFlipResult = {
      result: finalResult,
      round: newStats.totalFlips,
      timestamp: Date.now(),
    };

    setResult(coinResult);
    onResult?.(coinResult);
    onGameEnd?.(coinResult);
  }, [stats, onResult, onGameEnd]);

  /**
   * 重置游戏
   */
  const resetGame = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    setIsFlipping(false);
    setResult(null);
    setFlipProgress(0);
    setStats({
      totalFlips: 0,
      heads: 0,
      tails: 0,
      headsRate: '0',
      tailsRate: '0',
    });
    setCoin({
      x: canvasWidth / 2,
      y: canvasHeight / 2,
      rotation: 0,
      scale: 1,
      currentSide: 'heads',
    });
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
      className={`canvas-coin-flip ${className}`}
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
            border: '3px solid #f39c12',
            borderRadius: '15px',
            background: '#1a1a2e',
            display: 'block',
            maxWidth: '100%',
            height: 'auto',
          }}
        />
      </div>

      {/* 统计信息 */}
      {showStats && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '15px',
            width: '100%',
            maxWidth: '500px',
          }}
        >
          <div
            style={{
              background: 'rgba(52, 152, 219, 0.1)',
              padding: '15px',
              borderRadius: '10px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3498db' }}>
              {stats.totalFlips}
            </div>
            <div style={{ color: '#666', marginTop: '5px' }}>总次数</div>
          </div>

          <div
            style={{
              background: 'rgba(46, 204, 113, 0.1)',
              padding: '15px',
              borderRadius: '10px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2ecc71' }}>
              {stats.heads}
            </div>
            <div style={{ color: '#666', marginTop: '5px' }}>
              正面 ({stats.headsRate}%)
            </div>
          </div>

          <div
            style={{
              background: 'rgba(231, 76, 60, 0.1)',
              padding: '15px',
              borderRadius: '10px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#e74c3c' }}>
              {stats.tails}
            </div>
            <div style={{ color: '#666', marginTop: '5px' }}>
              反面 ({stats.tailsRate}%)
            </div>
          </div>
        </div>
      )}

      {/* 进度条 */}
      {isFlipping && (
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
                background: 'linear-gradient(45deg, #f39c12, #e67e22)',
                width: `${flipProgress * 100}%`,
                transition: 'width 0.1s ease',
              }}
            />
          </div>
          <div style={{ textAlign: 'center', marginTop: '5px', color: '#666' }}>
            抛掷进度：{Math.round(flipProgress * 100)}%
          </div>
        </div>
      )}

      {/* 控制按钮 */}
      <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={flipCoin}
          disabled={disabled || isFlipping}
          style={{
            background: 'linear-gradient(45deg, #f39c12, #e67e22)',
            color: 'white',
            border: 'none',
            padding: '20px 40px',
            borderRadius: '25px',
            fontSize: '1.3rem',
            fontWeight: 'bold',
            cursor: disabled || isFlipping ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            opacity: disabled || isFlipping ? 0.6 : 1,
          }}
        >
          {isFlipping ? '🪙 抛掷中...' : '🪙 抛硬币'}
        </button>

        <button
          onClick={resetGame}
          disabled={isFlipping}
          style={{
            background: 'linear-gradient(45deg, #95a5a6, #7f8c8d)',
            color: 'white',
            border: 'none',
            padding: '15px 30px',
            borderRadius: '25px',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            cursor: isFlipping ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            opacity: isFlipping ? 0.6 : 1,
          }}
        >
          重置统计
        </button>
      </div>

      {/* 结果显示 */}
      {result && !isFlipping && (
        <div
          style={{
            background: result.result === 'heads'
              ? 'linear-gradient(135deg, #2ecc71, #27ae60)'
              : 'linear-gradient(135deg, #e74c3c, #c0392b)',
            color: 'white',
            padding: '20px',
            borderRadius: '15px',
            fontSize: '1.2rem',
            textAlign: 'center',
            boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
            minWidth: '250px',
          }}
        >
          <div style={{ fontSize: '1.5rem', marginBottom: '10px' }}>
            {result.result === 'heads' ? '🟢 正面 (Heads)' : '🔴 反面 (Tails)'}
          </div>
          <div>第 {result.round} 次抛掷</div>
        </div>
      )}
    </div>
  );
};

export default CoinFlip;
