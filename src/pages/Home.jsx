import Header from '../components/Header'
import Carousel from '../components/Carousel'
import ProductCard from '../components/ProductCard'
import { getActiveCategories, getFeaturedByCategory, getAllCategories, getHomeBanners } from '../data/index'
import {
  ArrowRight,
  Laptop, Monitor, Keyboard, HardDrive, Camera, Armchair,
  Cpu, Layers3, Zap, Fan, Box, Server, CircuitBoard,
} from 'lucide-react'
import { Link } from 'react-router-dom'

const ICON_MAP = {
  laptops:        { Icon: Laptop,        color: '#00D4FF' },
  gpus:           { Icon: Layers3,       color: '#A855F7' },
  monitores:      { Icon: Monitor,       color: '#22D3EE' },
  procesadores:   { Icon: Cpu,           color: '#F97316' },
  ram:            { Icon: Server,        color: '#10B981' },
  almacenamiento: { Icon: HardDrive,     color: '#6366F1' },
  'placas-madre': { Icon: CircuitBoard,  color: '#EAB308' },
  gabinetes:      { Icon: Box,           color: '#94A3B8' },
  fuentes:        { Icon: Zap,           color: '#FFD700' },
  refrigeracion:  { Icon: Fan,           color: '#38BDF8' },
  perifericos:    { Icon: Keyboard,      color: '#F43F5E' },
  camaras:        { Icon: Camera,        color: '#84CC16' },
  'sillas-gamer': { Icon: Armchair,      color: '#EC4899' },
}

// Categorías fijas que se muestran en la sección "CATEGORÍAS DESTACADAS"
const FEATURED_CATEGORY_SLUGS = [
  'monitores',
  'almacenamiento',
  'fuentes',
  'ram',
  'placas-madre',
]

export default function Home() {
  const activeCategories = getActiveCategories()
  const allCategories    = getAllCategories()

  // Categorías destacadas: solo las 5 fijas, si están activas
  const featuredCategories = FEATURED_CATEGORY_SLUGS
    .map(slug => allCategories.find(c => c.slug === slug))
    .filter(Boolean)

  const homeBanners = getHomeBanners()

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A]">
      <Header />
      <main>
        {/* Hero Carousel */}
        <Carousel slides={homeBanners} />

        {/* ── CATEGORÍAS DESTACADAS (5 fijas) ── */}
        <section className="w-full px-4 py-10 md:px-8">
          <h2 className="mb-6 text-xl font-extrabold uppercase tracking-wide text-[#0A0A0A] dark:text-white flex items-center gap-2">
            CATEGORÍAS DESTACADAS 🔥
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {featuredCategories.map(c => {
              const { Icon, color } = ICON_MAP[c.slug] || { Icon: Box, color: '#FFD700' }
              return (
                <Link
                  key={c.slug}
                  to={`/categoria/${c.slug}`}
                  className="flex flex-col items-center gap-3 rounded-xl border border-gray-200 dark:border-[#1f1f1f] bg-white dark:bg-[#121212] px-4 py-5 text-center hover:border-[#C9A227] hover:shadow-[0_0_16px_#C9A22730] transition-all group"
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"
                    style={{ background: `${color}18`, boxShadow: `0 0 0 1px ${color}30` }}
                  >
                    <Icon className="h-6 w-6" style={{ color }} />
                  </div>
                  <span className="text-xs font-bold text-[#0A0A0A] dark:text-white uppercase tracking-wider line-clamp-2 leading-tight">
                    {c.label}
                  </span>
                </Link>
              )
            })}
          </div>
        </section>

        {/* Product sections per active category (show first 5 active) */}
        {activeCategories.slice(0, 5).map(cat => {
          const featured = getFeaturedByCategory(cat.slug, 5)
          if (featured.length === 0) return null
          return (
            <section key={cat.slug} className="w-full px-4 pb-10 md:px-8">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-extrabold uppercase tracking-wide text-[#0A0A0A] dark:text-white">
                  {cat.label.toUpperCase()}
                </h2>
                <Link
                  to={`/categoria/${cat.slug}`}
                  className="flex items-center gap-1 text-sm font-semibold text-[#BFBFBF] hover:text-[#FFD700] transition-colors"
                >
                  Ver más <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {featured.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
              <div className="mt-5 flex justify-center">
                <Link
                  to={`/categoria/${cat.slug}`}
                  className="rounded-full bg-[#FFD700] text-[#0A0A0A] px-7 py-2.5 text-sm font-extrabold uppercase tracking-widest hover:brightness-110 transition-all shadow-[0_4px_20px_#FFD70035]"
                >
                  VER TODOS LOS {cat.label.toUpperCase()}
                </Link>
              </div>
            </section>
          )
        })}
      </main>
    </div>
  )
}
