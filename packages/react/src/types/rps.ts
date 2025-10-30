/**
 * 石头剪刀布类型定义
 * RockPaperScissors 组件相关的 TypeScript 类型
 */

/**
 * 游戏策略类型
 * - random: 随机策略
 * - counter: 反制策略（针对玩家上次的选择）
 * - pattern: 模式策略（跟随或打破玩家的模式）
 */
export type RPSStrategy = 'random' | 'counter' | 'pattern';

/**
 * 游戏结果类型
 */
export type RPSResultType = 'win' | 'lose' | 'tie';

/**
 * 石头剪刀布属性接口
 */
export interface RockPaperScissorsProps {
  /** 可选择的选项，默认 ['rock', 'paper', 'scissors'] */
  choices?: string[];

  /** 选项对应的 emoji 图标 */
  emojis?: Record<string, string>;

  /** 是否显示统计信息，默认 true */
  showStats?: boolean;

  /** AI 策略，默认 'random' */
  strategy?: RPSStrategy;

  /** Canvas 宽度 */
  width?: number;

  /** Canvas 高度 */
  height?: number;

  /** 组件类名 */
  className?: string;

  /** 自定义样式 */
  style?: React.CSSProperties;

  /** 是否禁用，默认 false */
  disabled?: boolean;

  /** 游戏开始回调 */
  onGameStart?: () => void;

  /** 游戏结束回调 */
  onGameEnd?: (result: RPSResult) => void;

  /** 结果回调 */
  onResult?: (result: RPSResult) => void;
}

/**
 * 游戏结果接口
 */
export interface RPSResult {
  /** 玩家的选择 */
  playerChoice: string;

  /** 电脑的选择 */
  computerChoice: string;

  /** 游戏结果 */
  result: RPSResultType;

  /** 结果描述信息 */
  message: string;

  /** emoji 图标 */
  emoji: {
    /** 玩家的 emoji */
    player: string;
    /** 电脑的 emoji */
    computer: string;
  };

  /** 回合数 */
  round: number;
}

/**
 * 游戏统计接口
 */
export interface RPSStats {
  /** 总游戏次数 */
  totalGames: number;

  /** 获胜次数 */
  wins: number;

  /** 失败次数 */
  losses: number;

  /** 平局次数 */
  ties: number;

  /** 胜率（百分比字符串） */
  winRate: string;
}
