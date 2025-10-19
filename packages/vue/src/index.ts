// 组件导出
export { default as GridLottery } from './components/GridLottery.vue'
export { default as ScrollLottery } from './components/ScrollLottery.vue'
export { default as ScratchCard } from './components/ScratchCard.vue'
export { default as RockPaperScissors } from './components/RockPaperScissors.vue'
export { default as DiceGame } from './components/DiceGame.vue'
export { default as SlotMachine } from './components/SlotMachine.vue'

// 工具类导出
export { CanvasUtils, Animation } from './utils/CanvasUtils'
export type { Point, Size, Rect, AnimationState } from './utils/CanvasUtils'

// 类型导出
export * from './types'

// Vue 插件
import type { App } from 'vue'
import GridLottery from './components/GridLottery.vue'
import ScrollLottery from './components/ScrollLottery.vue'
import ScratchCard from './components/ScratchCard.vue'
import RockPaperScissors from './components/RockPaperScissors.vue'
import DiceGame from './components/DiceGame.vue'
import SlotMachine from './components/SlotMachine.vue'

const components = [
  GridLottery,
  ScrollLottery,
  ScratchCard,
  RockPaperScissors,
  DiceGame,
  SlotMachine
]

export default {
  install(app: App) {
    components.forEach(component => {
      const name = component.name || component.__name || 'UnknownComponent'
      app.component(name, component)
    })
  }
}