/**
 * QQ 互联 OAuth 2.0 授权地址构造工具。
 *
 * 使用前需要在 QQ 互联（https://connect.qq.com/）创建应用，并配置：
 *   - NEXT_PUBLIC_QQ_APP_ID        应用 AppID
 *   - NEXT_PUBLIC_QQ_REDIRECT_URI  授权回调地址（需与 QQ 互联后台登记的一致）
 *
 * 当前实现只负责把用户带到 QQ 的授权页面；授权成功后 QQ 会带 code 回调
 * redirect_uri，服务端拿到 code 后再换取 access_token / openid 即完成登录。
 */

export const QQ_AUTHORIZE_ENDPOINT = 'https://graph.qq.com/oauth2.0/authorize'

/** QQ 互联默认申请的基础权限。 */
export const QQ_DEFAULT_SCOPE = 'get_user_info'

/** 授权回调后用于校验 state 的 sessionStorage key。 */
export const QQ_OAUTH_STATE_KEY = 'randbox.qq.oauth.state'

export function getQQAppId(): string {
  return (process.env.NEXT_PUBLIC_QQ_APP_ID || '').trim()
}

export function isQQLoginConfigured(): boolean {
  return getQQAppId().length > 0
}

/**
 * 回调地址：优先使用环境变量，否则回退到当前页面地址。
 * 注意 QQ 互联要求回调地址与后台登记的一字不差（含端口与末尾斜杠）。
 */
export function getQQRedirectUri(pathname?: string): string {
  const configured = (process.env.NEXT_PUBLIC_QQ_REDIRECT_URI || '').trim()
  if (configured) {
    return configured
  }

  if (typeof window === 'undefined') {
    return ''
  }

  const path = pathname || window.location.pathname || '/'
  return `${window.location.origin}${path}`
}

export function createQQOAuthState(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

export interface QQAuthorizeOptions {
  appId?: string
  redirectUri?: string
  state?: string
  scope?: string
}

/**
 * 构造 QQ 授权页地址，例如：
 * https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=...&redirect_uri=...
 */
export function buildQQAuthorizeUrl(options: QQAuthorizeOptions = {}): string {
  const appId = (options.appId ?? getQQAppId()).trim()
  const redirectUri = (options.redirectUri ?? getQQRedirectUri()).trim()

  if (!appId) {
    throw new Error('NEXT_PUBLIC_QQ_APP_ID is not configured')
  }

  if (!redirectUri) {
    throw new Error('QQ redirect URI is empty')
  }

  const url = new URL(QQ_AUTHORIZE_ENDPOINT)
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('client_id', appId)
  url.searchParams.set('redirect_uri', redirectUri)
  url.searchParams.set('state', options.state ?? createQQOAuthState())
  url.searchParams.set('scope', options.scope ?? QQ_DEFAULT_SCOPE)

  return url.toString()
}
