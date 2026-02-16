import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEffect } from 'react'

export default function ProtectedRoute() {
  const { user, loading, openAuthModal } = useAuth()
  const location = useLocation()

  useEffect(() => {
    if (!loading && !user) {
      openAuthModal('signin')
    }
  }, [loading, user])

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="w-8 h-8 border-2 border-gray-200 border-t-black rounded-full animate-spin" />
          <p className="text-xs uppercase tracking-[0.2em] text-gray-400 font-bold">Loading</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />
  }

  return <Outlet />
}
