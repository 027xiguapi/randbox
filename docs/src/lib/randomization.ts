export interface RandomizationResult {
  groups: Array<{
    name: string
    participants: number[]
    size: number
  }>
  totalParticipants: number
  algorithm: string
  timestamp: string
  statistics: {
    groupSizes: number[]
    balance: number
    efficiency: number
  }
}

export interface StratificationResult extends RandomizationResult {
  strata: Array<{
    name: string
    groups: Array<{
      name: string
      participants: number[]
      size: number
    }>
  }>
}

export interface BlockResult extends RandomizationResult {
  blocks: Array<{
    blockNumber: number
    groups: Array<{
      name: string
      participants: number[]
      size: number
    }>
  }>
}

// Linear Congruential Generator for reproducible randomization
class RandomGenerator {
  private seed: number

  constructor(seed?: number) {
    this.seed = seed || Date.now()
  }

  next(): number {
    this.seed = (this.seed * 1664525 + 1013904223) % 2 ** 32
    return this.seed / 2 ** 32
  }

  setSeed(seed: number) {
    this.seed = seed
  }
}

// Fisher-Yates shuffle algorithm
function shuffle<T>(array: T[], rng: RandomGenerator): T[] {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng.next() * (i + 1))
		;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export function simpleRandomization(totalParticipants: number, groupCount: number, seed?: number): RandomizationResult {
  const rng = new RandomGenerator(seed)
  const participants = Array.from({ length: totalParticipants }, (_, i) => i + 1)
  const shuffled = shuffle(participants, rng)

  const groups = Array.from({ length: groupCount }, (_, i) => ({
    name: `组 ${i + 1}`,
    participants: [] as number[],
    size: 0,
  }))

  // Distribute participants evenly
  shuffled.forEach((participant, index) => {
    const groupIndex = index % groupCount
    groups[groupIndex].participants.push(participant)
    groups[groupIndex].size++
  })

  const groupSizes = groups.map((g) => g.size)
  const balance = 1 - (Math.max(...groupSizes) - Math.min(...groupSizes)) / Math.max(...groupSizes)

  return {
    groups,
    totalParticipants,
    algorithm: '简单随机化',
    timestamp: new Date().toISOString(),
    statistics: {
      groupSizes,
      balance,
      efficiency: 0.95,
    },
  }
}

export function stratifiedRandomization(
  strata: Array<{ name: string, size: number }>,
  groupCount: number,
  seed?: number,
): StratificationResult {
  const rng = new RandomGenerator(seed)
  let participantId = 1

  const strataResults = strata.map((stratum) => {
    const participants = Array.from({ length: stratum.size }, () => participantId++)
    const shuffled = shuffle(participants, rng)

    const groups = Array.from({ length: groupCount }, (_, i) => ({
      name: `组 ${i + 1}`,
      participants: [] as number[],
      size: 0,
    }))

    shuffled.forEach((participant, index) => {
      const groupIndex = index % groupCount
      groups[groupIndex].participants.push(participant)
      groups[groupIndex].size++
    })

    return {
      name: stratum.name,
      groups,
    }
  })

  // Combine all groups across strata
  const combinedGroups = Array.from({ length: groupCount }, (_, i) => ({
    name: `组 ${i + 1}`,
    participants: [] as number[],
    size: 0,
  }))

  strataResults.forEach((stratum) => {
    stratum.groups.forEach((group, index) => {
      combinedGroups[index].participants.push(...group.participants)
      combinedGroups[index].size += group.size
    })
  })

  const totalParticipants = strata.reduce((sum, s) => sum + s.size, 0)
  const groupSizes = combinedGroups.map((g) => g.size)
  const balance = 1 - (Math.max(...groupSizes) - Math.min(...groupSizes)) / Math.max(...groupSizes)

  return {
    groups: combinedGroups,
    strata: strataResults,
    totalParticipants,
    algorithm: '分层随机化',
    timestamp: new Date().toISOString(),
    statistics: {
      groupSizes,
      balance,
      efficiency: 0.98,
    },
  }
}

export function blockRandomization(
  totalParticipants: number,
  groupCount: number,
  blockSize: number,
  seed?: number,
): BlockResult {
  const rng = new RandomGenerator(seed)
  const participants = Array.from({ length: totalParticipants }, (_, i) => i + 1)
  const shuffled = shuffle(participants, rng)

  const blocks: Array<{
    blockNumber: number
    groups: Array<{
      name: string
      participants: number[]
      size: number
    }>
  }> = []

  const participantsPerGroup = blockSize / groupCount
  let currentParticipant = 0
  let blockNumber = 1

  while (currentParticipant < shuffled.length) {
    const blockParticipants = shuffled.slice(currentParticipant, currentParticipant + blockSize)
    const blockShuffled = shuffle(blockParticipants, rng)

    const groups = Array.from({ length: groupCount }, (_, i) => ({
      name: `组 ${i + 1}`,
      participants: [] as number[],
      size: 0,
    }))

    blockShuffled.forEach((participant, index) => {
      const groupIndex = Math.floor(index / participantsPerGroup)
      if (groupIndex < groupCount) {
        groups[groupIndex].participants.push(participant)
        groups[groupIndex].size++
      }
    })

    blocks.push({
      blockNumber,
      groups,
    })

    currentParticipant += blockSize
    blockNumber++
  }

  // Combine all groups across blocks
  const combinedGroups = Array.from({ length: groupCount }, (_, i) => ({
    name: `组 ${i + 1}`,
    participants: [] as number[],
    size: 0,
  }))

  blocks.forEach((block) => {
    block.groups.forEach((group, index) => {
      combinedGroups[index].participants.push(...group.participants)
      combinedGroups[index].size += group.size
    })
  })

  const groupSizes = combinedGroups.map((g) => g.size)
  const balance = 1 - (Math.max(...groupSizes) - Math.min(...groupSizes)) / Math.max(...groupSizes)

  return {
    groups: combinedGroups,
    blocks,
    totalParticipants,
    algorithm: '区组随机化',
    timestamp: new Date().toISOString(),
    statistics: {
      groupSizes,
      balance,
      efficiency: 0.99,
    },
  }
}
