import { useEffect, useState, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import banner1 from '../assets/baner1.png'
import banner2 from '../assets/baner2.png'
import banner3 from '../assets/baner3.jpg'

const slides = [
  {
    id: 1,
    image: banner1,
    alt: 'Banner 1',
    cta: 'COMPRAR AHORA',
  },
  {
    id: 2,
    image: banner2,
    alt: 'Banner 2',
    cta: 'VER OFERTAS',
  },
  {
    id: 3,
    image: banner3,
    alt: 'Banner 3',
    cta: 'EQUIPA TU PC',
  },
]

export default function Carousel() {
  const [index, setIndex] = useState(0)
  const [fade, setFade] = useState(true)

  const next = useCallback(() => {
    setFade(false)
    setTimeout(() => {
      setIndex((prev) => (prev + 1) % slides.length)
      setFade(true)
    }, 150)
  }, [])

  const prev = useCallback(() => {
    setFade(false)
    setTimeout(() => {
      setIndex((prev) => (prev - 1 + slides.length) % slides.length)
      setFade(true)
    }, 150)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      next()
    }, 5000)
    return () => clearInterval(timer)
  }, [next])

  return (
    <div className="group relative w-full overflow-hidden bg-white dark:bg-[#0A0A0A]">
      <div className="relative aspect-[16/5] w-full">
        {slides.map((s, i) => (
          <div
            key={s.id}
            className={`absolute inset-0 h-full w-full transition-opacity duration-500 ${
              i === index && fade ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={s.image}
              alt={s.alt}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent dark:from-black/60" />
            <div className="absolute inset-y-0 left-0 flex items-center px-6 md:px-12">
              <button
                type="button"
                className="rounded-md border border-[#FFD700] bg-[linear-gradient(135deg,#00D4FF,#0050A0)] px-5 py-2 text-sm font-bold text-white shadow-[0_0_10px_#00D4FF] transition-colors hover:bg-[#FFD700] hover:text-black"
              >
                {s.cta}
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={prev}
        aria-label="Anterior"
        className="invisible absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-[#121212]/70 p-2 text-white backdrop-blur transition-all hover:bg-[#121212]/90 group-hover:visible"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        type="button"
        onClick={next}
        aria-label="Siguiente"
        className="invisible absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-[#121212]/70 p-2 text-white backdrop-blur transition-all hover:bg-[#121212]/90 group-hover:visible"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      <div className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 space-x-2">
        {slides.map((s, i) => (
          <button
            key={s.id}
            aria-label={`Ir al slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-2 w-2 rounded-full transition-all ${
              i === index
                ? 'bg-[#FFD700] shadow-[0_0_6px_#00D4FF]'
                : 'bg-[#C9A227]'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
