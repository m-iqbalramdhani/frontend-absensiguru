import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'

export default function ProtectedRoute({ children, role }) {
  const { token, user } = useAuthStore()
  const [isRehydrated, setIsRehydrated] = useState(false)

  console.log('[ProtectedRoute] token:', token?.slice(0, 10), 'user:', user?.name, 'role:', user?.role, 'expected:', role)

  // Tunggu persist storage selesai rehydrate
  useEffect(() => {
    // Zustand persist butuh sedikit waktu untuk load dari localStorage
    const timer = setTimeout(() => {
      console.log('[ProtectedRoute] Rehydrated, token:', token?.slice(0, 10))
      setIsRehydrated(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [token])

  // Loading state saat menunggu rehydrate
  if (!isRehydrated) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: '#f6f3f2'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: '16px' }}>⏳</div>
          <div style={{ color: '#666' }}>Memuat...</div>
        </div>
      </div>
    )
  }

  // Belum login
  if (!token || !user) {
    return <Navigate to="/login" replace />
  }

  // Role tidak sesuai
  if (role && user.role !== role) {
    const redirect = user.role === 'admin' ? '/admin' : '/dashboard'
    return <Navigate to={redirect} replace />
  }

  return children
}