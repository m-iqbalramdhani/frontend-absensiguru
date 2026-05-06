import { useState, useEffect, useCallback } from 'react'
import absensiService from '../services/absensiService'
import { getBulanSekarang, getTahunSekarang } from '../utils/helpers'

/* ══════════════════════════════════════
   useRiwayat — hook untuk halaman riwayat absensi guru
══════════════════════════════════════ */
export default function useRiwayat() {
  const [riwayat, setRiwayat]     = useState([])
  const [rekap, setRekap]         = useState(null)
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState('')

  const [bulan, setBulan]         = useState(String(getBulanSekarang()))
  const [tahun, setTahun]         = useState(String(getTahunSekarang()))

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [riwayatData, rekapData] = await Promise.all([
        absensiService.getRiwayat(),
        absensiService.getRekapSaya(bulan, tahun),
      ])
      setRiwayat(riwayatData || [])
      setRekap(rekapData?.summary || null)
    } catch (e) {
      setError(e.message || 'Gagal memuat riwayat absensi')
    } finally {
      setLoading(false)
    }
  }, [bulan, tahun])

  useEffect(() => { load() }, [load])

  return {
    riwayat, rekap, loading, error,
    bulan, setBulan,
    tahun, setTahun,
    refetch: load,
  }
}