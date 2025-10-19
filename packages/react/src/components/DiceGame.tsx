import React, { useRef, useEffect, useState, useCallback } from 'react';
import { DiceGameProps, DiceGameResult } from '../types';
import { RandBox } from 'randbox';

/**
 * Canvas版骰子游戏组件
 * 基于Canvas的3D骰子游戏实现，支持多种游戏模式和真实动画效果
 */
export const DiceGame: React.FC<DiceGameProps> = ({
  diceCount = 2,
  gameMode = 'sum',
  targetSum,
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

  const [isRolling, setIsRolling] = useState(false);
  const [diceValues, setDiceValues] = useState<number[]>([]);
  const [result, setResult] = useState<DiceGameResult | null>(null);
  const [rollProgress, setRollProgress] = useState(0);
  const [stats, setStats] = useState({
    totalRolls: 0,
    correctGuesses: 0,
  });

  // Canvas配置
  const canvasWidth = 600;
  const canvasHeight = 400;
  const diceSize = 80;

  // 骰子状态
  const [dice, setDice] = useState<Array<{
    x: number;
    y: number;
    value: number;
    rotation: { x: number; y: number; z: number };
    size: number;
  }>>([]);

  /**
   * 初始化骰子位置
   */
  const initializeDice = useCallback(() => {
    const newDice = [];
    const spacing = 120;
    const startX = (canvasWidth - (diceCount - 1) * spacing) / 2;

    for (let i = 0; i < diceCount; i++) {
      newDice.push({
        x: startX + i * spacing,
        y: canvasHeight / 2,
        value: 1,
        rotation: { x: 0, y: 0, z: 0 },
        size: diceSize,
      });
    }

    setDice(newDice);
    setDiceValues(new Array(diceCount).fill(1));
  }, [diceCount]);

  /**
   * 绘制Canvas内容
   */
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 清空画布
    ctx.fillStyle = '#27ae60';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制背景纹理
    drawBackground(ctx);

    // 绘制骰子
    dice.forEach((die, index) => {
      drawDie(ctx, die, index);
      drawShadow(ctx, die);
    });
  }, [dice]);

  /**
   * 绘制背景纹理
   */
  const drawBackground = (ctx: CanvasRenderingContext2D) => {
    ctx.save();
    ctx.globalAlpha = 0.1;
    ctx.strokeStyle = '#2ecc71';
    ctx.lineWidth = 1;

    // 网格纹理
    for (let x = 0; x < canvasWidth; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvasHeight);
      ctx.stroke();
    }

    for (let y = 0; y < canvasHeight; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvasWidth, y);
      ctx.stroke();
    }

    ctx.restore();
  };

  /**
   * 绘制3D骰子
   */
  const drawDie = (
    ctx: CanvasRenderingContext2D,
    die: { x: number; y: number; value: number; size: number },
    index: number
  ) => {
    const { x, y, value, size } = die;

    ctx.save();

    // 主面（正面）
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;

    ctx.fillRect(x - size / 2, y - size / 2, size, size);
    ctx.strokeRect(x - size / 2, y - size / 2, size, size);

    // 右侧面（3D效果）
    ctx.fillStyle = '#e0e0e0';
    ctx.beginPath();
    ctx.moveTo(x + size / 2, y - size / 2);
    ctx.lineTo(x + size / 2 + 15, y - size / 2 - 15);
    ctx.lineTo(x + size / 2 + 15, y + size / 2 - 15);
    ctx.lineTo(x + size / 2, y + size / 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 顶面（3D效果）
    ctx.fillStyle = '#f0f0f0';
    ctx.beginPath();
    ctx.moveTo(x - size / 2, y - size / 2);
    ctx.lineTo(x - size / 2 + 15, y - size / 2 - 15);
    ctx.lineTo(x + size / 2 + 15, y - size / 2 - 15);
    ctx.lineTo(x + size / 2, y - size / 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 绘制点数
    drawDots(ctx, x, y, value, size);

    // 如果正在滚动，添加模糊效果
    if (isRolling) {
      ctx.save();
      ctx.globalAlpha = 0.3;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x - size / 2, y - size / 2, size, size);
      ctx.restore();
    }

    ctx.restore();
  };

  /**
   * 绘制骰子点数
   */
  const drawDots = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    value: number,
    size: number
  ) => {
    const dotSize = 8;
    const spacing = size / 4;

    ctx.fillStyle = '#000000';

    const dotPositions: { [key: number]: [number, number][] } = {
      1: [[0, 0]],
      2: [[-spacing, -spacing], [spacing, spacing]],
      3: [[-spacing, -spacing], [0, 0], [spacing, spacing]],
      4: [[-spacing, -spacing], [spacing, -spacing], [-spacing, spacing], [spacing, spacing]],
      5: [[-spacing, -spacing], [spacing, -spacing], [0, 0], [-spacing, spacing], [spacing, spacing]],
      6: [[-spacing, -spacing], [spacing, -spacing], [-spacing, 0], [spacing, 0], [-spacing, spacing], [spacing, spacing]]
    };

    if (dotPositions[value]) {
      dotPositions[value].forEach(([dx, dy]) => {
        ctx.beginPath();
        ctx.arc(centerX + dx, centerY + dy, dotSize, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  };

  /**
   * 绘制阴影
   */
  const drawShadow = (
    ctx: CanvasRenderingContext2D,
    die: { x: number; y: number; size: number }
  ) => {
    const { x, y, size } = die;

    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = '#000000';

    // 椭圆阴影
    ctx.beginPath();
    ctx.ellipse(x + 10, y + size / 2 + 10, size / 2, size / 4, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  };

  /**
   * 投掷骰子
   */
  const rollDice = useCallback(() => {
    if (isRolling || disabled) return;

    onGameStart?.();
    setIsRolling(true);
    setResult(null);
    setRollProgress(0);

    // 生成最终结果
    const finalValues = Array.from({ length: diceCount }, () => randBox.dice());

    // 开始动画
    const animationDuration = 2000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);
      setRollProgress(progress);

      if (progress >= 1) {
        // 动画结束
        setIsRolling(false);
        setDiceValues(finalValues);

        // 更新骰子显示
        setDice(prevDice =>
          prevDice.map((die, index) => ({
            ...die,
            value: finalValues[index],
          }))
        );

        // 处理结果
        processResult(finalValues);
        return;
      }

      // 动画过程中随机显示数字
      const animatedValues = Array.from({ length: diceCount }, () => randBox.dice());
      setDice(prevDice =>
        prevDice.map((die, index) => ({
          ...die,
          value: animatedValues[index],
        }))
      );

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
  }, [isRolling, disabled, diceCount, onGameStart]);

  /**
   * 处理游戏结果
   */
  const processResult = useCallback((values: number[]) => {
    const sum = values.reduce((a, b) => a + b, 0);
    let isWin = false;
    let description = '';

    switch (gameMode) {
      case 'sum':
        if (targetSum !== undefined) {
          isWin = sum === targetSum;
          description = `目标点数: ${targetSum}, 实际点数: ${sum}`;
        } else {
          description = `总点数: ${sum}`;
        }
        break;

      case 'even_odd':
        const isEven = sum % 2 === 0;
        description = `总点数: ${sum} (${isEven ? '偶数' : '奇数'})`;
        break;

      case 'specific':
        // 检查是否有特定组合
        const allSame = values.every(val => val === values[0]);
        if (allSame) {
          isWin = true;
          description = `豹子: ${values[0]}${values[0]}${values[0]}`;
        } else {
          description = `点数组合: ${values.join('-')}`;
        }
        break;

      default:
        description = `投掷结果: ${values.join(', ')} (总和: ${sum})`;
    }

    const diceResult: DiceGameResult = {
      results: values,
      total: sum,
      gameMode,
      isWin,
      message: description,
      values,
      sum,
      description,
    };

    setResult(diceResult);
    setStats(prev => ({
      totalRolls: prev.totalRolls + 1,
      correctGuesses: prev.correctGuesses + (isWin ? 1 : 0),
    }));

    onResult?.(diceResult);
    onGameEnd?.(diceResult);
  }, [gameMode, targetSum, onResult, onGameEnd]);

  /**
   * 重置游戏
   */
  const resetGame = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    setIsRolling(false);
    setResult(null);
    setRollProgress(0);
    setStats({ totalRolls: 0, correctGuesses: 0 });
    initializeDice();
  }, [initializeDice]);

  // 初始化
  useEffect(() => {
    initializeDice();
  }, [initializeDice]);

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

  const accuracy = stats.totalRolls > 0 ? Math.round((stats.correctGuesses / stats.totalRolls) * 100) : 0;

  return (
    <div
      className={`canvas-dice-game ${className}`}
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
            background: '#27ae60',
            display: 'block',
            maxWidth: '100%',
            height: 'auto',
          }}
        />
      </div>

      {/* 游戏信息 */}
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
            background: 'rgba(102, 126, 234, 0.1)',
            padding: '15px',
            borderRadius: '10px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#667eea' }}>
            {diceCount}
          </div>
          <div style={{ color: '#666', marginTop: '5px' }}>骰子数量</div>
        </div>

        <div
          style={{
            background: 'rgba(102, 126, 234, 0.1)',
            padding: '15px',
            borderRadius: '10px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#667eea' }}>
            {stats.totalRolls}
          </div>
          <div style={{ color: '#666', marginTop: '5px' }}>投掷次数</div>
        </div>

        <div
          style={{
            background: 'rgba(102, 126, 234, 0.1)',
            padding: '15px',
            borderRadius: '10px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#667eea' }}>
            {stats.correctGuesses}
          </div>
          <div style={{ color: '#666', marginTop: '5px' }}>成功次数</div>
        </div>

        <div
          style={{
            background: 'rgba(102, 126, 234, 0.1)',
            padding: '15px',
            borderRadius: '10px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#667eea' }}>
            {accuracy}%
          </div>
          <div style={{ color: '#666', marginTop: '5px' }}>成功率</div>
        </div>
      </div>

      {/* 进度条 */}
      {isRolling && (
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
                width: `${rollProgress * 100}%`,
                transition: 'width 0.3s ease',
              }}
            />
          </div>
          <div style={{ textAlign: 'center', marginTop: '5px', color: '#666' }}>
            投掷进度：{Math.round(rollProgress * 100)}%
          </div>
        </div>
      )}

      {/* 控制按钮 */}
      <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={rollDice}
          disabled={disabled || isRolling}
          style={{
            background: 'linear-gradient(45deg, #e74c3c, #c0392b)',
            color: 'white',
            border: 'none',
            padding: '20px 40px',
            borderRadius: '25px',
            fontSize: '1.3rem',
            fontWeight: 'bold',
            cursor: disabled || isRolling ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            opacity: disabled || isRolling ? 0.6 : 1,
          }}
        >
          {isRolling ? '🎲 投掷中...' : '🎲 投掷骰子'}
        </button>

        <button
          onClick={resetGame}
          disabled={isRolling}
          style={{
            background: 'linear-gradient(45deg, #95a5a6, #7f8c8d)',
            color: 'white',
            border: 'none',
            padding: '15px 30px',
            borderRadius: '25px',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            cursor: isRolling ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            opacity: isRolling ? 0.6 : 1,
          }}
        >
          重置游戏
        </button>
      </div>

      {/* 结果显示 */}
      {result && (
        <div
          style={{
            background: result.isWin
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
            {result.isWin ? '🎉 成功！' : '🎲 继续努力'}
          </div>
          <div>投掷结果：{result.values.join(', ')}</div>
          <div>总点数：{result.sum}</div>
          {result.description && (
            <div style={{ marginTop: '10px', fontSize: '1rem' }}>
              {result.description}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DiceGame;