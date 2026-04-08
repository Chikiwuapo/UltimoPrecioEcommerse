import { createElement } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function CategoryCard({ icon, label }) {
  return (
    <Link
      to="/404"
      className="group flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-5 transition-all duration-300 hover:border-[#FFD700] hover:shadow-lg hover:shadow-[#00D4FF1a] dark:border-[#C9A227] dark:bg-[#121212] dark:hover:shadow-[0_0_12px_#00D4FF]"
    >
      <div className="flex items-center gap-4">
        {createElement(icon, {
          className:
            'h-8 w-8 text-[#8B6B2E] transition-transform duration-300 group-hover:scale-110 dark:text-[#FFD700]',
        })}
        <span className="text-base font-extrabold uppercase tracking-wide text-[#0A0A0A] dark:text-white">
          {label}
        </span>
      </div>
      <div className="flex items-center gap-1 text-sm font-semibold text-[#8B6B2E] transition-colors group-hover:text-[#FFD700] dark:text-[#C9A227]">
        <span>Ver ofertas</span>
        <ArrowRight className="h-4 w-4" />
      </div>
    </Link>
  )
}
