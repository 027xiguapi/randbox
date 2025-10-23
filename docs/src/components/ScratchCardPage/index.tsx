'use client'

import type { ScratchCardResult } from '@randbox/react'
import { ScratchCard } from '@randbox/react'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { useLocale } from '@/hooks'

export default function ScratchCardPage() {
  const { t, currentLocale } = useLocale()
  const [history, setHistory] = useState<ScratchCardResult[]>([])
  const [currentResult, setCurrentResult] = useState<ScratchCardResult | null>(null)
  const [rows, setRows] = useState(3)
  const [cols, setCols] = useState(3)
  const [winProbability, setWinProbability] = useState(30)
  const [customSymbols, setCustomSymbols] = useState('🍎,🍊,🍋,🍇,🍓,💎,⭐,🎁')
  const [isCustomMode, setIsCustomMode] = useState(false)

  // 默认符号
  const defaultSymbols = ['🍎', '🍊', '🍋', '🍇', '🍓', '💎', '⭐', '🎁']

  const symbols = isCustomMode
    ? customSymbols.split(',').map(s => s.trim()).filter(s => s)
    : defaultSymbols

  const handleScratch = (result: ScratchCardResult) => {
    setCurrentResult(result)
  }

  const handleNewCard = () => {
    if (currentResult) {
      setHistory(prev => [currentResult, ...prev.slice(0, 9)])
      setCurrentResult(null)
    }
  }

  const clearHistory = () => {
    setHistory([])
  }

  // 计算统计信息
  const stats = {
    totalCards: history.length,
    wins: history.filter(r => r.isWinner).length,
    winRate: history.length > 0 ? ((history.filter(r => r.isWinner).length / history.length) * 100).toFixed(1) : '0',
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">{t('scratchCardPage.title')}</h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {t('scratchCardPage.subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* 游戏区域 */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                  {t('scratchCardPage.gamePanel.title')}
                </CardTitle>
                <CardDescription>
                  {t('scratchCardPage.gamePanel.description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center p-8">
                <ScratchCard
                  rows={rows}
                  cols={cols}
                  symbols={symbols}
                  winProbability={winProbability / 100}
                  onScratch={handleScratch}
                  onNewCard={handleNewCard}
                />
              </CardContent>
            </Card>

            {/* 游戏设置 */}
            <Card className="mt-6 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  {t('scratchCardPage.settings.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rows">
                      {t('scratchCardPage.settings.rowsLabel', { rows })}
                    </Label>
                    <Slider
                      id="rows"
                      min={3}
                      max={5}
                      step={1}
                      value={[rows]}
                      onValueChange={(value) => setRows(value[0])}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cols">
                      {t('scratchCardPage.settings.colsLabel', { cols })}
                    </Label>
                    <Slider
                      id="cols"
                      min={3}
                      max={5}
                      step={1}
                      value={[cols]}
                      onValueChange={(value) => setCols(value[0])}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="probability">
                    {t('scratchCardPage.settings.probabilityLabel', { probability: winProbability })}
                  </Label>
                  <Slider
                    id="probability"
                    min={10}
                    max={80}
                    step={5}
                    value={[winProbability]}
                    onValueChange={(value) => setWinProbability(value[0])}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="customMode"
                    checked={isCustomMode}
                    onChange={(e) => setIsCustomMode(e.target.checked)}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="customMode">{t('scratchCardPage.settings.customMode')}</Label>
                </div>

                {isCustomMode && (
                  <div className="space-y-2">
                    <Label htmlFor="symbols">{t('scratchCardPage.settings.symbolsLabel')}</Label>
                    <Input
                      id="symbols"
                      value={customSymbols}
                      onChange={(e) => setCustomSymbols(e.target.value)}
                      placeholder={t('scratchCardPage.settings.symbolsPlaceholder')}
                      className="text-sm"
                    />
                    <p className="text-xs text-slate-500">
                      {t('scratchCardPage.settings.symbolsHint')}
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>{t('scratchCardPage.settings.previewLabel')}</Label>
                  <div className="grid grid-cols-8 gap-2">
                    {symbols.slice(0, 8).map((symbol, index) => (
                      <div
                        key={index}
                        className="p-2 text-center bg-slate-100 dark:bg-slate-800 rounded border text-lg"
                      >
                        {symbol}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 右侧面板 */}
          <div className="space-y-6">
            {/* 当前结果 */}
            {currentResult && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    {t('scratchCardPage.currentResult.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-4">
                    <div className={`p-4 rounded-lg ${
                      currentResult.isWinner
                        ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                        : 'bg-slate-50 dark:bg-slate-800'
                    }`}
                    >
                      <div className="text-lg font-bold mb-2">
                        {currentResult.isWinner ? t('scratchCardPage.currentResult.winMessage') : t('scratchCardPage.currentResult.loseMessage')}
                      </div>
                      {currentResult.isWinner && currentResult.winningInfo && (
                        <div className="space-y-2">
                          <div className="text-sm text-green-600 dark:text-green-400">
                            {currentResult.winningInfo.name}
                          </div>
                          <div className="text-sm">
                            {t('scratchCardPage.currentResult.prizeLabel', { prize: currentResult.winningInfo.prize })}
                          </div>
                          <div className="text-xs text-slate-500">
                            {t('scratchCardPage.currentResult.lineTypeLabel', {
                              type: currentResult.winningInfo.type === 'row'
                                ? t('scratchCardPage.currentResult.lineTypes.row')
                                : currentResult.winningInfo.type === 'col'
                                  ? t('scratchCardPage.currentResult.lineTypes.col')
                                  : t('scratchCardPage.currentResult.lineTypes.diagonal')
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    <Button
                      onClick={handleNewCard}
                      className="w-full bg-pink-600 hover:bg-pink-700"
                    >
                      {t('scratchCardPage.currentResult.newCardButton')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 游戏统计 */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  {t('scratchCardPage.statistics.title')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">{t('scratchCardPage.statistics.totalCards')}</span>
                    <Badge variant="secondary">{stats.totalCards}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">{t('scratchCardPage.statistics.wins')}</span>
                    <Badge variant={stats.wins > 0 ? 'default' : 'secondary'}>
                      {stats.wins}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">{t('scratchCardPage.statistics.winRate')}</span>
                    <Badge variant={Number(stats.winRate) > 25 ? 'default' : 'secondary'}>
                      {stats.winRate}
                      %
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 历史记录 */}
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      {t('scratchCardPage.history.title')}
                    </CardTitle>
                    <CardDescription>{t('scratchCardPage.history.description')}</CardDescription>
                  </div>
                  {history.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearHistory}
                    >
                      {t('scratchCardPage.history.clearButton')}
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {history.length > 0
                  ? (
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {history.map((result, index) => (
                          <div
                            key={index}
                            className={`p-3 border rounded-lg ${
                              result.isWinner
                                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                                : 'bg-slate-50 dark:bg-slate-800'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <Badge
                                variant={result.isWinner ? 'default' : 'secondary'}
                                className="text-xs"
                              >
                                {result.isWinner ? t('scratchCardPage.history.win') : t('scratchCardPage.history.round', { round: index + 1 })}
                              </Badge>
                              <span className="text-xs text-slate-500">
                                {new Date().toLocaleTimeString()}
                              </span>
                            </div>
                            {result.isWinner && result.winningInfo && (
                              <div className="text-xs space-y-1">
                                <div className="font-medium">{result.winningInfo.name}</div>
                                <div className="text-slate-600 dark:text-slate-400">
                                  {result.winningInfo.prize}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )
                  : (
                      <div className="text-center py-8 text-slate-500">
                        <div className="w-12 h-12 mx-auto mb-3 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                          🎫
                        </div>
                        <p className="text-sm">{t('scratchCardPage.history.noHistory')}</p>
                        <p className="text-xs">{t('scratchCardPage.history.startPlaying')}</p>
                      </div>
                    )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 游戏说明 */}
        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle>{t('scratchCardPage.explanation.title')}</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">{t('scratchCardPage.explanation.rules.title')}</h4>
                <ul className="text-sm space-y-1">
                  <li>{t('scratchCardPage.explanation.rules.rule1')}</li>
                  <li>{t('scratchCardPage.explanation.rules.rule2')}</li>
                  <li>{t('scratchCardPage.explanation.rules.rule3')}</li>
                  <li>{t('scratchCardPage.explanation.rules.rule4')}</li>
                  <li>{t('scratchCardPage.explanation.rules.rule5')}</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">{t('scratchCardPage.explanation.tech.title')}</h4>
                <ul className="text-sm space-y-1">
                  <li>{t('scratchCardPage.explanation.tech.feature1')}</li>
                  <li>{t('scratchCardPage.explanation.tech.feature2')}</li>
                  <li>{t('scratchCardPage.explanation.tech.feature3')}</li>
                  <li>{t('scratchCardPage.explanation.tech.feature4')}</li>
                  <li>{t('scratchCardPage.explanation.tech.feature5')}</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
