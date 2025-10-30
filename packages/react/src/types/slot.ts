import {
  FontItemType,
  ImgItemType,
  BorderRadiusType,
  BackgroundType,
  FontExtendType
} from './index'

export type PrizeFontType = FontItemType & FontExtendType

export type BlockImgType = ImgItemType & {}

export type PrizeImgType = ImgItemType

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

export type PrizeType = {
  borderRadius?: BorderRadiusType
  background?: BackgroundType
  fonts?: Array<PrizeFontType>
  imgs?: Array<PrizeImgType>
}

export type SlotType = {
  order?: number[]
  speed?: number
  direction?: 1 | -1
}

export type DefaultConfigType = {
  /**
   * vertical 为纵向旋转
   * horizontal 为横向旋转
   */
  mode?: 'vertical' | 'horizontal'
  /**
   * 当排列方向 = `vertical`时
   *    1 bottom to top
   *   -1 top to bottom
   * 当排列方向 = `horizontal`时
   *    1 right to left
   *   -1 left to right
   */
  direction?: 1 | -1
  // 行间距
  rowSpacing?: number
  // 列间距
  colSpacing?: number
  // 速度
  speed?: number
  accelerationTime?: number
  decelerationTime?: number
}

export type DefaultStyleType = {
  borderRadius?: BorderRadiusType
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

export type EndCallbackType = (prize: PrizeType | undefined) => void

export default interface SlotMachineConfig {
  width: string | number
  height: string | number
  blocks?: Array<BlockType>
  prizes?: Array<PrizeType>
  slots?: Array<SlotType>
  defaultConfig?: DefaultConfigType
  defaultStyle?: DefaultStyleType
  end?: EndCallbackType
}

/**
 * React 组件专用类型定义
 */

/**
 * 老虎机属性接口
 */
export interface SlotMachineProps {
  /** 滚轴数组，每个滚轴包含多个符号 */
  reels: string[][];

  /** 每个滚轴符号的权重（可选） */
  weights?: number[][];

  /** 动画持续时间（毫秒），默认 3000 */
  animationDuration?: number;

  /** 按钮文字，默认"开始" */
  buttonText?: string;

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
  onGameEnd?: (result: SlotMachineResult) => void;

  /** 结果回调 */
  onResult?: (result: SlotMachineResult) => void;
}

/**
 * 老虎机结果接口
 */
export interface SlotMachineResult {
  /** 每个滚轴的结果 */
  results: string[];

  /** 是否中大奖（所有符号相同） */
  isJackpot: boolean;

  /** 组合描述 */
  combination: string;
}
