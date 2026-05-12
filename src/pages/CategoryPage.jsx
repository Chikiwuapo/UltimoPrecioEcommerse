import { useParams, Link, Navigate } from 'react-router-dom'
import { useState, useMemo } from 'react'
import Header from '../components/Header'
import ProductCard from '../components/ProductCard'
import Carousel from '../components/Carousel'
import {
  getProductsByCategory, getActiveCategories, getAllCategories, getBannersForCategory
} from '../data/index'
import { SlidersHorizontal, ChevronDown, X } from 'lucide-react'

export default function CategoryPage() {
  const { slug } = useParams()

  const allCats    = getAllCategories()
  const activeCats = getActiveCategories()
  const category   = allCats.find(c => c.slug === slug)
  const isActive   = activeCats.some(c => c.slug === slug)

  if (!category || !isActive) return <Navigate to="/404" replace />

  const products = getProductsByCategory(slug)
  const banners  = getBannersForCategory(slug)

  // Derived filter options
  const brands   = useMemo(() => [...new Set(products.map(p => p.brand))].sort(), [products])
  const prices   = useMemo(() => products.map(p => p.price), [products])
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)

  // Filter state
  const [filterBrands, setFilterBrands] = useState([])
  const [filterStock,  setFilterStock]  = useState(false)
  const [maxPriceVal,  setMaxPriceVal]  = useState(maxPrice)
  const [sortBy,       setSortBy]       = useState('featured')
  const [filtersOpen,  setFiltersOpen]  = useState(false)

  const filtered = useMemo(() => {
    let list = [...products]
    if (filterBrands.length > 0) list = list.filter(p => filterBrands.includes(p.brand))
    if (filterStock) list = list.filter(p => p.stock > 0)
    list = list.filter(p => p.price <= maxPriceVal)
    switch (sortBy) {
      case 'price-asc':  list.sort((a, b) => a.price - b.price);          break
      case 'price-desc': list.sort((a, b) => b.price - a.price);          break
      case 'name':       list.sort((a, b) => a.name.localeCompare(b.name)); break
      default:           list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    }
    return list
  }, [products, filterBrands, filterStock, maxPriceVal, sortBy])

  function toggleBrand(brand) {
    setFilterBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    )
  }

  function clearFilters() {
    setFilterBrands([])
    setFilterStock(false)
    setMaxPriceVal(maxPrice)
    setSortBy('featured')
  }

  const activeFiltersCount =
    filterBrands.length + (filterStock ? 1 : 0) + (maxPriceVal < maxPrice ? 1 : 0)

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A]">
      <Header />

      {/* ── Carousel de banners (personalizables por el admin) ── */}
      {banners.length > 0 && (
        <Carousel slides={banners} aspectRatio="16/4" />
      )}

      {/* Breadcrumb */}
      <div className="px-4 md:px-8 py-3 text-xs text-zinc-500 dark:text-zinc-400 border-b border-gray-100 dark:border-[#1a1a1a]">
        <Link to="/" className="hover:text-[#FFD700] transition-colors">Inicio</Link>
        {' › '}
        <span className="text-[#0A0A0A] dark:text-white font-semibold">{category.label}</span>
      </div>

      <div className="px-4 md:px-8 pb-14">

        {/* ── Toolbar row ──────────────────────────────────────── */}
        <div className="sticky top-[var(--header-h,112px)] z-20 bg-white/95 dark:bg-[#0A0A0A]/95 backdrop-blur py-3 border-b border-gray-100 dark:border-[#1a1a1a] flex flex-wrap items-center gap-3 mb-6">

          {/* Title */}
          <h1 className="text-lg font-extrabold uppercase tracking-wide text-[#0A0A0A] dark:text-white shrink-0">
            {category.label}
          </h1>
          <span className="text-sm text-zinc-400 shrink-0">({filtered.length} productos)</span>

          <div className="flex-1" />

          {/* Filter toggle button */}
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
              <option value="featured">Destacados</option>
              <option value="price-asc">Menor precio</option>
              <option value="price-desc">Mayor precio</option>
              <option value="name">A-Z</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
          </div>
        </div>

        {/* ── Horizontal filter panel (collapsible) ─────────── */}
        {filtersOpen && (
          <div className="mb-6 rounded-2xl border border-gray-100 dark:border-[#1f1f1f] bg-[#fafafa] dark:bg-[#0f0f0f] p-5">
            <div className="flex flex-wrap gap-6 items-start">

              {/* Price range */}
              <div className="min-w-[180px]">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Precio máximo</p>
                <div className="flex items-center justify-between text-xs text-[#0A0A0A] dark:text-white mb-1 font-semibold">
                  <span>S/. {minPrice}</span>
                  <span className="text-[#FFD700] font-bold">S/. {maxPriceVal}</span>
                </div>
                <input
                  type="range"
                  min={minPrice} max={maxPrice} step={10}
                  value={maxPriceVal}
                  onChange={e => setMaxPriceVal(Number(e.target.value))}
                  className="w-full accent-[#FFD700]"
                />
              </div>

              {/* Stock */}
              <div className="min-w-[140px]">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Disponibilidad</p>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox" checked={filterStock}
                    onChange={e => setFilterStock(e.target.checked)}
                    className="accent-[#FFD700] w-4 h-4"
                  />
                  <span className="text-sm text-[#0A0A0A] dark:text-white">Solo en stock</span>
                </label>
              </div>

              {/* Brands — chips */}
              <div className="flex-1 min-w-[220px]">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Marca</p>
                <div className="flex flex-wrap gap-2">
                  {brands.map(brand => {
                    const active = filterBrands.includes(brand)
                    return (
                      <button
                        key={brand}
                        onClick={() => toggleBrand(brand)}
                        className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${
                          active
                            ? 'bg-[#FFD700] text-[#0A0A0A] border-[#FFD700]'
                            : 'bg-transparent text-zinc-400 border-gray-200 dark:border-[#2a2a2a] hover:border-[#FFD700] hover:text-[#FFD700]'
                        }`}
                      >
                        {brand}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Clear button */}
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

        {/* ── Active filter chips (always visible) ──────────── */}
        {activeFiltersCount > 0 && !filtersOpen && (
          <div className="flex flex-wrap gap-2 mb-4">
            {filterBrands.map(b => (
              <button key={b} onClick={() => toggleBrand(b)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/40 text-[#C9A227] text-xs font-bold hover:bg-[#FFD700]/20">
                {b} <X className="h-3 w-3" />
              </button>
            ))}
            {filterStock && (
              <button onClick={() => setFilterStock(false)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                En stock <X className="h-3 w-3" />
              </button>
            )}
            {maxPriceVal < maxPrice && (
              <button onClick={() => setMaxPriceVal(maxPrice)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold">
                S/. ≤{maxPriceVal} <X className="h-3 w-3" />
              </button>
            )}
          </div>
        )}

        {/* ── Product grid ─────────────────────────────────── */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <p className="text-zinc-400 text-lg font-semibold mb-2">Sin resultados</p>
            <p className="text-zinc-500 text-sm mb-4">Intenta cambiar los filtros</p>
            <button
              onClick={clearFilters}
              className="px-5 py-2.5 rounded-full bg-[#FFD700] text-[#0A0A0A] text-sm font-extrabold hover:brightness-110 transition-all"
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
      </div>
    </div>
  )
}
