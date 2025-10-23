'use client'

import type { DiceGameResult } from '@randbox/react'
import { DiceGame } from '@randbox/react'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import { useLocale } from '@/hooks'

export default function DiceGamePage() {
  const { t } = useLocale()
  const [history, setHistory] = useState<DiceGameResult[]>([])
  const [currentResult, setCurrentResult] = useState<DiceGameResult | null>(null)
  const [diceCount, setDiceCount] = useState(2)
  const [sides, setSides] = useState(6)
  const [gameMode, setGameMode] = useState<'simple' | 'sum' | 'bigSmall' | 'guess' | 'even_odd' | 'specific'>('simple')
  const [targetSum, setTargetSum] = useState(7)

  const handleResult = (result: DiceGameResult) => {
    setCurrentResult(result)
    setHistory(prev => [result, ...prev.slice(0, 19)]) // 保持最近20条记录
  }

  const resetGame = () => {
    setHistory([])
    setCurrentResult(null)
  }

  const clearHistory = () => {
    setHistory([])
  }

  // 计算统计信息
  const stats = {
    totalGames: history.length,
    wins: history.filter(r => r.isWin).length,
    winRate: history.length > 0 ? `${((history.filter(r => r.isWin).length / history.length) * 100).toFixed(1)}%` : '0%',
    avgSum: history.length > 0 ? (history.reduce((sum, r) => sum + r.total, 0) / history.length).toFixed(1) : '0',
    maxSum: history.length > 0 ? Math.max(...history.map(r => r.total)) : 0,
    minSum: history.length > 0 ? Math.min(...history.map(r => r.total)) : 0,
  }

  const gameModeDescriptions = {
    simple: t('diceGamePage.gameModes.simple'),
    sum: t('diceGamePage.gameModes.sum', { target: targetSum }),
    bigSmall: t('diceGamePage.gameModes.bigSmall'),
    guess: t('diceGamePage.gameModes.guess'),
    even_odd: t('diceGamePage.gameModes.evenOdd'),
    specific: t('diceGamePage.gameModes.specific'),
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">{t('diceGamePage.title')}</h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {t('diceGamePage.subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* 游戏区域 */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  {t('diceGamePage.gamePanel.title')}
                </CardTitle>
                <CardDescription>{gameModeDescriptions[gameMode]}</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center p-8">
                <DiceGame
                  diceCount={diceCount}
                  sides={sides}
                  gameMode={gameMode}
                  targetSum={targetSum}
                  onResult={handleResult}
                />
              </CardContent>
            </Card>

            {/* 当前结果显示 */}
            {currentResult && (
              <Card className="mt-6 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    {t('diceGamePage.currentResult.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-4">
                    <div className={`p-6 rounded-lg ${
                      currentResult.isWin === true
                        ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                        : currentResult.isWin === false
                          ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                          : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                    }`}
                    >
                      <div className="flex justify-center items-center gap-4 mb-4">
                        {currentResult.results.map((value, index) => (
                          <div key={index} className="text-4xl font-bold bg-white dark:bg-slate-800 rounded-lg p-3 shadow">
                            {value}
                          </div>
                        ))}
                      </div>
                      <div className="space-y-2">
                        <div className="text-xl font-bold">
                          {t('diceGamePage.currentResult.total', { total: currentResult.total })}
                        </div>
                        <div className={`text-lg font-medium ${
                          currentResult.isWin === true
                            ? 'text-green-600 dark:text-green-400'
                            : currentResult.isWin === false
                              ? 'text-red-600 dark:text-red-400'
                              : 'text-blue-600 dark:text-blue-400'
                        }`}
                        >
                          {currentResult.message}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          {currentResult.description}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 游戏设置 */}
            <Card className="mt-6 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  {t('diceGamePage.settings.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="diceCount">
                      {t('diceGamePage.settings.diceCount', { count: diceCount })}
                    </Label>
                    <Slider
                      id="diceCount"
                      min={1}
                      max={6}
                      step={1}
                      value={[diceCount]}
                      onValueChange={(value) => setDiceCount(value[0])}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sides">
                      {t('diceGamePage.settings.sides', { sides })}
                    </Label>
                    <Slider
                      id="sides"
                      min={4}
                      max={20}
                      step={2}
                      value={[sides]}
                      onValueChange={(value) => setSides(value[0])}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gameMode">{t('diceGamePage.settings.gameModeLabel')}</Label>
                  <Select value={gameMode} onValueChange={(value: any) => setGameMode(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('diceGamePage.settings.gameModePlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="simple">{t('diceGamePage.settings.simpleMode')}</SelectItem>
                      <SelectItem value="sum">{t('diceGamePage.settings.sumMode')}</SelectItem>
                      <SelectItem value="bigSmall">{t('diceGamePage.settings.bigSmallMode')}</SelectItem>
                      <SelectItem value="guess">{t('diceGamePage.settings.guessMode')}</SelectItem>
                      <SelectItem value="even_odd">{t('diceGamePage.settings.evenOddMode')}</SelectItem>
                      <SelectItem value="specific">{t('diceGamePage.settings.specificMode')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {gameMode === 'sum' && (
                  <div className="space-y-2">
                    <Label htmlFor="targetSum">
                      {t('diceGamePage.settings.targetSum', { target: targetSum })}
                    </Label>
                    <Slider
                      id="targetSum"
                      min={diceCount}
                      max={diceCount * sides}
                      step={1}
                      value={[targetSum]}
                      onValueChange={(value) => setTargetSum(value[0])}
                    />
                    <p className="text-xs text-slate-500">
                      {t('diceGamePage.settings.rangeHint', { min: diceCount, max: diceCount * sides })}
                    </p>
                  </div>
                )}

                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="text-sm font-medium mb-1">{t('diceGamePage.settings.currentConfig')}</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    {t('diceGamePage.settings.configText', {
                      count: diceCount,
                      sides,
                      mode: gameModeDescriptions[gameMode],
                    })}
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
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      {t('diceGamePage.statistics.title')}
                    </CardTitle>
                  </div>
                  {history.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetGame}
                    >
                      {t('diceGamePage.statistics.resetButton')}
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">{t('diceGamePage.statistics.totalGames')}</span>
                    <Badge variant="secondary">{stats.totalGames}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">{t('diceGamePage.statistics.wins')}</span>
                    <Badge variant="default" className="bg-green-600">
                      {stats.wins}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">{t('diceGamePage.statistics.winRate')}</span>
                    <Badge variant={Number(stats.winRate.replace('%', '')) >= 50 ? 'default' : 'secondary'}>
                      {stats.winRate}
                    </Badge>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">{t('diceGamePage.statistics.avgSum')}</span>
                    <Badge variant="outline">{stats.avgSum}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">{t('diceGamePage.statistics.maxSum')}</span>
                    <Badge variant="outline">{stats.maxSum}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">{t('diceGamePage.statistics.minSum')}</span>
                    <Badge variant="outline">{stats.minSum}</Badge>
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
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      {t('diceGamePage.history.title')}
                    </CardTitle>
                    <CardDescription>{t('diceGamePage.history.description')}</CardDescription>
                  </div>
                  {history.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearHistory}
                    >
                      {t('diceGamePage.history.clearButton')}
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {history.length > 0
                  ? (
                      <div className="space-y-2 max-h-80 overflow-y-auto">
                        {history.map((result, index) => (
                          <div
                            key={index}
                            className={`p-3 border rounded-lg ${
                              result.isWin === true
                                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                                : result.isWin === false
                                  ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                                  : 'bg-slate-50 dark:bg-slate-800'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <Badge
                                variant={
                                  result.isWin === true
                                    ? 'default'
                                    : result.isWin === false ? 'destructive' : 'secondary'
                                }
                                className="text-xs"
                              >
                                {result.gameMode === 'simple'
                                  ? `第 ${index + 1} 轮`
                                  : result.isWin === true
                                    ? t('diceGamePage.history.win')
                                    : result.isWin === false ? t('diceGamePage.history.lose') : t('diceGamePage.history.complete')}
                              </Badge>
                              <span className="text-xs text-slate-500">
                                {t('diceGamePage.history.total', { total: result.total })}
                              </span>
                            </div>
                            <div className="flex gap-1 mb-1">
                              {result.results.map((value, i) => (
                                <span key={i} className="text-sm font-mono bg-white dark:bg-slate-700 px-1 rounded">
                                  {value}
                                </span>
                              ))}
                            </div>
                            <div className="text-xs text-slate-600 dark:text-slate-400">
                              {result.gameMode}
                              {' '}
                              |
                              {result.message}
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
                        <p className="text-sm">{t('diceGamePage.history.noHistory')}</p>
                        <p className="text-xs">{t('diceGamePage.history.startPlaying')}</p>
                      </div>
                    )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 游戏说明 */}
        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle>{t('diceGamePage.explanation.title')}</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">{t('diceGamePage.explanation.modes.title')}</h4>
                <ul className="text-sm space-y-1">
                  <li>{t('diceGamePage.explanation.modes.simple')}</li>
                  <li>{t('diceGamePage.explanation.modes.sum')}</li>
                  <li>{t('diceGamePage.explanation.modes.bigSmall')}</li>
                  <li>{t('diceGamePage.explanation.modes.guess')}</li>
                  <li>{t('diceGamePage.explanation.modes.evenOdd')}</li>
                  <li>{t('diceGamePage.explanation.modes.specific')}</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">{t('diceGamePage.explanation.tech.title')}</h4>
                <ul className="text-sm space-y-1">
                  <li>{t('diceGamePage.explanation.tech.feature1')}</li>
                  <li>{t('diceGamePage.explanation.tech.feature2')}</li>
                  <li>{t('diceGamePage.explanation.tech.feature3')}</li>
                  <li>{t('diceGamePage.explanation.tech.feature4')}</li>
                  <li>{t('diceGamePage.explanation.tech.feature5')}</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
