<template>
  <div class="canvas-scratch-card" :class="{ disabled }">
    <canvas
      ref="canvasRef"
      @mousedown="handleMouseDown"
      @mousemove="handleMouseMove"
      @mouseup="handleMouseUp"
      @mouseleave="handleMouseUp"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
      :style="{ cursor: isScratching || disabled ? 'crosshair' : 'pointer' }"
    />

    <div class="control-panel">
      <button
        @click="generateNewCard"
        class="new-card-button"
        :disabled="disabled"
      >
        新建卡片
      </button>

      <div v-if="result" class="result-display">
        {{ result.isWinner ? `恭喜中奖：${result.winningInfo?.prize}` : '谢谢参与' }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineProps, defineEmits } from 'vue'
import type { ScratchCardProps, ScratchCardResult } from '../types'
import { CanvasUtils } from '../utils/CanvasUtils'

interface ScratchCardPropsExtended extends ScratchCardProps {
  prizes?: string[]
  cardWidth?: number
  cardHeight?: number
}

const props = withDefaults(defineProps<ScratchCardPropsExtended>(), {
  prizes: () => ['1000元', '500元', '100元', '50元', '谢谢参与'],
  cardWidth: 300,
  cardHeight: 200,
  disabled: false
})

const emit = defineEmits<{
  reveal: [prize: string]
  newCard: []
}>()

const canvasRef = ref<HTMLCanvasElement>()
const isScratching = ref(false)
const result = ref<ScratchCardResult>()

let ctx: CanvasRenderingContext2D
let maskCanvas: HTMLCanvasElement
let maskCtx: CanvasRenderingContext2D
let backgroundCanvas: HTMLCanvasElement
let backgroundCtx: CanvasRenderingContext2D
let isRevealed = false
let scratchedPercentage = 0

const SCRATCH_RADIUS = 20

onMounted(() => {
  if (canvasRef.value) {
    ctx = canvasRef.value.getContext('2d')!
    setupCanvases()
    generateNewCard()
  }
})

function setupCanvases() {
  CanvasUtils.setupHighDPI(canvasRef.value!, ctx, props.cardWidth!, props.cardHeight!)

  // 创建遮罩层画布
  maskCanvas = document.createElement('canvas')
  maskCtx = maskCanvas.getContext('2d')!
  CanvasUtils.setupHighDPI(maskCanvas, maskCtx, props.cardWidth!, props.cardHeight!)

  // 创建背景层画布
  backgroundCanvas = document.createElement('canvas')
  backgroundCtx = backgroundCanvas.getContext('2d')!
  CanvasUtils.setupHighDPI(backgroundCanvas, backgroundCtx, props.cardWidth!, props.cardHeight!)
}

function generateNewCard() {
  if (!maskCtx || !backgroundCtx) return

  isRevealed = false
  scratchedPercentage = 0
  result.value = undefined

  // 随机选择奖品
  const randomPrize = props.prizes![Math.floor(Math.random() * props.prizes!.length)]

  // 绘制背景（奖品内容）
  drawBackground(randomPrize)

  // 绘制遮罩层
  drawMask()

  // 合成最终图像
  compositeImage()

  emit('newCard')
}

function drawBackground(prize: string) {
  backgroundCtx.clearRect(0, 0, props.cardWidth!, props.cardHeight!)

  // 绘制背景色
  const gradient = backgroundCtx.createLinearGradient(0, 0, props.cardWidth!, props.cardHeight!)
  if (prize === '谢谢参与') {
    gradient.addColorStop(0, '#95a5a6')
    gradient.addColorStop(1, '#7f8c8d')
  } else {
    gradient.addColorStop(0, '#f39c12')
    gradient.addColorStop(1, '#e67e22')
  }

  backgroundCtx.fillStyle = gradient
  backgroundCtx.fillRect(0, 0, props.cardWidth!, props.cardHeight!)

  // 绘制装饰边框
  backgroundCtx.strokeStyle = '#34495e'
  backgroundCtx.lineWidth = 4
  CanvasUtils.drawRoundedRect(backgroundCtx, 2, 2, props.cardWidth! - 4, props.cardHeight! - 4, 12)
  backgroundCtx.stroke()

  // 绘制奖品文本
  const fontSize = prize === '谢谢参与' ? 24 : 32
  CanvasUtils.drawText(
    backgroundCtx,
    prize,
    props.cardWidth! / 2,
    props.cardHeight! / 2,
    fontSize,
    '#ffffff',
    'center',
    'middle',
    'bold Arial'
  )

  // 绘制装饰元素
  if (prize !== '谢谢参与') {
    // 绘制星星装饰
    for (let i = 0; i < 8; i++) {
      const x = 30 + Math.random() * (props.cardWidth! - 60)
      const y = 30 + Math.random() * (props.cardHeight! - 60)
      drawStar(backgroundCtx, x, y, 8, '#ffffff', 0.6)
    }
  }
}

function drawStar(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, opacity: number) {
  ctx.save()
  ctx.globalAlpha = opacity
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo(x, y - size)
  ctx.lineTo(x + size * 0.3, y - size * 0.3)
  ctx.lineTo(x + size, y)
  ctx.lineTo(x + size * 0.3, y + size * 0.3)
  ctx.lineTo(x, y + size)
  ctx.lineTo(x - size * 0.3, y + size * 0.3)
  ctx.lineTo(x - size, y)
  ctx.lineTo(x - size * 0.3, y - size * 0.3)
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

function drawMask() {
  maskCtx.clearRect(0, 0, props.cardWidth!, props.cardHeight!)

  // 绘制银色遮罩层
  const gradient = maskCtx.createLinearGradient(0, 0, props.cardWidth!, props.cardHeight!)
  gradient.addColorStop(0, '#bdc3c7')
  gradient.addColorStop(0.5, '#ecf0f1')
  gradient.addColorStop(1, '#95a5a6')

  maskCtx.fillStyle = gradient
  maskCtx.fillRect(0, 0, props.cardWidth!, props.cardHeight!)

  // 绘制纹理效果
  for (let i = 0; i < 100; i++) {
    const x = Math.random() * props.cardWidth!
    const y = Math.random() * props.cardHeight!
    const size = Math.random() * 3 + 1

    maskCtx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.3})`
    maskCtx.beginPath()
    maskCtx.arc(x, y, size, 0, Math.PI * 2)
    maskCtx.fill()
  }

  // 绘制提示文字
  CanvasUtils.drawText(
    maskCtx,
    '刮开有奖',
    props.cardWidth! / 2,
    props.cardHeight! / 2,
    20,
    '#7f8c8d',
    'center',
    'middle',
    'bold Arial'
  )
}

function scratch(x: number, y: number) {
  if (isRevealed || props.disabled) return

  // 在遮罩层上刮除
  maskCtx.save()
  maskCtx.globalCompositeOperation = 'destination-out'
  maskCtx.beginPath()
  maskCtx.arc(x, y, SCRATCH_RADIUS, 0, Math.PI * 2)
  maskCtx.fill()
  maskCtx.restore()

  // 计算刮除百分比
  calculateScratchPercentage()

  // 合成图像
  compositeImage()

  // 检查是否已刮除足够多
  if (scratchedPercentage > 30 && !isRevealed) {
    revealCard()
  }
}

function calculateScratchPercentage() {
  const imageData = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height)
  const pixels = imageData.data
  let transparentPixels = 0
  let totalPixels = pixels.length / 4

  for (let i = 3; i < pixels.length; i += 4) {
    if (pixels[i] === 0) {
      transparentPixels++
    }
  }

  scratchedPercentage = (transparentPixels / totalPixels) * 100
}

function revealCard() {
  if (isRevealed) return

  isRevealed = true

  // 清除遮罩层以完全显示背景
  maskCtx.clearRect(0, 0, props.cardWidth!, props.cardHeight!)
  compositeImage()

  // 获取奖品信息
  const imageData = backgroundCtx.getImageData(0, 0, backgroundCanvas.width, backgroundCanvas.height)
  console.log(imageData)
  // 这里简化处理，实际应该从背景数据中解析奖品
  const prize = props.prizes![Math.floor(Math.random() * props.prizes!.length)]
  const isWinner = prize !== '谢谢参与'

  const cardResult: ScratchCardResult = {
    grid: [[prize]], // 简化为单个奖品
    isWinner,
    winningInfo: isWinner ? {
      pattern: [prize],
      name: '刮刮卡',
      prize,
      positions: [{ row: 0, col: 0 }]
    } : undefined
  }

  result.value = cardResult
  emit('reveal', prize)
}

function compositeImage() {
  ctx.clearRect(0, 0, props.cardWidth!, props.cardHeight!)

  // 先绘制背景
  ctx.drawImage(backgroundCanvas, 0, 0)

  // 再绘制遮罩层
  ctx.drawImage(maskCanvas, 0, 0)
}

function getEventPos(event: MouseEvent | TouchEvent): { x: number, y: number } {
  const rect = canvasRef.value!.getBoundingClientRect()

  if (event instanceof MouseEvent) {
    return {
      x: (event.clientX - rect.left) * (props.cardWidth! / rect.width),
      y: (event.clientY - rect.top) * (props.cardHeight! / rect.height)
    }
  } else {
    const touch = event.touches[0] || event.changedTouches[0]
    return {
      x: (touch.clientX - rect.left) * (props.cardWidth! / rect.width),
      y: (touch.clientY - rect.top) * (props.cardHeight! / rect.height)
    }
  }
}

function handleMouseDown(event: MouseEvent) {
  if (props.disabled) return
  isScratching.value = true
  const pos = getEventPos(event)
  scratch(pos.x, pos.y)
}

function handleMouseMove(event: MouseEvent) {
  if (!isScratching.value || props.disabled) return
  const pos = getEventPos(event)
  scratch(pos.x, pos.y)
}

function handleMouseUp() {
  isScratching.value = false
}

function handleTouchStart(event: TouchEvent) {
  event.preventDefault()
  if (props.disabled) return
  isScratching.value = true
  const pos = getEventPos(event)
  scratch(pos.x, pos.y)
}

function handleTouchMove(event: TouchEvent) {
  event.preventDefault()
  if (!isScratching.value || props.disabled) return
  const pos = getEventPos(event)
  scratch(pos.x, pos.y)
}

function handleTouchEnd(event: TouchEvent) {
  event.preventDefault()
  isScratching.value = false
}
</script>

<style scoped>
.canvas-scratch-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.canvas-scratch-card.disabled {
  opacity: 0.6;
  pointer-events: none;
}

canvas {
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  touch-action: none;
}

.control-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.new-card-button {
  padding: 12px 24px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  background: linear-gradient(45deg, #4ecdc4, #44a08d);
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(68, 160, 141, 0.4);
}

.new-card-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(68, 160, 141, 0.6);
}

.new-card-button:disabled {
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