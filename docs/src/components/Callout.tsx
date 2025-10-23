'use client'

import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'
import { AlertCircle, AlertTriangle, CheckCircle, Info } from 'lucide-react'
import * as React from 'react'

import { cn } from '@/lib/utils'

const calloutVariants = cva(
  'relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4',
  {
    variants: {
      type: {
        default: 'bg-background text-foreground [&>svg]:text-foreground',
        info: 'border-blue-500/50 bg-blue-50/50 text-blue-900 dark:border-blue-500/30 dark:bg-blue-950/20 dark:text-blue-200 [&>svg]:text-blue-600 dark:[&>svg]:text-blue-400',
        warning: 'border-yellow-500/50 bg-yellow-50/50 text-yellow-900 dark:border-yellow-500/30 dark:bg-yellow-950/20 dark:text-yellow-200 [&>svg]:text-yellow-600 dark:[&>svg]:text-yellow-400',
        error: 'border-red-500/50 bg-red-50/50 text-red-900 dark:border-red-500/30 dark:bg-red-950/20 dark:text-red-200 [&>svg]:text-red-600 dark:[&>svg]:text-red-400',
        success: 'border-green-500/50 bg-green-50/50 text-green-900 dark:border-green-500/30 dark:bg-green-950/20 dark:text-green-200 [&>svg]:text-green-600 dark:[&>svg]:text-green-400',
      },
    },
    defaultVariants: {
      type: 'default',
    },
  },
)

const icons = {
  default: Info,
  info: Info,
  warning: AlertTriangle,
  error: AlertCircle,
  success: CheckCircle,
}

export interface CalloutProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof calloutVariants> {
  type?: 'default' | 'info' | 'warning' | 'error' | 'success'
}

export function Callout({
  className,
  type = 'default',
  children,
  ...props
}: CalloutProps) {
  const Icon = icons[type || 'default']

  return (
    <div
      role="alert"
      className={cn(calloutVariants({ type }), className)}
      {...props}
    >
      <Icon className="h-4 w-4" />
      <div className="text-sm [&_p]:leading-relaxed">{children}</div>
    </div>
  )
}
