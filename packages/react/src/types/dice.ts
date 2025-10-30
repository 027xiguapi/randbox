/**
 * 骰子游戏类型定义
 * DiceGame 组件相关的 TypeScript 类型
 */

/**
 * 骰子游戏模式
 * - simple: 简单模式，仅显示骰子结果
 * - sum: 总和模式，显示所有骰子点数之和
 * - bigSmall: 大小模式，猜大小
 * - guess: 猜点模式，猜测具体点数
 * - even_odd: 单双模式，猜单数或双数
 * - specific: 特定点模式，猜测是否有特定点数
 */
export type DiceGameMode = 'simple' | 'sum' | 'bigSmall' | 'guess' | 'even_odd' | 'specific';

/**
 * 骰子游戏属性接口
 */
export interface DiceGameProps {
  /** 骰子数量，默认 1 */
  diceCount?: number;

  /** 骰子面数，默认 6（可以是 4, 6, 8, 10, 12, 20 等） */
  sides?: number;

  /** 游戏模式，默认 'simple' */
  gameMode?: DiceGameMode;

  /** 目标总和（在 sum 模式下使用） */
  targetSum?: number;

  /** 组件类名 */
  className?: string;

  /** 自定义样式 */
  style?: React.CSSProperties;

  /** 是否禁用，默认 false */
  disabled?: boolean;

  /** 游戏开始回调 */
  onGameStart?: () => void;

  /** 游戏结束回调 */
  onGameEnd?: (result: DiceGameResult) => void;

  /** 结果回调 */
  onResult?: (result: DiceGameResult) => void;
}

/**
 * 骰子游戏结果接口
 */
export interface DiceGameResult {
  /** 所有骰子的结果数组 */
  results: number[];

  /** 骰子点数总和 */
  total: number;

  /** 游戏模式 */
  gameMode: string;

  /** 是否获胜（在对战模式下） */
  isWin?: boolean;

  /** 结果描述信息 */
  message: string;

  /** 所有骰子的值（与 results 相同） */
  values: number[];

  /** 总和（与 total 相同） */
  sum: number;

  /** 详细描述 */
  description: string;
}
