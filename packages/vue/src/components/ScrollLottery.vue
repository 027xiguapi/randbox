<template>
  <div class="canvas-scroll-lottery" :class="{ disabled }">
    <canvas
      ref="canvasRef"
      @click="handleCanvasClick"
      :style="{ cursor: isAnimating || disabled ? 'default' : 'pointer' }"
    />

    <div class="control-panel">
      <button
        :disabled="isAnimating || disabled"
        @click="handleStart"
        class="start-button"
      >
        {{ isAnimating ? '抽奖中...' : (buttonText || '开始抽奖') }}
      </button>

      <div v-if="result" class="result-display">
        恭喜获得：{{ result.prize }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, defineProps, defineEmits, watch } from 'vue'
import type { GridLotteryProps, GridLotteryResult } from '../types'
import { CanvasUtils, Animation } from '../utils/CanvasUtils'

const props = withDefaults(defineProps<GridLotteryProps>(), {
  animationDuration: 3000,
  buttonText: '开始抽奖',
  disabled: false
})

const emit = defineEmits<{
  gameStart: []
  gameEnd: [result: GridLotteryResult]
  result: [result: GridLotteryResult]
}>()

const canvasRef = ref<HTMLCanvasElement>()
const isAnimating = ref(false)
const result = ref<GridLotteryResult>()

let ctx: CanvasRenderingContext2D
let animation: Animation
let scrollOffset = 0
let targetPosition = 0
let itemHeight = 60
let visibleItems = 5

const CANVAS_WIDTH = 400
const CANVAS_HEIGHT = 300

onMounted(() => {
  if (canvasRef.value) {
    ctx = canvasRef.value.getContext('2d')!
    animation = new Animation()
    setupCanvas()
    draw()
  }
})

onUnmounted(() => {
  animation?.stop()
})

watch(() => props.prizes, () => {
  draw()
}, { deep: true })

function setupCanvas() {
  CanvasUtils.setupHighDPI(canvasRef.value!, ctx, CANVAS_WIDTH, CANVAS_HEIGHT)
}

function draw() {
  if (!ctx) return

  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

  // 绘制背景
  const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT)
  gradient.addColorStop(0, '#667eea')
  gradient.addColorStop(1, '#764ba2')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

  // 绘制滚动区域背景
  const scrollAreaX = 50
  const scrollAreaY = 50
  const scrollAreaWidth = CANVAS_WIDTH - 100
  const scrollAreaHeight = CANVAS_HEIGHT - 150

  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
  CanvasUtils.drawRoundedRect(ctx, scrollAreaX, scrollAreaY, scrollAreaWidth, scrollAreaHeight, 12)
  ctx.fill()

  // 绘制边框
  ctx.strokeStyle = '#e0e0e0'
  ctx.lineWidth = 2
  CanvasUtils.drawRoundedRect(ctx, scrollAreaX, scrollAreaY, scrollAreaWidth, scrollAreaHeight, 12)
  ctx.stroke()

  // 设置裁剪区域
  ctx.save()
  CanvasUtils.drawRoundedRect(ctx, scrollAreaX, scrollAreaY, scrollAreaWidth, scrollAreaHeight, 12)
  ctx.clip()

  // 绘制奖品列表
  const startY = scrollAreaY + scrollAreaHeight / 2 - (visibleItems * itemHeight) / 2 - scrollOffset

  for (let i = 0; i < props.prizes.length * 3; i++) { // 重复3次以实现无限滚动效果
    const prizeIndex = i % props.prizes.length
    const prize = props.prizes[prizeIndex]
    const y = startY + i * itemHeight

    // 只绘制可见区域内的项目
    if (y + itemHeight >= scrollAreaY && y <= scrollAreaY + scrollAreaHeight) {
      const itemY = y
      const isCenter = Math.abs(itemY + itemHeight / 2 - (scrollAreaY + scrollAreaHeight / 2)) < itemHeight / 2

      // 绘制项目背景
      if (isCenter) {
        ctx.fillStyle = '#ff6b6b'
        CanvasUtils.drawRoundedRect(ctx, scrollAreaX + 10, itemY, scrollAreaWidth - 20, itemHeight - 4, 8)
        ctx.fill()
      }

      // 绘制文本
      const textColor = isCenter ? '#ffffff' : '#333333'
      const fontSize = isCenter ? 20 : 16
      CanvasUtils.drawText(
        ctx,
        prize,
        scrollAreaX + scrollAreaWidth / 2,
        itemY + itemHeight / 2,
        fontSize,
        textColor,
        'center',
        'middle'
      )

      // 绘制分隔线
      if (!isCenter) {
        ctx.strokeStyle = '#e0e0e0'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(scrollAreaX + 20, itemY + itemHeight)
        ctx.lineTo(scrollAreaX + scrollAreaWidth - 20, itemY + itemHeight)
        ctx.stroke()
      }
    }
  }

  ctx.restore()

  // 绘制指示器
  const indicatorY = scrollAreaY + scrollAreaHeight / 2
  ctx.strokeStyle = '#ff6b6b'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(scrollAreaX - 10, indicatorY - 15)
  ctx.lineTo(scrollAreaX - 2, indicatorY)
  ctx.lineTo(scrollAreaX - 10, indicatorY + 15)
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(scrollAreaX + scrollAreaWidth + 10, indicatorY - 15)
  ctx.lineTo(scrollAreaX + scrollAreaWidth + 2, indicatorY)
  ctx.lineTo(scrollAreaX + scrollAreaWidth + 10, indicatorY + 15)
  ctx.stroke()

  if (isAnimating.value) {
    requestAnimationFrame(draw)
  }
}

function handleCanvasClick() {
  if (isAnimating.value || props.disabled) return
  handleStart()
}

async function handleStart() {
  if (isAnimating.value || props.disabled) return

  emit('gameStart')
  isAnimating.value = true
  result.value = undefined

  // 确定目标位置
  const finalPrizeIndex = determineFinalPosition()
  const totalScrollDistance = (props.prizes.length * 2 + finalPrizeIndex) * itemHeight

  targetPosition = totalScrollDistance

  // 执行滚动动画
  await animation.start('scroll', scrollOffset, targetPosition, props.animationDuration, CanvasUtils.easeOutBounce)

  // 动画过程中更新scrollOffset
  const animateScroll = () => {
    const newOffset = animation.getValue('scroll')
    if (newOffset !== null) {
      scrollOffset = newOffset
      draw()
      if (animation.isAnimating('scroll')) {
        requestAnimationFrame(animateScroll)
      }
    }
  }
  animateScroll()

  // 等待动画完成
  await new Promise(resolve => {
    const checkComplete = () => {
      if (!animation.isAnimating('scroll')) {
        resolve(void 0)
      } else {
        setTimeout(checkComplete, 50)
      }
    }
    checkComplete()
  })

  // 设置最终结果
  const lotteryResult: GridLotteryResult = {
    position: finalPrizeIndex,
    prize: props.prizes[finalPrizeIndex],
    animation: []
  }

  result.value = lotteryResult
  isAnimating.value = false

  emit('result', lotteryResult)
  emit('gameEnd', lotteryResult)
}

function determineFinalPosition(): number {
  if (props.weights && props.weights.length === props.prizes.length) {
    const totalWeight = props.weights.reduce((sum, weight) => sum + weight, 0)
    let random = Math.random() * totalWeight

    for (let i = 0; i < props.weights.length; i++) {
      random -= props.weights[i]
      if (random <= 0) {
        return i
      }
    }
  }

  return Math.floor(Math.random() * props.prizes.length)
}
</script>

<style scoped>
.canvas-scroll-lottery {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.canvas-scroll-lottery.disabled {
  opacity: 0.6;
  pointer-events: none;
}

canvas {
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.control-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.start-button {
  padding: 12px 24px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  background: linear-gradient(45deg, #ff6b6b, #ee5a52);
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(238, 90, 82, 0.4);
}

.start-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(238, 90, 82, 0.6);
}

.start-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.result-display {
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  font-weight: bold;
  color: #333;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
</style>