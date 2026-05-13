import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Home        from './pages/Home'
import NotFound    from './pages/NotFound'
import CategoryPage from './pages/CategoryPage'
import ProductPage  from './pages/ProductPage'
import AdminLogin   from './pages/AdminLogin'
import AdminPanel   from './pages/AdminPanel'
import SearchPage   from './pages/SearchPage'
import ScrollToTop  from './components/ScrollToTop'

function AdminGuard() {
  const { isAdmin, loading } = useAuth()
  if (loading) return <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#FFD700] border-t-transparent rounded-full animate-spin" /></div>
  return isAdmin ? <AdminPanel /> : <Navigate to="/admin/login" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/"                element={<Home />} />
          <Route path="/buscar"          element={<SearchPage />} />
          <Route path="/categoria/:slug" element={<CategoryPage />} />
          <Route path="/producto/:slug"  element={<ProductPage />} />
          <Route path="/admin/login"     element={<AdminLogin />} />
          <Route path="/admin"           element={<AdminGuard />} />
          <Route path="/404"             element={<NotFound />} />
          <Route path="*"               element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
