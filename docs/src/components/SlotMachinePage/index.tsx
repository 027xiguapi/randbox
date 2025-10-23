'use client'

import type { SlotMachineResult } from '@randbox/react'
import { SlotMachine } from '@randbox/react'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLocale } from '@/hooks'

export default function SlotMachinePage() {
  const { t, currentLocale } = useLocale()
  const [history, setHistory] = useState<SlotMachineResult[]>([])
  const [customReels, setCustomReels] = useState<string>('🍎,🍊,🍋,🍇,🍓')
  const [isCustomMode, setIsCustomMode] = useState(false)

  // 默认转轮内容
  const defaultReels = [
    ['🍎', '🍊', '🍋', '🍇', '🍓', '🥝', '🍒', '🍑'],
    ['🍎', '🍊', '🍋', '🍇', '🍓', '🥝', '🍒', '🍑'],
    ['🍎', '🍊', '🍋', '🍇', '🍓', '🥝', '🍒', '🍑'],
  ]

  const customReelsArray = isCustomMode
    ? customReels.split(',').map(item => item.trim()).filter(item => item)
    : ['🍎', '🍊', '🍋', '🍇', '🍓', '🥝', '🍒', '🍑']

  const reels = isCustomMode
    ? [customReelsArray, customReelsArray, customReelsArray]
    : defaultReels

  const handleResult = (result: SlotMachineResult) => {
    setHistory(prev => [result, ...prev.slice(0, 9)]) // 保持最近10条记录
  }

  const clearHistory = () => {
    setHistory([])
  }

  // 计算统计信息
  const stats = {
    totalGames: history.length,
    jackpots: history.filter(r => r.isJackpot).length,
    jackpotRate: history.length > 0 ? ((history.filter(r => r.isJackpot).length / history.length) * 100).toFixed(1) : '0',
    combinations: [...new Set(history.map(r => r.combination))].length,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">{t('slotMachinePage.title')}</h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {t('slotMachinePage.subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* 游戏区域 */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  {t('slotMachinePage.gamePanel.title')}
                </CardTitle>
                <CardDescription>{t('slotMachinePage.gamePanel.description')}</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center p-8">
                <SlotMachine
                  reels={reels}
                  animationDuration={2500}
                  buttonText={t('slotMachinePage.gamePanel.buttonText')}
                  onResult={handleResult}
                  onGameStart={() => console.log('老虎机开始')}
                  onGameEnd={(result) => console.log('老虎机结束', result)}
                />
              </CardContent>
            </Card>

            {/* 转轮设置 */}
            <Card className="mt-6 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  {t('slotMachinePage.settings.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="customMode"
                    checked={isCustomMode}
                    onChange={(e) => setIsCustomMode(e.target.checked)}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="customMode">{t('slotMachinePage.settings.customMode')}</Label>
                </div>

                {isCustomMode && (
                  <div className="space-y-2">
                    <Label htmlFor="reels">{t('slotMachinePage.settings.reelsLabel')}</Label>
                    <Input
                      id="reels"
                      value={customReels}
                      onChange={(e) => setCustomReels(e.target.value)}
                      placeholder={t('slotMachinePage.settings.reelsPlaceholder')}
                      className="text-sm"
                    />
                    <p className="text-xs text-slate-500">
                      {t('slotMachinePage.settings.reelsHint')}
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>{t('slotMachinePage.settings.previewLabel')}</Label>
                  <div className="grid grid-cols-8 gap-2">
                    {(isCustomMode ? customReelsArray : defaultReels[0]).map((item, index) => (
                      <div
                        key={index}
                        className="p-2 text-center bg-slate-100 dark:bg-slate-800 rounded border text-lg"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 右侧面板 */}
          <div className="space-y-6">
            {/* 游戏统计 */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  {t('slotMachinePage.statistics.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">{t('slotMachinePage.statistics.totalGames')}</span>
                    <Badge variant="secondary">{stats.totalGames}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">{t('slotMachinePage.statistics.jackpots')}</span>
                    <Badge variant={stats.jackpots > 0 ? 'default' : 'secondary'}>
                      {stats.jackpots}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">{t('slotMachinePage.statistics.jackpotRate')}</span>
                    <Badge variant={Number(stats.jackpotRate) > 20 ? 'default' : 'secondary'}>
                      {stats.jackpotRate}
                      %
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">{t('slotMachinePage.statistics.combinations')}</span>
                    <Badge variant="outline">{stats.combinations}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 游戏历史 */}
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      {t('slotMachinePage.history.title')}
                    </CardTitle>
                    <CardDescription>{t('slotMachinePage.history.description')}</CardDescription>
                  </div>
                  {history.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearHistory}
                    >
                      {t('slotMachinePage.history.clearButton')}
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {history.length > 0
                  ? (
                      <div className="space-y-3 max-h-80 overflow-y-auto">
                        {history.map((result, index) => (
                          <div
                            key={index}
                            className={`p-3 border rounded-lg ${
                              result.isJackpot
                                ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                                : 'bg-slate-50 dark:bg-slate-800'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <Badge
                                variant={result.isJackpot ? 'default' : 'secondary'}
                                className="text-xs"
                              >
                                {result.isJackpot ? t('slotMachinePage.history.jackpot') : t('slotMachinePage.history.round', { round: index + 1 })}
                              </Badge>
                              <span className="text-xs text-slate-500">
                                {new Date().toLocaleTimeString()}
                              </span>
                            </div>
                            <div className="font-mono text-lg text-center mb-2">
                              {result.results.join(' | ')}
                            </div>
                            <div className="text-center">
                              <span className="text-xs text-slate-600 dark:text-slate-400">
                                {result.combination}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  : (
                      <div className="text-center py-8 text-slate-500">
                        <div className="w-12 h-12 mx-auto mb-3 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                          🎰
                        </div>
                        <p className="text-sm">{t('slotMachinePage.history.noHistory')}</p>
                        <p className="text-xs">{t('slotMachinePage.history.startPlaying')}</p>
                      </div>
                    )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 游戏说明 */}
        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle>{t('slotMachinePage.explanation.title')}</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">{t('slotMachinePage.explanation.rules.title')}</h4>
                <ul className="text-sm space-y-1">
                  <li>{t('slotMachinePage.explanation.rules.rule1')}</li>
                  <li>{t('slotMachinePage.explanation.rules.rule2')}</li>
                  <li>{t('slotMachinePage.explanation.rules.rule3')}</li>
                  <li>{t('slotMachinePage.explanation.rules.rule4')}</li>
                  <li>{t('slotMachinePage.explanation.rules.rule5')}</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">{t('slotMachinePage.explanation.tech.title')}</h4>
                <ul className="text-sm space-y-1">
                  <li>{t('slotMachinePage.explanation.tech.feature1')}</li>
                  <li>{t('slotMachinePage.explanation.tech.feature2')}</li>
                  <li>{t('slotMachinePage.explanation.tech.feature3')}</li>
                  <li>{t('slotMachinePage.explanation.tech.feature4')}</li>
                  <li>{t('slotMachinePage.explanation.tech.feature5')}</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
