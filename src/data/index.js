// ─────────────────────────────────────────────
//  src/data/index.js — Central Data Hub
//  Merges JSON base data with admin localStorage overrides
// ─────────────────────────────────────────────

import categories from './categories.json'
import bannersBase from './banners.json'

// ── Static JSON imports ──────────────────────
import laptops     from './products/laptops.json'
import gpus        from './products/gpus.json'
import monitores   from './products/monitores.json'
import procesadores from './products/procesadores.json'
import ram         from './products/ram.json'
import almacenamiento from './products/almacenamiento.json'
import placasMadre from './products/placas-madre.json'
import gabinetes   from './products/gabinetes.json'
import fuentes     from './products/fuentes.json'
import refrigeracion from './products/refrigeracion.json'
import perifericos from './products/perifericos.json'
import camaras     from './products/camaras.json'
import sillasGamer from './products/sillas-gamer.json'

// ── Base product catalog ─────────────────────
const BASE_PRODUCTS = [
  ...laptops,
  ...gpus,
  ...monitores,
  ...procesadores,
  ...ram,
  ...almacenamiento,
  ...placasMadre,
  ...gabinetes,
  ...fuentes,
  ...refrigeracion,
  ...perifericos,
  ...camaras,
  ...sillasGamer,
]

// ── localStorage keys ────────────────────────
const KEYS = {
  ADMIN_PRODUCTS:   'admin_products',
  PRODUCT_OVERRIDES: 'admin_product_overrides',
  ADMIN_BANNERS:    'admin_banners',
}

// ── Helpers ──────────────────────────────────
function safeJsonParse(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

// ── getAllProducts ───────────────────────────
// Returns base products merged with admin overrides and new admin products
export function getAllProducts() {
  const overrides     = safeJsonParse(KEYS.PRODUCT_OVERRIDES, {})
  const adminProducts = safeJsonParse(KEYS.ADMIN_PRODUCTS, [])

  const baseWithOverrides = BASE_PRODUCTS.map(p => ({
    ...p,
    ...(overrides[p.id] || {}),
  }))

  return [...baseWithOverrides, ...adminProducts]
}

// ── getProductsByCategory ────────────────────
export function getProductsByCategory(slug) {
  return getAllProducts().filter(p => p.category === slug)
}

// ── getProductBySlug ─────────────────────────
export function getProductBySlug(slug) {
  return getAllProducts().find(p => p.slug === slug) || null
}

// ── getActiveCategories ──────────────────────
// Only returns categories that have ≥1 product with stock > 0
export function getActiveCategories() {
  const all = getAllProducts()
  const activeSlugs = new Set(
    all.filter(p => p.stock > 0).map(p => p.category)
  )
  return categories.filter(c => activeSlugs.has(c.slug))
}

// ── getFeaturedByCategory ────────────────────
export function getFeaturedByCategory(slug, limit = 10) {
  return getProductsByCategory(slug)
    .filter(p => p.stock > 0)
    .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    .slice(0, limit)
}

// ── getAllCategories (including inactive) ────
export function getAllCategories() {
  return categories
}

// ── saveProductOverride (admin) ──────────────
export function saveProductOverride(productId, data) {
  const overrides = safeJsonParse(KEYS.PRODUCT_OVERRIDES, {})
  overrides[productId] = { ...overrides[productId], ...data }
  localStorage.setItem(KEYS.PRODUCT_OVERRIDES, JSON.stringify(overrides))
}

// ── saveAdminProduct (admin) ─────────────────
export function saveAdminProduct(product) {
  const existing = safeJsonParse(KEYS.ADMIN_PRODUCTS, [])
  const idx = existing.findIndex(p => p.id === product.id)
  if (idx >= 0) {
    existing[idx] = product
  } else {
    existing.push(product)
  }
  localStorage.setItem(KEYS.ADMIN_PRODUCTS, JSON.stringify(existing))
}

// ── deleteAdminProduct (admin) ───────────────
export function deleteAdminProduct(productId) {
  const existing = safeJsonParse(KEYS.ADMIN_PRODUCTS, [])
  const filtered = existing.filter(p => p.id !== productId)
  localStorage.setItem(KEYS.ADMIN_PRODUCTS, JSON.stringify(filtered))
}

// ── Banners ──────────────────────────────────
// Admin banners are ADDED on top of the base JSON banners for each category
export function getBannersForCategory(slug) {
  const adminBanners = safeJsonParse(KEYS.ADMIN_BANNERS, {})
  const base         = bannersBase[slug] || []
  const admin        = adminBanners[slug] || []
  // Admin banners go first (most recent customizations on top)
  return [...admin, ...base]
}

export function saveAdminBanner(slug, banner) {
  const adminBanners = safeJsonParse(KEYS.ADMIN_BANNERS, {})
  if (!adminBanners[slug]) adminBanners[slug] = []
  adminBanners[slug].push(banner)
  localStorage.setItem(KEYS.ADMIN_BANNERS, JSON.stringify(adminBanners))
}

export function deleteAdminBanner(slug, bannerId) {
  const adminBanners = safeJsonParse(KEYS.ADMIN_BANNERS, {})
  if (adminBanners[slug]) {
    adminBanners[slug] = adminBanners[slug].filter(b => b.id !== bannerId)
    localStorage.setItem(KEYS.ADMIN_BANNERS, JSON.stringify(adminBanners))
  }
}

export { categories }
