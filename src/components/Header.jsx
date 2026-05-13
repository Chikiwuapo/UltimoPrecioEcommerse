import { useEffect, useState, useRef, useMemo, useCallback } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  Menu, Search, Sun, Moon, X, ChevronDown,
  Laptop, Monitor, Keyboard, HardDrive, Camera, Armchair,
  Cpu, Layers3, Zap, Fan, Box, Server, CircuitBoard,
  Truck, Shield, Tag, ShieldCheck,
} from 'lucide-react'
import logo from '../assets/UltimoPrecioRemaster.png'
import { getActiveCategories, getAllProducts } from '../data/index'
import { useAuth } from '../context/AuthContext'

// Icon map keyed by slug
const ICON_MAP = {
  laptops:        Laptop,
  gpus:           Layers3,
  monitores:      Monitor,
  procesadores:   Cpu,
  ram:            Server,
  almacenamiento: HardDrive,
  'placas-madre': CircuitBoard,
  gabinetes:      Box,
  fuentes:        Zap,
  refrigeracion:  Fan,
  perifericos:    Keyboard,
  camaras:        Camera,
  'sillas-gamer': Armchair,
}

const CAT_COLORS = {
  laptops:        '#00D4FF',
  gpus:           '#A855F7',
  monitores:      '#22D3EE',
  procesadores:   '#F97316',
  ram:            '#10B981',
  almacenamiento: '#6366F1',
  'placas-madre': '#EAB308',
  gabinetes:      '#94A3B8',
  fuentes:        '#FFD700',
  refrigeracion:  '#38BDF8',
  perifericos:    '#F43F5E',
  camaras:        '#84CC16',
  'sillas-gamer': '#EC4899',
}

const MAX_SUGGESTIONS = 6

function getQuickLinks(activeCategories) {
  return activeCategories.slice(0, 5)
}

// Highlight matching text
function Highlight({ text, query }) {
  if (!query) return <span>{text}</span>
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return <span>{text}</span>
  return (
    <span>
      {text.slice(0, idx)}
      <mark className="bg-[#FFD700]/30 text-[#C9A227] dark:text-[#FFD700] rounded px-0.5 not-italic font-bold">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </span>
  )
}

export default function Header() {
  const { isAdmin } = useAuth()
  const navigate    = useNavigate()
  const [searchParams] = useSearchParams()

  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('theme') || 'dark' } catch { return 'dark' }
  })
  const [mobileOpen,   setMobileOpen]   = useState(false)
  const [megaOpen,     setMegaOpen]     = useState(false)
  const [searchVal,    setSearchVal]    = useState('')
  const [suggestions,  setSuggestions]  = useState([])
  const [showDrop,     setShowDrop]     = useState(false)
  const [activeIdx,    setActiveIdx]    = useState(-1)

  const searchRef  = useRef(null)
  const inputRef   = useRef(null)
  const dropRef    = useRef(null)

  const activeCategories = getActiveCategories()
  const quickLinks       = getQuickLinks(activeCategories)
  const allProducts      = useMemo(() => getAllProducts(), [])

  // Sync input with URL param when navigating to /buscar
  useEffect(() => {
    const q = searchParams.get('q')
    if (q) setSearchVal(q)
  }, [searchParams])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  // ── Smart suggestions ──────────────────────────────────────────
  const computeSuggestions = useCallback((val) => {
    const q = val.trim().toLowerCase()
    if (q.length < 2) return []

    const terms = q.split(/\s+/).filter(Boolean)

    const scored = allProducts.map(p => {
      let score = 0
      if (p.name.toLowerCase().includes(q))   score += 50
      if (p.brand?.toLowerCase().includes(q)) score += 30
      terms.forEach(t => {
        if (p.name.toLowerCase().includes(t))        score += 10
        if (p.brand?.toLowerCase().includes(t))      score += 8
        if (p.category?.toLowerCase().includes(t))   score += 5
        if (p.description?.toLowerCase().includes(t)) score += 3
      })
      if (p.featured) score += 2
      if (p.stock > 0) score += 1
      return { ...p, _score: score }
    })

    return scored
      .filter(p => p._score > 0)
      .sort((a, b) => b._score - a._score)
      .slice(0, MAX_SUGGESTIONS)
  }, [allProducts])

  useEffect(() => {
    const s = computeSuggestions(searchVal)
    setSuggestions(s)
    setActiveIdx(-1)
    setShowDrop(searchVal.trim().length >= 2)
  }, [searchVal, computeSuggestions])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDrop(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function toggleTheme() {
    setTheme(t => t === 'dark' ? 'light' : 'dark')
  }

  function handleSearch(e) {
    e?.preventDefault()
    const q = searchVal.trim()
    if (!q) return
    setShowDrop(false)
    navigate(`/buscar?q=${encodeURIComponent(q)}`)
  }

  function handleKeyDown(e) {
    if (!showDrop || suggestions.length === 0) {
      if (e.key === 'Enter') handleSearch()
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx(i => Math.min(i + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx(i => Math.max(i - 1, -1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (activeIdx >= 0 && suggestions[activeIdx]) {
        const p = suggestions[activeIdx]
        setShowDrop(false)
        navigate(`/producto/${p.slug}`)
      } else {
        handleSearch()
      }
    } else if (e.key === 'Escape') {
      setShowDrop(false)
    }
  }

  function handleSuggestionClick(product) {
    setShowDrop(false)
    navigate(`/producto/${product.slug}`)
  }

  function handleViewAll() {
    setShowDrop(false)
    navigate(`/buscar?q=${encodeURIComponent(searchVal.trim())}`)
  }

  return (
    <header className="w-full sticky top-0 z-50">

      {/* ── 1. ANNOUNCEMENT BAR ── */}
      <div className="w-full bg-[#C9A227] dark:bg-[#1a1200] py-1.5 px-4 flex items-center justify-center gap-6 text-[11px] font-bold text-[#0A0A0A] dark:text-[#FFD700] tracking-wide">
        <span className="flex items-center gap-1.5"><Truck  className="h-3 w-3" /> ENVÍOS A TODO PERÚ</span>
        <span className="hidden sm:flex items-center gap-1.5"><Shield className="h-3 w-3" /> GARANTÍA OFICIAL</span>
        <span className="hidden md:flex items-center gap-1.5"><Tag    className="h-3 w-3" /> PRECIOS ACTUALIZADOS DIARIO</span>
      </div>

      {/* ── 2. MAIN ROW: Logo + Search + Actions ── */}
      <div className="w-full bg-white dark:bg-[#0A0A0A] border-b border-[#C9A227]/30 px-4 md:px-8 py-2.5">
        <div className="flex items-center gap-4">

          {/* Logo */}
          <Link to="/" className="shrink-0">
            <img src={logo} alt="El Último Precio" className="h-14 w-auto object-contain" />
          </Link>

          {/* ── Smart Search bar ── */}
          <div ref={searchRef} className="flex-1 max-w-2xl mx-auto relative">
            <form onSubmit={handleSearch}>
              <div className={`flex items-center border-2 overflow-hidden bg-gray-50 dark:bg-[#121212] transition-all duration-300 ${
                showDrop
                  ? 'rounded-t-2xl border-[#FFD700] dark:border-[#FFD700] dark:shadow-[0_0_18px_#C9A22730]'
                  : 'rounded-full border-[#C9A227] dark:border-[#C9A227]/50 focus-within:border-[#FFD700] dark:focus-within:border-[#FFD700] dark:focus-within:shadow-[0_0_18px_#C9A22730]'
              }`}>
                <input
                  ref={inputRef}
                  type="text"
                  value={searchVal}
                  onChange={e => setSearchVal(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => searchVal.trim().length >= 2 && setShowDrop(true)}
                  placeholder="Buscar productos, marcas y más..."
                  autoComplete="off"
                  className="w-full bg-transparent pl-5 pr-3 py-2.5 text-sm text-[#0A0A0A] dark:text-zinc-100 placeholder:text-gray-400 focus:outline-none"
                />
                {/* Clear button */}
                {searchVal && (
                  <button
                    type="button"
                    onClick={() => { setSearchVal(''); setSuggestions([]); setShowDrop(false); inputRef.current?.focus() }}
                    className="shrink-0 px-2 text-zinc-400 hover:text-[#FFD700] transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <button
                  type="submit"
                  aria-label="Buscar"
                  className="shrink-0 self-stretch px-5 bg-gradient-to-r from-[#C9A227] to-[#FFD700] dark:from-[#0099FF] dark:to-[#0050A0] text-[#0A0A0A] dark:text-white font-bold text-sm flex items-center gap-2 hover:brightness-110 transition-all"
                >
                  <Search className="h-4 w-4" />
                  <span className="hidden sm:inline text-xs tracking-widest">BUSCAR</span>
                </button>
              </div>
            </form>

            {/* ── Suggestions dropdown ── */}
            {showDrop && suggestions.length > 0 && (
              <div
                ref={dropRef}
                className="absolute top-full left-0 right-0 z-50 bg-white dark:bg-[#0f0f0f] border-2 border-t-0 border-[#FFD700] rounded-b-2xl shadow-2xl dark:shadow-[0_8px_40px_#00000090] overflow-hidden"
              >
                <ul>
                  {suggestions.map((p, i) => {
                    const Icon  = ICON_MAP[p.category] || Box
                    const color = CAT_COLORS[p.category] || '#FFD700'
                    return (
                      <li key={p.id}>
                        <button
                          type="button"
                          onMouseDown={() => handleSuggestionClick(p)}
                          onMouseEnter={() => setActiveIdx(i)}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                            activeIdx === i
                              ? 'bg-[#FFD700]/10 dark:bg-[#C9A227]/10'
                              : 'hover:bg-gray-50 dark:hover:bg-[#1a1a1a]'
                          }`}
                        >
                          {/* Category icon */}
                          <div
                            className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
                            style={{ background: `${color}18` }}
                          >
                            <Icon className="h-4 w-4" style={{ color }} />
                          </div>

                          {/* Product info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-[#0A0A0A] dark:text-white truncate">
                              <Highlight text={p.name} query={searchVal.trim()} />
                            </p>
                            <p className="text-xs text-zinc-400 truncate">
                              <Highlight text={p.brand || ''} query={searchVal.trim()} />
                              {p.brand && ' · '}
                              {activeCategories.find(c => c.slug === p.category)?.label || p.category}
                            </p>
                          </div>

                          {/* Price + stock */}
                          <div className="shrink-0 text-right">
                            <p className="text-sm font-extrabold text-[#C9A227] dark:text-[#FFD700]">
                              S/. {p.price?.toLocaleString()}
                            </p>
                            <p className={`text-[10px] font-bold ${p.stock > 0 ? 'text-emerald-500' : 'text-red-400'}`}>
                              {p.stock > 0 ? 'En stock' : 'Sin stock'}
                            </p>
                          </div>
                        </button>
                      </li>
                    )
                  })}
                </ul>

                {/* View all results */}
                <div className="border-t border-gray-100 dark:border-[#1f1f1f]">
                  <button
                    type="button"
                    onMouseDown={handleViewAll}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 text-xs font-extrabold text-[#C9A227] dark:text-[#FFD700] hover:bg-[#FFD700]/8 dark:hover:bg-[#C9A227]/8 transition-colors tracking-wider"
                  >
                    <Search className="h-3.5 w-3.5" />
                    VER TODOS LOS RESULTADOS PARA "{searchVal.trim().toUpperCase()}"
                  </button>
                </div>
              </div>
            )}

            {/* Empty state in dropdown */}
            {showDrop && searchVal.trim().length >= 2 && suggestions.length === 0 && (
              <div className="absolute top-full left-0 right-0 z-50 bg-white dark:bg-[#0f0f0f] border-2 border-t-0 border-[#FFD700] rounded-b-2xl shadow-2xl overflow-hidden">
                <div className="px-4 py-5 text-center">
                  <p className="text-sm text-zinc-400">Sin resultados para <span className="font-bold text-[#0A0A0A] dark:text-white">"{searchVal}"</span></p>
                  <p className="text-xs text-zinc-500 mt-1">Presiona Enter para buscar de todas formas</p>
                </div>
              </div>
            )}
          </div>

          {/* Admin button */}
          <Link
            to={isAdmin ? '/admin' : '/admin/login'}
            title={isAdmin ? 'Panel Admin' : 'Acceso Admin'}
            className={`shrink-0 p-2.5 rounded-full border transition-all duration-200 hover:scale-110 ${
              isAdmin
                ? 'border-[#FFD700] bg-[#FFD700]/10 text-[#FFD700] hover:bg-[#FFD700]/20'
                : 'border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#121212] text-zinc-400 hover:border-[#FFD700] hover:text-[#FFD700]'
            }`}
          >
            <ShieldCheck className="h-5 w-5" />
          </Link>

          {/* Theme toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Cambiar tema"
            className="shrink-0 p-2.5 rounded-full border border-gray-200 dark:border-[#2a2a2a] hover:border-[#FFD700] dark:hover:border-[#FFD700] bg-white dark:bg-[#121212] text-[#0A0A0A] dark:text-white transition-all duration-200 hover:scale-110"
          >
            {theme === 'dark'
              ? <Sun  className="h-5 w-5 text-[#FFD700]" />
              : <Moon className="h-5 w-5 text-[#8B6B2E]" />}
          </button>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menú"
            className="lg:hidden shrink-0 p-2.5 rounded-full border border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#121212] text-[#0A0A0A] dark:text-white transition-all"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* ── 3. NAV BAR (desktop) ── */}
      <div className="hidden lg:block w-full bg-[#0A0A0A] border-b border-[#C9A227]/20">
        <div className="px-8 flex items-stretch">

          {/* Mega menu trigger */}
          <div
            className="relative"
            onMouseEnter={() => setMegaOpen(true)}
            onMouseLeave={() => setMegaOpen(false)}
          >
            <button
              type="button"
              className="flex items-center gap-2 px-5 py-3 text-xs font-extrabold tracking-widest text-[#0A0A0A] bg-gradient-to-r from-[#C9A227] to-[#FFD700] hover:from-[#FFD700] hover:to-[#C9A227] transition-all duration-200"
            >
              <Menu className="h-4 w-4" />
              TODAS LAS CATEGORÍAS
              <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${megaOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Mega dropdown */}
            {megaOpen && (
              <div className="absolute top-full left-0 z-50 w-[640px] bg-white dark:bg-[#0f0f0f] border border-gray-100 dark:border-[#C9A227]/20 shadow-2xl dark:shadow-[0_8px_40px_#00000080] rounded-b-xl overflow-hidden">
                <div className="grid grid-cols-2 gap-px p-3">
                  {activeCategories.map(cat => {
                    const Icon = ICON_MAP[cat.slug] || Box
                    return (
                      <Link
                        key={cat.slug}
                        to={`/categoria/${cat.slug}`}
                        onClick={() => setMegaOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#FFD700]/8 dark:hover:bg-[#C9A227]/8 group/item transition-colors"
                      >
                        <div className="h-9 w-9 rounded-lg bg-[#FFD700]/10 dark:bg-[#C9A227]/10 flex items-center justify-center shrink-0 group-hover/item:bg-[#FFD700]/20 transition-colors">
                          <Icon className="h-4 w-4 text-[#8B6B2E] dark:text-[#FFD700]" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#0A0A0A] dark:text-white leading-tight">{cat.label}</p>
                          <p className="text-xs text-gray-400 dark:text-[#BFBFBF] leading-tight">{cat.desc}</p>
                        </div>
                      </Link>
                    )
                  })}
                </div>
                <div className="border-t border-gray-100 dark:border-[#1f1f1f] px-3 py-2.5">
                  <Link
                    to="/"
                    onClick={() => setMegaOpen(false)}
                    className="flex items-center justify-center gap-1 text-xs font-bold text-[#8B6B2E] dark:text-[#FFD700] hover:text-[#C9A227] dark:hover:text-white transition-colors tracking-wider"
                  >
                    VER TODAS LAS CATEGORÍAS →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Quick nav links */}
          <nav className="flex items-stretch">
            {quickLinks.map(link => (
              <Link
                key={link.slug}
                to={`/categoria/${link.slug}`}
                className="px-4 py-3 text-[11px] font-extrabold tracking-widest text-zinc-400 hover:text-[#FFD700] hover:bg-white/5 border-b-2 border-transparent hover:border-[#FFD700] transition-all duration-150 flex items-center"
              >
                {link.label.toUpperCase()}
              </Link>
            ))}
          </nav>

          {/* Admin badge */}
          {isAdmin && (
            <Link
              to="/admin"
              className="ml-auto flex items-center gap-2 px-4 py-2 my-1.5 mr-0 bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-lg text-[11px] font-extrabold text-[#FFD700] tracking-wider hover:bg-[#FFD700]/20 transition-colors"
            >
              <ShieldCheck className="h-3.5 w-3.5" /> ADMIN
            </Link>
          )}
        </div>
      </div>

      {/* ── MOBILE MENU ── */}
      {mobileOpen && (
        <div className="lg:hidden bg-white dark:bg-[#0A0A0A] border-t border-[#C9A227]/30 shadow-xl">
          <div className="p-4 grid grid-cols-2 gap-2">
            {activeCategories.map(cat => {
              const Icon = ICON_MAP[cat.slug] || Box
              return (
                <Link
                  key={cat.slug}
                  to={`/categoria/${cat.slug}`}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2.5 p-3 rounded-xl border border-gray-100 dark:border-[#1f1f1f] hover:border-[#FFD700] dark:hover:border-[#FFD700] transition-colors"
                >
                  <Icon className="h-4 w-4 text-[#8B6B2E] dark:text-[#FFD700] shrink-0" />
                  <span className="text-xs font-semibold text-[#0A0A0A] dark:text-white leading-tight">{cat.label}</span>
                </Link>
              )
            })}
          </div>
          <div className="border-t border-[#1f1f1f] p-3">
            <Link
              to={isAdmin ? '/admin' : '/admin/login'}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-lg text-sm font-bold text-[#FFD700]"
            >
              <ShieldCheck className="h-4 w-4" />
              {isAdmin ? 'Panel Administrador' : 'Acceso Admin'}
            </Link>
          </div>
        </div>
      )}

    </header>
  )
}
