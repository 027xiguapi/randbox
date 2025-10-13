'use client'

import { Copy, Edit, Play, RefreshCw, Save, X } from 'lucide-react'
import { RandBox } from 'randbox'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

interface RandBoxTempProps {
  text?: string
  funcName: string
  option?: any
  module?: string
  description?: string
}

export default function RandBoxTemp({
  text = 'Generate Random Data',
  funcName,
  option,
  module = 'core',
  description,
}: RandBoxTempProps) {
  const [result, setResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentOption, setCurrentOption] = useState(option)
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState('')

  const generateFormula = (funcName: string, option: any) => {
    if (!option || (typeof option === 'object' && Object.keys(option).length === 0)) {
      return `RandBox.${funcName}()`
    }
    return `RandBox.${funcName}(${JSON.stringify(option)})`
  }

  const executeFunction = () => {
    setIsLoading(true)
    setError(null)

    try {
      const randBox = new RandBox()

      if (typeof randBox[funcName] !== 'function') {
        throw new TypeError(`Function '${funcName}' does not exist on RandBox instance`)
      }

      let res
      if (currentOption !== undefined && currentOption !== null) {
        res = randBox[funcName](currentOption)
      }
      else {
        res = randBox[funcName]()
      }

      setResult(res)
    }
    catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      console.error('RandBox execution error:', err)
    }
    finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (result !== null) {
      const resultString = typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result)
      navigator.clipboard.writeText(resultString)
    }
  }

  const copyFormula = () => {
    navigator.clipboard.writeText(generateFormula(funcName, currentOption))
  }

  const formatResult = (value: any) => {
    if (value === null || value === undefined) { return 'null' }
    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2)
    }
    return String(value)
  }

  const getModuleColor = (moduleName: string) => {
    const colors = {
      basics: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      helpers: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      text: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      person: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      mobile: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
      web: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
      location: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
      finance: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      core: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    }
    return colors[moduleName] || colors.core
  }

  const startEditing = () => {
    setIsEditing(true)
    setEditValue(generateFormula(funcName, currentOption))
  }

  const cancelEditing = () => {
    setIsEditing(false)
    setEditValue('')
  }

  const saveEditing = () => {
    try {
      const match = editValue.match(/RandBox\.\w+\((.*)\)/)
      if (match && match[1].trim()) {
        const paramStr = match[1].trim()
        const newOption = JSON.parse(paramStr)
        setCurrentOption(newOption)
      }
      else {
        setCurrentOption(undefined)
      }
      setIsEditing(false)
      setEditValue('')
      setError(null)
    }
    catch (err) {
      setError('Invalid formula format. Please use valid JSON for parameters.')
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge className={getModuleColor(module)}>
              {module}
            </Badge>
            <CardTitle className="text-lg">
              {funcName}
            </CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={executeFunction}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            {isLoading
              ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                )
              : (
                  <Play className="w-4 h-4" />
                )}
            {isLoading ? 'Generating...' : text}
          </Button>
        </div>
        {description && (
          <CardDescription className="mt-2">
            {description}
          </CardDescription>
        )}

        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Formula:</span>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={copyFormula}
                className="h-6 w-6 p-0"
                title="Copy formula"
              >
                <Copy className="w-3 h-3" />
              </Button>
              {!isEditing && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={startEditing}
                  className="h-6 w-6 p-0"
                  title="Edit formula"
                >
                  <Edit className="w-3 h-3" />
                </Button>
              )}
            </div>
          </div>

          {isEditing
            ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="flex-1 font-mono text-sm"
                    placeholder="RandBox.funcName(parameters)"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={saveEditing}
                    className="h-8 w-8 p-0 text-green-600"
                    title="Save"
                  >
                    <Save className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={cancelEditing}
                    className="h-8 w-8 p-0 text-red-600"
                    title="Cancel"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )
            : (
                <div className="p-2 bg-muted rounded-md border">
                  <code className="text-sm font-mono text-foreground">
                    {generateFormula(funcName, currentOption)}
                  </code>
                </div>
              )}
        </div>
      </CardHeader>

      <CardContent>
        {error && (
          <div className="p-3 mb-4 bg-red-50 border border-red-200 rounded-md text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300">
            <strong>Error:</strong>
            {error}
          </div>
        )}

        {result !== null && !error && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm text-muted-foreground">Result:</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyToClipboard}
                className="h-8 w-8 p-0"
                title="Copy result"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <div className="p-3 bg-muted rounded-md">
              <pre className="text-sm overflow-x-auto whitespace-pre-wrap break-words">
                {formatResult(result)}
              </pre>
            </div>
            <div className="text-xs text-muted-foreground">
              Type:
              {typeof result}
              | Length:
              {
                typeof result === 'string'
                  ? result.length
                  : Array.isArray(result)
                    ? result.length
                    : typeof result === 'object'
                      ? Object.keys(result).length
                      : 'N/A'
              }
            </div>
          </div>
        )}

        {result === null && !error && (
          <div className="text-center py-8 text-muted-foreground">
            <Play className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Click the button above to generate random data</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
