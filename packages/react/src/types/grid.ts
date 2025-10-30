import {
  FontItemType,
  ImgItemType,
  BorderRadiusType,
  BackgroundType,
  ShadowType,
  FontExtendType
} from './index'

export type PrizeFontType = FontItemType & FontExtendType

export type ButtonFontType = FontItemType & FontExtendType

export type CellFontType = PrizeFontType | ButtonFontType

export type BlockImgType = ImgItemType & {}

export type PrizeImgType = ImgItemType & {
  activeSrc?: string
}

export type ButtonImgType = ImgItemType & {}

export type CellImgType = PrizeImgType | ButtonImgType

export type BlockType = {
  borderRadius?: BorderRadiusType
  background?: BackgroundType
  padding?: string
  paddingTop?: string | number
  paddingRight?: string | number
  paddingBottom?: string | number
  paddingLeft?: string | number
  imgs?: Array<BlockImgType>
}

export type CellType<T, U> = {
  x: number
  y: number
  col?: number
  row?: number
  borderRadius?: BorderRadiusType
  background?: BackgroundType
  shadow?: ShadowType
  fonts?: Array<T>
  imgs?: Array<U>
}

export type PrizeType = CellType<PrizeFontType, PrizeImgType> & {
  range?: number
  disabled?: boolean
}

export type ButtonType = CellType<ButtonFontType, ButtonImgType> & {
  callback?: Function
}

export type DefaultConfigType = {
  gutter?: number
  speed?: number
  accelerationTime?: number
  decelerationTime?: number
}

export type DefaultStyleType = {
  borderRadius?: BorderRadiusType
  background?: BackgroundType
  shadow?: ShadowType
  fontColor?: PrizeFontType['fontColor']
  fontSize?: PrizeFontType['fontSize']
  fontStyle?: PrizeFontType['fontStyle']
  fontWeight?: PrizeFontType['fontWeight']
  lineHeight?: PrizeFontType['lineHeight']
  wordWrap?: PrizeFontType['wordWrap']
  lengthLimit?: PrizeFontType['lengthLimit']
  lineClamp?: PrizeFontType['lineClamp']
}

export type ActiveStyleType = {
  background?: BackgroundType
  shadow?: ShadowType
  fontColor?: PrizeFontType['fontColor']
  fontSize?: PrizeFontType['fontSize']
  fontStyle?: PrizeFontType['fontStyle']
  fontWeight?: PrizeFontType['fontWeight']
  lineHeight?: PrizeFontType['lineHeight']
}

export type RowsType = number
export type ColsType = number
export type StartCallbackType = (e: MouseEvent, button?: ButtonType) => void
export type EndCallbackType = (prize: object) => void

export default interface LuckyGridConfig {
  width: string | number
  height: string | number
  rows?: RowsType
  cols?: ColsType
  blocks?: Array<BlockType>
  prizes?: Array<PrizeType>
  buttons?: Array<ButtonType>
  button?: ButtonType
  defaultConfig?: DefaultConfigType
  defaultStyle?: DefaultStyleType
  activeStyle?: ActiveStyleType
  start?: StartCallbackType
  end?: EndCallbackType
}

/**
 * React 组件专用类型定义
 */

/**
 * 九宫格抽奖属性接口
 */
export interface GridLotteryProps {
  /** 奖品列表 */
  prizes: string[];

  /** 奖品权重（可选） */
  weights?: number[];

  /** 网格大小，默认 9 */
  gridSize?: number;

  /** 动画持续时间（毫秒），默认 3000 */
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
  onGameEnd?: (result: GridLotteryResult) => void;

  /** 结果回调 */
  onResult?: (result: GridLotteryResult) => void;
}

/**
 * 九宫格抽奖结果接口
 */
export interface GridLotteryResult {
  /** 中奖位置（0-8） */
  position: number;

  /** 中奖奖品 */
  prize: string;

  /** 动画路径 */
  animation: number[];
}
