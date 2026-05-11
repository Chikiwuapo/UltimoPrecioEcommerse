import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { saveAdminProduct, saveProductOverride } from '../data/index'
import { saveImage } from '../hooks/useProductImages'
import ProductForm  from '../components/admin/ProductForm'
import ProductTable from '../components/admin/ProductTable'
import BannersTab   from '../components/admin/BannersTab'
import { Package, Image, LogOut, ShieldCheck, Plus, ChevronLeft } from 'lucide-react'

const TABS = [
  { id: 'products', label: 'Productos', icon: Package },
  { id: 'banners',  label: 'Banners',   icon: Image   },
]

export default function AdminPanel() {
  const { logout } = useAuth()
  const navigate   = useNavigate()
  const [tab,        setTab]      = useState('products')
  const [showForm,   setShowForm]  = useState(false) // 'add' | 'edit' | false
  const [editing,    setEditing]   = useState(null)
  const [tick,       setTick]      = useState(0) // force re-render after mutations

  function refresh() { setTick(t => t + 1) }

  async function handleSave(product, imgSrc) {
    // Save image to IndexedDB if it's base64
    if (imgSrc && imgSrc.startsWith('data:')) {
      await saveImage(`img_${product.id}`, imgSrc)
      product.image = imgSrc
    }
    if (editing) {
      saveProductOverride(product.id, product)
    } else {
      saveAdminProduct(product)
    }
    setShowForm(false)
    setEditing(null)
    refresh()
  }

  function handleEdit(product) {
    setEditing(product)
    setShowForm('edit')
  }

  function handleToggleStock(product) {
    const newStock = product.stock > 0 ? 0 : 10
    saveProductOverride(product.id, { stock: newStock, stockLabel: newStock > 0 ? '>10' : '0' })
    refresh()
  }

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-[#080808]">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-[#0A0A0A] border-b border-[#1a1a1a] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-[#FFD700]" />
          <span className="font-extrabold text-white tracking-wide text-sm uppercase">Panel Admin</span>
          <span className="text-xs text-zinc-600">— El Último Precio</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="h-3.5 w-3.5" /> Ver tienda
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-red-800/50 text-red-400 hover:bg-red-900/20 rounded-lg text-xs font-bold transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" /> Salir
          </button>
        </div>
      </header>

      <div className="p-6 max-w-7xl mx-auto">
        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-[#1a1a1a]">
          {TABS.map(t => {
            const Icon = t.icon
            return (
              <button
                key={t.id}
                onClick={() => { setTab(t.id); setShowForm(false); setEditing(null) }}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-bold transition-colors border-b-2 -mb-px ${
                  tab === t.id
                    ? 'border-[#FFD700] text-[#FFD700]'
                    : 'border-transparent text-zinc-400 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />{t.label}
              </button>
            )
          })}
        </div>

        {/* ── Tab: Products ── */}
        {tab === 'products' && (
          <div className="space-y-6">
            {!showForm && (
              <button
                onClick={() => { setShowForm('add'); setEditing(null) }}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#FFD700] text-[#0A0A0A] font-extrabold text-sm rounded-lg hover:brightness-110"
              >
                <Plus className="h-4 w-4" /> AGREGAR PRODUCTO
              </button>
            )}

            {showForm && (
              <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-2xl p-6">
                <h2 className="text-sm font-extrabold text-white uppercase tracking-widest mb-5">
                  {showForm === 'edit' ? `✏️ Editando: ${editing?.name}` : '➕ Nuevo Producto'}
                </h2>
                <ProductForm
                  key={editing?.id || 'new'}
                  initial={editing}
                  onSave={handleSave}
                  onCancel={() => { setShowForm(false); setEditing(null) }}
                />
              </div>
            )}

            {!showForm && (
              <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-2xl p-6">
                <h2 className="text-sm font-extrabold text-white uppercase tracking-widest mb-5">
                  📦 Gestión de Productos
                </h2>
                <ProductTable
                  key={tick}
                  onEdit={handleEdit}
                  onToggleStock={handleToggleStock}
                  onRefresh={refresh}
                />
              </div>
            )}
          </div>
        )}

        {/* ── Tab: Banners ── */}
        {tab === 'banners' && (
          <div className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-2xl p-6">
            <h2 className="text-sm font-extrabold text-white uppercase tracking-widest mb-5">🖼️ Banners por Categoría</h2>
            <BannersTab />
          </div>
        )}
      </div>
    </div>
  )
}
