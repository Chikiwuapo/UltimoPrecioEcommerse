import { useState } from 'react'
import { getAllCategories, getBannersForCategory, getHomeBanners, saveAdminBanner, deleteAdminBanner } from '../../data/index'
import ImageUploader from './ImageUploader'
import { Plus, Trash2, Image, ChevronLeft, Layout, Laptop, Monitor, Keyboard, HardDrive, Camera, Armchair, Cpu, Layers3, Zap, Fan, Box, Server, CircuitBoard } from 'lucide-react'

const ICON_MAP = {
  laptops:        Laptop,
  gpus:           Layers3,
  monitores:      Monitor,
  procesadores:   Cpu,
  ram:            Server,
  almacenamiento: HardDrive,
  'placas-madre': CircuitBoard,
  gabinetes:      Box,
  fuentes:        Zap,
  refrigeracion:  Fan,
  perifericos:    Keyboard,
  camaras:        Camera,
  'sillas-gamer': Armchair,
}

export default function BannersTab() {
  const categories = getAllCategories()
  const [view,     setView]     = useState('grid') // 'grid' | 'edit'
  const [selCat,   setSelCat]   = useState('home')
  const [imgSrc,   setImgSrc]   = useState('')
  const [ctaText,  setCtaText]  = useState('VER PRODUCTOS')
  const [refresh,  setRefresh]  = useState(0)

  const banners = selCat === 'home' ? getHomeBanners() : getBannersForCategory(selCat)

  function addBanner() {
    if (!imgSrc) return
    const banner = {
      id:      `ban-adm-${Date.now()}`,
      image:   imgSrc,
      cta:     ctaText,
      ctaLink: selCat === 'home' ? '/' : `/categoria/${selCat}`,
    }
    saveAdminBanner(selCat, banner)
    setImgSrc('')
    setRefresh(r => r + 1)
  }

  function removeBanner(bannerId) {
    deleteAdminBanner(selCat, bannerId)
    setRefresh(r => r + 1)
  }

  function openEdit(catSlug) {
    setSelCat(catSlug)
    setView('edit')
  }

  const selectedCategoryLabel = selCat === 'home' ? 'Inicio (Home)' : (categories.find(c => c.slug === selCat)?.label || selCat)

  if (view === 'grid') {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-widest mb-4">Selecciona una sección para gestionar sus banners</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {/* Home Card */}
            <button
              onClick={() => openEdit('home')}
              className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border border-[#2a2a2a] bg-[#0f0f0f] hover:border-[#FFD700] hover:bg-[#FFD700]/5 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#FFD700]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Layout className="h-6 w-6 text-[#FFD700]" />
              </div>
              <span className="text-xs font-bold text-white uppercase tracking-wider text-center">Inicio (Home)</span>
            </button>

            {/* Category Cards */}
            {categories.map(c => {
              const Icon = ICON_MAP[c.slug] || Box
              return (
                <button
                  key={c.slug}
                  onClick={() => openEdit(c.slug)}
                  className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border border-[#2a2a2a] bg-[#0f0f0f] hover:border-[#FFD700] hover:bg-[#FFD700]/5 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="h-6 w-6 text-zinc-400 group-hover:text-[#FFD700]" />
                  </div>
                  <span className="text-xs font-bold text-white uppercase tracking-wider text-center line-clamp-2">{c.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
      {/* Header with back button */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setView('grid')}
          className="p-2 rounded-lg bg-[#0f0f0f] border border-[#2a2a2a] text-zinc-400 hover:text-white hover:border-[#FFD700] transition-all"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div>
          <h2 className="text-lg font-bold text-white leading-tight">{selectedCategoryLabel}</h2>
          <p className="text-xs text-zinc-500 uppercase tracking-widest">Gestión de Banners</p>
        </div>
      </div>

      {/* Existing banners */}
      <div>
        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">
          Banners actuales ({banners.length})
        </p>
        {banners.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-[#2a2a2a] rounded-2xl">
             <Image className="h-8 w-8 text-zinc-700 mb-2" />
             <p className="text-sm text-zinc-600 italic">Sin banners personalizados para esta sección</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {banners.map(b => (
              <div key={b.id} className="relative rounded-xl overflow-hidden border border-[#2a2a2a] group">
                <img src={b.image} alt={b.cta} className="w-full h-32 object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button onClick={() => removeBanner(b.id)} className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-full">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-3 py-1.5">
                  <p className="text-xs font-bold text-[#FFD700]">{b.cta}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add banner */}
      <div className="border border-[#2a2a2a] rounded-xl p-5 space-y-4 bg-[#0f0f0f]">
        <p className="flex items-center gap-2 text-sm font-bold text-white">
          <Plus className="h-4 w-4 text-[#FFD700]" /> Agregar nuevo banner
        </p>
        <ImageUploader value={imgSrc} onChange={setImgSrc} onClear={() => setImgSrc('')} />
        <div>
          <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Texto del botón</label>
          <input
            type="text"
            value={ctaText}
            onChange={e => setCtaText(e.target.value)}
            placeholder="VER PRODUCTOS"
            className="w-full bg-[#0A0A0A] border border-[#2a2a2a] focus:border-[#FFD700] rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none"
          />
        </div>
        <button
          onClick={addBanner}
          disabled={!imgSrc}
          className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-[#FFD700] text-[#0A0A0A] font-extrabold text-sm rounded-lg hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <Image className="h-4 w-4" /> AGREGAR BANNER A {selectedCategoryLabel.toUpperCase()}
        </button>
      </div>
    </div>
  )
}
