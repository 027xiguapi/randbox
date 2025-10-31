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

export function simpleRandomization(
  N: number,
  numArms: number,
  seed?: number,
  prob?: number[],
  _prob_unit?: string,
  _prob_each?: string,
  conditions?: string,
  _check_inputs: boolean = true,
  _simple: boolean = true,
): RandomizationResult {
  const rng = new RandomGenerator(seed)
  const participants = Array.from({ length: N }, (_, _i) => _i + 1)
  const shuffled = shuffle(participants, rng)

  // Parse conditions if provided
  const groupNames = conditions
    ? conditions.split(',').map(c => c.trim())
    : Array.from({ length: numArms }, (_, _i) => `组 ${_i + 1}`)

  const groups = groupNames.map((name, _i) => ({
    name,
    participants: [] as number[],
    size: 0,
  }))

  // Use probability-based assignment if prob is provided
  if (prob && prob.length > 0) {
    // Calculate cumulative probabilities
    const cumulativeProbs = prob.reduce<number[]>((acc, p, i) => {
      acc.push((acc[i - 1] || 0) + p)
      return acc
    }, [])

    shuffled.forEach((participant) => {
      const random = rng.next()
      let groupIndex = 0

      for (let i = 0; i < cumulativeProbs.length; i++) {
        if (random <= cumulativeProbs[i]) {
          groupIndex = i
          break
        }
      }

      groups[groupIndex].participants.push(participant)
      groups[groupIndex].size++
    })
  }
  else {
    // Distribute participants evenly
    shuffled.forEach((participant, index) => {
      const groupIndex = index % numArms
      groups[groupIndex].participants.push(participant)
      groups[groupIndex].size++
    })
  }

  const groupSizes = groups.map((g) => g.size)
  const balance = 1 - (Math.max(...groupSizes) - Math.min(...groupSizes)) / Math.max(...groupSizes)

  return {
    groups,
    totalParticipants: N,
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
  blocks?: any,
  prob?: number[] | null,
  prob_unit?: string | null,
  prob_each?: string | null,
  m?: any,
  m_unit?: string | null,
  block_m?: any,
  block_m_each?: any,
  block_prob?: number[] | null,
  block_prob_each?: any,
  num_arms?: number | null,
  conditions?: string | null,
  check_inputs: boolean = true,
): BlockResult {
  // Default values for backward compatibility
  const totalParticipants = 20
  const groupCount = num_arms || 2
  const blockSize = blocks || 4
  const seed = Date.now()
  const rng = new RandomGenerator(seed)
  const participants = Array.from({ length: totalParticipants }, (_, i) => i + 1)
  const shuffled = shuffle(participants, rng)

  const blockList: Array<{
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

    blockList.push({
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

  blockList.forEach((block) => {
    block.groups.forEach((group, index) => {
      combinedGroups[index].participants.push(...group.participants)
      combinedGroups[index].size += group.size
    })
  })

  const groupSizes = combinedGroups.map((g) => g.size)
  const balance = 1 - (Math.max(...groupSizes) - Math.min(...groupSizes)) / Math.max(...groupSizes)

  return {
    groups: combinedGroups,
    blocks: blockList,
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
