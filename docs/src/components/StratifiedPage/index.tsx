'use client'

import type { RandomizationResult } from '@/lib/randomization'
import { Copy, Download, Info, Layers, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useLocale } from '@/hooks'
import { RandomizationHistory } from '@/lib/history'
import { stratifiedRandomization } from '@/lib/randomization'

interface Stratum {
  id: string
  name: string
  size: number
}

export default function StratifiedRandomizationPage() {
  const { t, currentLocale } = useLocale()
  const [strata, setStrata] = useState<Stratum[]>([
    { id: '1', name: 'male', size: 10 },
    { id: '2', name: 'female', size: 10 },
  ])
  const [groupCount, setGroupCount] = useState<number>(2)
  const [seed, setSeed] = useState<string>('')
  const [result, setResult] = useState<RandomizationResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')

  // Initialize default stratum names based on current locale
  useEffect(() => {
    setStrata([
      { id: '1', name: t('stratifiedPage.defaultStrataNames.male'), size: 10 },
      { id: '2', name: t('stratifiedPage.defaultStrataNames.female'), size: 10 },
    ])
  }, [currentLocale, t])

  const addStratum = () => {
    const newId = (Math.max(...strata.map((s) => Number.parseInt(s.id))) + 1).toString()
    setStrata([...strata, { id: newId, name: t('stratifiedPage.defaultStrataNames.newStratum', { id: newId }), size: 10 }])
  }

  const removeStratum = (id: string) => {
    if (strata.length > 1) {
      setStrata(strata.filter((s) => s.id !== id))
    }
  }

  const updateStratum = (id: string, field: keyof Stratum, value: string | number) => {
    setStrata(strata.map((s) => (s.id === id ? { ...s, [field]: value } : s)))
  }

  const handleRandomize = async () => {
    setError('')
    setIsLoading(true)

    try {
      // Validation
      if (strata.length < 1) {
        throw new Error(t('stratifiedPage.errorMessages.minimumStrata'))
      }
      if (groupCount < 2 || groupCount > 10) {
        throw new Error(t('stratifiedPage.errorMessages.groupCountRange'))
      }

      const totalSamples = strata.reduce((sum, s) => sum + s.size, 0)
      if (totalSamples < 1 || totalSamples > 10000) {
        throw new Error(t('stratifiedPage.errorMessages.totalSamplesRange'))
      }

      for (const stratum of strata) {
        if (!stratum.name.trim()) {
          throw new Error(t('stratifiedPage.errorMessages.stratumNameEmpty'))
        }
        if (stratum.size < 1) {
          throw new Error(t('stratifiedPage.errorMessages.stratumSizeInvalid', { name: stratum.name }))
        }
      }

      const seedValue = seed ? Number.parseInt(seed) : undefined
      const randomizationResult = stratifiedRandomization(
        strata.map((s) => ({ name: s.name, size: s.size })),
        groupCount,
        seedValue,
      )
      setResult(randomizationResult)

      RandomizationHistory.saveRecord('stratified', {
        strata: strata.map((s) => ({ name: s.name, size: s.size })),
        groupCount,
        seed,
      }, randomizationResult)
    }
    catch (err) {
      setError(err instanceof Error ? err.message : t('stratifiedPage.errorMessages.randomizationError'))
    }
    finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const downloadReport = () => {
    if (!result) { return }

    const blob = new Blob([result.report], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = t('stratifiedPage.resultsPanel.downloadFileName', { date: new Date().toISOString().split('T')[0] })
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const totalSamples = strata.reduce((sum, s) => sum + s.size, 0)

  return (
    <main className="pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">{t('stratifiedPage.title')}</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('stratifiedPage.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="w-5 h-5" />
                  {t('stratifiedPage.strataSetup.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {strata.map((stratum, index) => (
                  <div key={stratum.id} className="flex items-end gap-3 p-4 bg-muted/30 rounded-lg">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor={`stratum-name-${stratum.id}`}>{t('stratifiedPage.strataSetup.stratumName')}</Label>
                      <Input
                        id={`stratum-name-${stratum.id}`}
                        value={stratum.name}
                        onChange={(e) => updateStratum(stratum.id, 'name', e.target.value)}
                        placeholder={t('stratifiedPage.strataSetup.stratumNamePlaceholder')}
                      />
                    </div>
                    <div className="w-24 space-y-2">
                      <Label htmlFor={`stratum-size-${stratum.id}`}>{t('stratifiedPage.strataSetup.sampleSize')}</Label>
                      <Input
                        id={`stratum-size-${stratum.id}`}
                        type="number"
                        min="1"
                        value={stratum.size}
                        onChange={(e) => updateStratum(stratum.id, 'size', Number.parseInt(e.target.value) || 0)}
                        placeholder={t('stratifiedPage.strataSetup.sampleSizePlaceholder')}
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeStratum(stratum.id)}
                      disabled={strata.length <= 1}
                      className="h-10 w-10 p-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}

                <Button onClick={addStratum} variant="outline" className="w-full bg-transparent">
                  <Plus className="w-4 h-4 mr-2" />
                  {t('stratifiedPage.strataSetup.addStratum')}
                </Button>

                <div className="bg-muted/50 rounded-lg p-3">
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">{t('stratifiedPage.strataSetup.totalSamples')}</span>
                    <span className="text-foreground">{totalSamples}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('stratifiedPage.randomizationParams.title')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="groupCount">{t('stratifiedPage.randomizationParams.groupCount')}</Label>
                  <Input
                    id="groupCount"
                    type="number"
                    min="2"
                    max="10"
                    value={groupCount}
                    onChange={(e) => setGroupCount(Number.parseInt(e.target.value) || 0)}
                    placeholder={t('stratifiedPage.randomizationParams.groupCountPlaceholder')}
                  />
                  <p className="text-sm text-muted-foreground">{t('stratifiedPage.randomizationParams.groupCountHint')}</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seed">{t('stratifiedPage.randomizationParams.seed')}</Label>
                  <Input
                    id="seed"
                    type="number"
                    value={seed}
                    onChange={(e) => setSeed(e.target.value)}
                    placeholder={t('stratifiedPage.randomizationParams.seedPlaceholder')}
                  />
                  <p className="text-sm text-muted-foreground">{t('stratifiedPage.randomizationParams.seedHint')}</p>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button onClick={handleRandomize} disabled={isLoading} className="w-full" size="lg">
                  {isLoading ? t('stratifiedPage.randomizationParams.calculatingButton') : t('stratifiedPage.randomizationParams.startButton')}
                </Button>

                {/* Algorithm Info */}
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-muted-foreground">
                      <p className="font-medium mb-1">{t('stratifiedPage.randomizationParams.algorithmTitle')}</p>
                      <p>
                        {t('stratifiedPage.randomizationParams.algorithmDescription')}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Panel */}
          <div className="space-y-6">
            {result && (
              <>
                {/* Statistics Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>{t('stratifiedPage.resultsPanel.title')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-foreground">{result.statistics.totalSamples}</div>
                        <div className="text-sm text-muted-foreground">{t('stratifiedPage.resultsPanel.totalSamples')}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-foreground">{strata.length}</div>
                        <div className="text-sm text-muted-foreground">{t('stratifiedPage.resultsPanel.strataCount')}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-foreground">{result.groups.length}</div>
                        <div className="text-sm text-muted-foreground">{t('stratifiedPage.resultsPanel.groupCount')}</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {result.groups.map((group, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              {t('stratifiedPage.resultsPanel.groupLabel', { index: index + 1 })}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {t('stratifiedPage.resultsPanel.samplesCount', { count: group.length })}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(group.join(', '))}
                            className="h-8"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2 mt-6">
                      <Button onClick={downloadReport} variant="outline" className="flex-1 bg-transparent">
                        <Download className="w-4 h-4 mr-2" />
                        {t('stratifiedPage.resultsPanel.downloadReport')}
                      </Button>
                      <Button onClick={() => copyToClipboard(result.report)} variant="outline" className="flex-1">
                        <Copy className="w-4 h-4 mr-2" />
                        {t('stratifiedPage.resultsPanel.copyReport')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Stratum Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle>{t('stratifiedPage.resultsPanel.stratumDistributionTitle')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {strata.map((stratum, index) => (
                        <div key={stratum.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">
                              {t('stratifiedPage.resultsPanel.stratumTitle', { name: stratum.name, count: stratum.size })}
                            </h4>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {result.groups.map((group, groupIndex) => {
                              const stratumSamples = group.participants.filter((sample) => {
                                // Calculate which stratum this sample belongs to
                                let currentTotal = 0
                                for (let i = 0; i < index; i++) {
                                  currentTotal += strata[i].size
                                }
                                return sample > currentTotal && sample <= currentTotal + stratum.size
                              })
                              return (
                                <div key={groupIndex} className="bg-muted/30 rounded p-2">
                                  <div className="text-xs text-muted-foreground mb-1">
                                    {t('stratifiedPage.resultsPanel.groupInStratum', { index: groupIndex + 1 })}
                                  </div>
                                  <div className="text-sm font-medium">
                                    {t('stratifiedPage.resultsPanel.samplesCount', { count: stratumSamples.length })}
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Detailed Groups */}
                <Card>
                  <CardHeader>
                    <CardTitle>{t('stratifiedPage.resultsPanel.detailedGroupsTitle')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {result.groups.map((group, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">
                              {t('stratifiedPage.resultsPanel.groupTitle', { index: index + 1, count: group.length })}
                            </h4>
                            <Button variant="ghost" size="sm" onClick={() => copyToClipboard(group.join(', '))}>
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="bg-muted/30 rounded-lg p-3">
                            <div className="text-sm text-muted-foreground break-all">{group.participants.join(', ')}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Report Preview */}
                <Card>
                  <CardHeader>
                    <CardTitle>{t('stratifiedPage.resultsPanel.reportPreviewTitle')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea value={result.report} readOnly className="min-h-[300px] font-mono text-sm" />
                  </CardContent>
                </Card>
              </>
            )}

            {!result && (
              <Card>
                <CardContent className="py-12 text-center">
                  <Layers className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">{t('stratifiedPage.resultsPanel.noResults')}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
