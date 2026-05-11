import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, Lock, Mail, ShieldAlert } from 'lucide-react'
import logo from '../assets/UltimoPrecioRemaster.png'

export default function AdminLogin() {
  const { login } = useAuth()
  const navigate  = useNavigate()

  const [user, setUser]       = useState('')
  const [pass, setPass]       = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await login(user, pass)
    setLoading(false)
    if (result.ok) {
      navigate('/admin')
    } else {
      setError(result.error)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link to="/">
            <img src={logo} alt="El Último Precio" className="h-20 w-auto" />
          </Link>
        </div>

        {/* Card */}
        <div className="bg-[#121212] border border-[#C9A227]/30 rounded-2xl p-8 shadow-[0_0_40px_#C9A22720]">
          <div className="flex items-center gap-2 mb-6">
            <ShieldAlert className="h-5 w-5 text-[#FFD700]" />
            <h1 className="text-lg font-extrabold text-white tracking-wide">ACCESO ADMINISTRADOR</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-[#BFBFBF] mb-1.5 tracking-wider uppercase">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#C9A227]" />
                <input
                  type="email"
                  value={user}
                  onChange={e => setUser(e.target.value)}
                  placeholder="admin@ultimoprecio.com"
                  required
                  autoComplete="username"
                  className="w-full bg-[#0A0A0A] border border-[#2a2a2a] focus:border-[#FFD700] rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-[#BFBFBF] mb-1.5 tracking-wider uppercase">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#C9A227]" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={pass}
                  onChange={e => setPass(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full bg-[#0A0A0A] border border-[#2a2a2a] focus:border-[#FFD700] rounded-lg pl-10 pr-10 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-[#FFD700] transition-colors"
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2 bg-red-950/50 border border-red-800/50 rounded-lg px-3 py-2.5">
                <ShieldAlert className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                <p className="text-xs text-red-300">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-[#C9A227] to-[#FFD700] text-[#0A0A0A] font-extrabold text-sm tracking-widest rounded-lg hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? 'VERIFICANDO...' : 'INGRESAR'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-zinc-600 mt-6">
          <Link to="/" className="hover:text-[#C9A227] transition-colors">← Volver a la tienda</Link>
        </p>
      </div>
    </div>
  )
}
