'use client'

import clsx from 'clsx'
import { addBasePath } from 'next/dist/client/add-base-path'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { useLocale } from '@/hooks'

const ONE_YEAR = 365 * 24 * 60 * 60 * 1000

// 语言配置
const LOCALES = [
  { value: 'zh', label: '中文', icon: '🇨🇳' },
  { value: 'en', label: 'English', icon: '🇺🇸' },
  { value: 'ja', label: '日本語', icon: '🇯🇵' },
]

/**
 * 快速切换语言组件，用于覆盖 nextra 原生切换下拉框
 */
export default function LocaleToggle({
  className,
}: {
  className?: string
}) {
  const { currentLocale } = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const forceHideBanner = useCallback(() => {
    const banner = document.querySelector('.nextra-banner')
    if (!banner) {
      return
    }

    const isBannerDismissed = localStorage.getItem('starter-banner')
    if (isBannerDismissed) {
      banner.classList.add('x:hidden')
    }
  }, [])

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(() => {
        forceHideBanner()
      })
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })
    forceHideBanner()
    return () => observer.disconnect()
  }, [forceHideBanner])

  const changeLocale = useCallback((locale: string) => {
    // 滚动条位置记录
    const currentPosition = window.scrollY
    // 检查是否滚动到底部
    const isAtBottom = (window.innerHeight + window.scrollY) >= document.body.offsetHeight

    const currentPathLocale = pathname.split('/')[1] || 'en'
    const newPathname = pathname.replace(`/${currentPathLocale}`, `/${locale}`)
    const nextHref = addBasePath(newPathname)

    const date = new Date(Date.now() + ONE_YEAR)
    document.cookie = `NEXT_LOCALE=${locale}; expires=${date.toUTCString()}; path=/`

    router.replace(nextHref)
    setIsOpen(false)

    // 在路由变化后恢复滚动位置
    requestAnimationFrame(() => {
      if (isAtBottom) {
        window.scrollTo(0, document.body.scrollHeight)
      }
      else {
        window.scrollTo(0, currentPosition)
      }
    })
  }, [pathname, router])

  const currentLocaleConfig = LOCALES.find(l => l.value === currentLocale) || LOCALES[0]

  return (
    <div className={clsx('relative', className)}>
      <button
        className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md border border-gray-200 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="切换语言"
      >
        <span className="text-base">{currentLocaleConfig.icon}</span>
        <span className="hidden sm:inline">{currentLocaleConfig.label}</span>
        <svg
          className={clsx('w-4 h-4 transition-transform', isOpen && 'rotate-180')}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 shadow-lg z-50 py-1">
            {LOCALES.map((locale) => (
              <button
                key={locale.value}
                className={clsx(
                  'w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors',
                  currentLocale === locale.value && 'bg-gray-100 dark:bg-gray-700 font-medium',
                )}
                onClick={() => changeLocale(locale.value)}
              >
                <span className="text-base">{locale.icon}</span>
                <span>{locale.label}</span>
                {currentLocale === locale.value && (
                  <svg
                    className="w-4 h-4 ml-auto"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
