import type { MetaRecord } from 'nextra'
import { TitleBadge } from '@/components/TitleBadge'

export default {
  index: {
    type: 'page',
    display: 'hidden',
    theme: {
      timestamp: false,
      layout: 'full',
      toc: false,
    },
  },
  introduction: {
    type: 'page',
    theme: {
      navbar: true,
      toc: false,
    },
  },
  docs: {
    title: '📦 示例代码',
    type: 'page',
  },
  blog: {
    title: '博客',
    type: 'page',
  },
  upgrade: {
    title: (
      <span className="flex items-center leading-[1]">
        新变化
        <TitleBadge />
      </span>
    ),
    type: 'page',
  },
  simple: {
    title: '简单随机化',
  },
  block: {
    title: '区组随机化',
  },
  stratified: {
    title: '分层随机化',
  },
  'coin-flip': {
    title: '抛硬币',
  },
  'dice-game': {
    title: '骰子游戏',
  },
  'grid-lottery': {
    title: '网格抽奖',
  },
  'rock-paper-scissors': {
    title: '石头剪刀布',
  },
  'scratch-card': {
    title: '刮刮卡',
  },
  'slot-machine': {
    title: '老虎机',
  },
  history: {
    title: '历史',
  },
} satisfies MetaRecord
