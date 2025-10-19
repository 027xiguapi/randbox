<template>
  <div class="canvas-rock-paper-scissors" :class="{ disabled }">
    <canvas
      ref="canvasRef"
      @click="handleCanvasClick"
      :style="{ cursor: isPlaying || disabled ? 'default' : 'pointer' }"
    />

    <div class="control-panel">
      <div class="choice-buttons">
        <button
          v-for="choice in choices"
          :key="choice"
          @click="handlePlayerChoice(choice)"
          :disabled="isPlaying || disabled"
          class="choice-button"
        >
          {{ emojis[choice] }} {{ choice }}
        </button>
      </div>

      <div v-if="showStats && stats" class="stats-display">
        胜率: {{ stats.winRate }} ({{ stats.wins }}/{{ stats.totalGames }})
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, defineProps, defineEmits, computed } from 'vue'
import type { RockPaperScissorsProps, RPSResult, RPSStats } from '../types'
import { CanvasUtils, Animation } from '../utils/CanvasUtils'

const props = withDefaults(defineProps<RockPaperScissorsProps>(), {
  choices: () => ['石头', '剪刀', '布'],
  emojis: () => ({ '石头': '🪨', '剪刀': '✂️', '布': '📄' }),
  showStats: false,
  strategy: 'random',
  disabled: false
})

const emit = defineEmits<{
  result: [result: RPSResult]
}>()

const canvasRef = ref<HTMLCanvasElement>()
const isPlaying = ref(false)
const currentResult = ref<RPSResult>()
const gameHistory = ref<RPSResult[]>([])

let ctx: CanvasRenderingContext2D
let animation: Animation

const CANVAS_WIDTH = 400
const CANVAS_HEIGHT = 300

const stats = computed<RPSStats>(() => {
  const totalGames = gameHistory.value.length
  const wins = gameHistory.value.filter(r => r.result === 'win').length
  const losses = gameHistory.value.filter(r => r.result === 'lose').length
  const ties = gameHistory.value.filter(r => r.result === 'tie').length

  return {
    totalGames,
    wins,
    losses,
    ties,
    winRate: totalGames > 0 ? ((wins / totalGames) * 100).toFixed(1) + '%' : '0%'
  }
})

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
  gradient.addColorStop(0, '#667eea')
  gradient.addColorStop(1, '#764ba2')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

  // 绘制对战区域
  drawBattleArea()

  // 绘制游戏标题
  CanvasUtils.drawText(
    ctx,
    '石头剪刀布',
    CANVAS_WIDTH / 2,
    30,
    24,
    '#ffffff',
    'center',
    'middle',
    'bold Arial'
  )

  if (isPlaying.value) {
    requestAnimationFrame(draw)
  }
}

function drawBattleArea() {
  const centerY = CANVAS_HEIGHT / 2
  const leftX = CANVAS_WIDTH / 4
  const rightX = (CANVAS_WIDTH * 3) / 4

  // 绘制玩家区域
  drawPlayerArea(leftX, centerY, '玩家', currentResult.value?.emoji.player || '❓')

  // 绘制VS文字
  CanvasUtils.drawText(
    ctx,
    'VS',
    CANVAS_WIDTH / 2,
    centerY,
    20,
    '#ffffff',
    'center',
    'middle',
    'bold Arial'
  )

  // 绘制电脑区域
  drawPlayerArea(rightX, centerY, '电脑', currentResult.value?.emoji.computer || '❓')

  // 绘制结果
  if (currentResult.value) {
    const resultColor = currentResult.value.result === 'win' ? '#2ecc71' :
                       currentResult.value.result === 'lose' ? '#e74c3c' : '#f39c12'

    CanvasUtils.drawText(
      ctx,
      currentResult.value.message,
      CANVAS_WIDTH / 2,
      centerY + 80,
      18,
      resultColor,
      'center',
      'middle',
      'bold Arial'
    )
  }
}

function drawPlayerArea(x: number, y: number, label: string, emoji: string) {
  // 绘制背景圆圈
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'
  ctx.beginPath()
  ctx.arc(x, y, 60, 0, Math.PI * 2)
  ctx.fill()

  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.arc(x, y, 60, 0, Math.PI * 2)
  ctx.stroke()

  // 绘制emoji
  CanvasUtils.drawText(
    ctx,
    emoji,
    x,
    y,
    40,
    '#ffffff',
    'center',
    'middle'
  )

  // 绘制标签
  CanvasUtils.drawText(
    ctx,
    label,
    x,
    y + 90,
    16,
    '#ffffff',
    'center',
    'middle',
    'Arial'
  )
}

function handleCanvasClick() {
  // Canvas点击暂时不处理，使用按钮操作
}

async function handlePlayerChoice(playerChoice: string) {
  if (isPlaying.value || props.disabled) return

  isPlaying.value = true

  // 生成电脑选择
  const computerChoice = generateComputerChoice()

  // 确定结果
  const result = determineWinner(playerChoice, computerChoice)

  // 创建结果对象
  const gameResult: RPSResult = {
    playerChoice,
    computerChoice,
    result,
    message: getResultMessage(result),
    emoji: {
      player: props.emojis[playerChoice],
      computer: props.emojis[computerChoice]
    },
    round: gameHistory.value.length + 1
  }

  // 执行选择动画
  await animateChoice(gameResult)

  // 更新状态
  currentResult.value = gameResult
  gameHistory.value.push(gameResult)
  isPlaying.value = false

  emit('result', gameResult)
}

function generateComputerChoice(): string {
  switch (props.strategy) {
    case 'counter':
      // 反制策略：根据玩家历史选择反制
      if (gameHistory.value.length > 0) {
        const lastPlayerChoice = gameHistory.value[gameHistory.value.length - 1].playerChoice
        const counterMap: Record<string, string> = {
          '石头': '布',
          '剪刀': '石头',
          '布': '剪刀'
        }
        return counterMap[lastPlayerChoice] || props.choices[0]
      }
      break

    case 'pattern':
      // 模式策略：尝试识别玩家模式
      if (gameHistory.value.length >= 2) {
        const recentChoices = gameHistory.value.slice(-2).map(r => r.playerChoice)
        if (recentChoices[0] === recentChoices[1]) {
          // 如果玩家连续选择相同，预测继续
          const counterMap: Record<string, string> = {
            '石头': '布',
            '剪刀': '石头',
            '布': '剪刀'
          }
          return counterMap[recentChoices[1]] || props.choices[0]
        }
      }
      break

    default:
      // 随机策略
      break
  }

  return props.choices[Math.floor(Math.random() * props.choices.length)]
}

function determineWinner(player: string, computer: string): 'win' | 'lose' | 'tie' {
  if (player === computer) return 'tie'

  const winConditions: Record<string, string> = {
    '石头': '剪刀',
    '剪刀': '布',
    '布': '石头'
  }

  return winConditions[player] === computer ? 'win' : 'lose'
}

function getResultMessage(result: 'win' | 'lose' | 'tie'): string {
  switch (result) {
    case 'win': return '你赢了！'
    case 'lose': return '你输了！'
    case 'tie': return '平局！'
  }
}

async function animateChoice(result: RPSResult) {
  // 显示选择过程动画
  const animationFrames = ['❓', '🤔', '💭']

  for (const frame of animationFrames) {
    currentResult.value = {
      ...result,
      emoji: {
        player: frame,
        computer: frame
      }
    }
    draw()
    await new Promise(resolve => setTimeout(resolve, 300))
  }

  // 显示最终结果
  currentResult.value = result
  draw()
}
</script>

<style scoped>
.canvas-rock-paper-scissors {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.canvas-rock-paper-scissors.disabled {
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

.choice-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.choice-button {
  padding: 10px 16px;
  font-size: 14px;
  font-weight: bold;
  color: white;
  background: linear-gradient(45deg, #4ecdc4, #44a08d);
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(68, 160, 141, 0.4);
  min-width: 80px;
}

.choice-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(68, 160, 141, 0.6);
}

.choice-button:disabled {
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
</style>