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
    title: 'This is Introduction',
    theme: {
      navbar: true,
      toc: false,
    },
  },
  docs: {
    title: '📦 Some Examples',
    type: 'page',
  },
  blog: {
    title: 'Blog',
    type: 'page',
  },
  upgrade: {
    title: (
      <span className="flex items-center leading-[1]">
        What's New
        <TitleBadge />
      </span>
    ),
    type: 'page',
  },
  simple: {
    title: 'Simple Random',
  },
  block: {
    title: 'Block Random',
  },
  stratified: {
    title: 'Stratified Random',
  },
  'dice-game': {
    title: 'Dice Game',
  },
  'grid-lottery': {
    title: 'Grid Lottery',
  },
  'rock-paper-scissors': {
    title: 'Rock Paper Scissors',
  },
  'scratch-card': {
    title: 'Scratch Card',
  },
  'slot-machine': {
    title: 'Slot Machine',
  },
  history: {
    title: 'History',
  },
} satisfies MetaRecord
