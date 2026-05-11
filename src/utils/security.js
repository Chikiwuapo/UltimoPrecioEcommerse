// ─────────────────────────────────────────────
//  src/utils/security.js — Security utilities
// ─────────────────────────────────────────────

// ── SHA-256 hash via Web Crypto API ──────────
export async function hashPassword(password) {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

// ── Input sanitizer (basic XSS prevention) ───
export function sanitizeInput(str) {
  if (typeof str !== 'string') return ''
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim()
}

// ── Image URL validator ───────────────────────
export function isValidImageUrl(url) {
  if (!url || typeof url !== 'string') return false
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'https:'
  } catch {
    return false
  }
}

// ── Rate limiter ─────────────────────────────
const RATE_LIMIT_KEY  = 'admin_login_attempts'
const MAX_ATTEMPTS    = 5
const LOCKOUT_MS      = 15 * 60 * 1000 // 15 minutes

export function checkRateLimit() {
  try {
    const raw = sessionStorage.getItem(RATE_LIMIT_KEY)
    if (!raw) return { locked: false, attempts: 0, remaining: MAX_ATTEMPTS }
    const data = JSON.parse(raw)
    const now = Date.now()
    if (data.lockedUntil && now < data.lockedUntil) {
      const minutes = Math.ceil((data.lockedUntil - now) / 60000)
      return { locked: true, minutes, attempts: data.attempts }
    }
    if (data.lockedUntil && now >= data.lockedUntil) {
      sessionStorage.removeItem(RATE_LIMIT_KEY)
      return { locked: false, attempts: 0, remaining: MAX_ATTEMPTS }
    }
    return {
      locked: false,
      attempts: data.attempts,
      remaining: MAX_ATTEMPTS - data.attempts,
    }
  } catch {
    return { locked: false, attempts: 0, remaining: MAX_ATTEMPTS }
  }
}

export function recordFailedAttempt() {
  try {
    const raw = sessionStorage.getItem(RATE_LIMIT_KEY)
    const data = raw ? JSON.parse(raw) : { attempts: 0 }
    data.attempts = (data.attempts || 0) + 1
    if (data.attempts >= MAX_ATTEMPTS) {
      data.lockedUntil = Date.now() + LOCKOUT_MS
    }
    sessionStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(data))
    return data
  } catch {
    return { attempts: 1 }
  }
}

export function resetRateLimit() {
  sessionStorage.removeItem(RATE_LIMIT_KEY)
}
