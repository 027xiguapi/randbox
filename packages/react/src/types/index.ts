// 字体类型
export type FontItemType = {
  text: string
  top?: string | number
  left?: string | number
  fontColor?: string
  fontSize?: string
  fontStyle?: string
  fontWeight?: string
  lineHeight?: string
}

export type FontExtendType = {
  wordWrap?: boolean
  lengthLimit?: string | number
  lineClamp?: number
}

export type ImgType = HTMLImageElement | HTMLCanvasElement

// 图片类型
export type ImgItemType = {
  src: string
  top?: string | number
  left?: string | number
  width?: string
  height?: string
  formatter?: (img: ImgType) => ImgType
  $resolve?: Function
  $reject?: Function
}

export type BorderRadiusType = string | number
export type BackgroundType = string
export type ShadowType = string

export type ConfigType = {
  // 临时处理元素类型, 当版本升到4.x之后就可以删掉了
  nodeType?: number
  // 配置
  flag: 'WEB' | 'MP-WX' | 'UNI-H5' | 'UNI-MP' | 'TARO-H5' | 'TARO-MP'
  el?: string
  divElement?: HTMLDivElement
  canvasElement?: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  dpr: number
  handleCssUnit?: (num: number, unit: string) => number
  // 覆盖方法
  rAF?: Function
  setTimeout: Function
  setInterval: Function
  clearTimeout: Function
  clearInterval: Function
  // 组件生命周期
  beforeCreate?: Function
  beforeResize?: Function
  afterResize?: Function
  beforeInit?: Function
  afterInit?: Function
  beforeDraw?: Function
  afterDraw?: Function
  afterStart?: Function
}

export type UserConfigType = Partial<ConfigType>

export type UniImageType = {
  path: string
  width: number
  height: number
}

export type Tuple<T, Len extends number, Res extends T[] = []> = Res['length'] extends Len ? Res : Tuple<T, Len, [...Res, T]>

/**
 * React 组件通用类型定义
 */

/**
 * 基础游戏组件属性
 */
export interface BaseGameProps {
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  onGameStart?: () => void;
  onGameEnd?: (result: any) => void;
}

/**
 * 动画状态接口
 */
export interface AnimationState {
  isAnimating: boolean;
  currentStep: number;
  totalSteps: number;
}

/**
 * 游戏状态接口
 */
export interface GameState {
  isPlaying: boolean;
  result?: any;
  history: any[];
}

/**
 * 游戏主题配置接口
 */
export interface GameTheme {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  borderRadius: string;
  fontFamily: string;
}

/**
 * 游戏配置上下文类型
 */
export interface GameConfigContextType {
  theme: GameTheme;
  locale: 'zh-CN' | 'en-US';
  soundEnabled: boolean;
  animationEnabled: boolean;
}

/**
 * 样式配置接口
 */
export interface StyleConfig {
  containerClass?: string;
  buttonClass?: string;
  resultClass?: string;
  animationClass?: string;
}

// 从各个模块选择性导出 React 组件需要的类型
// GridLottery 相关类型
export type { GridLotteryProps, GridLotteryResult } from './grid';

// SlotMachine 相关类型
export type { SlotMachineProps, SlotMachineResult } from './slot';

// LuckyWheel 相关类型
export type { LuckyWheelProps, LuckyWheelResult, LuckyWheelStats } from './wheel';

// DiceGame 相关类型
export type { DiceGameProps, DiceGameResult, DiceGameMode } from './dice';

// ScratchCard 相关类型
export type { ScratchCardProps, ScratchCardResult } from './scratch';

// RockPaperScissors 相关类型
export type { RockPaperScissorsProps, RPSResult, RPSStats, RPSStrategy, RPSResultType } from './rps';

// CoinFlip 相关类型
export type { CoinFlipProps, CoinFlipResult, CoinFlipStats, CoinSide } from './coin';
