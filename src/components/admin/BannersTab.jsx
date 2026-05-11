import { useState } from 'react'
import { getAllCategories, getBannersForCategory, saveAdminBanner, deleteAdminBanner } from '../../data/index'
import ImageUploader from './ImageUploader'
import { Plus, Trash2, Image } from 'lucide-react'

export default function BannersTab() {
  const categories = getAllCategories()
  const [selCat,   setSelCat]   = useState(categories[0]?.slug || '')
  const [imgSrc,   setImgSrc]   = useState('')
  const [ctaText,  setCtaText]  = useState('VER PRODUCTOS')
  const [refresh,  setRefresh]  = useState(0)

  const banners = getBannersForCategory(selCat)

  function addBanner() {
    if (!imgSrc) return
    const banner = {
      id:      `ban-adm-${Date.now()}`,
      image:   imgSrc,
      cta:     ctaText,
      ctaLink: `/categoria/${selCat}`,
    }
    saveAdminBanner(selCat, banner)
    setImgSrc('')
    setRefresh(r => r + 1)
  }

  function removeBanner(bannerId) {
    deleteAdminBanner(selCat, bannerId)
    setRefresh(r => r + 1)
  }

  return (
    <div className="space-y-6">
      {/* Category selector */}
      <div>
        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Categoría</label>
        <select
          value={selCat}
          onChange={e => setSelCat(e.target.value)}
          className="bg-[#0A0A0A] border border-[#2a2a2a] focus:border-[#FFD700] rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none"
        >
          {categories.map(c => <option key={c.slug} value={c.slug}>{c.label}</option>)}
        </select>
      </div>

      {/* Existing banners */}
      <div>
        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">
          Banners actuales ({banners.length})
        </p>
        {banners.length === 0 ? (
          <p className="text-sm text-zinc-600 italic">Sin banners personalizados para esta categoría</p>
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
      <div className="border border-[#2a2a2a] rounded-xl p-5 space-y-4">
        <p className="flex items-center gap-2 text-sm font-bold text-white">
          <Plus className="h-4 w-4 text-[#FFD700]" /> Agregar banner
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
          className="flex items-center gap-2 px-5 py-2.5 bg-[#FFD700] text-[#0A0A0A] font-extrabold text-sm rounded-lg hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Image className="h-4 w-4" /> AGREGAR BANNER
        </button>
      </div>
    </div>
  )
}
