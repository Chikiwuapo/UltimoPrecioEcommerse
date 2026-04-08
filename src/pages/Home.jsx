import Header from '../components/Header'
import Carousel from '../components/Carousel'
import CategoryCard from '../components/CategoryCard'
import ProductCard from '../components/ProductCard'
import { popularCategories } from '../data/categories'
import { laptops, gpus } from '../data/products'
import { Laptop, Cpu, PcCase, Layers3, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'


const iconMap = {
  laptops: Laptop,
  ram: Cpu,
  'pc-completas': PcCase,
  gpus: Layers3,
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0A]">
      <Header />
      <main>
        <Carousel />

        <section className="w-full px-4 py-10 md:px-8">
          <h2 className="mb-6 text-xl font-extrabold uppercase tracking-wide text-[#0A0A0A] dark:text-white">
            CATEGORÍAS POPULARES
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {popularCategories.map((c) => {
              const Icon = iconMap[c.key]
              return <CategoryCard key={c.key} icon={Icon} label={c.label} />
            })}
          </div>
        </section>

        <section className="w-full px-4 pb-8 md:px-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-extrabold uppercase tracking-wide text-[#0A0A0A] dark:text-white">
              PRODUCTOS DESTACADOS POR CATEGORÍA
            </h2>
            <Link
              to="/404"
              className="flex items-center gap-1 text-sm font-semibold text-[#BFBFBF] hover:text-[#FFD700]"
            >
              Ver más Laptops <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {laptops.slice(0, 10).map((p) => (
              <ProductCard
                key={p.id}
                image={p.image}
                name={p.name}
                description={p.description}
                price={p.price}
                oldPrice={p.oldPrice}
              />
            ))}
          </div>
          <div className="mt-6 flex justify-center">
            <Link
              to="/404"
              className="rounded-md border border-[#FFD700] bg-[#0050A0] px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-[#FFD700] hover:text-black"
            >
              VER MÁS PRODUCTOS DE ESTA CATEGORÍA
            </Link>
          </div>
        </section>

        <section className="w-full px-4 pb-12 md:px-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-extrabold uppercase tracking-wide text-[#0A0A0A] dark:text-white">
              TARJETAS DE VIDEO DESTACADAS
            </h2>
            <Link
              to="/404"
              className="flex items-center gap-1 text-sm font-semibold text-[#BFBFBF] hover:text-[#FFD700]"
            >
              Ver más Tarjetas <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {gpus.slice(0, 10).map((p) => (
              <ProductCard
                key={p.id}
                image={p.image}
                name={p.name}
                description={p.description}
                price={p.price}
                oldPrice={p.oldPrice}
              />
            ))}
          </div>
          <div className="mt-6 flex justify-center">
            <Link
              to="/404"
              className="rounded-md border border-[#FFD700] bg-[#0050A0] px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-[#FFD700] hover:text-black"
            >
              VER MÁS PRODUCTOS DE ESTA CATEGORÍA
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
