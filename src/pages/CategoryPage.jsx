import { useParams, Link, Navigate } from 'react-router-dom'
import { useState, useEffect, useMemo } from 'react'
import Header from '../components/Header'
import ProductCard from '../components/ProductCard'
import Carousel from '../components/Carousel'
import {
  getProductsByCategory, getActiveCategories, getAllCategories, getBannersForCategory
} from '../data/index'
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react'

export default function CategoryPage() {
  const { slug } = useParams()

  // Verify category exists and is active
  const allCats    = getAllCategories()
  const activeCats = getActiveCategories()
  const category   = allCats.find(c => c.slug === slug)
  const isActive   = activeCats.some(c => c.slug === slug)

  if (!category || !isActive) return <Navigate to="/404" replace />

  const products = getProductsByCategory(slug)
  const banners  = getBannersForCategory(slug)

  // Filter state
  const brands   = useMemo(() => [...new Set(products.map(p => p.brand))].sort(), [products])
  const prices   = useMemo(() => products.map(p => p.price), [products])
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)

  const [filterBrands, setFilterBrands] = useState([])
  const [filterStock,  setFilterStock]  = useState(false)
  const [priceRange,   setPriceRange]   = useState([minPrice, maxPrice])
  const [sortBy,       setSortBy]       = useState('featured')
  const [sidebarOpen,  setSidebarOpen]  = useState(false)

  const filtered = useMemo(() => {
    let list = [...products]
    if (filterBrands.length > 0) list = list.filter(p => filterBrands.includes(p.brand))
    if (filterStock) list = list.filter(p => p.stock > 0)
    list = list.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])
    switch (sortBy) {
      case 'price-asc':  list.sort((a, b) => a.price - b.price); break
      case 'price-desc': list.sort((a, b) => b.price - a.price); break
      case 'name':       list.sort((a, b) => a.name.localeCompare(b.name)); break
      default:           list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    }
    return list
  }, [products, filterBrands, filterStock, priceRange, sortBy])

  function toggleBrand(brand) {
    setFilterBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    )
  }

  function clearFilters() {
    setFilterBrands([])
    setFilterStock(false)
    setPriceRange([minPrice, maxPrice])
    setSortBy('featured')
  }

  const hasFilters = filterBrands.length > 0 || filterStock || priceRange[0] > minPrice || priceRange[1] < maxPrice

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A]">
      <Header />

      {/* Carousel de banners de categoría */}
      {banners.length > 0 && (
        <Carousel slides={banners} aspectRatio="16/4" />
      )}

      {/* Breadcrumb */}
      <div className="px-4 md:px-8 py-3 text-xs text-zinc-500 dark:text-zinc-400">
        <Link to="/" className="hover:text-[#FFD700] transition-colors">Inicio</Link>
        {' › '}
        <span className="text-[#0A0A0A] dark:text-white font-semibold">{category.label}</span>
      </div>

      <div className="flex px-4 md:px-8 pb-12 gap-6">

        {/* ── Sidebar Filters ── */}
        <aside className={`
          fixed inset-y-0 left-0 z-40 w-72 bg-white dark:bg-[#0f0f0f] border-r border-gray-200 dark:border-[#1f1f1f]
          p-6 overflow-y-auto transition-transform duration-300 shadow-2xl
          lg:static lg:w-64 lg:shrink-0 lg:rounded-xl lg:border lg:shadow-none lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-extrabold text-[#0A0A0A] dark:text-white uppercase tracking-wider flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-[#FFD700]" /> Filtros
            </h2>
            {hasFilters && (
              <button onClick={clearFilters} className="text-xs text-[#C9A227] hover:text-[#FFD700] font-semibold">
                Limpiar
              </button>
            )}
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-zinc-500 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Precio */}
          <div className="mb-6">
            <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-3">Precio</p>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-[#0A0A0A] dark:text-white font-semibold">S/. {priceRange[0]}</span>
              <span className="text-xs text-zinc-400">—</span>
              <span className="text-xs text-[#0A0A0A] dark:text-white font-semibold">S/. {priceRange[1]}</span>
            </div>
            <input
              type="range" min={minPrice} max={maxPrice} step={10}
              value={priceRange[1]}
              onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
              className="w-full accent-[#FFD700]"
            />
          </div>

          {/* Disponibilidad */}
          <div className="mb-6">
            <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-3">Disponibilidad</p>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox" checked={filterStock}
                onChange={e => setFilterStock(e.target.checked)}
                className="accent-[#FFD700] w-4 h-4"
              />
              <span className="text-sm text-[#0A0A0A] dark:text-white">Solo en stock</span>
            </label>
          </div>

          {/* Marcas */}
          <div>
            <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-3">Marca</p>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {brands.map(brand => (
                <label key={brand} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filterBrands.includes(brand)}
                    onChange={() => toggleBrand(brand)}
                    className="accent-[#FFD700] w-4 h-4"
                  />
                  <span className="text-sm text-[#0A0A0A] dark:text-zinc-200">{brand}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* ── Product Grid ── */}
        <div className="flex-1 min-w-0">
          {/* Header row */}
          <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden flex items-center gap-2 px-3 py-2 border border-gray-200 dark:border-[#2a2a2a] rounded-lg text-sm font-semibold text-[#0A0A0A] dark:text-white"
              >
                <SlidersHorizontal className="h-4 w-4" /> Filtros
              </button>
              <h1 className="text-xl font-extrabold uppercase tracking-wide text-[#0A0A0A] dark:text-white">
                {category.label}
              </h1>
              <span className="text-sm text-zinc-400">({filtered.length} productos)</span>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500 hidden sm:inline">Ordenar:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="appearance-none bg-white dark:bg-[#121212] border border-gray-200 dark:border-[#2a2a2a] rounded-lg pl-3 pr-8 py-2 text-sm text-[#0A0A0A] dark:text-white focus:outline-none focus:border-[#FFD700] cursor-pointer"
                >
                  <option value="featured">Destacados</option>
                  <option value="price-asc">Precio: menor a mayor</option>
                  <option value="price-desc">Precio: mayor a menor</option>
                  <option value="name">Nombre A-Z</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="text-zinc-400 text-lg font-semibold mb-2">Sin resultados</p>
              <p className="text-zinc-500 text-sm">Intenta cambiar los filtros</p>
              <button onClick={clearFilters} className="mt-4 px-4 py-2 bg-[#FFD700] text-[#0A0A0A] rounded-lg text-sm font-bold">
                Limpiar filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
        />
      )}
    </div>
  )
}
