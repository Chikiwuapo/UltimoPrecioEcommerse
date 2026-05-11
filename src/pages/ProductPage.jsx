import { useParams, Link, Navigate } from 'react-router-dom'
import { useState, useEffect, useRef, useMemo } from 'react'
import Header from '../components/Header'
import ProductCard from '../components/ProductCard'
import { getProductBySlug, getProductsByCategory, getAllCategories } from '../data/index'
import { getImageSrc } from '../hooks/useProductImages'
import { MessageCircle, ChevronRight, ChevronLeft } from 'lucide-react'

const WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER || '51964849433'

function buildWhatsAppLink(product) {
  const msg = encodeURIComponent(
    `Hola, estoy interesado en este producto:\n*${product.name}*\nPrecio: S/. ${product.price.toLocaleString()}\n\n¿Me podría dar más información y disponibilidad?`
  )
  return `https://wa.me/${WHATSAPP}?text=${msg}`
}

// ── Spec label translations ──────────────────
const SPEC_LABELS = {
  processor:'Procesador', ram:'RAM', storage:'Almacenamiento', gpu:'GPU', display:'Pantalla',
  vram:'VRAM', busWidth:'Bus de datos', coreClock:'Reloj núcleo', recommendedPSU:'Fuente rec.',
  size:'Tamaño', panel:'Panel', resolution:'Resolución', refreshRate:'Tasa de refresco',
  responseTime:'Tiempo de respuesta', connectors:'Conectores', tipo:'Tipo de pantalla',
  socket:'Socket', series:'Serie', cores:'Núcleos / Hilos', baseClock:'Frec. base',
  boostClock:'Frec. boost', capacity:'Capacidad', type:'Tipo', frequency:'Frecuencia',
  latency:'Latencia', formFactor:'Factor de forma', interface:'Interfaz',
  readSpeed:'Velocidad lectura', writeSpeed:'Velocidad escritura',
  chipset:'Chipset', ramType:'Tipo RAM', ramSlots:'Ranuras RAM',
  maxRam:'RAM máxima', maxFreq:'Frec. máxima', compatibility:'Compatibilidad',
  fans:'Ventiladores', sidePanel:'Panel lateral', maxGpuLength:'GPU máx.', color:'Color',
  wattage:'Potencia', certification:'Certificación', modular:'Modular',
  tdp:'TDP', base:'Base', lighting:'Iluminación', microphone:'Micrófono',
  connectivity:'Conectividad', material:'Material', reclining:'Reclinación',
  weightCapacity:'Peso máx.', dimensions:'Dimensiones', fps:'FPS',
  powerConnectors:'Conectores poder', extras:'Extras', note:'Nota', voltage:'Voltaje',
  brand:'Marca', generation:'Generación', model:'Modelo',
}



export default function ProductPage() {
  const { slug }   = useParams()
  const product    = getProductBySlug(slug)
  const [imgSrc, setImgSrc] = useState('')
  const relatedRef = useRef(null)

  useEffect(() => {
    if (!product) return
    getImageSrc(product).then(src => setImgSrc(src || product.image || ''))
  }, [product])

  if (!product) return <Navigate to="/404" replace />

  const allCats  = getAllCategories()
  const category = allCats.find(c => c.slug === product.category)

  const related = useMemo(() =>
    getProductsByCategory(product.category)
      .filter(p => p.id !== product.id && p.stock > 0)
      .sort(() => Math.random() - 0.5)
      .slice(0, 8),
    [product.category, product.id]
  )

  const hasDiscount = product.oldPrice && product.oldPrice > product.price
  const discount    = hasDiscount ? Math.round((1 - product.price / product.oldPrice) * 100) : null
  const specEntries = product.specs ? Object.entries(product.specs).filter(([, v]) => v) : []

  function scrollRelated(dir) {
    if (relatedRef.current) {
      relatedRef.current.scrollBy({ left: dir * 300, behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A]">
      <Header />

      {/* Breadcrumb */}
      <nav className="px-4 md:px-8 py-3 flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 flex-wrap border-b border-gray-100 dark:border-[#1a1a1a]">
        <Link to="/" className="hover:text-[#FFD700] transition-colors">Inicio</Link>
        <ChevronRight className="h-3 w-3 shrink-0" />
        {category && (
          <>
            <Link to={`/categoria/${category.slug}`} className="hover:text-[#FFD700] transition-colors">{category.label}</Link>
            <ChevronRight className="h-3 w-3 shrink-0" />
          </>
        )}
        <span className="text-[#0A0A0A] dark:text-white font-semibold line-clamp-1">{product.name}</span>
      </nav>

      <main className="px-4 md:px-8 py-8 max-w-7xl mx-auto space-y-12">

        {/* ══ HERO: Image + Info ══════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

          {/* Image */}
          <div className="sticky top-24 self-start">
            <div className="rounded-2xl overflow-hidden bg-[#f8f8f8] dark:bg-[#111] border border-gray-100 dark:border-[#1f1f1f] aspect-square flex items-center justify-center">
              <img
                src={imgSrc}
                alt={product.name}
                className="w-full h-full object-contain p-6"
                onError={e => { e.currentTarget.src = 'https://via.placeholder.com/600x600?text=Sin+imagen' }}
              />
            </div>
          </div>

          {/* Info panel */}
          <div className="flex flex-col gap-4">

            {/* Product name */}
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#0A0A0A] dark:text-white leading-tight">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-end gap-4">
              <span className="text-4xl font-black text-[#C9A227] dark:text-[#FFD700]">
                S/. {product.price.toLocaleString()}
              </span>
              {hasDiscount && (
                <div className="flex flex-col">
                  <span className="text-base text-zinc-400 line-through">S/. {product.oldPrice.toLocaleString()}</span>
                  <span className="text-xs font-bold text-white bg-red-500 px-2 py-0.5 rounded">-{discount}% OFF</span>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-[#C9A227]/30 to-transparent" />

            {/* WhatsApp CTA */}
            <a
              href={buildWhatsAppLink(product)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 py-4 bg-[#25D366] hover:bg-[#1da851] text-white font-extrabold text-base rounded-2xl transition-all hover:shadow-[0_0_24px_#25D36650] tracking-wider"
            >
              <MessageCircle className="h-5 w-5" />
              CONSULTAR POR WHATSAPP
            </a>


          </div>
        </div>

        {/* ══ SPECS — grid de cuadritos ══════════════════════════ */}
        {specEntries.length > 0 && (
          <section>
            {/* Section header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1 bg-gradient-to-r from-[#C9A227]/40 to-transparent" />
              <span className="px-6 py-2 rounded-full bg-gradient-to-r from-[#C9A227] to-[#FFD700] text-[#0A0A0A] text-sm font-extrabold tracking-widest uppercase shadow-[0_0_20px_#C9A22740]">
                Especificaciones Técnicas
              </span>
              <div className="h-px flex-1 bg-gradient-to-l from-[#C9A227]/40 to-transparent" />
            </div>

            {/* Grid of spec cards — centrado */}
            <div className="flex flex-wrap justify-center gap-3">
              {specEntries.map(([key, val]) => (
                <div
                  key={key}
                  className="flex flex-col items-center text-center gap-1 rounded-xl border border-gray-100 dark:border-[#1f1f1f] bg-[#fafafa] dark:bg-[#0f0f0f] px-4 py-3 w-36 hover:border-[#C9A227]/50 transition-colors"
                >
                  <p className="text-[10px] font-semibold text-[#C9A227] uppercase tracking-wider leading-tight">
                    {SPEC_LABELS[key] || key}
                  </p>
                  <p className="text-sm font-bold text-[#0A0A0A] dark:text-white leading-snug break-words">
                    {String(val)}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ══ DESCRIPTION ════════════════════════════════════════ */}
        {product.description && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1 bg-gradient-to-r from-[#C9A227]/40 to-transparent" />
              <span className="text-sm font-extrabold tracking-widest uppercase text-[#0A0A0A] dark:text-white">
                {product.name.toUpperCase()}
              </span>
              <div className="h-px flex-1 bg-gradient-to-l from-[#C9A227]/40 to-transparent" />
            </div>
            <div className="rounded-2xl border border-gray-100 dark:border-[#1f1f1f] bg-[#fafafa] dark:bg-[#0f0f0f] p-6 md:p-8">
              <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          </section>
        )}

        {/* ══ RELATED PRODUCTS ═══════════════════════════════════ */}
        {related.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-extrabold uppercase tracking-widest text-[#0A0A0A] dark:text-white">
                También te recomendamos
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => scrollRelated(-1)}
                  className="p-2 rounded-full border border-gray-200 dark:border-[#2a2a2a] text-zinc-400 hover:text-[#FFD700] hover:border-[#FFD700] transition-all"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => scrollRelated(1)}
                  className="p-2 rounded-full bg-[#FFD700] text-[#0A0A0A] hover:brightness-110 transition-all"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Horizontal scroll */}
            <div
              ref={relatedRef}
              className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide snap-x snap-mandatory"
              style={{ scrollbarWidth: 'none' }}
            >
              {related.map(p => (
                <div key={p.id} className="shrink-0 w-48 sm:w-56 snap-start">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </section>
        )}

      </main>
    </div>
  )
}
