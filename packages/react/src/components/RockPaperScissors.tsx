import React, { useRef, useEffect, useState, useCallback } from 'react';
import { RockPaperScissorsProps, RPSResult, RPSStats } from '../types';
import { RandBox } from 'randbox';

/**
 * Canvas版石头剪刀布游戏组件
 * 基于Canvas的石头剪刀布游戏实现，支持多种策略和统计功能
 */
export const RockPaperScissors: React.FC<RockPaperScissorsProps> = ({
  choices = ['rock', 'paper', 'scissors'],
  emojis = {
    rock: '🪨',
    paper: '📄',
    scissors: '✂️'
  },
  showStats = true,
  strategy = 'random',
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

  const [isPlaying, setIsPlaying] = useState(false);
  const [result, setResult] = useState<RPSResult | null>(null);
  const [stats, setStats] = useState<RPSStats>({
    totalGames: 0,
    wins: 0,
    losses: 0,
    ties: 0,
    winRate: '0%'
  });
  const [animationProgress, setAnimationProgress] = useState(0);
  const [playerChoice, setPlayerChoice] = useState<string | null>(null);
  const [computerChoice, setComputerChoice] = useState<string | null>(null);

  // Canvas配置
  const canvasWidth = 600;
  const canvasHeight = 400;

  /**
   * 计算获胜者
   */
  const determineWinner = (player: string, computer: string): 'win' | 'lose' | 'tie' => {
    if (player === computer) return 'tie';

    const winConditions: Record<string, string> = {
      rock: 'scissors',
      paper: 'rock',
      scissors: 'paper'
    };

    return winConditions[player] === computer ? 'win' : 'lose';
  };

  /**
   * 根据策略生成电脑选择
   */
  const generateComputerChoice = useCallback((playerChoice: string, gameHistory: RPSResult[]): string => {
    switch (strategy) {
      case 'counter':
        // 反制策略：选择能击败玩家上一次选择的选项
        const counterChoices: Record<string, string> = {
          rock: 'paper',
          paper: 'scissors',
          scissors: 'rock'
        };
        return counterChoices[playerChoice] || randBox.pickone(choices);

      case 'pattern':
        // 模式识别策略：分析玩家的选择模式
        if (gameHistory.length >= 2) {
          const lastTwo = gameHistory.slice(-2).map(r => r.playerChoice);
          if (lastTwo[0] === lastTwo[1]) {
            // 如果玩家连续选择相同，预测继续
            const counterChoices: Record<string, string> = {
              rock: 'paper',
              paper: 'scissors',
              scissors: 'rock'
            };
            return counterChoices[lastTwo[1]] || randBox.pickone(choices);
          }
        }
        return randBox.pickone(choices);

      default:
        return randBox.pickone(choices);
    }
  }, [strategy, choices]);

  /**
   * 绘制Canvas内容
   */
  const drawCanvas = useCallback((playerChoice?: string, computerChoice?: string, animProgress: number = 0) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 清空画布
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制标题
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('石头剪刀布', canvas.width / 2, 50);

    // 绘制VS
    ctx.font = 'bold 24px Arial, sans-serif';
    ctx.fillStyle = '#f1c40f';
    ctx.fillText('VS', canvas.width / 2, canvas.height / 2);

    // 玩家区域
    drawPlayerArea(ctx, '玩家', playerChoice || null, 150, animProgress);

    // 电脑区域
    drawPlayerArea(ctx, '电脑', computerChoice || null, canvas.width - 150, animProgress);

    // 如果正在动画中，绘制倒计时
    if (isPlaying && animProgress < 1) {
      drawCountdown(ctx, animProgress);
    }
  }, [isPlaying]);

  /**
   * 绘制玩家/电脑区域
   */
  const drawPlayerArea = (
    ctx: CanvasRenderingContext2D,
    label: string,
    choice: string | null,
    centerX: number,
    animProgress: number
  ) => {
    // 绘制标签
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(label, centerX, 100);

    // 绘制选择圆圈
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(centerX, 200, 80, 0, Math.PI * 2);
    ctx.stroke();

    if (choice && animProgress >= 1) {
      // 显示最终选择
      ctx.font = 'bold 64px Arial, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(emojis[choice] || choice, centerX, 220);
    } else if (isPlaying && animProgress < 1) {
      // 动画中显示随机符号
      const randomChoice = randBox.pickone(choices);
      ctx.font = 'bold 48px Arial, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.globalAlpha = 0.7;
      ctx.fillText(emojis[randomChoice] || randomChoice, centerX, 220);
      ctx.globalAlpha = 1;
    } else if (choice) {
      // 静态显示选择
      ctx.font = 'bold 64px Arial, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(emojis[choice] || choice, centerX, 220);
    }
  };

  /**
   * 绘制倒计时
   */
  const drawCountdown = (ctx: CanvasRenderingContext2D, progress: number) => {
    const countdown = Math.ceil((1 - progress) * 3);
    if (countdown > 0) {
      ctx.save();
      ctx.fillStyle = '#e74c3c';
      ctx.font = 'bold 48px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(countdown.toString(), canvasWidth / 2, canvasHeight - 100);
      ctx.restore();
    }
  };

  /**
   * 开始游戏
   */
  const playGame = useCallback((playerChoice: string) => {
    if (isPlaying || disabled) return;

    onGameStart?.();
    setIsPlaying(true);
    setPlayerChoice(playerChoice);
    setAnimationProgress(0);
    setResult(null);

    // 生成电脑选择
    const gameHistory: RPSResult[] = []; // 在实际应用中，这应该从state或props获取
    const computerChoice = generateComputerChoice(playerChoice, gameHistory);
    setComputerChoice(computerChoice);

    // 开始动画
    const animationDuration = 2000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);
      setAnimationProgress(progress);

      if (progress >= 1) {
        // 动画结束，计算结果
        const gameResult = determineWinner(playerChoice, computerChoice);
        const messages = {
          win: '🎉 你赢了！',
          lose: '😅 你输了！',
          tie: '🤝 平局！'
        };

        const result: RPSResult = {
          playerChoice,
          computerChoice,
          result: gameResult,
          message: messages[gameResult],
          emoji: {
            player: emojis[playerChoice] || playerChoice,
            computer: emojis[computerChoice] || computerChoice
          },
          round: stats.totalGames + 1
        };

        // 更新统计
        const newStats = {
          totalGames: stats.totalGames + 1,
          wins: stats.wins + (gameResult === 'win' ? 1 : 0),
          losses: stats.losses + (gameResult === 'lose' ? 1 : 0),
          ties: stats.ties + (gameResult === 'tie' ? 1 : 0),
          winRate: '0%'
        };
        newStats.winRate = newStats.totalGames > 0
          ? Math.round((newStats.wins / newStats.totalGames) * 100) + '%'
          : '0%';

        setStats(newStats);
        setResult(result);
        setIsPlaying(false);

        onResult?.(result);
        onGameEnd?.(result);
        return;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
  }, [isPlaying, disabled, stats, generateComputerChoice, emojis, onGameStart, onResult, onGameEnd]);

  /**
   * 重置游戏
   */
  const resetGame = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    setIsPlaying(false);
    setResult(null);
    setPlayerChoice(null);
    setComputerChoice(null);
    setAnimationProgress(0);
    setStats({
      totalGames: 0,
      wins: 0,
      losses: 0,
      ties: 0,
      winRate: '0%'
    });
  }, []);

  // 绘制Canvas
  useEffect(() => {
    drawCanvas(playerChoice || undefined, computerChoice || undefined, animationProgress);
  }, [drawCanvas, playerChoice, computerChoice, animationProgress]);

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
      className={`canvas-rps-game ${className}`}
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
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            display: 'block',
            maxWidth: '100%',
            height: 'auto',
          }}
        />
      </div>

      {/* 选择按钮 */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {choices.map((choice) => (
          <button
            key={choice}
            onClick={() => playGame(choice)}
            disabled={disabled || isPlaying}
            style={{
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              color: 'white',
              border: 'none',
              padding: '15px 25px',
              borderRadius: '15px',
              fontSize: '2rem',
              cursor: disabled || isPlaying ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              opacity: disabled || isPlaying ? 0.6 : 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <span>{emojis[choice] || choice}</span>
            <span style={{ fontSize: '0.8rem', textTransform: 'capitalize' }}>
              {choice}
            </span>
          </button>
        ))}
      </div>

      {/* 重置按钮 */}
      <button
        onClick={resetGame}
        disabled={isPlaying}
        style={{
          background: 'linear-gradient(45deg, #95a5a6, #7f8c8d)',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '20px',
          fontSize: '1rem',
          fontWeight: 'bold',
          cursor: isPlaying ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s ease',
          opacity: isPlaying ? 0.6 : 1,
        }}
      >
        重置统计
      </button>

      {/* 统计信息 */}
      {showStats && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
            gap: '15px',
            width: '100%',
            maxWidth: '600px',
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
              {stats.totalGames}
            </div>
            <div style={{ color: '#666', marginTop: '5px' }}>总局数</div>
          </div>

          <div
            style={{
              background: 'rgba(39, 174, 96, 0.1)',
              padding: '15px',
              borderRadius: '10px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#27ae60' }}>
              {stats.wins}
            </div>
            <div style={{ color: '#666', marginTop: '5px' }}>胜利</div>
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
              {stats.losses}
            </div>
            <div style={{ color: '#666', marginTop: '5px' }}>失败</div>
          </div>

          <div
            style={{
              background: 'rgba(241, 196, 15, 0.1)',
              padding: '15px',
              borderRadius: '10px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f1c40f' }}>
              {stats.ties}
            </div>
            <div style={{ color: '#666', marginTop: '5px' }}>平局</div>
          </div>

          <div
            style={{
              background: 'rgba(155, 89, 182, 0.1)',
              padding: '15px',
              borderRadius: '10px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#9b59b6' }}>
              {stats.winRate}
            </div>
            <div style={{ color: '#666', marginTop: '5px' }}>胜率</div>
          </div>
        </div>
      )}

      {/* 结果显示 */}
      {result && (
        <div
          style={{
            background: result.result === 'win'
              ? 'linear-gradient(135deg, #27ae60, #2ecc71)'
              : result.result === 'lose'
              ? 'linear-gradient(135deg, #e74c3c, #c0392b)'
              : 'linear-gradient(135deg, #f39c12, #e67e22)',
            color: 'white',
            padding: '20px',
            borderRadius: '15px',
            fontSize: '1.2rem',
            textAlign: 'center',
            boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
          }}
        >
          <div style={{ fontSize: '1.5rem', marginBottom: '10px' }}>
            {result.message}
          </div>
          <div>
            你: {result.emoji.player} vs 电脑: {result.emoji.computer}
          </div>
          <div style={{ marginTop: '5px', fontSize: '1rem' }}>
            第 {result.round} 局
          </div>
        </div>
      )}
    </div>
  );
};

export default RockPaperScissors;