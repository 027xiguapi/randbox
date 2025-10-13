import type { BlockResult, RandomizationResult, StratificationResult } from './randomization'

export type RandomizationType = 'simple' | 'stratified' | 'block'

export interface SimpleParams {
  totalParticipants: number
  groupCount: number
  seed?: string
}

export interface StratifiedParams {
  strata: Array<{ name: string, size: number }>
  groupCount: number
  seed?: string
}

export interface BlockParams {
  sampleSize: number
  groupCount: number
  blockSize: number
  seed?: string
}

export interface HistoryRecord {
  id: string
  type: RandomizationType
  timestamp: string
  params: SimpleParams | StratifiedParams | BlockParams
  result: RandomizationResult | StratificationResult | BlockResult
  title?: string
}

export class RandomizationHistory {
  private static readonly STORAGE_KEY = 'randomization_history'
  private static readonly MAX_RECORDS = 100

  static saveRecord(
    type: RandomizationType,
    params: SimpleParams | StratifiedParams | BlockParams,
    result: RandomizationResult | StratificationResult | BlockResult,
    title?: string,
  ): void {
    try {
      const records = this.getRecords()
      const newRecord: HistoryRecord = {
        id: this.generateId(),
        type,
        timestamp: new Date().toISOString(),
        params,
        result,
        title: title || this.generateTitle(type, params),
      }

      records.unshift(newRecord)

      // Keep only the latest MAX_RECORDS
      if (records.length > this.MAX_RECORDS) {
        records.splice(this.MAX_RECORDS)
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(records))
    }
    catch (error) {
      console.error('Failed to save randomization history:', error)
    }
  }

  static getRecords(): HistoryRecord[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    }
    catch (error) {
      console.error('Failed to load randomization history:', error)
      return []
    }
  }

  static getRecordsByType(type: RandomizationType): HistoryRecord[] {
    return this.getRecords().filter(record => record.type === type)
  }

  static deleteRecord(id: string): void {
    try {
      const records = this.getRecords().filter(record => record.id !== id)
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(records))
    }
    catch (error) {
      console.error('Failed to delete history record:', error)
    }
  }

  static clearHistory(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY)
    }
    catch (error) {
      console.error('Failed to clear history:', error)
    }
  }

  static exportHistory(): string {
    const records = this.getRecords()
    return JSON.stringify(records, null, 2)
  }

  static importHistory(data: string): boolean {
    try {
      const records = JSON.parse(data) as HistoryRecord[]

      // Validate the data structure
      if (!Array.isArray(records)) {
        throw new TypeError('Invalid data format')
      }

      // Basic validation of record structure
      for (const record of records) {
        if (!record.id || !record.type || !record.timestamp || !record.params || !record.result) {
          throw new Error('Invalid record structure')
        }
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(records))
      return true
    }
    catch (error) {
      console.error('Failed to import history:', error)
      return false
    }
  }

  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
  }

  private static generateTitle(type: RandomizationType, params: any): string {
    const date = new Date().toLocaleDateString()

    switch (type) {
      case 'simple':
        return `简单随机化 - ${params.totalParticipants}人${params.groupCount}组 (${date})`
      case 'stratified':
        const totalStrata = params.strata?.length || 0
        const totalParticipants = params.strata?.reduce((sum: number, s: any) => sum + s.size, 0) || 0
        return `分层随机化 - ${totalParticipants}人${totalStrata}层${params.groupCount}组 (${date})`
      case 'block':
        return `区组随机化 - ${params.sampleSize}人块大小${params.blockSize} (${date})`
      default:
        return `随机化记录 (${date})`
    }
  }
}
