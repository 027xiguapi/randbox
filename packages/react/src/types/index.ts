import { ReactNode } from 'react';

// 通用类型定义
export interface BaseGameProps {
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  onGameStart?: () => void;
  onGameEnd?: (result: any) => void;
}

// 九宫格抽奖相关类型
export interface GridLotteryProps extends BaseGameProps {
  prizes: string[];
  weights?: number[];
  gridSize?: number;
  animationDuration?: number;
  buttonText?: string;
  onResult?: (result: GridLotteryResult) => void;
}

export interface GridLotteryResult {
  position: number;
  prize: string;
  animation: number[];
}

// 滚动抽奖相关类型
export interface SlotMachineProps extends BaseGameProps {
  reels: string[][];
  weights?: number[][];
  animationDuration?: number;
  buttonText?: string;
  onResult?: (result: SlotMachineResult) => void;
}

export interface SlotMachineResult {
  results: string[];
  isJackpot: boolean;
  combination: string;
}

// 刮刮卡相关类型
export interface ScratchCardProps extends BaseGameProps {
  rows?: number;
  cols?: number;
  symbols?: string[];
  winProbability?: number;
  onScratch?: (result: ScratchCardResult) => void;
  onNewCard?: () => void;
}

export interface ScratchCardResult {
  grid: string[][];
  isWinner: boolean;
  scratchProgress?: number;
  winningInfo?: {
    pattern: string[];
    name: string;
    prize: string;
    symbol?: string;
    type?: 'row' | 'col' | 'diagonal';
    positions: Array<{ row: number; col: number }>;
  };
}

// 石头剪刀布相关类型
export interface RockPaperScissorsProps extends BaseGameProps {
  choices?: string[];
  emojis?: Record<string, string>;
  showStats?: boolean;
  strategy?: 'random' | 'counter' | 'pattern';
  onResult?: (result: RPSResult) => void;
}

export interface RPSResult {
  playerChoice: string;
  computerChoice: string;
  result: 'win' | 'lose' | 'tie';
  message: string;
  emoji: { player: string; computer: string };
  round: number;
}

export interface RPSStats {
  totalGames: number;
  wins: number;
  losses: number;
  ties: number;
  winRate: string;
}

// 骰子游戏相关类型
export interface DiceGameProps extends BaseGameProps {
  diceCount?: number;
  sides?: number;
  gameMode?: 'simple' | 'sum' | 'bigSmall' | 'guess' | 'even_odd' | 'specific';
  targetSum?: number;
  onResult?: (result: DiceGameResult) => void;
}

export interface DiceGameResult {
  results: number[];
  total: number;
  gameMode: string;
  isWin?: boolean;
  message: string;
  values: number[];
  sum: number;
  description: string;
}

// 动画相关类型
export interface AnimationState {
  isAnimating: boolean;
  currentStep: number;
  totalSteps: number;
}

// 游戏状态类型
export interface GameState {
  isPlaying: boolean;
  result?: any;
  history: any[];
}

// 主题相关类型
export interface GameTheme {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  borderRadius: string;
  fontFamily: string;
}

export interface GameConfigContextType {
  theme: GameTheme;
  locale: 'zh-CN' | 'en-US';
  soundEnabled: boolean;
  animationEnabled: boolean;
}

// 样式相关类型
export interface StyleConfig {
  containerClass?: string;
  buttonClass?: string;
  resultClass?: string;
  animationClass?: string;
}