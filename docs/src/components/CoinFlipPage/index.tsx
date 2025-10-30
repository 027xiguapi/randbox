'use client'

import type { CoinFlipResult, CoinFlipStats } from '@randbox/react'
import { CoinFlip } from '@randbox/react'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import { useLocale } from '@/hooks'

export default function CoinFlipPage() {
  const { t } = useLocale()
  const [history, setHistory] = useState<CoinFlipResult[]>([])
  const [currentResult, setCurrentResult] = useState<CoinFlipResult | null>(null)
  const [animationDuration, setAnimationDuration] = useState(2000)
  const [showStats, setShowStats] = useState(true)

  const handleResult = (result: CoinFlipResult) => {
    setCurrentResult(result)
    setHistory(prev => [result, ...prev.slice(0, 49)])
  }

  const resetGame = () => {
    setHistory([])
    setCurrentResult(null)
  }

  const clearHistory = () => {
    setHistory([])
  }

  const stats: CoinFlipStats = {
    totalFlips: history.length,
    heads: history.filter(r => r.result === 'heads').length,
    tails: history.filter(r => r.result === 'tails').length,
    headsRate: history.length > 0 ? ((history.filter(r => r.result === 'heads').length / history.length) * 100).toFixed(1) : '0',
    tailsRate: history.length > 0 ? ((history.filter(r => r.result === 'tails').length / history.length) * 100).toFixed(1) : '0',
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            {t('coinFlipPage.title') || 'Coin Flip Game'}
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {t('coinFlipPage.subtitle') || 'Classic coin flip game'}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                  {t('coinFlipPage.gamePanel.title') || 'Game Panel'}
                </CardTitle>
                <CardDescription>
                  {t('coinFlipPage.gamePanel.description') || 'Click to flip'}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center p-8">
                <CoinFlip
                  animationDuration={animationDuration}
                  showStats={showStats}
                  onResult={handleResult}
                />
              </CardContent>
            </Card>

            <Card className="mt-6 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  {t('coinFlipPage.settings.title') || 'Settings'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="animationDuration">
                    {t('coinFlipPage.settings.animationDuration', { duration: animationDuration }) || `Animation: ${animationDuration}ms`}
                  </Label>
                  <Slider
                    id="animationDuration"
                    min={1000}
                    max={5000}
                    step={500}
                    value={[animationDuration]}
                    onValueChange={(value) => setAnimationDuration(value[0])}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="showStats"
                    checked={showStats}
                    onChange={(e) => setShowStats(e.target.checked)}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="showStats">{t('coinFlipPage.settings.showStats') || 'Show Stats'}</Label>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    {t('coinFlipPage.statistics.title') || 'Statistics'}
                  </CardTitle>
                  {history.length > 0 && (
                    <Button variant="outline" size="sm" onClick={resetGame}>
                      {t('coinFlipPage.statistics.resetButton') || 'Reset'}
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">{t('coinFlipPage.statistics.totalFlips') || 'Total'}</span>
                    <Badge variant="secondary">{stats.totalFlips}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">{t('coinFlipPage.statistics.heads') || 'Heads'}</span>
                    <Badge variant="default" className="bg-green-600">{stats.heads}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">{t('coinFlipPage.statistics.tails') || 'Tails'}</span>
                    <Badge variant="destructive">{stats.tails}</Badge>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">{t('coinFlipPage.statistics.headsRate') || 'Heads %'}</span>
                    <Badge variant="outline">{stats.headsRate}%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">{t('coinFlipPage.statistics.tailsRate') || 'Tails %'}</span>
                    <Badge variant="outline">{stats.tailsRate}%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    {t('coinFlipPage.history.title') || 'History'}
                  </CardTitle>
                  {history.length > 0 && (
                    <Button variant="outline" size="sm" onClick={clearHistory}>
                      {t('coinFlipPage.history.clearButton') || 'Clear'}
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {history.length > 0 ? (
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {history.map((result, index) => (
                      <div
                        key={index}
                        className={`p-3 border rounded-lg ${result.result === 'heads' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{result.result === 'heads' ? '🟢' : '🔴'}</span>
                            <span className="text-sm font-medium">
                              {result.result === 'heads' ? (t('coinFlipPage.history.heads') || 'Heads') : (t('coinFlipPage.history.tails') || 'Tails')}
                            </span>
                          </div>
                          <Badge variant="outline" className="text-xs">#{result.round}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <div className="w-12 h-12 mx-auto mb-3 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">🪙</div>
                    <p className="text-sm">{t('coinFlipPage.history.noHistory') || 'No history'}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
