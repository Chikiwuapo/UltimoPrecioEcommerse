import { useState, useMemo } from 'react'
import { getAllProducts, getAllCategories, deleteAdminProduct } from '../../data/index'
import { Search, Pencil, Trash2, EyeOff, Eye, ChevronLeft, ChevronRight } from 'lucide-react'

const PAGE_SIZE = 15

export default function ProductTable({ onEdit, onToggleStock, onRefresh }) {
  const [query,      setQuery]      = useState('')
  const [catFilter,  setCatFilter]  = useState('all')
  const [page,       setPage]       = useState(1)
  const categories = getAllCategories()
  const products   = getAllProducts()

  const filtered = useMemo(() => {
    let list = products
    if (catFilter !== 'all') list = list.filter(p => p.category === catFilter)
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q)
      )
    }
    return list
  }, [products, catFilter, query])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function handleDelete(product) {
    if (!confirm(`¿Eliminar "${product.name}"?`)) return
    deleteAdminProduct(product.id)
    onRefresh()
  }

  function isAdminProduct(p) {
    return p.id.startsWith('adm-')
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setPage(1) }}
            placeholder="Buscar por nombre o marca..."
            className="w-full bg-[#0A0A0A] border border-[#2a2a2a] focus:border-[#FFD700] rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none"
          />
        </div>
        <select
          value={catFilter}
          onChange={e => { setCatFilter(e.target.value); setPage(1) }}
          className="bg-[#0A0A0A] border border-[#2a2a2a] focus:border-[#FFD700] rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
        >
          <option value="all">Todas las categorías</option>
          {categories.map(c => <option key={c.slug} value={c.slug}>{c.label}</option>)}
        </select>
      </div>

      <p className="text-xs text-zinc-500">{filtered.length} productos encontrados</p>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-[#1f1f1f]">
        <table className="w-full text-sm min-w-[700px]">
          <thead className="bg-[#121212] border-b border-[#1f1f1f]">
            <tr>
              {['Imagen','Nombre','Marca','Cat.','Precio','Stock','Acciones'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-bold text-zinc-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1a1a1a]">
            {paged.map(p => (
              <tr key={p.id} className="bg-[#0d0d0d] hover:bg-[#141414] transition-colors">
                <td className="px-4 py-3">
                  <img
                    src={p.image || 'https://via.placeholder.com/48x48?text=?'}
                    alt={p.name}
                    className="w-10 h-10 object-contain rounded bg-[#1a1a1a]"
                  />
                </td>
                <td className="px-4 py-3 text-white font-medium max-w-[200px]">
                  <span className="line-clamp-2">{p.name}</span>
                  {isAdminProduct(p) && (
                    <span className="text-[10px] bg-[#FFD700]/20 text-[#FFD700] px-1 rounded">NUEVO</span>
                  )}
                </td>
                <td className="px-4 py-3 text-zinc-400">{p.brand}</td>
                <td className="px-4 py-3">
                  <span className="text-xs bg-[#1a1a1a] text-zinc-400 px-2 py-0.5 rounded">{p.category}</span>
                </td>
                <td className="px-4 py-3 text-[#FFD700] font-bold whitespace-nowrap">S/. {p.price?.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${p.stock > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                    {p.stock > 0 ? p.stockLabel : 'Sin stock'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onEdit(p)}
                      title="Editar"
                      className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => onToggleStock(p)}
                      title={p.stock > 0 ? 'Desactivar stock' : 'Activar stock'}
                      className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 transition-colors"
                    >
                      {p.stock > 0 ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                    {isAdminProduct(p) && (
                      <button
                        onClick={() => handleDelete(p)}
                        title="Eliminar"
                        className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-1.5 rounded border border-[#2a2a2a] text-zinc-400 hover:text-white disabled:opacity-30">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm text-zinc-400">Pág. {page} de {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-1.5 rounded border border-[#2a2a2a] text-zinc-400 hover:text-white disabled:opacity-30">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
}
