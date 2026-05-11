import { useEffect, useState, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import banner1 from '../assets/baner1.png'
import banner2 from '../assets/baner2.png'
import banner3 from '../assets/baner3.jpg'

const DEFAULT_SLIDES = [
  { id: 'def-1', image: banner1, ctaLink: '/' },
  { id: 'def-2', image: banner2, ctaLink: '/' },
  { id: 'def-3', image: banner3, ctaLink: '/' },
]

// Props:
//   slides  — array of { id, image, cta, ctaLink } — optional, uses defaults if omitted
//   aspectRatio — CSS aspect ratio string, default '16/5'
export default function Carousel({ slides: propSlides, aspectRatio = '16/5' }) {
  const slides = (propSlides && propSlides.length > 0) ? propSlides : DEFAULT_SLIDES

  const [index, setIndex] = useState(0)
  const [fade,  setFade]  = useState(true)

  const go = useCallback((nextIdx) => {
    setFade(false)
    setTimeout(() => {
      setIndex(nextIdx)
      setFade(true)
    }, 150)
  }, [])

  const next = useCallback(() => go((index + 1) % slides.length),         [index, slides.length, go])
  const prev = useCallback(() => go((index - 1 + slides.length) % slides.length), [index, slides.length, go])

  // Reset index if slides change
  useEffect(() => { setIndex(0) }, [slides.length])

  // Auto-play
  useEffect(() => {
    if (slides.length <= 1) return
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next, slides.length])

  return (
    <div className="group relative w-full overflow-hidden bg-white dark:bg-[#0A0A0A]">
      <div className="relative w-full" style={{ aspectRatio }}>

        {slides.map((s, i) => {
          const Wrapper = s.ctaLink ? Link : 'div'
          const wrapperProps = s.ctaLink ? { to: s.ctaLink } : {}
          return (
            <Wrapper
              key={s.id}
              {...wrapperProps}
              className={`absolute inset-0 h-full w-full transition-opacity duration-500 block ${
                i === index && fade ? 'opacity-100' : 'opacity-0 pointer-events-none'
              } ${s.ctaLink ? 'cursor-pointer' : ''}`}
            >
              <img
                src={s.image}
                alt={s.cta || `Banner ${i + 1}`}
                className="h-full w-full object-cover"
              />
              {/* Subtle gradient only, no button */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
            </Wrapper>
          )
        })}
      </div>

      {/* Arrows — only if more than 1 slide */}
      {slides.length > 1 && (
        <>
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

          {/* Dots */}
          <div className="absolute bottom-3 left-1/2 z-20 -translate-x-1/2 flex gap-1.5">
            {slides.map((s, i) => (
              <button
                key={s.id}
                aria-label={`Slide ${i + 1}`}
                onClick={() => go(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === index
                    ? 'w-5 h-2 bg-[#FFD700] shadow-[0_0_6px_#FFD70080]'
                    : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
