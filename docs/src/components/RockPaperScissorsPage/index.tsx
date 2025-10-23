'use client'

import type { RPSResult, RPSStats } from '@randbox/react'
import { RockPaperScissors } from '@randbox/react'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { useLocale } from '@/hooks'

export default function RockPaperScissorsPage() {
  const { t, currentLocale } = useLocale()
  const [history, setHistory] = useState<RPSResult[]>([])
  const [currentResult, setCurrentResult] = useState<RPSResult | null>(null)
  const [strategy, setStrategy] = useState<'random' | 'counter' | 'pattern'>('random')
  const [showStats, setShowStats] = useState(true)
  const [customChoices, setCustomChoices] = useState(
    currentLocale === 'zh' ? '石头,剪刀,布' : 'Rock,Scissors,Paper',
  )
  const [customEmojis, setCustomEmojis] = useState('🪨,✂️,📄')
  const [isCustomMode, setIsCustomMode] = useState(false)

  // 默认选项和表情
  const defaultChoices = currentLocale === 'zh' ? ['石头', '剪刀', '布'] : ['Rock', 'Scissors', 'Paper']
  const defaultEmojis = currentLocale === 'zh'
    ? { 石头: '🪨', 剪刀: '✂️', 布: '📄' }
    : { Rock: '🪨', Scissors: '✂️', Paper: '📄' }

  const choices = isCustomMode
    ? customChoices.split(',').map(c => c.trim()).filter(c => c)
    : defaultChoices

  const emojis = isCustomMode
    ? Object.fromEntries(
        choices.map((choice, index) => [
          choice,
          customEmojis.split(',')[index]?.trim() || '❓',
        ]),
      )
    : defaultEmojis

  const handleResult = (result: RPSResult) => {
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
  const stats: RPSStats = {
    totalGames: history.length,
    wins: history.filter(r => r.result === 'win').length,
    losses: history.filter(r => r.result === 'lose').length,
    ties: history.filter(r => r.result === 'tie').length,
    winRate: history.length > 0 ? `${((history.filter(r => r.result === 'win').length / history.length) * 100).toFixed(1)}%` : '0%',
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">{t('rockPaperScissorsPage.title')}</h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {t('rockPaperScissorsPage.subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* 游戏区域 */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  {t('rockPaperScissorsPage.gamePanel.title')}
                </CardTitle>
                <CardDescription>{t('rockPaperScissorsPage.gamePanel.description')}</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center p-8">
                <RockPaperScissors
                  choices={choices}
                  emojis={emojis}
                  showStats={showStats}
                  strategy={strategy}
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
                    {t('rockPaperScissorsPage.currentResult.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-4">
                    <div className={`p-6 rounded-lg ${
                      currentResult.result === 'win'
                        ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                        : currentResult.result === 'lose'
                          ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                          : 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'
                    }`}
                    >
                      <div className="flex justify-center items-center gap-8 mb-4">
                        <div className="text-center">
                          <div className="text-4xl mb-2">{currentResult.emoji.player}</div>
                          <div className="text-sm font-medium">{t('rockPaperScissorsPage.currentResult.playerChoice')}</div>
                          <div className="text-lg">{currentResult.playerChoice}</div>
                        </div>
                        <div className="text-2xl font-bold">VS</div>
                        <div className="text-center">
                          <div className="text-4xl mb-2">{currentResult.emoji.computer}</div>
                          <div className="text-sm font-medium">{t('rockPaperScissorsPage.currentResult.computerChoice')}</div>
                          <div className="text-lg">{currentResult.computerChoice}</div>
                        </div>
                      </div>
                      <div className={`text-xl font-bold ${
                        currentResult.result === 'win'
                          ? 'text-green-600 dark:text-green-400'
                          : currentResult.result === 'lose'
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-yellow-600 dark:text-yellow-400'
                      }`}
                      >
                        {currentResult.message}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                        {t('rockPaperScissorsPage.currentResult.round', { round: currentResult.round })}
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
                  {t('rockPaperScissorsPage.settings.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="strategy">{t('rockPaperScissorsPage.settings.strategyLabel')}</Label>
                  <Select value={strategy} onValueChange={(value: 'random' | 'counter' | 'pattern') => setStrategy(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('rockPaperScissorsPage.settings.strategyPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="random">{t('rockPaperScissorsPage.settings.randomMode')}</SelectItem>
                      <SelectItem value="counter">{t('rockPaperScissorsPage.settings.counterMode')}</SelectItem>
                      <SelectItem value="pattern">{t('rockPaperScissorsPage.settings.patternMode')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-slate-500">
                    {t('rockPaperScissorsPage.settings.strategyHint')}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="showStats"
                    checked={showStats}
                    onChange={(e) => setShowStats(e.target.checked)}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="showStats">{t('rockPaperScissorsPage.settings.showStats')}</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="customMode"
                    checked={isCustomMode}
                    onChange={(e) => setIsCustomMode(e.target.checked)}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="customMode">{t('rockPaperScissorsPage.settings.customMode')}</Label>
                </div>

                {isCustomMode && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="choices">{t('rockPaperScissorsPage.settings.choicesLabel')}</Label>
                      <Input
                        id="choices"
                        value={customChoices}
                        onChange={(e) => setCustomChoices(e.target.value)}
                        placeholder={t('rockPaperScissorsPage.settings.choicesPlaceholder')}
                        className="text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emojis">{t('rockPaperScissorsPage.settings.emojisLabel')}</Label>
                      <Input
                        id="emojis"
                        value={customEmojis}
                        onChange={(e) => setCustomEmojis(e.target.value)}
                        placeholder={t('rockPaperScissorsPage.settings.emojisPlaceholder')}
                        className="text-sm"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>{t('rockPaperScissorsPage.settings.previewLabel')}</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {choices.map((choice, index) => (
                      <div
                        key={index}
                        className="p-3 text-center bg-slate-100 dark:bg-slate-800 rounded border"
                      >
                        <div className="text-xl mb-1">{emojis[choice] || '❓'}</div>
                        <div className="text-sm">{choice}</div>
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
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      {t('rockPaperScissorsPage.statistics.title')}
                    </CardTitle>
                  </div>
                  {history.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetGame}
                    >
                      {t('rockPaperScissorsPage.statistics.resetButton')}
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">{t('rockPaperScissorsPage.statistics.totalGames')}</span>
                    <Badge variant="secondary">{stats.totalGames}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">{t('rockPaperScissorsPage.statistics.wins')}</span>
                    <Badge variant="default" className="bg-green-600">
                      {stats.wins}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">{t('rockPaperScissorsPage.statistics.losses')}</span>
                    <Badge variant="destructive">
                      {stats.losses}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">{t('rockPaperScissorsPage.statistics.ties')}</span>
                    <Badge variant="outline">
                      {stats.ties}
                    </Badge>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">{t('rockPaperScissorsPage.statistics.winRate')}</span>
                    <Badge variant={Number(stats.winRate.replace('%', '')) >= 50 ? 'default' : 'secondary'}>
                      {stats.winRate}
                    </Badge>
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
                      {t('rockPaperScissorsPage.history.title')}
                    </CardTitle>
                    <CardDescription>{t('rockPaperScissorsPage.history.description')}</CardDescription>
                  </div>
                  {history.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearHistory}
                    >
                      {t('rockPaperScissorsPage.history.clearButton')}
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
                              result.result === 'win'
                                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                                : result.result === 'lose'
                                  ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                                  : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <Badge
                                variant={
                                  result.result === 'win'
                                    ? 'default'
                                    : result.result === 'lose' ? 'destructive' : 'secondary'
                                }
                                className="text-xs"
                              >
                                {t('rockPaperScissorsPage.history.round', { round: result.round })}
                              </Badge>
                              <span className="text-xs text-slate-500">
                                {result.result === 'win'
                                  ? t('rockPaperScissorsPage.history.win')
                                  : result.result === 'lose' ? t('rockPaperScissorsPage.history.lose') : t('rockPaperScissorsPage.history.tie')}
                              </span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span>
                                {result.emoji.player}
                                {' '}
                                {result.playerChoice}
                              </span>
                              <span className="text-xs text-slate-500">VS</span>
                              <span>
                                {result.emoji.computer}
                                {' '}
                                {result.computerChoice}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  : (
                      <div className="text-center py-8 text-slate-500">
                        <div className="w-12 h-12 mx-auto mb-3 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                          ✂️
                        </div>
                        <p className="text-sm">{t('rockPaperScissorsPage.history.noHistory')}</p>
                        <p className="text-xs">{t('rockPaperScissorsPage.history.startPlaying')}</p>
                      </div>
                    )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 游戏说明 */}
        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle>{t('rockPaperScissorsPage.explanation.title')}</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">{t('rockPaperScissorsPage.explanation.rules.title')}</h4>
                <ul className="text-sm space-y-1">
                  <li>{t('rockPaperScissorsPage.explanation.rules.rule1')}</li>
                  <li>{t('rockPaperScissorsPage.explanation.rules.rule2')}</li>
                  <li>{t('rockPaperScissorsPage.explanation.rules.rule3')}</li>
                  <li>{t('rockPaperScissorsPage.explanation.rules.rule4')}</li>
                  <li>{t('rockPaperScissorsPage.explanation.rules.rule5')}</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">{t('rockPaperScissorsPage.explanation.aiStrategy.title')}</h4>
                <ul className="text-sm space-y-1">
                  <li>{t('rockPaperScissorsPage.explanation.aiStrategy.random')}</li>
                  <li>{t('rockPaperScissorsPage.explanation.aiStrategy.counter')}</li>
                  <li>{t('rockPaperScissorsPage.explanation.aiStrategy.pattern')}</li>
                  <li>{t('rockPaperScissorsPage.explanation.aiStrategy.canvas')}</li>
                  <li>{t('rockPaperScissorsPage.explanation.aiStrategy.responsive')}</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
