import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import authService from '../services/authService'
import useAuthStore from '../store/authStore'

/**
 * useLogin — custom hook untuk proses login
 *
 * Returns:
 *  { form, errors, loading, handleChange, handleSubmit }
 */
export default function useLogin() {
  const navigate   = useNavigate()
  const { setAuth } = useAuthStore()

  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  // Update field form
  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
    // Hapus error field saat user mulai mengetik
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
    if (serverError) setServerError('')
  }

  // Validasi client-side sebelum kirim ke API
  const validate = () => {
    const newErrors = {}

    if (!form.email.trim()) {
      newErrors.email = 'Email wajib diisi'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Format email tidak valid'
    }

    if (!form.password) {
      newErrors.password = 'Password wajib diisi'
    } else if (form.password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Submit login
  const handleSubmit = async (e) => {
    e?.preventDefault()
    if (!validate()) return

    setLoading(true)
    setServerError('')

    try {
      const res = await authService.login(form)
      const { token, user } = res

      // Simpan ke Zustand store (otomatis persist ke localStorage)
      setAuth(user, token)
      console.log('[Login] Auth set:', { user, token: token?.slice(0, 10) + '...' })

      // Tunggu Zustand persist selesai simpan ke localStorage
      await new Promise(resolve => setTimeout(resolve, 300))

      // Redirect sesuai role
      if (user.role === 'admin') {
        console.log('[Login] Navigating to /admin')
        navigate('/admin', { replace: true })
      } else {
        console.log('[Login] Navigating to /dashboard')
        navigate('/dashboard', { replace: true })
      }

    } catch (err) {
      const msg = err?.response?.data?.message
      if (msg === 'Email atau password salah') {
        setServerError('Email atau password yang Anda masukkan salah')
      } else if (err?.response?.status === 429) {
        setServerError('Terlalu banyak percobaan login. Coba lagi nanti.')
      } else if (!err?.response) {
        setServerError('Tidak dapat terhubung ke server. Periksa koneksi Anda.')
      } else {
        setServerError(msg || 'Terjadi kesalahan. Silakan coba lagi.')
      }
    } finally {
      setLoading(false)
    }
  }

  return {
    form,
    errors,
    loading,
    serverError,
    handleChange,
    handleSubmit,
  }
}