'use client'

import type { GridLotteryResult } from '@randbox/react'
import { GridLottery } from '@randbox/react'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useLocale } from '@/hooks'

export default function GridLotteryPage() {
  const { t, currentLocale } = useLocale()
  const [history, setHistory] = useState<GridLotteryResult[]>([])
  const [customPrizes, setCustomPrizes] = useState<string>(
    currentLocale === 'zh'
      ? 'iPhone 15,iPad,MacBook,Apple Watch,AirPods,充电宝,数据线,谢谢参与,再来一次'
      : 'iPhone 15,iPad,MacBook,Apple Watch,AirPods,Power Bank,Cable,Thank You,Try Again',
  )
  const [isCustomMode, setIsCustomMode] = useState(false)

  // 默认奖品
  const defaultPrizes = currentLocale === 'zh'
    ? [
        '🎁 特等奖',
        '🏆 一等奖',
        '🥇 二等奖',
        '🥈 三等奖',
        '🥉 四等奖',
        '🎊 五等奖',
        '🎈 纪念奖',
        '😊 谢谢参与',
        '🔄 再来一次',
      ]
    : [
        '🎁 Grand Prize',
        '🏆 First Prize',
        '🥇 Second Prize',
        '🥈 Third Prize',
        '🥉 Fourth Prize',
        '🎊 Fifth Prize',
        '🎈 Memorial Prize',
        '😊 Thank You',
        '🔄 Try Again',
      ]

  const prizes = isCustomMode
    ? customPrizes.split(',').map(p => p.trim()).filter(p => p)
    : defaultPrizes

  const handleResult = (result: GridLotteryResult) => {
    setHistory(prev => [result, ...prev.slice(0, 9)]) // 保持最近10条记录
  }

  const clearHistory = () => {
    setHistory([])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">{t('gridLotteryPage.title')}</h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {t('gridLotteryPage.subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* 游戏区域 */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  {t('gridLotteryPage.gamePanel.title')}
                </CardTitle>
                <CardDescription>{t('gridLotteryPage.gamePanel.description')}</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center p-8">
                <GridLottery
                  prizes={prizes}
                  animationDuration={3000}
                  buttonText={t('gridLotteryPage.gamePanel.buttonText')}
                  onResult={handleResult}
                  onGameStart={() => console.log('游戏开始')}
                  onGameEnd={(result) => console.log('游戏结束', result)}
                />
              </CardContent>
            </Card>

            {/* 奖品设置 */}
            <Card className="mt-6 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  {t('gridLotteryPage.settings.title')}
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
                  <Label htmlFor="customMode">{t('gridLotteryPage.settings.customMode')}</Label>
                </div>

                {isCustomMode && (
                  <div className="space-y-2">
                    <Label htmlFor="prizes">{t('gridLotteryPage.settings.prizeListLabel')}</Label>
                    <Input
                      id="prizes"
                      value={customPrizes}
                      onChange={(e) => setCustomPrizes(e.target.value)}
                      placeholder={t('gridLotteryPage.settings.prizeListPlaceholder')}
                      className="text-sm"
                    />
                    <p className="text-xs text-slate-500">
                      {t('gridLotteryPage.settings.prizeListHint')}
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>{t('gridLotteryPage.settings.previewLabel')}</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {prizes.slice(0, 9).map((prize, index) => (
                      <div
                        key={index}
                        className="p-2 text-xs text-center bg-slate-100 dark:bg-slate-800 rounded border"
                      >
                        {prize}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 抽奖历史 */}
          <div>
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      {t('gridLotteryPage.history.title')}
                    </CardTitle>
                    <CardDescription>{t('gridLotteryPage.history.description')}</CardDescription>
                  </div>
                  {history.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearHistory}
                    >
                      {t('gridLotteryPage.history.clearButton')}
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {history.length > 0
                  ? (
                      <div className="space-y-3">
                        {history.map((result, index) => (
                          <div
                            key={index}
                            className="p-3 border rounded-lg bg-slate-50 dark:bg-slate-800"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <Badge variant="secondary" className="text-xs">
                                {t('gridLotteryPage.history.round', { round: index + 1 })}
                              </Badge>
                              <span className="text-xs text-slate-500">
                                {t('gridLotteryPage.history.position', { position: result.position + 1 })}
                              </span>
                            </div>
                            <div className="font-medium text-sm">
                              {result.prize}
                            </div>
                            <div className="text-xs text-slate-500 mt-1">
                              {new Date().toLocaleTimeString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  : (
                      <div className="text-center py-8 text-slate-500">
                        <div className="w-12 h-12 mx-auto mb-3 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                          🎲
                        </div>
                        <p className="text-sm">{t('gridLotteryPage.history.noHistory')}</p>
                        <p className="text-xs">{t('gridLotteryPage.history.startPlaying')}</p>
                      </div>
                    )}
              </CardContent>
            </Card>

            {/* 游戏统计 */}
            {history.length > 0 && (
              <Card className="mt-6 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    统计信息
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">总抽奖次数</span>
                      <span className="font-medium">{history.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">{t('gridLotteryPage.statistics.recentWin')}</span>
                      <span className="font-medium">{history[0]?.prize}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="space-y-1">
                      <div className="font-medium text-xs">中奖统计</div>
                      {Object.entries(
                        history.reduce((acc, result) => {
                          acc[result.prize] = (acc[result.prize] || 0) + 1
                          return acc
                        }, {} as Record<string, number>),
                      ).map(([prize, count]) => (
                        <div key={prize} className="flex justify-between text-xs">
                          <span className="truncate">{prize}</span>
                          <span>
                            {count}
                            次
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* 游戏说明 */}
        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle>{t('gridLotteryPage.explanation.title')}</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">{t('gridLotteryPage.explanation.rules.title')}</h4>
                <ul className="text-sm space-y-1">
                  <li>{t('gridLotteryPage.explanation.rules.rule1')}</li>
                  <li>{t('gridLotteryPage.explanation.rules.rule2')}</li>
                  <li>{t('gridLotteryPage.explanation.rules.rule3')}</li>
                  <li>{t('gridLotteryPage.explanation.rules.rule4')}</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">{t('gridLotteryPage.explanation.tech.title')}</h4>
                <ul className="text-sm space-y-1">
                  <li>{t('gridLotteryPage.explanation.tech.feature1')}</li>
                  <li>{t('gridLotteryPage.explanation.tech.feature2')}</li>
                  <li>{t('gridLotteryPage.explanation.tech.feature3')}</li>
                  <li>{t('gridLotteryPage.explanation.tech.feature4')}</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
