'use client'

import type { HistoryRecord, RandomizationType } from '@/lib/history'
import { ClockIcon, DownloadIcon, SearchIcon, TrashIcon, UploadIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useLocale } from '@/hooks'
import { RandomizationHistory } from '@/lib/history'

export default function HistoryPage() {
  const { t, currentLocale } = useLocale()
  const [records, setRecords] = useState<HistoryRecord[]>([])
  const [filteredRecords, setFilteredRecords] = useState<HistoryRecord[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<RandomizationType | 'all'>('all')
  const [selectedDate, setSelectedDate] = useState('')

  // 加载历史记录
  const loadHistory = () => {
    const historyRecords = RandomizationHistory.getRecords()
    setRecords(historyRecords)
    setFilteredRecords(historyRecords)
  }

  // 过滤记录
  const filterRecords = () => {
    let filtered = records

    // 按类型过滤
    if (selectedType !== 'all') {
      filtered = filtered.filter(record => record.type === selectedType)
    }

    // 按搜索查询过滤
    if (searchQuery) {
      filtered = filtered.filter(record =>
        record.title?.toLowerCase().includes(searchQuery.toLowerCase())
        || record.type.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // 按日期过滤
    if (selectedDate) {
      const selectedDateStr = new Date(selectedDate).toDateString()
      filtered = filtered.filter(record =>
        new Date(record.timestamp).toDateString() === selectedDateStr,
      )
    }

    setFilteredRecords(filtered)
  }

  // 删除单个记录
  const deleteRecord = (id: string) => {
    RandomizationHistory.deleteRecord(id)
    loadHistory()
  }

  // 清空所有历史
  const clearAllHistory = () => {
    if (confirm(t('historyPage.confirmations.clearAll.description'))) {
      RandomizationHistory.clearHistory()
      loadHistory()
    }
  }

  // 导出历史
  const exportHistory = () => {
    const data = RandomizationHistory.exportHistory()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `randomization-history-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // 导入历史
  const importHistory = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) { return }

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = e.target?.result as string
        const success = RandomizationHistory.importHistory(data)
        if (success) {
          loadHistory()
          alert(t('historyPage.messages.imported'))
        }
        else {
          alert(t('historyPage.messages.importError'))
        }
      }
      catch (error) {
        alert(t('historyPage.messages.importError'))
      }
    }
    reader.readAsText(file)
    event.target.value = '' // 重置文件输入
  }

  // 格式化时间
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return date.toLocaleTimeString(currentLocale === 'zh' ? 'zh-CN' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })
    }
    else if (diffDays === 1) {
      return '昨天'
    }
    else if (diffDays < 7) {
      return `${diffDays}天前`
    }
    else {
      return date.toLocaleDateString(currentLocale === 'zh' ? 'zh-CN' : 'en-US')
    }
  }

  // 获取类型标签颜色
  const getTypeColor = (type: RandomizationType) => {
    switch (type) {
      case 'simple': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'stratified': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'block': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  // 获取类型显示名称
  const getTypeName = (type: RandomizationType) => {
    switch (type) {
      case 'simple': return t('historyPage.typeLabels.simple')
      case 'stratified': return t('historyPage.typeLabels.stratified')
      case 'block': return t('historyPage.typeLabels.block')
      default: return type
    }
  }

  useEffect(() => {
    loadHistory()
  }, [])

  useEffect(() => {
    filterRecords()
  }, [records, searchQuery, selectedType, selectedDate])

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header - 模仿 Chrome 历史页面的标题栏 */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200 dark:border-slate-700">
          <div>
            <h1 className="text-3xl font-normal text-slate-900 dark:text-slate-100 mb-1">
              {t('historyPage.title')}
            </h1>
            <p className="text-base text-slate-600 dark:text-slate-400">
              {t('historyPage.subtitle')}
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={exportHistory}
              disabled={records.length === 0}
              className="h-9 px-3 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <DownloadIcon className="w-4 h-4 mr-2" />
              {t('historyPage.header.exportHistory')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => document.getElementById('import-file')?.click()}
              className="h-9 px-3 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <UploadIcon className="w-4 h-4 mr-2" />
              {t('historyPage.header.importHistory')}
            </Button>
            <input
              id="import-file"
              type="file"
              accept=".json"
              className="hidden"
              onChange={importHistory}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllHistory}
              disabled={records.length === 0}
              className="h-9 px-3 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              <TrashIcon className="w-4 h-4 mr-2" />
              {t('historyPage.header.clearAll')}
            </Button>
          </div>
        </div>

        {/* Search Bar - 模仿 Chrome 的搜索栏 */}
        <div className="mb-6">
          <div className="max-w-2xl">
            <div className="relative">
              <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                type="text"
                placeholder={t('historyPage.header.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 pl-12 pr-4 text-base border-slate-300 dark:border-slate-600 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Filters - 简化的筛选器 */}
        {(selectedType !== 'all' || selectedDate) && (
          <div className="mb-6">
            <div className="flex items-center gap-4 text-sm">
              <span className="text-slate-600 dark:text-slate-400">筛选条件:</span>
              {selectedType !== 'all' && (
                <Badge variant="secondary" className="px-3 py-1">
                  {getTypeName(selectedType)}
                  <button
                    onClick={() => setSelectedType('all')}
                    className="ml-2 hover:text-red-600"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {selectedDate && (
                <Badge variant="secondary" className="px-3 py-1">
                  {selectedDate}
                  <button
                    onClick={() => setSelectedDate('')}
                    className="ml-2 hover:text-red-600"
                  >
                    ×
                  </button>
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Quick Filters */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-3 py-1.5 rounded-full transition-colors ${
                selectedType === 'all'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              {t('historyPage.header.allTypes')}
            </button>
            <button
              onClick={() => setSelectedType('simple')}
              className={`px-3 py-1.5 rounded-full transition-colors ${
                selectedType === 'simple'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              {t('historyPage.typeLabels.simple')}
            </button>
            <button
              onClick={() => setSelectedType('stratified')}
              className={`px-3 py-1.5 rounded-full transition-colors ${
                selectedType === 'stratified'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              {t('historyPage.typeLabels.stratified')}
            </button>
            <button
              onClick={() => setSelectedType('block')}
              className={`px-3 py-1.5 rounded-full transition-colors ${
                selectedType === 'block'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              {t('historyPage.typeLabels.block')}
            </button>
          </div>
        </div>

        {/* History List */}
        {filteredRecords.length === 0 ? (
          <div className="text-center py-16">
            <ClockIcon className="w-16 h-16 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
              {records.length === 0 ? t('historyPage.noRecords.title') : '没有符合条件的记录'}
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              {records.length === 0
                ? t('historyPage.noRecords.description')
                : '请尝试调整搜索条件或筛选器'}
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {/* Results count */}
            <div className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              显示
              {' '}
              {filteredRecords.length}
              {' '}
              /
              {' '}
              {records.length}
              {' '}
              条记录
            </div>

            {/* History items - 模仿 Chrome 历史页面的列表样式 */}
            {filteredRecords.map((record) => (
              <div
                key={record.id}
                className="group flex items-center py-3 px-4 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer border-l-4 border-transparent hover:border-blue-400"
              >
                {/* Icon */}
                <div className="flex-shrink-0 mr-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${getTypeColor(record.type)}`}>
                    {record.type === 'simple' ? 'S' : record.type === 'stratified' ? 'St' : 'B'}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-medium text-slate-900 dark:text-slate-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {record.title}
                      </h3>
                      <div className="flex items-center gap-4 mt-1">
                        <Badge
                          variant="secondary"
                          className={`text-xs ${getTypeColor(record.type)} border-0`}
                        >
                          {getTypeName(record.type)}
                        </Badge>
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                          {record.type === 'simple' && (
                            <span>
                              {(record.params as any).totalParticipants}
                              {' '}
                              名参与者，
                              {(record.params as any).groupCount}
                              {' '}
                              个组
                            </span>
                          )}
                          {record.type === 'stratified' && (
                            <span>
                              {(record.params as any).strata?.length || 0}
                              {' '}
                              个分层，
                              {(record.params as any).groupCount}
                              {' '}
                              个组
                            </span>
                          )}
                          {record.type === 'block' && (
                            <span>
                              样本量
                              {' '}
                              {(record.params as any).sampleSize}
                              ，块大小
                              {' '}
                              {(record.params as any).blockSize}
                            </span>
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Time and Actions */}
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <span className="text-sm text-slate-500 dark:text-slate-400 min-w-[80px] text-right">
                        {formatTime(record.timestamp)}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteRecord(record.id)
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-2 h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
