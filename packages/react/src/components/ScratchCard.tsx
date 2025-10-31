import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ScratchCardProps, ScratchCardResult } from '../types';
import { RandBox } from 'randbox';

/**
 * Canvas版刮刮卡组件
 * 基于Canvas的高性能刮刮卡实现，支持真实的刮除体验
 */
export const ScratchCard: React.FC<ScratchCardProps> = ({
  rows = 3,
  cols = 3,
  symbols = ['🍎', '🍌', '🍒', '🍋', '🍇', '🍓'],
  winProbability = 30,
  className = '',
  style,
  disabled = false,
  onGameStart,
  onGameEnd,
  onScratch,
  onNewCard,
}) => {
  const randBox = new RandBox();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);

  const [cardData, setCardData] = useState<{
    grid: string[][];
    isWinner: boolean;
    winningInfo?: any;
  } | null>(null);

  const [isScratching, setIsScratching] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [scratchProgress, setScratchProgress] = useState(0);
  const [result, setResult] = useState<ScratchCardResult | null>(null);
  const [lastScratchPoint, setLastScratchPoint] = useState<{ x: number; y: number } | null>(null);

  // Canvas配置
  const canvasWidth = 600;
  const canvasHeight = 400;
  const cellWidth = canvasWidth / cols;
  const cellHeight = canvasHeight / rows;
  const revealThreshold = 0.3; // 30%刮开时自动显示

  /**
   * 生成刮刮卡内容
   */
  const generateCard = useCallback((): {
    grid: string[][];
    isWinner: boolean;
    winningInfo?: any;
  } => {
    const shouldWin = randBox.bool({ likelihood: winProbability });
    const grid: string[][] = [];

    // 初始化网格
    for (let i = 0; i < rows; i++) {
      grid[i] = [];
      for (let j = 0; j < cols; j++) {
        grid[i][j] = randBox.pickone(symbols);
      }
    }

    let winningInfo: any = null;

    if (shouldWin) {
      // 确保有中奖组合
      const winSymbol = randBox.pickone(symbols);

      // 随机选择一行、一列或对角线来放置中奖符号
      const winTypes = ['row', 'col', 'diagonal'];
      const winType = randBox.pickone(winTypes);

      switch (winType) {
        case 'row':
          const winRow = randBox.natural({ min: 0, max: rows - 1 });
          for (let j = 0; j < cols; j++) {
            grid[winRow][j] = winSymbol;
          }
          winningInfo = { type: 'row', index: winRow, symbol: winSymbol };
          break;

        case 'col':
          const winCol = randBox.natural({ min: 0, max: cols - 1 });
          for (let i = 0; i < rows; i++) {
            grid[i][winCol] = winSymbol;
          }
          winningInfo = { type: 'col', index: winCol, symbol: winSymbol };
          break;

        case 'diagonal':
          if (rows === cols) {
            const diagonalType = randBox.bool() ? 'main' : 'anti';
            if (diagonalType === 'main') {
              for (let i = 0; i < rows; i++) {
                grid[i][i] = winSymbol;
              }
            } else {
              for (let i = 0; i < rows; i++) {
                grid[i][cols - 1 - i] = winSymbol;
              }
            }
            winningInfo = { type: 'diagonal', diagonal: diagonalType, symbol: winSymbol };
          }
          break;
      }
    }

    return { grid, isWinner: shouldWin, winningInfo };
  }, [rows, cols, symbols, winProbability]);

  /**
   * 绘制奖品内容（底层）
   */
  const drawPrizeContent = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !cardData) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制背景
    const backgroundColor = cardData.isWinner ? '#4ecdc4' : '#e74c3c';
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, backgroundColor);
    gradient.addColorStop(1, adjustColor(backgroundColor, -20));

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制装饰图案
    drawDecorativePattern(ctx);

    // 绘制网格和符号
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const x = j * cellWidth;
        const y = i * cellHeight;

        // 绘制单元格背景
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.fillRect(x + 5, y + 5, cellWidth - 10, cellHeight - 10);

        // 绘制边框
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 2;
        ctx.strokeRect(x + 5, y + 5, cellWidth - 10, cellHeight - 10);

        // 绘制符号
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 48px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
          cardData.grid[i][j],
          x + cellWidth / 2,
          y + cellHeight / 2
        );
      }
    }

    // 如果是中奖卡片，绘制中奖提示
    if (cardData.isWinner && cardData.winningInfo) {
      highlightWinningCombination(ctx, cardData.winningInfo);
    }
  }, [cardData, rows, cols, cellWidth, cellHeight]);

  /**
   * 绘制装饰图案
   */
  const drawDecorativePattern = (ctx: CanvasRenderingContext2D) => {
    ctx.save();
    ctx.globalAlpha = 0.1;
    ctx.fillStyle = '#ffffff';

    // 绘制随机圆圈
    for (let i = 0; i < 15; i++) {
      const x = randBox.natural({ min: 0, max: canvasWidth });
      const y = randBox.natural({ min: 0, max: canvasHeight });
      const radius = randBox.natural({ min: 10, max: 30 });

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  };

  /**
   * 高亮中奖组合
   */
  const highlightWinningCombination = (ctx: CanvasRenderingContext2D, winningInfo: any) => {
    ctx.save();
    ctx.strokeStyle = '#ffff00';
    ctx.lineWidth = 6;
    ctx.shadowColor = '#ffff00';
    ctx.shadowBlur = 10;

    switch (winningInfo.type) {
      case 'row':
        const rowY = winningInfo.index * cellHeight + cellHeight / 2;
        ctx.beginPath();
        ctx.moveTo(10, rowY);
        ctx.lineTo(canvasWidth - 10, rowY);
        ctx.stroke();
        break;

      case 'col':
        const colX = winningInfo.index * cellWidth + cellWidth / 2;
        ctx.beginPath();
        ctx.moveTo(colX, 10);
        ctx.lineTo(colX, canvasHeight - 10);
        ctx.stroke();
        break;

      case 'diagonal':
        ctx.beginPath();
        if (winningInfo.diagonal === 'main') {
          ctx.moveTo(10, 10);
          ctx.lineTo(canvasWidth - 10, canvasHeight - 10);
        } else {
          ctx.moveTo(canvasWidth - 10, 10);
          ctx.lineTo(10, canvasHeight - 10);
        }
        ctx.stroke();
        break;
    }

    ctx.restore();
  };

  /**
   * 绘制涂层（覆盖层）
   */
  const drawScratchLayer = useCallback(() => {
    const canvas = overlayCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 创建银色涂层
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#c0c0c0');
    gradient.addColorStop(0.5, '#e8e8e8');
    gradient.addColorStop(1, '#a8a8a8');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 添加纹理效果
    addTextureEffect(ctx);

    // 添加文字提示
    ctx.fillStyle = '#666666';
    ctx.font = 'bold 24px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('刮开这里', canvas.width / 2, canvas.height / 2 - 40);
    ctx.fillText('发现你的奖品！', canvas.width / 2, canvas.height / 2 + 40);
  }, []);

  /**
   * 添加纹理效果
   */
  const addTextureEffect = (ctx: CanvasRenderingContext2D) => {
    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;

    // 添加线条纹理
    for (let i = 0; i < canvasWidth; i += 4) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvasHeight);
      ctx.stroke();
    }

    ctx.restore();
  };

  /**
   * 刮除功能
   */
  const scratch = useCallback((x: number, y: number) => {
    if (isRevealed) return;

    const canvas = overlayCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineWidth = 30;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (isScratching) {
      if (lastScratchPoint) {
        // 绘制连续路径，支持平滑刮除
        ctx.beginPath();
        ctx.moveTo(lastScratchPoint.x, lastScratchPoint.y);
        ctx.lineTo(x, y);
        ctx.stroke();
      } else {
        // 首次刮除，绘制圆形
        ctx.beginPath();
        ctx.arc(x, y, 15, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();

    // 更新最后刮除点
    setLastScratchPoint({ x, y });

    // 计算刮开进度
    calculateScratchProgress();
  }, [isScratching, isRevealed, lastScratchPoint]);

  /**
   * 计算刮开进度
   */
  const calculateScratchProgress = useCallback(() => {
    const canvas = overlayCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let transparentPixels = 0;
    let totalPixels = 0;

    for (let i = 3; i < imageData.data.length; i += 4) {
      totalPixels++;
      if (imageData.data[i] === 0) {
        transparentPixels++;
      }
    }

    const progress = transparentPixels / totalPixels;
    setScratchProgress(progress);

    // 自动揭晓
    if (progress >= revealThreshold && !isRevealed) {
      revealAll();
    }
  }, [isRevealed, revealThreshold]);

  /**
   * 完全揭晓
   */
  const revealAll = useCallback(() => {
    if (isRevealed || !cardData) return;

    setIsRevealed(true);
    setScratchProgress(1);
    setLastScratchPoint(null); // 重置刮除点

    // 清除涂层
    const canvas = overlayCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    const scratchResult: ScratchCardResult = {
      grid: cardData.grid,
      isWinner: cardData.isWinner,
      winningInfo: cardData.winningInfo,
      scratchProgress: 1,
    };

    setResult(scratchResult);
    onScratch?.(scratchResult);
    onGameEnd?.(scratchResult);
  }, [isRevealed, cardData, onScratch, onGameEnd]);

  /**
   * 新卡片
   */
  const generateNewCard = useCallback(() => {
    onGameStart?.();

    const newCard = generateCard();
    setCardData(newCard);
    setIsRevealed(false);
    setScratchProgress(0);
    setResult(null);
    setLastScratchPoint(null); // 重置刮除点

    // 重新绘制 - 使用 setTimeout 确保状态更新后再绘制
    setTimeout(() => {
      if (canvasRef.current && overlayCanvasRef.current) {
        drawPrizeContent();
        drawScratchLayer();
      }
    }, 0);

    onNewCard?.();
  }, [generateCard, onGameStart, onNewCard]); // 移除了绘制函数的依赖

  /**
   * 颜色调整函数
   */
  const adjustColor = (color: string, amount: number): string => {
    const usePound = color[0] === '#';
    const col = usePound ? color.slice(1) : color;
    const num = parseInt(col, 16);
    let r = (num >> 16) + amount;
    let g = (num >> 8 & 0x00FF) + amount;
    let b = (num & 0x0000FF) + amount;
    r = r > 255 ? 255 : r < 0 ? 0 : r;
    g = g > 255 ? 255 : g < 0 ? 0 : g;
    b = b > 255 ? 255 : b < 0 ? 0 : b;
    return (usePound ? '#' : '') + (r << 16 | g << 8 | b).toString(16).padStart(6, '0');
  };

  /**
   * 获取鼠标/触摸位置
   * 使用 pageX/pageY 而不是 clientX/clientY，以支持页面滚动
   */
  const getPointerPosition = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = overlayCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ('touches' in e) {
      // 使用 changedTouches 获取最后一个触摸点（与 Vue 代码一致）
      const touch = e.changedTouches[e.changedTouches.length - 1];
      return {
        x: (touch.pageX - rect.left) * scaleX,
        y: (touch.pageY - rect.top) * scaleY,
      };
    } else {
      // 使用 pageX/pageY 获取相对于整个渲染页面的坐标
      return {
        x: (e.pageX - rect.left) * scaleX,
        y: (e.pageY - rect.top) * scaleY,
      };
    }
  };

  // 初始化 - 只在组件挂载时执行一次
  useEffect(() => {
    const initCard = generateCard();
    setCardData(initCard);
    onGameStart?.();
  }, []); // 空依赖数组，只在挂载时执行一次

  // 重新绘制内容
  useEffect(() => {
    if (cardData) {
      drawPrizeContent();
    }
  }, [cardData, drawPrizeContent]);

  return (
    <div
      className={`canvas-scratch-card ${className}`}
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
          position: 'relative',
          borderRadius: '15px',
          overflow: 'hidden',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
        }}
      >
        {/* 底层Canvas - 显示奖品内容 */}
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          style={{
            display: 'block',
            maxWidth: '100%',
            height: 'auto',
          }}
        />

        {/* 覆盖层Canvas - 可刮除的涂层 */}
        <canvas
          ref={overlayCanvasRef}
          width={canvasWidth}
          height={canvasHeight}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            cursor: isRevealed ? 'default' : 'pointer',
            maxWidth: '100%',
            height: 'auto',
          }}
          onMouseDown={(e) => {
            if (!isRevealed && !disabled) {
              setIsScratching(true);
              setLastScratchPoint(null); // 重置刮除点，支持新路径
              const pos = getPointerPosition(e);
              scratch(pos.x, pos.y);
            }
          }}
          onMouseMove={(e) => {
            if (isScratching && !isRevealed && !disabled) {
              const pos = getPointerPosition(e);
              scratch(pos.x, pos.y);
            }
          }}
          onMouseUp={() => {
            setIsScratching(false);
            setLastScratchPoint(null); // 结束刮除时重置
          }}
          onMouseLeave={() => {
            setIsScratching(false);
            setLastScratchPoint(null); // 结束刮除时重置
          }}
          onTouchStart={(e) => {
            e.preventDefault();
            if (!isRevealed && !disabled) {
              setIsScratching(true);
              setLastScratchPoint(null); // 重置刮除点，支持新路径
              const pos = getPointerPosition(e);
              scratch(pos.x, pos.y);
            }
          }}
          onTouchMove={(e) => {
            e.preventDefault();
            if (isScratching && !isRevealed && !disabled) {
              const pos = getPointerPosition(e);
              scratch(pos.x, pos.y);
            }
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            setIsScratching(false);
            setLastScratchPoint(null); // 结束刮除时重置
          }}
        />
      </div>

      {/* 进度条 */}
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div
          style={{
            width: '100%',
            height: '10px',
            background: '#e9ecef',
            borderRadius: '5px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              width: `${scratchProgress * 100}%`,
              transition: 'width 0.3s ease',
            }}
          />
        </div>
        <div style={{ textAlign: 'center', marginTop: '5px', color: '#666' }}>
          刮开进度：{Math.round(scratchProgress * 100)}%
        </div>
      </div>

      {/* 控制按钮 */}
      <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={generateNewCard}
          disabled={disabled}
          style={{
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            color: 'white',
            border: 'none',
            padding: '15px 30px',
            borderRadius: '25px',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            cursor: disabled ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            opacity: disabled ? 0.6 : 1,
          }}
        >
          新刮刮卡
        </button>

        <button
          onClick={revealAll}
          disabled={disabled || isRevealed}
          style={{
            background: 'linear-gradient(45deg, #e74c3c, #c0392b)',
            color: 'white',
            border: 'none',
            padding: '15px 30px',
            borderRadius: '25px',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            cursor: disabled || isRevealed ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            opacity: disabled || isRevealed ? 0.6 : 1,
          }}
        >
          直接揭晓
        </button>
      </div>

      {/* 结果显示 */}
      {result && isRevealed && (
        <div
          style={{
            background: result.isWinner
              ? 'linear-gradient(135deg, #27ae60, #2ecc71)'
              : 'linear-gradient(135deg, #e74c3c, #c0392b)',
            color: 'white',
            padding: '20px',
            borderRadius: '15px',
            fontSize: '1.2rem',
            textAlign: 'center',
            boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
          }}
        >
          <div style={{ fontSize: '1.5rem', marginBottom: '10px' }}>
            {result.isWinner ? '🎉 恭喜中奖！' : '😅 再接再厉！'}
          </div>
          {result.isWinner && result.winningInfo && (
            <div>
              中奖符号：{result.winningInfo.symbol} <br />
              中奖方式：{
                result.winningInfo.type === 'row' ? '横排' :
                result.winningInfo.type === 'col' ? '竖排' : '对角线'
              }
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ScratchCard;