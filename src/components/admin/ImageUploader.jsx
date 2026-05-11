import { useRef, useState } from 'react'
import { UploadCloud, Link2, X, Image } from 'lucide-react'
import { fileToBase64 } from '../../hooks/useProductImages'

const ACCEPT = 'image/jpeg,image/png,image/webp'
const MAX_MB = 5

export default function ImageUploader({ value, onChange, onClear }) {
  const inputRef = useRef(null)
  const [tab, setTab] = useState('upload') // 'upload' | 'url'
  const [urlInput, setUrlInput] = useState('')
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState('')

  async function handleFile(file) {
    setError('')
    if (!file.type.startsWith('image/')) {
      setError('Solo se permiten imágenes JPG, PNG o WebP')
      return
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`La imagen no puede superar ${MAX_MB}MB`)
      return
    }
    const base64 = await fileToBase64(file)
    onChange(base64)
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  function handleUrlSubmit() {
    if (urlInput.startsWith('https://')) {
      onChange(urlInput)
      setUrlInput('')
    } else {
      setError('La URL debe comenzar con https://')
    }
  }

  return (
    <div className="space-y-2">
      {/* Tabs */}
      <div className="flex rounded-lg overflow-hidden border border-[#2a2a2a] w-fit">
        {['upload', 'url'].map(t => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 ${tab === t ? 'bg-[#FFD700] text-[#0A0A0A]' : 'bg-[#0f0f0f] text-zinc-400 hover:text-white'}`}
          >
            {t === 'upload' ? <><UploadCloud className="h-3.5 w-3.5" />Subir</> : <><Link2 className="h-3.5 w-3.5" />URL</>}
          </button>
        ))}
      </div>

      {/* Preview */}
      {value && (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-[#2a2a2a] bg-[#0a0a0a]">
          <img src={value} alt="Preview" className="w-full h-full object-contain" />
          <button
            type="button"
            onClick={onClear}
            className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Upload dropzone */}
      {tab === 'upload' && !value && (
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed cursor-pointer py-8 transition-colors
            ${dragging ? 'border-[#FFD700] bg-[#FFD700]/5' : 'border-[#2a2a2a] hover:border-[#C9A227] hover:bg-[#C9A227]/5'}`}
        >
          <Image className="h-8 w-8 text-zinc-500" />
          <p className="text-sm text-zinc-400">Arrastra una imagen aquí</p>
          <p className="text-xs text-zinc-600">o haz clic para seleccionar</p>
          <p className="text-xs text-zinc-700">JPG • PNG • WebP — máx. {MAX_MB}MB</p>
          <input ref={inputRef} type="file" accept={ACCEPT} className="hidden" onChange={e => { if (e.target.files[0]) handleFile(e.target.files[0]) }} />
        </div>
      )}

      {/* URL input */}
      {tab === 'url' && !value && (
        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={e => setUrlInput(e.target.value)}
            placeholder="https://ejemplo.com/imagen.jpg"
            className="flex-1 bg-[#0A0A0A] border border-[#2a2a2a] focus:border-[#FFD700] rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none"
          />
          <button type="button" onClick={handleUrlSubmit} className="px-4 py-2 bg-[#FFD700] text-[#0A0A0A] font-bold text-sm rounded-lg hover:brightness-110">
            OK
          </button>
        </div>
      )}

      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}
