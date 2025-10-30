import {
  FontItemType,
  ImgItemType,
  BackgroundType,
  FontExtendType
} from './index'

export type PrizeFontType = FontItemType & FontExtendType

export type ButtonFontType = FontItemType & {}

export type BlockImgType = ImgItemType & {
  rotate?: boolean
}

export type PrizeImgType = ImgItemType & {}

export type ButtonImgType = ImgItemType & {}

export type BlockType = {
  padding?: string
  background?: BackgroundType
  imgs?: Array<BlockImgType>
}

export type PrizeType = {
  range?: number
  background?: BackgroundType
  fonts?: Array<PrizeFontType>
  imgs?: Array<PrizeImgType>
}

export type ButtonType = {
  radius?: string
  pointer?: boolean
  background?: BackgroundType
  fonts?: Array<ButtonFontType>
  imgs?: Array<ButtonImgType>
}

export type DefaultConfigType = {
  gutter?: string | number
  offsetDegree?: number
  speed?: number
  speedFunction?: string
  accelerationTime?: number
  decelerationTime?: number
  stopRange?: number
}

export type DefaultStyleType = {
  background?: BackgroundType
  fontColor?: PrizeFontType['fontColor']
  fontSize?: PrizeFontType['fontSize']
  fontStyle?: PrizeFontType['fontStyle']
  fontWeight?: PrizeFontType['fontWeight']
  lineHeight?: PrizeFontType['lineHeight']
  wordWrap?: PrizeFontType['wordWrap']
  lengthLimit?: PrizeFontType['lengthLimit']
  lineClamp?: PrizeFontType['lineClamp']
}

export type StartCallbackType = (e: MouseEvent) => void
export type EndCallbackType = (prize: object) => void

export default interface LuckyWheelConfig {
  width: string | number
  height: string | number
  blocks?: Array<BlockType>
  prizes?: Array<PrizeType>
  buttons?: Array<ButtonType>
  defaultConfig?: DefaultConfigType
  defaultStyle?: DefaultStyleType
  start?: StartCallbackType
  end?: EndCallbackType
}

/**
 * React 组件专用类型定义
 */

/**
 * 幸运大转盘属性接口
 */
export interface LuckyWheelProps {
  /** 奖品列表 */
  prizes: string[];

  /** 奖品权重（可选） */
  weights?: number[];

  /** 自定义颜色数组（可选） */
  colors?: string[];

  /** 动画持续时间（毫秒），默认 4000 */
  animationDuration?: number;

  /** 按钮文字，默认"开始抽奖" */
  buttonText?: string;

  /** 组件类名 */
  className?: string;

  /** 自定义样式 */
  style?: React.CSSProperties;

  /** 是否禁用，默认 false */
  disabled?: boolean;

  /** 游戏开始回调 */
  onGameStart?: () => void;

  /** 游戏结束回调 */
  onGameEnd?: (result: LuckyWheelResult) => void;

  /** 结果回调 */
  onResult?: (result: LuckyWheelResult) => void;
}

/**
 * 幸运大转盘结果接口
 */
export interface LuckyWheelResult {
  /** 中奖奖品索引 */
  prizeIndex: number;

  /** 中奖奖品 */
  prize: string;

  /** 最终旋转角度 */
  angle: number;

  /** 回合数 */
  round: number;
}

/**
 * 幸运大转盘统计接口
 */
export interface LuckyWheelStats {
  /** 总抽奖次数 */
  totalSpins: number;

  /** 奖品历史记录 */
  prizeHistory: Record<string, number>;
}
