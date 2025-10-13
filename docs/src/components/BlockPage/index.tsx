'use client'

import { AlertTriangle, Copy, Download, Grid3X3, Info } from 'lucide-react'
import { useState } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useLocale } from '@/hooks'
import { RandomizationHistory } from '@/lib/history'
import { blockRandomization } from '@/lib/randomization'

export default function BlockRandomizationPage() {
  const { t, currentLocale } = useLocale()
  const [sampleSize, setSampleSize] = useState<number>(20)
  const [groupCount, setGroupCount] = useState<number>(2)
  const [blockSize, setBlockSize] = useState<number>(4)
  const [seed, setSeed] = useState<string>('')
  const [result, setResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')

  // Calculate valid block sizes based on group count
  const getValidBlockSizes = () => {
    const sizes = []
    for (let i = groupCount; i <= Math.min(20, sampleSize); i++) {
      if (i % groupCount === 0) {
        sizes.push(i)
      }
    }
    return sizes
  }

  const validBlockSizes = getValidBlockSizes()
  const isBlockSizeValid = blockSize % groupCount === 0

  const handleRandomize = async () => {
    setError('')
    setIsLoading(true)

    try {
      if (sampleSize < 1 || sampleSize > 10000) {
        throw new Error(t('blockPage.errorMessages.sampleSizeRange'))
      }
      if (groupCount < 2 || groupCount > 10) {
        throw new Error(t('blockPage.errorMessages.groupCountRange'))
      }
      if (blockSize % groupCount !== 0) {
        throw new Error(t('blockPage.errorMessages.blockSizeDivisible'))
      }
      if (blockSize < groupCount) {
        throw new Error(t('blockPage.errorMessages.blockSizeMinimum'))
      }

      const seedValue = seed ? Number.parseInt(seed) : undefined
      const randomizationResult = blockRandomization(sampleSize, groupCount, blockSize, seedValue)
      console.log('seedValue', randomizationResult)
      setResult(randomizationResult)

      // Save to history
      RandomizationHistory.saveRecord('block', {
        sampleSize,
        groupCount,
        blockSize,
        seed,
      }, randomizationResult)
    }
    catch (err) {
      setError(err instanceof Error ? err.message : t('blockPage.errorMessages.randomizationError'))
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
    a.download = t('blockPage.resultsPanel.downloadFileName', { date: new Date().toISOString().split('T')[0] })
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const totalBlocks = Math.ceil(sampleSize / blockSize)
  const samplesPerGroup = blockSize / groupCount

  return (
    <main className="pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">{t('blockPage.title')}</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('blockPage.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Grid3X3 className="w-5 h-5" />
                {t('blockPage.inputPanel.title')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="sampleSize">{t('blockPage.inputPanel.sampleSize')}</Label>
                <Input
                  id="sampleSize"
                  type="number"
                  min="1"
                  max="10000"
                  value={sampleSize}
                  onChange={(e) => setSampleSize(Number.parseInt(e.target.value) || 0)}
                  placeholder={t('blockPage.inputPanel.sampleSizePlaceholder')}
                />
                <p className="text-sm text-muted-foreground">{t('blockPage.inputPanel.sampleSizeHint')}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="groupCount">{t('blockPage.inputPanel.groupCount')}</Label>
                <Input
                  id="groupCount"
                  type="number"
                  min="2"
                  max="10"
                  value={groupCount}
                  onChange={(e) => {
                    const newGroupCount = Number.parseInt(e.target.value) || 0
                    setGroupCount(newGroupCount)
                    // Reset block size if current one is invalid
                    if (blockSize % newGroupCount !== 0) {
                      const validSizes = []
                      for (let i = newGroupCount; i <= 20; i++) {
                        if (i % newGroupCount === 0) {
                          validSizes.push(i)
                          break
                        }
                      }
                      if (validSizes.length > 0) {
                        setBlockSize(validSizes[0])
                      }
                    }
                  }}
                  placeholder={t('blockPage.inputPanel.groupCountPlaceholder')}
                />
                <p className="text-sm text-muted-foreground">{t('blockPage.inputPanel.groupCountHint')}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="blockSize">{t('blockPage.inputPanel.blockSize')}</Label>
                <Select value={blockSize.toString()} onValueChange={(value) => setBlockSize(Number.parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('blockPage.inputPanel.blockSizePlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {validBlockSizes.map((size) => (
                      <SelectItem key={size} value={size.toString()}>
                        {size}
                        {' '}
                        (
                        {t('blockPage.inputPanel.samplesPerGroupText', { count: size / groupCount })}
                        )
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">{t('blockPage.inputPanel.blockSizeHint')}</p>
              </div>

              {!isBlockSizeValid && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    {t('blockPage.errorMessages.blockSizeValidation', { blockSize, groupCount })}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="seed">{t('blockPage.inputPanel.seed')}</Label>
                <Input
                  id="seed"
                  type="number"
                  value={seed}
                  onChange={(e) => setSeed(e.target.value)}
                  placeholder={t('blockPage.inputPanel.seedPlaceholder')}
                />
                <p className="text-sm text-muted-foreground">{t('blockPage.inputPanel.seedHint')}</p>
              </div>

              {/* Block Preview */}
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-medium mb-2">{t('blockPage.inputPanel.blockPreviewTitle')}</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">{t('blockPage.inputPanel.totalBlocks')}</span>
                    <span className="font-medium">{totalBlocks}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">{t('blockPage.inputPanel.samplesPerGroup')}</span>
                    <span className="font-medium">{samplesPerGroup}</span>
                  </div>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                onClick={handleRandomize}
                disabled={isLoading || !isBlockSizeValid}
                className="w-full"
                size="lg"
              >
                {isLoading ? t('blockPage.inputPanel.calculatingButton') : t('blockPage.inputPanel.startButton')}
              </Button>

              {/* Algorithm Info */}
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium mb-1">{t('blockPage.inputPanel.algorithmTitle')}</p>
                    <p>
                      {t('blockPage.inputPanel.algorithmDescription')}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Panel */}
          <div className="space-y-6">
            {result && (
              <>
                {/* Statistics Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>{t('blockPage.resultsPanel.title')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-foreground">{result.statistics.totalSamples}</div>
                        <div className="text-sm text-muted-foreground">{t('blockPage.resultsPanel.totalSamples')}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-foreground">{totalBlocks}</div>
                        <div className="text-sm text-muted-foreground">{t('blockPage.resultsPanel.blockCount')}</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {result.groups.map((group, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              {t('blockPage.resultsPanel.groupLabel', { index: index + 1 })}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {t('blockPage.resultsPanel.samplesCount', { count: group.length })}
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
                        {t('blockPage.resultsPanel.downloadReport')}
                      </Button>
                      <Button onClick={() => copyToClipboard(result.report)} variant="outline" className="flex-1">
                        <Copy className="w-4 h-4 mr-2" />
                        {t('blockPage.resultsPanel.copyReport')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Block Visualization */}
                <Card>
                  <CardHeader>
                    <CardTitle>{t('blockPage.resultsPanel.blockDistributionTitle')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Array.from({ length: totalBlocks }, (_, blockIndex) => {
                        const blockStart = blockIndex * blockSize + 1
                        const blockEnd = Math.min((blockIndex + 1) * blockSize, sampleSize)
                        const blockSamples = Array.from(
                          { length: blockEnd - blockStart + 1 },
                          (_, i) => blockStart + i,
                        )

                        return (
                          <div key={blockIndex} className="border border-border rounded-lg p-4">
                            <h4 className="font-medium mb-3">
                              {t('blockPage.resultsPanel.blockTitle', {
                                index: blockIndex + 1,
                                start: blockStart,
                                end: blockEnd,
                              })}
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {result.groups.map((group, groupIndex) => {
                                const groupSamplesInBlock = group.participants.filter(
                                  (sample) => sample >= blockStart && sample <= blockEnd,
                                )
                                return (
                                  <div key={groupIndex} className="bg-muted/30 rounded p-2">
                                    <div className="text-xs text-muted-foreground mb-1">
                                      {t('blockPage.resultsPanel.groupInBlock', { index: groupIndex + 1 })}
                                    </div>
                                    <div className="text-sm font-medium">
                                      {t('blockPage.resultsPanel.samplesCount', { count: groupSamplesInBlock.length })}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {groupSamplesInBlock.join(', ')}
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Detailed Groups */}
                <Card>
                  <CardHeader>
                    <CardTitle>{t('blockPage.resultsPanel.detailedGroupsTitle')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {result.groups.map((group, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">
                              {t('blockPage.resultsPanel.groupTitle', { index: index + 1, count: group.length })}
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
                    <CardTitle>{t('blockPage.resultsPanel.reportPreviewTitle')}</CardTitle>
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
                  <Grid3X3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">{t('blockPage.resultsPanel.noResults')}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
