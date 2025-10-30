/**
 * 刮刮卡类型定义
 * ScratchCard 组件相关的 TypeScript 类型
 */

/**
 * 刮刮卡属性接口
 */
export interface ScratchCardProps {
  /** 行数，默认 3 */
  rows?: number;

  /** 列数，默认 3 */
  cols?: number;

  /** 符号数组，用于填充卡片 */
  symbols?: string[];

  /** 中奖概率，0-1 之间，默认 0.3 */
  winProbability?: number;

  /** Canvas 宽度，默认 300 */
  width?: number;

  /** Canvas 高度，默认 200 */
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
  onGameEnd?: (result: ScratchCardResult) => void;

  /** 刮开回调（每次刮开时触发） */
  onScratch?: (result: ScratchCardResult) => void;

  /** 新卡片回调 */
  onNewCard?: () => void;
}

/**
 * 刮刮卡结果接口
 */
export interface ScratchCardResult {
  /** 卡片网格内容 */
  grid: string[][];

  /** 是否中奖 */
  isWinner: boolean;

  /** 刮开进度（0-1） */
  scratchProgress?: number;

  /** 中奖信息 */
  winningInfo?: {
    /** 中奖模式（连线类型） */
    pattern: string[];

    /** 中奖名称 */
    name: string;

    /** 奖品名称 */
    prize: string;

    /** 中奖符号 */
    symbol?: string;

    /** 中奖类型：行/列/对角线 */
    type?: 'row' | 'col' | 'diagonal';

    /** 中奖位置数组 */
    positions: Array<{
      row: number;
      col: number;
    }>;
  };
}
