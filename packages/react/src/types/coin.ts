/**
 * 抛硬币类型定义
 * CoinFlip 组件相关的 TypeScript 类型
 */

/**
 * 硬币结果类型
 */
export type CoinSide = 'heads' | 'tails';

/**
 * 抛硬币属性接口
 */
export interface CoinFlipProps {
  /** 动画持续时间（毫秒），默认 2000 */
  animationDuration?: number;

  /** 是否显示统计信息，默认 true */
  showStats?: boolean;

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
  onGameEnd?: (result: CoinFlipResult) => void;

  /** 结果回调 */
  onResult?: (result: CoinFlipResult) => void;
}

/**
 * 抛硬币结果接口
 */
export interface CoinFlipResult {
  /** 硬币结果：正面或反面 */
  result: CoinSide;

  /** 回合数 */
  round: number;

  /** 时间戳 */
  timestamp: number;
}

/**
 * 抛硬币统计接口
 */
export interface CoinFlipStats {
  /** 总抛掷次数 */
  totalFlips: number;

  /** 正面次数 */
  heads: number;

  /** 反面次数 */
  tails: number;

  /** 正面概率（百分比字符串） */
  headsRate: string;

  /** 反面概率（百分比字符串） */
  tailsRate: string;
}
