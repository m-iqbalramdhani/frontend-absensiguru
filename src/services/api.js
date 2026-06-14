import axios from 'axios'
import useAuthStore from '../store/authStore'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://absensiguru-ufj09qpq.b4a.run',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// ── Request Interceptor — tambahkan token ke header ──
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ── Response Interceptor — handle error global & 401 logout ──
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status

    // Hanya logout saat token benar-benar invalid (401 Unauthorized)
    // Bukan saat endpoint tidak ada (404) atau server error (500)
    if (status === 401) {
      const errorMessage = error?.response?.data?.message || ''
      // Cek apakah error karena token expired/invalid
      const isTokenError = errorMessage.toLowerCase().includes('token') ||
                          errorMessage.toLowerCase().includes('unauthorized') ||
                          errorMessage.toLowerCase().includes('tidak memiliki akses')

      if (isTokenError) {
        try {
          useAuthStore.getState().logout()
          localStorage.removeItem('smk-auth')
        } catch {}
        window.location.href = '/login'
      }
      return Promise.reject(error)
    }

    // Normalize error message agar mudah ditangkap di catch block
    const message =
      error?.response?.data?.message ||
      (status === 403 ? 'Akses ditolak'          :
       status === 404 ? 'Data tidak ditemukan'    :
       status === 409 ? 'Data sudah ada / konflik':
       status === 422 ? 'Data tidak valid'        :
       status === 429 ? 'Terlalu banyak permintaan, coba lagi nanti' :
       status >= 500  ? 'Terjadi kesalahan pada server' :
       !error.response ? 'Tidak dapat terhubung ke server' :
       'Terjadi kesalahan')

    error.message = message
    return Promise.reject(error)
  }
);

export default api