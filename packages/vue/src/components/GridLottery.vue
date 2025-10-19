<template>
  <div class="canvas-grid-lottery" :class="{ disabled }">
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
import { CanvasUtils, Animation, type Rect } from '../utils/CanvasUtils'

const props = withDefaults(defineProps<GridLotteryProps>(), {
  gridSize: 9,
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
const currentPosition = ref(-1)
const result = ref<GridLotteryResult>()

let ctx: CanvasRenderingContext2D
let animation: Animation
let gridItems: Rect[] = []
let animationPath: number[] = []

const CANVAS_WIDTH = 400
const CANVAS_HEIGHT = 400
const GRID_COLS = 3
const GRID_ROWS = 3
const ITEM_SIZE = 120
const ITEM_GAP = 10

onMounted(() => {
  if (canvasRef.value) {
    ctx = canvasRef.value.getContext('2d')!
    animation = new Animation()
    setupCanvas()
    setupGridItems()
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

function setupGridItems() {
  gridItems = []
  const startX = (CANVAS_WIDTH - (GRID_COLS * ITEM_SIZE + (GRID_COLS - 1) * ITEM_GAP)) / 2
  const startY = (CANVAS_HEIGHT - (GRID_ROWS * ITEM_SIZE + (GRID_ROWS - 1) * ITEM_GAP)) / 2

  for (let i = 0; i < GRID_ROWS; i++) {
    for (let j = 0; j < GRID_COLS; j++) {
      const index = i * GRID_COLS + j
      if (index < props.prizes.length) {
        gridItems.push({
          x: startX + j * (ITEM_SIZE + ITEM_GAP),
          y: startY + i * (ITEM_SIZE + ITEM_GAP),
          width: ITEM_SIZE,
          height: ITEM_SIZE
        })
      }
    }
  }
}

function draw() {
  if (!ctx) return

  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

  // 绘制背景
  ctx.fillStyle = '#f8f9fa'
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

  // 绘制九宫格
  gridItems.forEach((item, index) => {
    if (index >= props.prizes.length) return

    const isActive = currentPosition.value === index
    const isHighlight = isAnimating.value && isActive

    // 绘制格子背景
    ctx.fillStyle = isHighlight ? '#ff6b6b' : isActive ? '#4ecdc4' : '#ffffff'
    CanvasUtils.drawRoundedRect(ctx, item.x, item.y, item.width, item.height, 8)
    ctx.fill()

    // 绘制边框
    ctx.strokeStyle = isHighlight ? '#ff5252' : '#e0e0e0'
    ctx.lineWidth = isHighlight ? 3 : 1
    CanvasUtils.drawRoundedRect(ctx, item.x, item.y, item.width, item.height, 8)
    ctx.stroke()

    // 绘制奖品文本
    const textColor = isHighlight || isActive ? '#ffffff' : '#333333'
    CanvasUtils.drawText(
      ctx,
      props.prizes[index],
      item.x + item.width / 2,
      item.y + item.height / 2,
      16,
      textColor,
      'center',
      'middle'
    )

    // 绘制闪烁效果
    if (isHighlight) {
      const time = Date.now()
      const opacity = 0.3 + 0.3 * Math.sin(time * 0.01)
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`
      CanvasUtils.drawRoundedRect(ctx, item.x, item.y, item.width, item.height, 8)
      ctx.fill()
    }
  })

  if (isAnimating.value) {
    requestAnimationFrame(draw)
  }
}

function handleCanvasClick(event: MouseEvent) {
  if (isAnimating.value || props.disabled) return

  const rect = canvasRef.value!.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  // 检查是否点击了开始按钮区域
  const buttonRect = {
    x: CANVAS_WIDTH / 2 - 60,
    y: CANVAS_HEIGHT - 50,
    width: 120,
    height: 30
  }

  if (CanvasUtils.isPointInRect(x, y, buttonRect)) {
    handleStart()
  }
}

async function handleStart() {
  if (isAnimating.value || props.disabled) return

  emit('gameStart')
  isAnimating.value = true
  currentPosition.value = -1
  result.value = undefined

  // 生成抽奖路径
  generateAnimationPath()

  // 执行动画
  await animateLottery()

  // 确定最终结果
  const finalPosition = determineFinalPosition()
  currentPosition.value = finalPosition

  const lotteryResult: GridLotteryResult = {
    position: finalPosition,
    prize: props.prizes[finalPosition],
    animation: animationPath
  }

  result.value = lotteryResult
  isAnimating.value = false

  emit('result', lotteryResult)
  emit('gameEnd', lotteryResult)
}

function generateAnimationPath() {
  // 生成顺时针路径：0→1→2→5→8→7→6→3→0...
  const clockwisePath = [0, 1, 2, 5, 8, 7, 6, 3]
  const minRounds = 3
  const maxRounds = 5
  const rounds = minRounds + Math.random() * (maxRounds - minRounds)

  animationPath = []
  for (let i = 0; i < rounds * clockwisePath.length; i++) {
    animationPath.push(clockwisePath[i % clockwisePath.length])
  }
}

async function animateLottery() {
  const stepDuration = props.animationDuration / animationPath.length

  for (let i = 0; i < animationPath.length; i++) {
    currentPosition.value = animationPath[i]
    draw()

    // 逐渐减慢速度
    const slowDownFactor = 1 + (i / animationPath.length) * 2
    await new Promise(resolve => setTimeout(resolve, stepDuration * slowDownFactor))
  }
}

function determineFinalPosition(): number {
  if (props.weights && props.weights.length === props.prizes.length) {
    // 使用权重随机
    const totalWeight = props.weights.reduce((sum, weight) => sum + weight, 0)
    let random = Math.random() * totalWeight

    for (let i = 0; i < props.weights.length; i++) {
      random -= props.weights[i]
      if (random <= 0) {
        return i
      }
    }
  }

  // 默认随机
  return Math.floor(Math.random() * props.prizes.length)
}
</script>

<style scoped>
.canvas-grid-lottery {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.canvas-grid-lottery.disabled {
  opacity: 0.6;
  pointer-events: none;
}

canvas {
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  background: white;
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