export class CanvasUtils {
  static getDevicePixelRatio(): number {
    return window.devicePixelRatio || 1
  }

  static setupHighDPI(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, width: number, height: number) {
    const ratio = this.getDevicePixelRatio()

    canvas.width = width * ratio
    canvas.height = height * ratio
    canvas.style.width = width + 'px'
    canvas.style.height = height + 'px'

    ctx.scale(ratio, ratio)
  }

  static drawRoundedRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ) {
    ctx.beginPath()
    ctx.moveTo(x + radius, y)
    ctx.lineTo(x + width - radius, y)
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
    ctx.lineTo(x + width, y + height - radius)
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
    ctx.lineTo(x + radius, y + height)
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
    ctx.lineTo(x, y + radius)
    ctx.quadraticCurveTo(x, y, x + radius, y)
    ctx.closePath()
  }

  static drawText(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    fontSize: number = 16,
    color: string = '#000',
    align: CanvasTextAlign = 'center',
    baseline: CanvasTextBaseline = 'middle',
    fontFamily: string = 'Arial, sans-serif'
  ) {
    ctx.font = `${fontSize}px ${fontFamily}`
    ctx.fillStyle = color
    ctx.textAlign = align
    ctx.textBaseline = baseline
    ctx.fillText(text, x, y)
  }

  static easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
  }

  static easeOutBounce(t: number): number {
    const n1 = 7.5625
    const d1 = 2.75

    if (t < 1 / d1) {
      return n1 * t * t
    } else if (t < 2 / d1) {
      return n1 * (t -= 1.5 / d1) * t + 0.75
    } else if (t < 2.5 / d1) {
      return n1 * (t -= 2.25 / d1) * t + 0.9375
    } else {
      return n1 * (t -= 2.625 / d1) * t + 0.984375
    }
  }

  static isPointInRect(x: number, y: number, rect: { x: number, y: number, width: number, height: number }): boolean {
    return x >= rect.x && x <= rect.x + rect.width && y >= rect.y && y <= rect.y + rect.height
  }

  static getRandomColor(): string {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F']
    return colors[Math.floor(Math.random() * colors.length)]
  }

  static lerp(start: number, end: number, factor: number): number {
    return start + (end - start) * factor
  }

  static degToRad(degrees: number): number {
    return (degrees * Math.PI) / 180
  }

  static radToDeg(radians: number): number {
    return (radians * 180) / Math.PI
  }
}

export interface Point {
  x: number
  y: number
}

export interface Size {
  width: number
  height: number
}

export interface Rect extends Point, Size {}

export interface AnimationState {
  startTime: number
  duration: number
  startValue: number
  endValue: number
  easing: (t: number) => number
}

export class Animation {
  private animations: Map<string, AnimationState> = new Map()
  private requestId?: number

  start(
    key: string,
    startValue: number,
    endValue: number,
    duration: number,
    easing: (t: number) => number = CanvasUtils.easeInOutCubic
  ): Promise<void> {
    return new Promise((resolve) => {
      this.animations.set(key, {
        startTime: Date.now(),
        duration,
        startValue,
        endValue,
        easing
      })

      const animate = () => {
        const now = Date.now()
        let hasActiveAnimations = false

        for (const [animKey, state] of this.animations) {
          const elapsed = now - state.startTime
          const progress = Math.min(elapsed / state.duration, 1)

          if (progress >= 1) {
            this.animations.delete(animKey)
            if (animKey === key) resolve()
          } else {
            hasActiveAnimations = true
          }
        }

        if (hasActiveAnimations) {
          this.requestId = requestAnimationFrame(animate)
        }
      }

      animate()
    })
  }

  getValue(key: string): number | null {
    const state = this.animations.get(key)
    if (!state) return null

    const elapsed = Date.now() - state.startTime
    const progress = Math.min(elapsed / state.duration, 1)
    const easedProgress = state.easing(progress)

    return CanvasUtils.lerp(state.startValue, state.endValue, easedProgress)
  }

  stop(key?: string) {
    if (key) {
      this.animations.delete(key)
    } else {
      this.animations.clear()
    }

    if (this.requestId) {
      cancelAnimationFrame(this.requestId)
      this.requestId = undefined
    }
  }

  isAnimating(key?: string): boolean {
    if (key) {
      return this.animations.has(key)
    }
    return this.animations.size > 0
  }
}