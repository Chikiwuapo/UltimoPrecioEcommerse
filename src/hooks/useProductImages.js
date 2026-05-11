// ─────────────────────────────────────────────
//  src/hooks/useProductImages.js
//  IndexedDB storage for product/banner images
// ─────────────────────────────────────────────

const DB_NAME    = 'ultimoprecio_images'
const DB_VERSION = 1
const STORE_NAME = 'images'

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = (e) => {
      e.target.result.createObjectStore(STORE_NAME)
    }
    req.onsuccess  = (e) => resolve(e.target.result)
    req.onerror    = (e) => reject(e.target.error)
  })
}

export async function saveImage(key, base64) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx    = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    const req   = store.put(base64, key)
    req.onsuccess = () => resolve()
    req.onerror   = (e) => reject(e.target.error)
  })
}

export async function getImage(key) {
  try {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const tx    = db.transaction(STORE_NAME, 'readonly')
      const store = tx.objectStore(STORE_NAME)
      const req   = store.get(key)
      req.onsuccess = (e) => resolve(e.target.result || null)
      req.onerror   = (e) => reject(e.target.error)
    })
  } catch {
    return null
  }
}

export async function deleteImage(key) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx    = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    const req   = store.delete(key)
    req.onsuccess = () => resolve()
    req.onerror   = (e) => reject(e.target.error)
  })
}

// Resolves the correct image src for a product:
// 1. Check IndexedDB for uploaded image
// 2. Fall back to product.image (URL)
export async function getImageSrc(product) {
  if (!product) return ''
  const key = `img_${product.id}`
  const stored = await getImage(key)
  if (stored) return stored
  return product.image || ''
}

// Convert File to base64
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload  = (e) => resolve(e.target.result)
    reader.onerror = (e) => reject(e)
    reader.readAsDataURL(file)
  })
}
