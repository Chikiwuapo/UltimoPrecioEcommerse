import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ProductCard({ image, name, description, price, oldPrice }) {
  return (
    <div className="group relative rounded-xl border border-gray-200 bg-white p-3 transition-all hover:shadow-lg dark:border-[#1f1f1f] dark:bg-[#121212] dark:hover:shadow-[0_0_10px_#00D4FF]">
      <button
        type="button"
        aria-label="Agregar a favoritos"
        className="absolute right-3 top-3 rounded-full bg-white/80 p-2 text-[#8B6B2E] shadow hover:text-[#FFD700] dark:bg-[#0A0A0A]/70 dark:text-[#C9A227]"
      >
        <Heart className="h-4 w-4" />
      </button>
      <div className="aspect-[4/3] w-full overflow-hidden rounded-md bg-gray-100 dark:bg-[#0A0A0A]">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
          loading="lazy"
        />
      </div>
      <div className="mt-3 space-y-1">
        <h3 className="line-clamp-2 text-sm font-semibold text-[#0A0A0A] dark:text-white">
          {name}
        </h3>
        <p className="line-clamp-2 text-xs text-[#4A4A4A] dark:text-[#BFBFBF]">
          {description}
        </p>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            {oldPrice ? (
              <span className="text-xs text-gray-500 line-through dark:text-[#BFBFBF]">
                {oldPrice}
              </span>
            ) : null}
            <span className="text-base font-extrabold text-[#8B6B2E] dark:text-[#FFD700] dark:shadow-[0_0_6px_#00D4FF]">
              {price}
            </span>
          </div>
          <Link
            to="/404"
            className="rounded-md border border-[#C9A227] bg-[linear-gradient(135deg,#0099FF,#0050A0)] px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-[#FFD700] hover:text-black"
          >
            Añadir al carrito
          </Link>
        </div>
      </div>
    </div>
  )
}
