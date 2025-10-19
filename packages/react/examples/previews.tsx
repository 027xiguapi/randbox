import React from 'react';
import { ComponentPreview } from './ComponentPreview';
import { DiceGame } from '../src/components/DiceGame';
import { GridLottery } from '../src/components/GridLottery';
import { SlotMachine } from '../src/components/SlotMachine';
import { ScratchCard } from '../src/components/ScratchCard';

// 游戏组件预览
export const DiceGamePreview: React.FC = () => (
  <ComponentPreview
    component={DiceGame}
    componentName="骰子游戏 (DiceGame)"
    description="使用Canvas渲染的高性能骰子游戏组件"
    defaultProps={{
      diceCount: 2,
      sides: 6,
      gameMode: 'simple' as const,
      width: 400,
      height: 300
    }}
    propVariations={[
      {
        name: '大画布',
        props: { width: 600, height: 400, diceCount: 3 }
      },
      {
        name: '猜大小',
        props: { gameMode: 'bigSmall', width: 500, height: 350 }
      },
      {
        name: '多骰子',
        props: { diceCount: 4, sides: 6, gameMode: 'simple', width: 600, height: 400 }
      },
      {
        name: '十面骰',
        props: { diceCount: 2, sides: 10, gameMode: 'bigSmall', width: 450, height: 320 }
      }
    ]}
    config={{
      autoPlay: true,
      interval: 5000,
      randomizeProps: true,
      showSettings: true
    }}
  />
);

export const GridLotteryPreview: React.FC = () => (
  <ComponentPreview
    component={GridLottery}
    componentName="九宫格抽奖 (GridLottery)"
    description="使用Canvas渲染的九宫格抽奖组件，支持更丰富的视觉效果"
    defaultProps={{
      prizes: ['一等奖', '二等奖', '三等奖', '四等奖', '五等奖', '六等奖', '七等奖', '八等奖', '谢谢参与'],
      width: 400,
      height: 400,
      animationDuration: 2000
    }}
    propVariations={[
      {
        name: '大画布',
        props: { width: 500, height: 500 }
      },
      {
        name: 'emoji奖品',
        props: {
          prizes: ['🎁', '🏆', '💎', '⭐', '🎯', '🎪', '🎨', '🎭', '🎊'],
          width: 450,
          height: 450
        }
      },
      {
        name: '商品奖品',
        props: {
          prizes: ['iPhone 15', 'iPad', 'AirPods', 'Apple Watch', '优惠券', '积分', '代金券', '红包', '谢谢参与'],
          weights: [1, 3, 5, 8, 15, 20, 25, 20, 3],
          width: 480,
          height: 480
        }
      },
      {
        name: '快速模式',
        props: {
          prizes: ['🎯', '🏆', '🎮', '🎲', '🎪', '🎨', '🎭', '🎸', '🎊'],
          animationDuration: 800,
          width: 350,
          height: 350
        }
      }
    ]}
    config={{
      autoPlay: false,
      randomizeProps: true,
      showSettings: true
    }}
  />
);

export const SlotMachinePreview: React.FC = () => (
  <ComponentPreview
    component={SlotMachine}
    componentName="老虎机 (SlotMachine)"
    description="使用Canvas渲染的老虎机组件，提供流畅的动画效果"
    defaultProps={{
      reels: [
        ['🍎', '🍊', '🍋', '🍒', '🍇', '🔔', '💎', '7️⃣'],
        ['🍎', '🍊', '🍋', '🍒', '🍇', '🔔', '💎', '7️⃣'],
        ['🍎', '🍊', '🍋', '🍒', '🍇', '🔔', '💎', '7️⃣']
      ],
      width: 400,
      height: 300,
      animationDuration: 3000
    }}
    propVariations={[
      {
        name: '宽屏模式',
        props: { width: 600, height: 250 }
      },
      {
        name: '数字模式',
        props: {
          reels: [
            ['1', '2', '3', '4', '5', '6', '7'],
            ['1', '2', '3', '4', '5', '6', '7'],
            ['1', '2', '3', '4', '5', '6', '7']
          ],
          width: 450,
          height: 300
        }
      },
      {
        name: '五轴模式',
        props: {
          reels: [
            ['🍎', '🍊', '🍋', '🍒', '🍇'],
            ['🍎', '🍊', '🍋', '🍒', '🍇'],
            ['🍎', '🍊', '🍋', '🍒', '🍇'],
            ['🍎', '🍊', '🍋', '🍒', '🍇'],
            ['🍎', '🍊', '🍋', '🍒', '🍇']
          ],
          width: 500,
          height: 300
        }
      },
      {
        name: '字母模式',
        props: {
          reels: [
            ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
            ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
            ['A', 'B', 'C', 'D', 'E', 'F', 'G']
          ],
          animationDuration: 2000,
          width: 420,
          height: 280
        }
      }
    ]}
    config={{
      autoPlay: false,
      randomizeProps: true,
      showSettings: true
    }}
  />
);

export const ScratchCardPreview: React.FC = () => (
  <ComponentPreview
    component={ScratchCard}
    componentName="刮刮卡 (ScratchCard)"
    description="使用Canvas渲染的刮刮卡组件，支持真实的刮刮效果"
    defaultProps={{
      width: 300,
      height: 200,
      rows: 3,
      cols: 3,
      symbols: ['🍎', '🍊', '🍋', '🍒', '🍇', '🔔', '💎'],
      winProbability: 0.3
    }}
    propVariations={[
      {
        name: '大卡片',
        props: { width: 400, height: 300, rows: 4, cols: 4 }
      },
      {
        name: '高中奖率',
        props: {
          width: 350,
          height: 250,
          winProbability: 0.6,
          symbols: ['💰', '💎', '🏆', '🎯', '⭐']
        }
      },
      {
        name: '数字模式',
        props: {
          width: 380,
          height: 280,
          rows: 3,
          cols: 4,
          symbols: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
          winProbability: 0.4
        }
      },
      {
        name: '小卡片',
        props: {
          width: 250,
          height: 180,
          rows: 2,
          cols: 3,
          symbols: ['⭐', '💫', '✨', '🌟'],
          winProbability: 0.5
        }
      }
    ]}
    config={{
      autoPlay: false,
      randomizeProps: true,
      showSettings: true
    }}
  />
);

// 所有预览组件的导出
export const AllComponentPreviews = {
  DiceGamePreview,
  GridLotteryPreview,
  SlotMachinePreview,
  ScratchCardPreview
};

export default AllComponentPreviews;