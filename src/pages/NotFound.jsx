import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 text-center">
      <h1 className="mb-2 text-5xl font-extrabold text-zinc-900">404</h1>
      <p className="mb-6 text-zinc-600">Página no encontrada</p>
      <Link
        to="/"
        className="rounded-md bg-brand-red px-4 py-2 font-semibold text-white hover:bg-red-700"
      >
        Volver al inicio
      </Link>
    </div>
  )
}
