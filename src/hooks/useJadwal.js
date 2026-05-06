import { useState, useEffect } from 'react'
import api from '../services/api'

/* ══════════════════════════════════════
   useJadwal — jadwal mengajar guru
══════════════════════════════════════ */
export default function useJadwal() {
  const [jadwal, setJadwal]     = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      console.log('[useJadwal] Fetching jadwal...')
      const res = await api.get('/api/jadwal/saya')
      console.log('[useJadwal] Response:', res.data)
      setJadwal(res.data || [])
    } catch (e) {
      console.error('[useJadwal] Error:', e.response?.status, e.response?.data)
      setError(e.message || 'Gagal memuat jadwal')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  return { jadwal, loading, error, refetch: load }
}