import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, Search, Sun, Moon } from 'lucide-react'
import logo from '../assets/UltimoPrecioRemaster.png'

const productCategories = [
  'PC Configuraciones',
  'Laptops',
  'Monitores',
  'Periféricos PC',
  'Almacenamiento (SSD/HDD)',
  'Tarjetas de Video',
  'Case / Gabinetes',
  'Fuente de Poder',
  'Refrigeración',
]

const pcSubcategories = [
  'Procesadores',
  'Placas Madre',
  'RAM',
  'Almacenamiento (SSD/HDD)',
  'Tarjetas de Video',
  'Case / Gabinetes',
  'Fuente de Poder',
  'Refrigeración',
]

export default function Header() {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('theme') || 'light'
    } catch {
      return 'light'
    }
  })

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    localStorage.setItem('theme', next)
    if (next === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
  return (
    <header className="w-full border-b border-[#C9A227] bg-white text-[#0A0A0A] dark:bg-[#121212] dark:text-white">
      <div className="w-full px-10 md:px-12">
        <div className="flex items-center justify-between gap-6 py-3">
          <Link to="/" className="shrink-0">
            <img src={logo} alt="El Último Precio" className="h-40 md:h-32 sm:h-24 w-auto" />
          </Link>

          <nav className="hidden flex-1 items-center justify-center gap-8 lg:flex">
            <div className="relative group">
              <button
                type="button"
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold hover:bg-gray-100 dark:hover:bg-[#0A0A0A]"
              >
                <Menu className="h-5 w-5 text-[#8B6B2E] dark:text-white" />
                <span className="uppercase">PRODUCTOS</span>
              </button>
              <div className="invisible absolute left-0 top-full z-50 mt-2 w-72 rounded-md border border-gray-200 bg-white p-2 opacity-0 shadow-xl transition-all duration-150 group-hover:visible group-hover:opacity-100 dark:border-[#C9A227] dark:bg-[#121212]">
                <ul className="max-h-80 overflow-auto">
                  {productCategories.map((cat) => (
                    <li key={cat}>
                      <Link
                        to="/404"
                        className="block rounded px-3 py-2 text-sm text-[#0A0A0A] hover:text-[#FFD700] dark:text-zinc-200"
                      >
                        {cat}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="relative group">
              <Link
                to="/404"
                className="text-sm font-semibold uppercase hover:text-[#FFD700]"
              >
                PC CONFIGURACIONES
              </Link>
              <div className="invisible absolute left-0 top-full z-50 mt-2 min-w-[18rem] rounded-md border border-gray-200 bg-white p-4 opacity-0 shadow-xl transition-all duration-150 group-hover:visible group-hover:opacity-100 dark:border-[#C9A227] dark:bg-[#121212]">
                <div className="grid grid-cols-1 gap-1">
                  {pcSubcategories.map((item) => (
                    <Link
                      key={item}
                      to="/404"
                      className="rounded px-2 py-1.5 text-sm text-[#0A0A0A] hover:text-[#FFD700] dark:text-zinc-200"
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link
              to="/404"
              className="text-sm font-semibold uppercase hover:text-[#FFD700]"
            >
              MONITORES
            </Link>
            <Link
              to="/404"
              className="text-sm font-semibold uppercase hover:text-[#FFD700]"
            >
              PERIFÉRICOS PC
            </Link>
            <Link
              to="/404"
              className="text-sm font-semibold uppercase hover:text-[#FFD700]"
            >
              LAPTOPS
            </Link>
          </nav>

          <div className="flex w-full max-w-[820px] shrink-0 items-center justify-end gap-3">
            <div className="group flex flex-1 items-center rounded-full border border-gray-300 transition-shadow focus-within:ring-2 focus-within:ring-[#00D4FF]/50 dark:border-none dark:bg-gradient-to-r dark:from-[#0099FF] dark:to-[#FFD700] dark:p-[1px] dark:focus-within:shadow-[0_0_20px_#00D4FF]">
              <div className="flex w-full items-center overflow-hidden rounded-full bg-gray-100 dark:bg-[#121212]/60">
                <input
                  type="text"
                  placeholder="Buscar en catálogo..."
                  className="w-full bg-transparent px-5 py-2.5 text-sm text-[#4A4A4A] placeholder:text-gray-500 focus:outline-none dark:text-zinc-200"
                />
                <button
                  type="button"
                  aria-label="Buscar"
                  className="mr-1 flex items-center justify-center rounded-full bg-[linear-gradient(135deg,#0099FF,#0050A0)] px-4 py-1.5 text-white transition-colors hover:bg-[#FFD700] hover:text-black dark:hover:bg-[#00D4FF] dark:hover:text-white"
                >
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Cambiar tema"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white text-[#0A0A0A] transition-colors hover:bg-gray-100 dark:border-[#2a2a2a] dark:bg-[#0A0A0A] dark:text-white dark:hover:bg-[#1a1a1a]"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
