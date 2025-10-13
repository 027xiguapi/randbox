'use client'

import type { RandomizationResult } from '@/lib/randomization'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useLocale } from '@/hooks'
import { RandomizationHistory } from '@/lib/history'
import { simpleRandomization } from '@/lib/randomization'

export default function SimpleRandomizationPage() {
  const { t, currentLocale } = useLocale()
  const [totalParticipants, setTotalParticipants] = useState<number>(20)
  const [groupCount, setGroupCount] = useState<number>(2)
  const [seed, setSeed] = useState<string>('')
  const [result, setResult] = useState<RandomizationResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleRandomize = async () => {
    setIsLoading(true)

    // Simulate processing time for professional feel
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const seedValue = seed ? Number.parseInt(seed) : undefined
    const randomizationResult = simpleRandomization(totalParticipants, groupCount, seedValue)
    setResult(randomizationResult)

    // Save to history
    RandomizationHistory.saveRecord('simple', {
      totalParticipants,
      groupCount,
      seed,
    }, randomizationResult)
    setIsLoading(false)
  }

  const isValidInput = totalParticipants > 0 && groupCount > 0 && groupCount <= totalParticipants

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">{t('simplePage.title')}</h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {t('simplePage.subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                {t('simplePage.inputPanel.title')}
              </CardTitle>
              <CardDescription>{t('simplePage.inputPanel.description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="participants">{t('simplePage.inputPanel.totalParticipants')}</Label>
                <Input
                  id="participants"
                  type="number"
                  value={totalParticipants}
                  onChange={(e) => setTotalParticipants(Number.parseInt(e.target.value) || 0)}
                  min="1"
                  max="10000"
                  className="text-lg"
                />
                <p className="text-sm text-slate-500">{t('simplePage.inputPanel.totalParticipantsHint')}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="groups">{t('simplePage.inputPanel.groupCount')}</Label>
                <Input
                  id="groups"
                  type="number"
                  value={groupCount}
                  onChange={(e) => setGroupCount(Number.parseInt(e.target.value) || 0)}
                  min="2"
                  max="20"
                  className="text-lg"
                />
                <p className="text-sm text-slate-500">{t('simplePage.inputPanel.groupCountHint')}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="seed">{t('simplePage.inputPanel.seed')}</Label>
                <Input
                  id="seed"
                  type="number"
                  value={seed}
                  onChange={(e) => setSeed(e.target.value)}
                  placeholder={t('simplePage.inputPanel.seedPlaceholder')}
                  className="text-lg"
                />
                <p className="text-sm text-slate-500">{t('simplePage.inputPanel.seedHint')}</p>
              </div>

              <Button
                onClick={handleRandomize}
                disabled={!isValidInput || isLoading}
                className="w-full text-lg py-6"
                size="lg"
              >
                {isLoading ? t('simplePage.inputPanel.calculatingButton') : t('simplePage.inputPanel.startButton')}
              </Button>

              {!isValidInput && (
                <p className="text-sm text-red-500 text-center">
                  {t('simplePage.inputPanel.validationError', { maxGroups: totalParticipants })}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Results Panel */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                {t('simplePage.resultsPanel.title')}
              </CardTitle>
              <CardDescription>{t('simplePage.resultsPanel.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="space-y-6">
                  {/* Summary */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {result.totalParticipants}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">{t('simplePage.resultsPanel.totalParticipantsLabel')}</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {result.groups.length}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">{t('simplePage.resultsPanel.groupCountLabel')}</div>
                    </div>
                  </div>

                  <Separator />

                  {/* Groups */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">{t('simplePage.resultsPanel.groupDetailsTitle')}</h3>
                    {result.groups.map((group, index) => (
                      <div key={index} className="p-4 border rounded-lg bg-slate-50 dark:bg-slate-800">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{group.name}</h4>
                          <Badge variant="secondary">
                            {group.size}
                            {' '}
                            {t('simplePage.resultsPanel.participantsLabel')}
                          </Badge>
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          {t('simplePage.resultsPanel.participantIds')}
                          {group.participants.slice(0, 10).join(', ')}
                          {group.participants.length > 10 && t('simplePage.resultsPanel.moreParticipants', { count: group.participants.length - 10 })}
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Statistics */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">{t('simplePage.resultsPanel.statisticsTitle')}</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-600 dark:text-slate-400">{t('simplePage.resultsPanel.balance')}</span>
                        <span className="ml-2 font-medium">
                          {(result.statistics.balance * 100).toFixed(1)}
                          %
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-600 dark:text-slate-400">{t('simplePage.resultsPanel.efficiency')}</span>
                        <span className="ml-2 font-medium">
                          {(result.statistics.efficiency * 100).toFixed(1)}
                          %
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-slate-500">
                      {t('simplePage.resultsPanel.generateTime')}
                      {new Date(result.timestamp).toLocaleString(currentLocale === 'zh' ? 'zh-CN' : 'en-US')}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500">
                  <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-slate-300 dark:border-slate-600 rounded-full"></div>
                  </div>
                  <p>{t('simplePage.resultsPanel.noResultsText')}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Algorithm Info */}
        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle>{t('simplePage.algorithmInfo.title')}</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>
              {t('simplePage.algorithmInfo.description')}
            </p>
            <ul>
              {t('simplePage.algorithmInfo.features').map((feature: string, index: number) => (
                <li key={index}>
                  <strong>{feature.split('：')[0]}</strong>
                  ：
                  {feature.split('：')[1]}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
