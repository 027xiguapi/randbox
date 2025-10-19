<template>
  <div class="canvas-dice-game" :class="{ disabled }">
    <canvas
      ref="canvasRef"
      @click="handleCanvasClick"
      :style="{ cursor: isRolling || disabled ? 'default' : 'pointer' }"
    />

    <div class="control-panel">
      <div class="game-controls">
        <div class="dice-count-selector">
          <label>骰子数量:</label>
          <select v-model="selectedDiceCount" :disabled="isRolling || disabled">
            <option v-for="count in [1, 2, 3, 4, 5, 6]" :key="count" :value="count">
              {{ count }}
            </option>
          </select>
        </div>

        <div class="game-mode-selector">
          <label>游戏模式:</label>
          <select v-model="selectedGameMode" :disabled="isRolling || disabled">
            <option value="simple">简单模式</option>
            <option value="bigSmall">大小模式</option>
            <option value="guess">猜点模式</option>
          </select>
        </div>

        <button
          @click="rollDice"
          :disabled="isRolling || disabled"
          class="roll-button"
        >
          {{ isRolling ? '投掷中...' : '投掷骰子' }}
        </button>
      </div>

      <div v-if="showStats && stats" class="stats-display">
        总投掷: {{ stats.totalRolls }} | 胜率: {{ stats.winRate }}
      </div>

      <div v-if="result" class="result-display">
        {{ result.message }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, defineProps, defineEmits, computed, watch } from 'vue'
import type { DiceGameProps, DiceGameResult } from '../types'
import { CanvasUtils, Animation } from '../utils/CanvasUtils'

const props = withDefaults(defineProps<DiceGameProps>(), {
  diceCount: 2,
  sides: 6,
  gameMode: 'simple',
  disabled: false
})

const emit = defineEmits<{
  result: [result: DiceGameResult]
}>()

const canvasRef = ref<HTMLCanvasElement>()
const isRolling = ref(false)
const result = ref<DiceGameResult>()
const gameHistory = ref<DiceGameResult[]>([])
const selectedDiceCount = ref(props.diceCount || 2)
const selectedGameMode = ref(props.gameMode || 'simple')
const diceValues = ref<number[]>([])
const showStats = ref(true)

let ctx: CanvasRenderingContext2D
let animation: Animation
let diceAnimations: Array<{ x: number, y: number, rotation: number }> = []

const CANVAS_WIDTH = 400
const CANVAS_HEIGHT = 300
const DICE_SIZE = 60

const stats = computed(() => {
  const totalRolls = gameHistory.value.length
  const wins = gameHistory.value.filter(r => r.isWin).length
  return {
    totalRolls,
    wins,
    winRate: totalRolls > 0 ? ((wins / totalRolls) * 100).toFixed(1) + '%' : '0%'
  }
})

onMounted(() => {
  if (canvasRef.value) {
    ctx = canvasRef.value.getContext('2d')!
    animation = new Animation()
    setupCanvas()
    initializeDice()
    draw()
  }
})

onUnmounted(() => {
  animation?.stop()
})

watch([selectedDiceCount], () => {
  initializeDice()
  draw()
})

function setupCanvas() {
  CanvasUtils.setupHighDPI(canvasRef.value!, ctx, CANVAS_WIDTH, CANVAS_HEIGHT)
}

function initializeDice() {
  diceValues.value = Array(selectedDiceCount.value).fill(1)
  diceAnimations = []

  const spacing = Math.min(80, (CANVAS_WIDTH - 40) / selectedDiceCount.value)
  const startX = (CANVAS_WIDTH - (selectedDiceCount.value - 1) * spacing) / 2

  for (let i = 0; i < selectedDiceCount.value; i++) {
    diceAnimations.push({
      x: startX + i * spacing,
      y: CANVAS_HEIGHT / 2,
      rotation: 0
    })
  }
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

  // 绘制标题
  CanvasUtils.drawText(
    ctx,
    '骰子游戏',
    CANVAS_WIDTH / 2,
    40,
    24,
    '#ffffff',
    'center',
    'middle',
    'bold Arial'
  )

  // 绘制骰子
  diceAnimations.forEach((diceAnim, index) => {
    drawDice(diceAnim.x, diceAnim.y, diceValues.value[index], diceAnim.rotation)
  })

  // 绘制总点数（如果有多个骰子）
  if (diceValues.value.length > 1 && !isRolling.value) {
    const total = diceValues.value.reduce((sum, val) => sum + val, 0)
    CanvasUtils.drawText(
      ctx,
      `总点数: ${total}`,
      CANVAS_WIDTH / 2,
      CANVAS_HEIGHT - 80,
      20,
      '#ffffff',
      'center',
      'middle',
      'bold Arial'
    )
  }

  if (isRolling.value) {
    requestAnimationFrame(draw)
  }
}

function drawDice(x: number, y: number, value: number, rotation: number = 0) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(rotation)

  // 绘制骰子背景
  ctx.fillStyle = '#ffffff'
  CanvasUtils.drawRoundedRect(ctx, -DICE_SIZE/2, -DICE_SIZE/2, DICE_SIZE, DICE_SIZE, 8)
  ctx.fill()

  // 绘制边框
  ctx.strokeStyle = '#333333'
  ctx.lineWidth = 2
  CanvasUtils.drawRoundedRect(ctx, -DICE_SIZE/2, -DICE_SIZE/2, DICE_SIZE, DICE_SIZE, 8)
  ctx.stroke()

  // 绘制点数
  drawDots(value)

  ctx.restore()
}

function drawDots(value: number) {
  const dotSize = 6
  const positions = getDotPositions(value)

  ctx.fillStyle = '#333333'
  positions.forEach(pos => {
    ctx.beginPath()
    ctx.arc(pos.x, pos.y, dotSize, 0, Math.PI * 2)
    ctx.fill()
  })
}

function getDotPositions(value: number): Array<{ x: number, y: number }> {
  const offset = 15
  const positions: Array<{ x: number, y: number }> = []

  switch (value) {
    case 1:
      positions.push({ x: 0, y: 0 })
      break
    case 2:
      positions.push({ x: -offset, y: -offset })
      positions.push({ x: offset, y: offset })
      break
    case 3:
      positions.push({ x: -offset, y: -offset })
      positions.push({ x: 0, y: 0 })
      positions.push({ x: offset, y: offset })
      break
    case 4:
      positions.push({ x: -offset, y: -offset })
      positions.push({ x: offset, y: -offset })
      positions.push({ x: -offset, y: offset })
      positions.push({ x: offset, y: offset })
      break
    case 5:
      positions.push({ x: -offset, y: -offset })
      positions.push({ x: offset, y: -offset })
      positions.push({ x: 0, y: 0 })
      positions.push({ x: -offset, y: offset })
      positions.push({ x: offset, y: offset })
      break
    case 6:
      positions.push({ x: -offset, y: -offset })
      positions.push({ x: 0, y: -offset })
      positions.push({ x: offset, y: -offset })
      positions.push({ x: -offset, y: offset })
      positions.push({ x: 0, y: offset })
      positions.push({ x: offset, y: offset })
      break
  }

  return positions
}

function handleCanvasClick() {
  if (!isRolling.value && !props.disabled) {
    rollDice()
  }
}

async function rollDice() {
  if (isRolling.value || props.disabled) return

  isRolling.value = true
  result.value = undefined

  // 执行滚动动画
  await animateRoll()

  // 生成最终结果
  const finalValues = generateDiceValues()
  diceValues.value = finalValues

  // 计算游戏结果
  const gameResult = calculateGameResult(finalValues)

  result.value = gameResult
  gameHistory.value.push(gameResult)
  isRolling.value = false

  emit('result', gameResult)
}

async function animateRoll() {
  const duration = 2000
  const steps = 20

  for (let step = 0; step < steps; step++) {
    // 随机旋转和值
    diceAnimations.forEach((diceAnim, index) => {
      diceAnim.rotation += 0.3
      diceValues.value[index] = Math.floor(Math.random() * props.sides!) + 1
    })

    draw()
    await new Promise(resolve => setTimeout(resolve, duration / steps))
  }
}

function generateDiceValues(): number[] {
  return Array(selectedDiceCount.value)
    .fill(0)
    .map(() => Math.floor(Math.random() * props.sides!) + 1)
}

function calculateGameResult(values: number[]): DiceGameResult {
  const total = values.reduce((sum, val) => sum + val, 0)
  let isWin = false
  let message = ''

  switch (selectedGameMode.value) {
    case 'simple':
      message = `投掷结果: ${values.join(', ')}，总点数: ${total}`
      isWin = true // 简单模式总是胜利
      break

    case 'bigSmall':
      const average = (selectedDiceCount.value * (props.sides! + 1)) / 2
      const isBig = total > average
      isWin = Math.random() > 0.5 ? isBig : !isBig // 50% 胜率
      message = `${isBig ? '大' : '小'} (${total}) - ${isWin ? '胜利' : '失败'}`
      break

    case 'guess':
      const target = Math.floor(Math.random() * props.sides!) + 1
      isWin = values.includes(target)
      message = `目标点数: ${target} - ${isWin ? '猜中了' : '没猜中'}`
      break

    default:
      message = '未知模式'
      break
  }

  return {
    results: values,
    total,
    gameMode: selectedGameMode.value,
    isWin,
    message
  }
}
</script>

<style scoped>
.canvas-dice-game {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.canvas-dice-game.disabled {
  opacity: 0.6;
  pointer-events: none;
}

canvas {
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  background: transparent;
}

.control-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.game-controls {
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
}

.dice-count-selector,
.game-mode-selector {
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
  font-weight: bold;
}

.dice-count-selector select,
.game-mode-selector select {
  padding: 5px 10px;
  border-radius: 5px;
  border: none;
  background: white;
  font-size: 14px;
}

.roll-button {
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

.roll-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(238, 90, 82, 0.6);
}

.roll-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.stats-display {
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  font-weight: bold;
  color: #333;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  font-size: 14px;
}

.result-display {
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  font-weight: bold;
  color: #333;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}
</style>