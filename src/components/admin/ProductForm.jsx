import { useState, useEffect } from 'react'
import { getAllCategories } from '../../data/index'
import { sanitizeInput } from '../../utils/security'
import ImageUploader from './ImageUploader'
import { Save, X, Plus, Trash2 } from 'lucide-react'

const SPEC_FIELDS = {
  laptops:       ['processor','ram','storage','gpu','display'],
  gpus:          ['gpu','vram','busWidth','coreClock','recommendedPSU'],
  monitores:     ['size','panel','resolution','refreshRate','responseTime','connectors','tipo'],
  procesadores:  ['socket','series','cores','baseClock','boostClock'],
  ram:           ['capacity','type','frequency','latency','formFactor'],
  almacenamiento:['type','capacity','interface','readSpeed','writeSpeed'],
  'placas-madre':['socket','chipset','ramType','ramSlots','maxRam','maxFreq','formFactor','compatibility'],
  gabinetes:     ['formFactor','fans','sidePanel','maxGpuLength','color'],
  fuentes:       ['wattage','certification','modular'],
  refrigeracion: ['type','size','compatibility','tdp'],
  perifericos:   ['type','connectivity','lighting','microphone'],
  camaras:       ['resolution','fps','connectivity','microphone'],
  'sillas-gamer':['material','reclining','weightCapacity','dimensions','color'],
}

const SPEC_LABELS = {
  processor:'Procesador',ram:'RAM',storage:'Almacenamiento',gpu:'GPU',display:'Pantalla',
  vram:'VRAM',busWidth:'Bus datos',coreClock:'Reloj núcleo',recommendedPSU:'Fuente recomendada',
  size:'Tamaño',panel:'Panel',resolution:'Resolución',refreshRate:'Tasa refresco',
  responseTime:'Tiempo respuesta',connectors:'Conectores',tipo:'Tipo de pantalla',
  socket:'Socket',series:'Serie',cores:'Núcleos / Hilos',baseClock:'Frec. base',boostClock:'Frec. boost',
  capacity:'Capacidad',type:'Tipo',frequency:'Frecuencia',latency:'Latencia',formFactor:'Factor de forma',
  interface:'Interfaz',readSpeed:'Lectura',writeSpeed:'Escritura',
  chipset:'Chipset',ramType:'Tipo RAM',ramSlots:'Ranuras RAM',maxRam:'RAM máxima',maxFreq:'Frec. máxima',compatibility:'Compatibilidad',
  fans:'Ventiladores',sidePanel:'Panel lateral',maxGpuLength:'GPU máx.',color:'Color',
  wattage:'Potencia',certification:'Certificación',modular:'Modular',
  tdp:'TDP',lighting:'Iluminación',microphone:'Micrófono',
  connectivity:'Conectividad',material:'Material',reclining:'Reclinación',weightCapacity:'Peso máximo',dimensions:'Dimensiones',
  fps:'FPS',
}

function slugify(str) {
  return str.toLowerCase()
    .replace(/[áà]/g,'a').replace(/[éè]/g,'e').replace(/[íì]/g,'i')
    .replace(/[óò]/g,'o').replace(/[úù]/g,'u').replace(/ñ/g,'n')
    .replace(/[^a-z0-9\s-]/g,'').replace(/\s+/g,'-').replace(/-+/g,'-').trim()
}

const EMPTY = {
  name:'', brand:'', description:'', price:'', oldPrice:'',
  category: 'monitores', stock:'', stockLabel:'', image:'', featured:false, specs:{},
}

export default function ProductForm({ initial = null, onSave, onCancel }) {
  const [form,    setForm]    = useState(initial || EMPTY)
  const [imgSrc,  setImgSrc]  = useState(initial?.image || '')
  const [errors,  setErrors]  = useState({})
  
  // Custom specs state
  const [newSpecKey, setNewSpecKey] = useState('')
  const [newSpecVal, setNewSpecVal] = useState('')

  const categories = getAllCategories()
  const baseSpecFields = SPEC_FIELDS[form.category] || []
  
  // Combine base fields with existing custom ones in form.specs
  const allSpecKeys = [...new Set([...baseSpecFields, ...Object.keys(form.specs || {})])]

  useEffect(() => {
    if (initial) {
      setForm(initial)
      setImgSrc(initial.image || '')
    }
  }, [initial])

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }))
  }

  function setSpec(key, value) {
    setForm(f => ({ ...f, specs: { ...f.specs, [key]: value } }))
  }

  function addCustomSpec() {
    if (!newSpecKey.trim() || !newSpecVal.trim()) return
    const key = slugify(newSpecKey)
    setSpec(key, newSpecVal)
    setNewSpecKey('')
    setNewSpecVal('')
  }

  function removeSpec(key) {
    const newSpecs = { ...form.specs }
    delete newSpecs[key]
    setForm(f => ({ ...f, specs: newSpecs }))
  }

  function validate() {
    const e = {}
    if (!form.name.trim())     e.name     = 'Nombre requerido'
    if (!form.brand.trim())    e.brand    = 'Marca requerida'
    if (!form.price || isNaN(Number(form.price))) e.price = 'Precio inválido'
    if (!form.stock || isNaN(Number(form.stock))) e.stock = 'Stock inválido'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    const id   = initial?.id || `adm-${Date.now()}`
    const slug = initial?.slug || slugify(form.name)
    const product = {
      ...form,
      id, slug,
      name:        sanitizeInput(form.name),
      brand:       sanitizeInput(form.brand),
      description: sanitizeInput(form.description),
      price:       Number(form.price),
      oldPrice:    form.oldPrice ? Number(form.oldPrice) : null,
      stock:       Number(form.stock),
      stockLabel:  form.stockLabel || String(form.stock),
      image:       imgSrc,
      currency:    'PEN',
    }
    onSave(product, imgSrc)
  }

  const field = (label, key, type='text', placeholder='') => (
    <div>
      <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">{label}</label>
      <input
        type={type}
        value={form[key] || ''}
        onChange={e => set(key, e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#0A0A0A] border border-[#2a2a2a] focus:border-[#FFD700] rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none"
      />
      {errors[key] && <p className="text-xs text-red-400 mt-1">{errors[key]}</p>}
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {field('Nombre del producto *', 'name', 'text', 'Ej: Monitor Teros 24" Plano 144Hz')}
        {field('Marca *', 'brand', 'text', 'Ej: Teros')}
      </div>

      <div>
        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Descripción</label>
        <textarea
          value={form.description || ''}
          onChange={e => set('description', e.target.value)}
          rows={3}
          className="w-full bg-[#0A0A0A] border border-[#2a2a2a] focus:border-[#FFD700] rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none resize-none"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {field('Precio S/. *', 'price', 'number', '0')}
        {field('Precio anterior', 'oldPrice', 'number', '0')}
        {field('Stock (unidades) *', 'stock', 'number', '10')}
        {field('Etiqueta stock', 'stockLabel', 'text', 'Ej: >10')}
      </div>

      <div>
        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Categoría</label>
        <select
          value={form.category}
          onChange={e => set('category', e.target.value)}
          className="w-full bg-[#0A0A0A] border border-[#2a2a2a] focus:border-[#FFD700] rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none"
        >
          {categories.map(c => <option key={c.slug} value={c.slug}>{c.label}</option>)}
        </select>
      </div>

      {/* Imagen */}
      <div>
        <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Imagen del producto</label>
        <ImageUploader
          value={imgSrc}
          onChange={setImgSrc}
          onClear={() => setImgSrc('')}
        />
      </div>

      {/* Especificaciones */}
      <div>
        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3 flex items-center justify-between">
          Especificaciones Técnicas
          <span className="text-[10px] text-zinc-600 normal-case font-medium">Define los detalles técnicos del producto</span>
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          {allSpecKeys.map(key => (
            <div key={key} className="flex flex-col">
              <div className="flex items-center justify-between mb-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{SPEC_LABELS[key] || key}</label>
                {!baseSpecFields.includes(key) && (
                  <button type="button" onClick={() => removeSpec(key)} className="text-red-500 hover:text-red-400 p-0.5">
                    <Trash2 className="h-3 w-3" />
                  </button>
                )}
              </div>
              <input
                type="text"
                value={form.specs?.[key] || ''}
                onChange={e => setSpec(key, e.target.value)}
                className="w-full bg-[#0A0A0A] border border-[#2a2a2a] focus:border-[#FFD700] rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
              />
            </div>
          ))}
        </div>

        {/* Add custom spec */}
        <div className="p-3 rounded-xl border border-[#2a2a2a] bg-[#0f0f0f] space-y-3">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Añadir especificación personalizada</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              type="text"
              value={newSpecKey}
              onChange={e => setNewSpecKey(e.target.value)}
              placeholder="Nombre (ej: Generación)"
              className="bg-[#0A0A0A] border border-[#2a2a2a] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFD700]"
            />
            <div className="flex gap-2">
              <input
                type="text"
                value={newSpecVal}
                onChange={e => setNewSpecVal(e.target.value)}
                placeholder="Valor (ej: 13va Gen)"
                className="flex-1 bg-[#0A0A0A] border border-[#2a2a2a] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFD700]"
              />
              <button
                type="button"
                onClick={addCustomSpec}
                className="px-3 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Destacado */}
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={!!form.featured} onChange={e => set('featured', e.target.checked)} className="accent-[#FFD700] w-4 h-4" />
        <span className="text-sm text-zinc-300">Marcar como producto destacado</span>
      </label>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button type="submit" className="flex items-center gap-2 px-5 py-2.5 bg-[#FFD700] text-[#0A0A0A] font-extrabold text-sm rounded-lg hover:brightness-110">
          <Save className="h-4 w-4" />
          {initial ? 'GUARDAR CAMBIOS' : 'AGREGAR PRODUCTO'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="flex items-center gap-2 px-4 py-2.5 border border-[#2a2a2a] text-zinc-400 hover:text-white text-sm rounded-lg">
            <X className="h-4 w-4" /> Cancelar
          </button>
        )}
      </div>
    </form>
  )
}
