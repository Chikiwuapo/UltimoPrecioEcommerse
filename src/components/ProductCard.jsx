import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Eye, Package } from 'lucide-react'
import { getImageSrc } from '../hooks/useProductImages'

export default function ProductCard({ product }) {
  const { name, description, price, oldPrice, slug, stock, stockLabel, featured } = product
  const [imgSrc, setImgSrc] = useState(product.image || '')

  useEffect(() => {
    getImageSrc(product).then(src => setImgSrc(src))
  }, [product.id])

  const hasDiscount = oldPrice && oldPrice > price
  const discount = hasDiscount ? Math.round((1 - price / oldPrice) * 100) : null

  return (
    <div className="group relative rounded-xl border border-gray-200 bg-white overflow-hidden flex flex-col transition-all hover:shadow-lg hover:-translate-y-0.5 dark:border-[#1f1f1f] dark:bg-[#121212] dark:hover:shadow-[0_4px_20px_#C9A22730]">

      {/* Featured badge */}
      {featured && (
        <div className="absolute top-2 left-2 z-10 px-2 py-0.5 bg-[#FFD700] text-[#0A0A0A] text-[10px] font-extrabold rounded-full uppercase tracking-wider">
          ⭐ Destacado
        </div>
      )}

      {/* Discount badge */}
      {hasDiscount && (
        <div className="absolute top-2 right-2 z-10 px-2 py-0.5 bg-red-500 text-white text-[10px] font-extrabold rounded-full">
          -{discount}%
        </div>
      )}

      {/* Image */}
      <Link to={`/producto/${slug}`} className="block aspect-[4/3] w-full overflow-hidden bg-gray-100 dark:bg-[#0A0A0A]">
        <img
          src={imgSrc}
          alt={name}
          loading="lazy"
          onError={e => { e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Sin+imagen' }}
          className="h-full w-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
        />
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-3 gap-2">
        <Link to={`/producto/${slug}`} className="block">
          <h3 className="line-clamp-2 text-sm font-semibold text-[#0A0A0A] dark:text-white leading-snug hover:text-[#C9A227] transition-colors">
            {name}
          </h3>
        </Link>

        {/* Stock indicator */}
        <div className="flex items-center gap-1">
          <Package className="h-3 w-3 text-zinc-400" />
          <span className={`text-[10px] font-bold ${stock > 0 ? 'text-emerald-500' : 'text-red-400'}`}>
            {stock > 0 ? `En stock (${stockLabel})` : 'Sin stock'}
          </span>
        </div>

        <div className="flex items-center justify-between mt-auto pt-1">
          {/* Price */}
          <div className="flex flex-col">
            {hasDiscount && (
              <span className="text-[10px] text-zinc-400 line-through">S/. {oldPrice?.toLocaleString()}</span>
            )}
            <span className="text-base font-extrabold text-[#C9A227] dark:text-[#FFD700]">
              S/. {price?.toLocaleString()}
            </span>
          </div>

          {/* CTA */}
          <Link
            to={`/producto/${slug}`}
            className="flex items-center gap-1 rounded-lg border border-[#C9A227] px-2.5 py-1.5 text-[11px] font-bold text-[#C9A227] dark:text-[#FFD700] hover:bg-[#FFD700] hover:text-[#0A0A0A] hover:border-[#FFD700] transition-all"
          >
            <Eye className="h-3 w-3" /> Ver
          </Link>
        </div>
      </div>
    </div>
  )
}
