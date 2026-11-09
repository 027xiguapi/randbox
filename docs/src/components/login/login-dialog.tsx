'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { useLocale } from '@/hooks'
import {
  buildQQAuthorizeUrl,
  createQQOAuthState,
  isQQLoginConfigured,
  QQ_OAUTH_STATE_KEY,
} from '@/lib/qq-oauth'

const FOCUSABLE
  = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

function QQPenguin({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <ellipse cx="11" cy="29" rx="3.3" ry="1.7" fill="#F5A623" />
      <ellipse cx="21" cy="29" rx="3.3" ry="1.7" fill="#F5A623" />
      <path
        d="M6.6 14.4c-1.9.7-3 2.6-3 4.8 0 2.9 2.2 5.3 5 5.8"
        stroke="#111"
        strokeWidth="2.8"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M25.4 14.4c1.9.7 3 2.6 3 4.8 0 2.9-2.2 5.3-5 5.8"
        stroke="#111"
        strokeWidth="2.8"
        strokeLinecap="round"
        fill="none"
      />
      <ellipse cx="16" cy="17.5" rx="10.4" ry="11.4" fill="#111" />
      <ellipse cx="16" cy="20.4" rx="7.5" ry="8" fill="#fff" />
      <ellipse cx="16" cy="10" rx="6.5" ry="5.9" fill="#111" />
      <ellipse cx="16" cy="10.6" rx="5.1" ry="4.7" fill="#fff" />
      <circle cx="13.7" cy="10" r="1.2" fill="#111" />
      <circle cx="18.3" cy="10" r="1.2" fill="#111" />
      <path d="m14.5 12.6 1.5 1.4 1.5-1.4z" fill="#F5A623" />
    </svg>
  )
}

function LoginIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  )
}

export function LoginDialog() {
  const { t } = useLocale()

  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [redirecting, setRedirecting] = useState(false)
  const [error, setError] = useState('')

  const triggerRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!open || !mounted) {
      return
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setOpen(false)
        triggerRef.current?.focus()
        return
      }

      if (event.key !== 'Tab' || !dialogRef.current) {
        return
      }

      const items = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter(item => item.offsetParent !== null)

      if (!items.length) {
        return
      }

      const first = items[0]
      const last = items[items.length - 1]

      if (
        event.shiftKey
        && (document.activeElement === first
          || document.activeElement === dialogRef.current)
      ) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)
    dialogRef.current?.focus()

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [open, mounted])

  const close = () => {
    setOpen(false)
    setRedirecting(false)
    setError('')
    triggerRef.current?.focus()
  }

  const handleQQLogin = () => {
    setError('')

    if (!isQQLoginConfigured()) {
      setError(t('loginQQMissing'))
      return
    }

    try {
      const state = createQQOAuthState()

      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(QQ_OAUTH_STATE_KEY, state)
      }

      setRedirecting(true)
      window.location.href = buildQQAuthorizeUrl({ state })
    } catch {
      setRedirecting(false)
      setError(t('loginQQFailed'))
    }
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={t('loginLabel')}
        title={t('loginLabel')}
        className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-[#12b7f5] px-2.5 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-[#0ca8e0] sm:px-3"
      >
        <LoginIcon className="size-4" />
        <span className="max-md:hidden">{t('loginLabel')}</span>
      </button>

      {mounted && open
        ? createPortal(
            <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/50 backdrop-blur-sm">
              <div
                className="flex min-h-full items-center justify-center p-4 sm:p-6"
                onMouseDown={(event) => {
                  if (event.target === event.currentTarget) {
                    close()
                  }
                }}
              >
                <div
                  ref={dialogRef}
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="login-dialog-title"
                  aria-describedby="login-dialog-description"
                  tabIndex={-1}
                  className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-2xl outline-none sm:p-8"
                >
                  <button
                    type="button"
                    onClick={close}
                    aria-label={t('loginClose')}
                    className="absolute right-4 top-4 inline-flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="size-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      aria-hidden="true"
                    >
                      <path d="M6 6l12 12M18 6L6 18" />
                    </svg>
                  </button>

                  <h2
                    id="login-dialog-title"
                    className="mb-2 text-center text-2xl font-bold"
                  >
                    {t('loginTitle')}
                  </h2>
                  <p
                    id="login-dialog-description"
                    className="mb-6 text-center text-sm text-muted-foreground"
                  >
                    {t('loginDescription')}
                  </p>

                  <div className="mb-4 flex items-center gap-3 text-xs font-medium text-muted-foreground">
                    <span className="h-px flex-1 bg-border" />
                    <span>{t('loginPartnerTitle')}</span>
                    <span className="h-px flex-1 bg-border" />
                  </div>

                  <button
                    type="button"
                    onClick={handleQQLogin}
                    disabled={redirecting}
                    className="flex w-full items-center justify-center gap-2 rounded-md bg-[#12b7f5] px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-[#0ca8e0] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#12b7f5] focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-wait disabled:opacity-80"
                  >
                    <QQPenguin className="size-6 shrink-0" />
                    <span>
                      {redirecting ? t('loginQQRedirecting') : t('loginQQButton')}
                    </span>
                  </button>

                  {error
                    ? (
                        <p
                          role="alert"
                          className="mt-3 text-left text-sm text-destructive"
                        >
                          {error}
                        </p>
                      )
                    : null}
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  )
}

export default LoginDialog
