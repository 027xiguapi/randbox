import type { CSSProperties } from 'vue'

export interface BaseGameProps {
  class?: string
  style?: CSSProperties
  disabled?: boolean
  onGameStart?: () => void
  onGameEnd?: (result: any) => void
}

export interface GridLotteryProps extends BaseGameProps {
  prizes: string[]
  weights?: number[]
  gridSize?: number
  animationDuration?: number
  buttonText?: string
  onResult?: (result: GridLotteryResult) => void
}

export interface GridLotteryResult {
  position: number
  prize: string
  animation: number[]
}

export interface SlotMachineProps extends BaseGameProps {
  reels: string[][]
  weights?: number[][]
  animationDuration?: number
  buttonText?: string
  onResult?: (result: SlotMachineResult) => void
}

export interface SlotMachineResult {
  results: string[]
  isJackpot: boolean
  combination: string
}

export interface ScratchCardProps extends BaseGameProps {
  rows?: number
  cols?: number
  symbols?: string[]
  winProbability?: number
  onScratch?: (result: ScratchCardResult) => void
  onNewCard?: () => void
}

export interface ScratchCardResult {
  grid: string[][]
  isWinner: boolean
  winningInfo?: {
    pattern: string[]
    name: string
    prize: string
    positions: Array<{
      row: number
      col: number
    }>
  }
}

export interface RockPaperScissorsProps extends BaseGameProps {
  choices?: string[]
  emojis?: Record<string, string>
  showStats?: boolean
  strategy?: 'random' | 'counter' | 'pattern'
  onResult?: (result: RPSResult) => void
}

export interface RPSResult {
  playerChoice: string
  computerChoice: string
  result: 'win' | 'lose' | 'tie'
  message: string
  emoji: {
    player: string
    computer: string
  }
  round: number
}

export interface RPSStats {
  totalGames: number
  wins: number
  losses: number
  ties: number
  winRate: string
}

export interface DiceGameProps extends BaseGameProps {
  diceCount?: number
  sides?: number
  gameMode?: 'simple' | 'bigSmall' | 'guess'
  onResult?: (result: DiceGameResult) => void
}

export interface DiceGameResult {
  results: number[]
  total: number
  gameMode: string
  isWin?: boolean
  message: string
}

export interface AnimationState {
  isAnimating: boolean
  currentStep: number
  totalSteps: number
}

export interface GameState {
  isPlaying: boolean
  result?: any
  history: any[]
}

export interface GameTheme {
  primaryColor: string
  secondaryColor: string
  backgroundColor: string
  textColor: string
  borderRadius: string
  fontFamily: string
}

export interface GameConfigContextType {
  theme: GameTheme
  locale: 'zh-CN' | 'en-US'
  soundEnabled: boolean
  animationEnabled: boolean
}