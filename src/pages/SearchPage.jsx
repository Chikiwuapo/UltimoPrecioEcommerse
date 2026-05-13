import { useSearchParams, Link } from 'react-router-dom'
import { useMemo, useState } from 'react'
import Header from '../components/Header'
import ProductCard from '../components/ProductCard'
import { getAllProducts, getAllCategories } from '../data/index'
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react'
import ScrollToTop from '../components/ScrollToTop'

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''

  const allProducts  = getAllProducts()
  const allCategories = getAllCategories()

  const [sortBy,      setSortBy]      = useState('relevance')
  const [catFilter,   setCatFilter]   = useState('all')
  const [filterStock, setFilterStock] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)

  // ── Smart search logic ──────────────────────────────────────────
  const results = useMemo(() => {
    if (!query.trim()) return []

    const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean)

    const scored = allProducts.map(p => {
      const searchable = [
        p.name,
        p.brand,
        p.description,
        p.category,
        ...(p.specs ? Object.values(p.specs) : []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      let score = 0

      // Exact full-query match in name → highest priority
      if (p.name.toLowerCase().includes(query.toLowerCase())) score += 100
      // Exact full-query match in brand
      if (p.brand?.toLowerCase().includes(query.toLowerCase())) score += 60
      // Exact full-query match in description
      if (p.description?.toLowerCase().includes(query.toLowerCase())) score += 30

      // Per-term scoring
      terms.forEach(term => {
        if (p.name.toLowerCase().includes(term))        score += 20
        if (p.brand?.toLowerCase().includes(term))      score += 15
        if (p.category?.toLowerCase().includes(term))   score += 10
        if (p.description?.toLowerCase().includes(term)) score += 5
        if (p.specs && Object.values(p.specs).some(v =>
          String(v).toLowerCase().includes(term)
        )) score += 8
      })

      // Boost featured products
      if (p.featured) score += 5
      // Boost in-stock products
      if (p.stock > 0) score += 3

      return { ...p, _score: score }
    })

    return scored.filter(p => p._score > 0)
  }, [query, allProducts])

  // ── Apply filters + sort ────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = [...results]
    if (catFilter !== 'all') list = list.filter(p => p.category === catFilter)
    if (filterStock)         list = list.filter(p => p.stock > 0)

    switch (sortBy) {
      case 'price-asc':  list.sort((a, b) => a.price - b.price);           break
      case 'price-desc': list.sort((a, b) => b.price - a.price);           break
      case 'name':       list.sort((a, b) => a.name.localeCompare(b.name)); break
      default:           list.sort((a, b) => b._score - a._score)           // relevance
    }
    return list
  }, [results, catFilter, filterStock, sortBy])

  // Categories that appear in results
  const resultCats = useMemo(() => {
    const slugs = [...new Set(results.map(p => p.category))]
    return allCategories.filter(c => slugs.includes(c.slug))
  }, [results, allCategories])

  const activeFiltersCount = (catFilter !== 'all' ? 1 : 0) + (filterStock ? 1 : 0)

  function clearFilters() {
    setCatFilter('all')
    setFilterStock(false)
    setSortBy('relevance')
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A]">
      <ScrollToTop />
      <Header />

      <main className="px-4 md:px-8 py-6 max-w-7xl mx-auto">

        {/* ── Header row ── */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 mb-2">
            <Link to="/" className="hover:text-[#FFD700] transition-colors">Inicio</Link>
            <span>›</span>
            <span className="text-[#0A0A0A] dark:text-white font-semibold">Búsqueda</span>
          </div>

          {query ? (
            <div className="flex flex-wrap items-baseline gap-3">
              <h1 className="text-2xl font-extrabold text-[#0A0A0A] dark:text-white">
                Resultados para{' '}
                <span className="text-[#C9A227] dark:text-[#FFD700]">"{query}"</span>
              </h1>
              <span className="text-sm text-zinc-400">
                {filtered.length} producto{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
              </span>
            </div>
          ) : (
            <h1 className="text-2xl font-extrabold text-[#0A0A0A] dark:text-white">
              Busca un producto
            </h1>
          )}
        </div>

        {/* ── No query state ── */}
        {!query.trim() && (
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <div className="w-20 h-20 rounded-full bg-[#FFD700]/10 flex items-center justify-center mb-4">
              <Search className="h-9 w-9 text-[#FFD700]" />
            </div>
            <p className="text-zinc-400 text-lg font-semibold mb-1">Escribe algo para buscar</p>
            <p className="text-zinc-500 text-sm">Prueba con "RTX 4060", "ASUS", "monitor 144hz"…</p>
          </div>
        )}

        {/* ── No results state ── */}
        {query.trim() && results.length === 0 && (
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
              <Search className="h-9 w-9 text-red-400" />
            </div>
            <p className="text-zinc-300 text-lg font-semibold mb-1">Sin resultados para "{query}"</p>
            <p className="text-zinc-500 text-sm mb-6">Intenta con otro término o revisa la ortografía</p>
            <Link
              to="/"
              className="px-6 py-2.5 rounded-full bg-[#FFD700] text-[#0A0A0A] text-sm font-extrabold hover:brightness-110 transition-all"
            >
              Volver al inicio
            </Link>
          </div>
        )}

        {/* ── Results ── */}
        {query.trim() && results.length > 0 && (
          <>
            {/* Toolbar */}
            <div className="sticky top-[var(--header-h,112px)] z-20 bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur py-3 border-b border-gray-100 dark:border-[#1a1a1a] flex flex-wrap items-center gap-3 mb-6">

              {/* Filter toggle */}
              <button
                onClick={() => setFiltersOpen(o => !o)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-bold transition-all ${
                  filtersOpen || activeFiltersCount > 0
                    ? 'border-[#FFD700] bg-[#FFD700]/10 text-[#FFD700]'
                    : 'border-gray-200 dark:border-[#2a2a2a] text-zinc-400 hover:border-[#FFD700] hover:text-[#FFD700]'
                }`}
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filtros
                {activeFiltersCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#FFD700] text-[#0A0A0A] text-[10px] font-extrabold flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="appearance-none bg-white dark:bg-[#121212] border border-gray-200 dark:border-[#2a2a2a] rounded-xl pl-3 pr-8 py-2 text-sm text-[#0A0A0A] dark:text-white focus:outline-none focus:border-[#FFD700] cursor-pointer"
                >
                  <option value="relevance">Más relevantes</option>
                  <option value="price-asc">Menor precio</option>
                  <option value="price-desc">Mayor precio</option>
                  <option value="name">A-Z</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
              </div>

              <span className="text-xs text-zinc-500 ml-auto">
                {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Filter panel */}
            {filtersOpen && (
              <div className="mb-6 rounded-2xl border border-gray-100 dark:border-[#1f1f1f] bg-[#fafafa] dark:bg-[#0f0f0f] p-5">
                <div className="flex flex-wrap gap-6 items-start">

                  {/* Category filter */}
                  <div className="min-w-[200px]">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Categoría</p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setCatFilter('all')}
                        className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${
                          catFilter === 'all'
                            ? 'bg-[#FFD700] text-[#0A0A0A] border-[#FFD700]'
                            : 'bg-transparent text-zinc-400 border-gray-200 dark:border-[#2a2a2a] hover:border-[#FFD700] hover:text-[#FFD700]'
                        }`}
                      >
                        Todas
                      </button>
                      {resultCats.map(cat => (
                        <button
                          key={cat.slug}
                          onClick={() => setCatFilter(cat.slug)}
                          className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${
                            catFilter === cat.slug
                              ? 'bg-[#FFD700] text-[#0A0A0A] border-[#FFD700]'
                              : 'bg-transparent text-zinc-400 border-gray-200 dark:border-[#2a2a2a] hover:border-[#FFD700] hover:text-[#FFD700]'
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Stock filter */}
                  <div className="min-w-[140px]">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Disponibilidad</p>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filterStock}
                        onChange={e => setFilterStock(e.target.checked)}
                        className="accent-[#FFD700] w-4 h-4"
                      />
                      <span className="text-sm text-[#0A0A0A] dark:text-white">Solo en stock</span>
                    </label>
                  </div>

                  {/* Clear */}
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs font-bold transition-all self-end"
                    >
                      <X className="h-3.5 w-3.5" /> Limpiar filtros
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Active filter chips */}
            {activeFiltersCount > 0 && !filtersOpen && (
              <div className="flex flex-wrap gap-2 mb-4">
                {catFilter !== 'all' && (
                  <button
                    onClick={() => setCatFilter('all')}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/40 text-[#C9A227] text-xs font-bold hover:bg-[#FFD700]/20"
                  >
                    {allCategories.find(c => c.slug === catFilter)?.label} <X className="h-3 w-3" />
                  </button>
                )}
                {filterStock && (
                  <button
                    onClick={() => setFilterStock(false)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold"
                  >
                    En stock <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            )}

            {/* No results after filter */}
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-zinc-400 text-lg font-semibold mb-2">Sin resultados con estos filtros</p>
                <button
                  onClick={clearFilters}
                  className="mt-3 px-5 py-2.5 rounded-full bg-[#FFD700] text-[#0A0A0A] text-sm font-extrabold hover:brightness-110 transition-all"
                >
                  Limpiar filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {filtered.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
