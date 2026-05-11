import { createContext, useContext, useState, useEffect } from 'react'
import { hashPassword, checkRateLimit, recordFailedAttempt, resetRateLimit } from '../utils/security'

const AuthContext = createContext(null)

const SESSION_KEY = 'admin_session'

export function AuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  // Restore session on mount
  useEffect(() => {
    try {
      const session = sessionStorage.getItem(SESSION_KEY)
      if (session) {
        const { expires } = JSON.parse(session)
        if (Date.now() < expires) {
          setIsAdmin(true)
        } else {
          sessionStorage.removeItem(SESSION_KEY)
        }
      }
    } catch {
      sessionStorage.removeItem(SESSION_KEY)
    }
    setLoading(false)
  }, [])

  async function login(user, pass) {
    // Rate limiting check
    const rate = checkRateLimit()
    if (rate.locked) {
      return { ok: false, error: `Demasiados intentos. Espera ${rate.minutes} minuto(s).` }
    }

    // Hash the entered password
    const passHash = await hashPassword(pass)
    const storedHash = await hashPassword(import.meta.env.VITE_ADMIN_PASS)

    const userMatch = user.trim().toLowerCase() === import.meta.env.VITE_ADMIN_USER.toLowerCase()
    const passMatch = passHash === storedHash

    if (userMatch && passMatch) {
      resetRateLimit()
      // Session expires in 8 hours
      const session = { expires: Date.now() + 8 * 60 * 60 * 1000 }
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
      setIsAdmin(true)
      return { ok: true }
    }

    const data = recordFailedAttempt()
    const remaining = Math.max(0, 5 - data.attempts)
    if (remaining === 0) {
      return { ok: false, error: 'Cuenta bloqueada por 15 minutos por múltiples intentos fallidos.' }
    }
    return { ok: false, error: `Credenciales incorrectas. Intentos restantes: ${remaining}` }
  }

  function logout() {
    sessionStorage.removeItem(SESSION_KEY)
    setIsAdmin(false)
  }

  return (
    <AuthContext.Provider value={{ isAdmin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
