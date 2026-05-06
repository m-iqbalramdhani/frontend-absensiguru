import { useState, useEffect, useCallback } from 'react'
import absensiService from '../services/absensiService'

/* ══════════════════════════════════════
   useAbsensi — hook untuk halaman absensi guru
   Mengelola:
   • Status absensi hari ini
   • Ambil koordinat GPS dari browser
   • Submit absen masuk / pulang
   • Lapor izin / sakit
══════════════════════════════════════ */
export default function useAbsensi() {
  const [absensiHariIni, setAbsensi]  = useState(null)
  const [loading, setLoading]         = useState(true)
  const [submitting, setSubmitting]   = useState(false)
  const [gpsLoading, setGpsLoading]   = useState(false)
  const [koordinat, setKoordinat]     = useState(null)
  const [gpsError, setGpsError]       = useState('')
  const [error, setError]             = useState('')
  const [successMsg, setSuccessMsg]   = useState('')

  // Muat status absensi hari ini
  const loadStatus = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data   = await absensiService.getRiwayat()
      const today = new Date().toISOString().split('T')[0]
      const list  = data || []
      const hariIni = list.find(a => a.tanggal?.startsWith(today)) || null
      setAbsensi(hariIni)
    } catch (e) {
      setError(e.message || 'Gagal memuat status absensi')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadStatus() }, [loadStatus])

  // Ambil koordinat GPS dari browser
  const getGPS = useCallback(() => {
    setGpsError('')
    setGpsLoading(true)

    if (!navigator.geolocation) {
      setGpsError('Browser tidak mendukung GPS')
      setGpsLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setKoordinat({
          latitude:  pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy:  Math.round(pos.coords.accuracy),
        })
        setGpsLoading(false)
      },
      (err) => {
        const msg =
          err.code === 1 ? 'Izin lokasi ditolak. Aktifkan GPS di browser.' :
          err.code === 2 ? 'Posisi tidak tersedia. Coba lagi.' :
          'Waktu GPS habis. Coba lagi.'
        setGpsError(msg)
        setGpsLoading(false)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    )
  }, [])

  // Submit absen masuk
  const handleAbsenMasuk = async () => {
    if (!koordinat) { setGpsError('Ambil lokasi GPS terlebih dahulu'); return }
    setSubmitting(true)
    setError('')
    setSuccessMsg('')
    try {
      const res = await absensiService.absenMasuk({
        latitude:  koordinat.latitude,
        longitude: koordinat.longitude,
      })
      setSuccessMsg(res.message || 'Absen masuk berhasil dicatat ✅')
      await loadStatus()
    } catch (e) {
      setError(e.message || 'Absen masuk gagal')
    } finally {
      setSubmitting(false)
    }
  }

  // Submit absen pulang
  const handleAbsenPulang = async () => {
    if (!koordinat) { setGpsError('Ambil lokasi GPS terlebih dahulu'); return }
    setSubmitting(true)
    setError('')
    setSuccessMsg('')
    try {
      const res = await absensiService.absenPulang({
        latitude:  koordinat.latitude,
        longitude: koordinat.longitude,
      })
      setSuccessMsg(res.message || 'Absen pulang berhasil dicatat ✅')
      await loadStatus()
    } catch (e) {
      setError(e.message || 'Absen pulang gagal')
    } finally {
      setSubmitting(false)
    }
  }

  // Submit izin / sakit
  const handleIzinSakit = async ({ status, keterangan, tanggal }) => {
    setSubmitting(true)
    setError('')
    setSuccessMsg('')
    try {
      const res = await absensiService.laporIzinSakit({ status, keterangan, tanggal })
      setSuccessMsg(res.message || `Laporan ${status} berhasil dicatat ✅`)
      await loadStatus()
    } catch (e) {
      setError(e.message || 'Gagal menyimpan laporan')
    } finally {
      setSubmitting(false)
    }
  }

  return {
    absensiHariIni,
    loading,
    submitting,
    gpsLoading,
    koordinat,
    gpsError,
    error,
    successMsg,
    getGPS,
    handleAbsenMasuk,
    handleAbsenPulang,
    handleIzinSakit,
    clearMessages: () => { setError(''); setSuccessMsg('') },
  }
}