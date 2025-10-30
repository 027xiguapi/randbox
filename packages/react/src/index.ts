// 核心游戏组件导出
export { default as GridLottery } from './components/GridLottery';
export { default as SlotMachine } from './components/SlotMachine';
export { default as ScratchCard } from './components/ScratchCard';
export { default as DiceGame } from './components/DiceGame';
export { default as RockPaperScissors } from './components/RockPaperScissors';
export { default as CoinFlip } from './components/CoinFlip';
export { default as LuckyWheel } from './components/LuckyWheel';

// 类型导出
export type {
  // 基础类型
  BaseGameProps,
  AnimationState,
  GameState,
  GameTheme,
  GameConfigContextType,
  StyleConfig,

  // 九宫格抽奖类型
  GridLotteryProps,
  GridLotteryResult,

  // 滚动抽奖类型
  SlotMachineProps,
  SlotMachineResult,

  // 刮刮卡类型
  ScratchCardProps,
  ScratchCardResult,

  // 石头剪刀布类型
  RockPaperScissorsProps,
  RPSResult,
  RPSStats,

  // 骰子游戏类型
  DiceGameProps,
  DiceGameResult,

  // 抛硬币类型
  CoinFlipProps,
  CoinFlipResult,
  CoinFlipStats,

  // 幸运大转盘类型
  LuckyWheelProps,
  LuckyWheelResult,
  LuckyWheelStats,
} from './types';

// 注意：所有组件都基于Canvas渲染，无需外部CSS
