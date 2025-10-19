<template>
  <div class="canvas-slot-machine" :class="{ disabled }">
    <canvas
      ref="canvasRef"
      @click="handleCanvasClick"
      :style="{ cursor: isSpinning || disabled || credits <= 0 ? 'default' : 'pointer' }"
    />

    <div class="control-panel">
      <div class="game-info">
        <div class="credits-display">
          积分: {{ credits }}
        </div>
        <div class="bet-selector">
          <label>投注:</label>
          <select v-model="currentBet" :disabled="isSpinning || disabled || credits <= 0">
            <option v-for="bet in availableBets" :key="bet" :value="bet">{{ bet }}</option>
          </select>
        </div>
      </div>

      <button
        @click="spin"
        :disabled="isSpinning || disabled || credits < currentBet"
        class="spin-button"
      >
        {{ isSpinning ? '转动中...' : (credits < currentBet ? '积分不足' : '开始转动') }}
      </button>

      <div v-if="lastResult" class="result-display">
        {{ lastResult.message }}
        <div v-if="lastResult.payout > 0" class="payout">
          赢得: {{ lastResult.payout }} 积分
        </div>
      </div>

      <div v-if="showPayTable" class="pay-table">
        <h4>赔率表</h4>
        <div v-for="combo in payTable" :key="combo.combination" class="pay-row">
          {{ combo.symbols.join(' ') }} - {{ combo.multiplier }}x
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, defineProps, defineEmits } from 'vue'
import { CanvasUtils, Animation } from '../utils/CanvasUtils'

interface SlotMachineProps {
  initialCredits?: number
  showPayTable?: boolean
  disabled?: boolean
}

interface SlotResult {
  symbols: string[]
  combination: string
  payout: number
  multiplier: number
  message: string
}

const props = withDefaults(defineProps<SlotMachineProps>(), {
  initialCredits: 100,
  showPayTable: true,
  disabled: false
})

const emit = defineEmits<{
  spin: [result: SlotResult]
}>()

const canvasRef = ref<HTMLCanvasElement>()
const isSpinning = ref(false)
const credits = ref(props.initialCredits || 100)
const currentBet = ref(10)
const lastResult = ref<SlotResult>()

let ctx: CanvasRenderingContext2D
let animation: Animation
let reelPositions = [0, 0, 0]
let targetPositions = [0, 0, 0]

const CANVAS_WIDTH = 400
const CANVAS_HEIGHT = 300
const REEL_WIDTH = 100
const REEL_HEIGHT = 200
const SYMBOL_HEIGHT = 60

const symbols = ['🍒', '🍋', '🍊', '🍇', '⭐', '💎', '🔔', '🍀']
const availableBets = [5, 10, 20, 50]

const payTable = [
  { symbols: ['💎', '💎', '💎'], multiplier: 50, combination: 'triple_diamond' },
  { symbols: ['⭐', '⭐', '⭐'], multiplier: 25, combination: 'triple_star' },
  { symbols: ['🔔', '🔔', '🔔'], multiplier: 15, combination: 'triple_bell' },
  { symbols: ['🍀', '🍀', '🍀'], multiplier: 10, combination: 'triple_clover' },
  { symbols: ['🍇', '🍇', '🍇'], multiplier: 8, combination: 'triple_grape' },
  { symbols: ['🍊', '🍊', '🍊'], multiplier: 6, combination: 'triple_orange' },
  { symbols: ['🍋', '🍋', '🍋'], multiplier: 4, combination: 'triple_lemon' },
  { symbols: ['🍒', '🍒', '🍒'], multiplier: 3, combination: 'triple_cherry' },
  { symbols: ['🍒', '🍒'], multiplier: 2, combination: 'double_cherry' },
  { symbols: ['🍒'], multiplier: 1, combination: 'single_cherry' }
]

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

function setupCanvas() {
  CanvasUtils.setupHighDPI(canvasRef.value!, ctx, CANVAS_WIDTH, CANVAS_HEIGHT)
}

function draw() {
  if (!ctx) return

  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

  // 绘制背景
  const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT)
  gradient.addColorStop(0, '#2c3e50')
  gradient.addColorStop(1, '#34495e')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

  // 绘制老虎机框架
  drawSlotMachineFrame()

  // 绘制转轮
  drawReels()

  // 绘制标题
  CanvasUtils.drawText(
    ctx,
    '🎰 老虎机',
    CANVAS_WIDTH / 2,
    30,
    24,
    '#f1c40f',
    'center',
    'middle',
    'bold Arial'
  )

  if (isSpinning.value) {
    requestAnimationFrame(draw)
  }
}

function drawSlotMachineFrame() {
  const frameX = (CANVAS_WIDTH - REEL_WIDTH * 3 - 40) / 2
  const frameY = 60

  // 绘制主框架
  ctx.fillStyle = '#95a5a6'
  CanvasUtils.drawRoundedRect(ctx, frameX - 20, frameY - 10, REEL_WIDTH * 3 + 40, REEL_HEIGHT + 20, 15)
  ctx.fill()

  // 绘制内框
  ctx.fillStyle = '#2c3e50'
  CanvasUtils.drawRoundedRect(ctx, frameX - 10, frameY, REEL_WIDTH * 3 + 20, REEL_HEIGHT, 10)
  ctx.fill()

  // 绘制分隔线
  for (let i = 1; i < 3; i++) {
    ctx.strokeStyle = '#7f8c8d'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(frameX + i * REEL_WIDTH, frameY)
    ctx.lineTo(frameX + i * REEL_WIDTH, frameY + REEL_HEIGHT)
    ctx.stroke()
  }
}

function drawReels() {
  const frameX = (CANVAS_WIDTH - REEL_WIDTH * 3 - 40) / 2
  const frameY = 60

  // 设置裁剪区域
  ctx.save()
  CanvasUtils.drawRoundedRect(ctx, frameX - 10, frameY, REEL_WIDTH * 3 + 20, REEL_HEIGHT, 10)
  ctx.clip()

  for (let reelIndex = 0; reelIndex < 3; reelIndex++) {
    const reelX = frameX + reelIndex * REEL_WIDTH
    const offset = reelPositions[reelIndex] % (symbols.length * SYMBOL_HEIGHT)

    // 绘制转轮符号
    for (let i = -2; i < symbols.length + 2; i++) {
      const symbolIndex = (i + symbols.length) % symbols.length
      const y = frameY + i * SYMBOL_HEIGHT - offset

      if (y > frameY - SYMBOL_HEIGHT && y < frameY + REEL_HEIGHT + SYMBOL_HEIGHT) {
        // 绘制符号背景
        const isMiddle = y > frameY + REEL_HEIGHT/2 - SYMBOL_HEIGHT/2 &&
                        y < frameY + REEL_HEIGHT/2 + SYMBOL_HEIGHT/2

        if (isMiddle && !isSpinning.value) {
          ctx.fillStyle = 'rgba(241, 196, 15, 0.3)'
          ctx.fillRect(reelX + 5, y + 5, REEL_WIDTH - 10, SYMBOL_HEIGHT - 10)
        }

        // 绘制符号
        CanvasUtils.drawText(
          ctx,
          symbols[symbolIndex],
          reelX + REEL_WIDTH / 2,
          y + SYMBOL_HEIGHT / 2,
          40,
          '#ffffff',
          'center',
          'middle'
        )
      }
    }
  }

  ctx.restore()

  // 绘制中奖线
  if (!isSpinning.value) {
    ctx.strokeStyle = '#f1c40f'
    ctx.lineWidth = 3
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.moveTo(frameX - 5, frameY + REEL_HEIGHT / 2)
    ctx.lineTo(frameX + REEL_WIDTH * 3 + 5, frameY + REEL_HEIGHT / 2)
    ctx.stroke()
    ctx.setLineDash([])
  }
}

function handleCanvasClick() {
  if (!isSpinning.value && !props.disabled && credits.value >= currentBet.value) {
    spin()
  }
}

async function spin() {
  if (isSpinning.value || props.disabled || credits.value < currentBet.value) return

  isSpinning.value = true
  credits.value -= currentBet.value
  lastResult.value = undefined

  // 生成目标位置
  const finalSymbols: string[] = []
  for (let i = 0; i < 3; i++) {
    const randomIndex = Math.floor(Math.random() * symbols.length)
    targetPositions[i] = randomIndex * SYMBOL_HEIGHT
    finalSymbols.push(symbols[randomIndex])
  }

  // 执行转动动画
  await animateReels()

  // 计算结果
  const result = calculateResult(finalSymbols)
  credits.value += result.payout

  lastResult.value = result
  isSpinning.value = false

  emit('spin', result)
}

async function animateReels() {
  const baseDuration = 2000
  const promises: Promise<void>[] = []

  for (let i = 0; i < 3; i++) {
    const duration = baseDuration + i * 500 // 每个转轮延迟停止
    const startPos = reelPositions[i]
    const finalPos = targetPositions[i] + symbols.length * SYMBOL_HEIGHT * 3 // 多转几圈

    promises.push(
      animation.start(
        `reel${i}`,
        startPos,
        finalPos,
        duration,
        CanvasUtils.easeOutBounce
      )
    )
  }

  // 动画过程中更新位置
  const animateFrame = () => {
    for (let i = 0; i < 3; i++) {
      const pos = animation.getValue(`reel${i}`)
      if (pos !== null) {
        reelPositions[i] = pos
      }
    }
    draw()

    if (animation.isAnimating()) {
      requestAnimationFrame(animateFrame)
    }
  }
  animateFrame()

  // 等待所有转轮停止
  await Promise.all(promises)

  // 设置最终位置
  for (let i = 0; i < 3; i++) {
    reelPositions[i] = targetPositions[i]
  }
  draw()
}

function calculateResult(resultSymbols: string[]): SlotResult {
  let bestMatch = { multiplier: 0, combination: '', payout: 0, message: '未中奖' }

  // 检查三个相同
  if (resultSymbols[0] === resultSymbols[1] && resultSymbols[1] === resultSymbols[2]) {
    const match = payTable.find(p =>
      p.symbols.length === 3 &&
      p.symbols[0] === resultSymbols[0] &&
      p.symbols.every(s => s === resultSymbols[0])
    )
    if (match) {
      bestMatch = {
        multiplier: match.multiplier,
        combination: match.combination,
        payout: currentBet.value * match.multiplier,
        message: `三个${resultSymbols[0]}! 大奖!`
      }
    }
  }
  // 检查两个樱桃
  else if (resultSymbols.filter(s => s === '🍒').length >= 2) {
    const match = payTable.find(p => p.combination === 'double_cherry')
    if (match) {
      bestMatch = {
        multiplier: match.multiplier,
        combination: match.combination,
        payout: currentBet.value * match.multiplier,
        message: '两个樱桃!'
      }
    }
  }
  // 检查一个樱桃
  else if (resultSymbols.includes('🍒')) {
    const match = payTable.find(p => p.combination === 'single_cherry')
    if (match) {
      bestMatch = {
        multiplier: match.multiplier,
        combination: match.combination,
        payout: currentBet.value * match.multiplier,
        message: '一个樱桃!'
      }
    }
  }

  return {
    symbols: resultSymbols,
    combination: bestMatch.combination,
    payout: bestMatch.payout,
    multiplier: bestMatch.multiplier,
    message: bestMatch.message
  }
}
</script>

<style scoped>
.canvas-slot-machine {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  color: white;
}

.canvas-slot-machine.disabled {
  opacity: 0.6;
  pointer-events: none;
}

canvas {
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  background: transparent;
}

.control-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  width: 100%;
}

.game-info {
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;
}

.credits-display {
  padding: 8px 16px;
  background: linear-gradient(45deg, #f1c40f, #f39c12);
  border-radius: 20px;
  font-weight: bold;
  color: #2c3e50;
  box-shadow: 0 2px 10px rgba(241, 196, 15, 0.3);
}

.bet-selector {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
}

.bet-selector select {
  padding: 5px 10px;
  border-radius: 5px;
  border: none;
  background: white;
  color: #2c3e50;
  font-size: 14px;
}

.spin-button {
  padding: 15px 30px;
  font-size: 18px;
  font-weight: bold;
  color: white;
  background: linear-gradient(45deg, #e74c3c, #c0392b);
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(231, 76, 60, 0.4);
  min-width: 180px;
}

.spin-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(231, 76, 60, 0.6);
}

.spin-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.result-display {
  padding: 10px 20px;
  background: rgba(46, 204, 113, 0.9);
  border-radius: 20px;
  font-weight: bold;
  color: white;
  box-shadow: 0 2px 10px rgba(46, 204, 113, 0.3);
  text-align: center;
}

.payout {
  font-size: 18px;
  color: #f1c40f;
  margin-top: 5px;
}

.pay-table {
  margin-top: 10px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  text-align: center;
  max-width: 300px;
}

.pay-table h4 {
  margin: 0 0 10px 0;
  color: #f1c40f;
}

.pay-row {
  padding: 2px 0;
  font-size: 14px;
  display: flex;
  justify-content: space-between;
}
</style>