import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import api from '../../services/api'
import absensiService from '../../services/absensiService'

export default function AbsensiPage() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('absen')
  const [loading, setLoading] = useState(false)
  const [location, setLocation] = useState(null)
  const [locationError, setLocationError] = useState('')
  const [schoolLocation, setSchoolLocation] = useState(null)
  const [todayAttendance, setTodayAttendance] = useState(null)
  const [distance, setDistance] = useState(null)
  const [izinForm, setIzinForm] = useState({ status: 'izin', keterangan: '', tanggal: '' })
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')

  // Load data saat mount
  useEffect(() => {
    loadTodayAttendance()
    loadSchoolLocation()
  }, [])

  const getLocalDate = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const loadTodayAttendance = async () => {
    try {
      const today = getLocalDate()
      const res = await api.get(`/api/absensi/riwayat?tanggal=${today}`)
      setTodayAttendance(res.data?.[0] || null)
    } catch (error) {
      console.error('[Absensi] Error load attendance:', error.response?.status)
    }
  }

  const loadSchoolLocation = async () => {
    try {
      const res = await api.get('/api/absensi/lokasi')
      setSchoolLocation(res.data || null)
    } catch (error) {
      console.error('[Absensi] Error load location:', error.response?.status)
    }
  }

  const getCurrentLocation = () => {
    setLocationError('')
    setMessage('')

    if (!navigator.geolocation) {
      setLocationError('Browser tidak mendukung geolocation')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }
        setLocation(coords)
        
        // Hitung jarak jika lokasi sekolah sudah diketahui
        if (schoolLocation) {
          const dist = calculateDistance(
            coords.latitude,
            coords.longitude,
            schoolLocation.latitude,
            schoolLocation.longitude
          )
          setDistance(dist)
        }
      },
      (error) => {
        setLocationError('Gagal mendapatkan lokasi. Pastikan GPS aktif.')
        console.error('Geolocation error:', error)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    )
  }

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3 // Earth radius in meters
    const φ1 = lat1 * Math.PI / 180
    const φ2 = lat2 * Math.PI / 180
    const Δφ = (lat2 - lat1) * Math.PI / 180
    const Δλ = (lon2 - lon1) * Math.PI / 180

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))

    return R * c // Distance in meters
  }

  const handleAbsenMasuk = async () => {
    if (!location) {
      setLocationError('Silakan deteksi lokasi terlebih dahulu')
      return
    }

    if (!schoolLocation) {
      setMessage('Lokasi sekolah belum dikonfigurasi')
      setMessageType('error')
      return
    }

    // Validasi frontend untuk UI, tapi tidak memblokir (diserahkan ke backend)
    // if (distance > schoolLocation.radius) { ... }

    setLoading(true)
    try {
      await api.post('/api/absensi/masuk', {
        latitude: location.latitude,
        longitude: location.longitude
      })
      setMessage('Absen masuk berhasil!')
      setMessageType('success')
      loadTodayAttendance()
      setLocation(null)
      setDistance(null)
    } catch (error) {
      setMessage(error.response?.data?.message || 'Gagal absen masuk')
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  const handleAbsenPulang = async () => {
    if (!location) {
      setLocationError('Silakan deteksi lokasi terlebih dahulu')
      return
    }

    if (!schoolLocation) {
      setMessage('Lokasi sekolah belum dikonfigurasi')
      setMessageType('error')
      return
    }

    // Validasi frontend untuk UI, tapi tidak memblokir (diserahkan ke backend)
    // if (distance > schoolLocation.radius) { ... }

    setLoading(true)
    try {
      await api.post('/api/absensi/pulang', {
        latitude: location.latitude,
        longitude: location.longitude
      })
      setMessage('Absen pulang berhasil!')
      setMessageType('success')
      loadTodayAttendance()
      setLocation(null)
      setDistance(null)
    } catch (error) {
      setMessage(error.response?.data?.message || 'Gagal absen pulang')
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  const handleIzinSakit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/api/absensi/izin-sakit', {
        ...izinForm,
        tanggal: izinForm.tanggal || getLocalDate()
      })
      setMessage(`Laporan ${izinForm.status} berhasil dicatat`)
      setMessageType('success')
      setIzinForm({ status: 'izin', keterangan: '', tanggal: '' })
      loadTodayAttendance()
    } catch (error) {
      setMessage(error.response?.data?.message || 'Gagal mengirim laporan')
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  const getGradColor = (status) => {
    switch (status) {
      case 'hadir': return 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
      case 'toleransi': return 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
      case 'terlambat': return 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
      case 'izin': return 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
      case 'sakit': return 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'
      default: return 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)'
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'hadir': return 'Hadir'
      case 'toleransi': return 'Toleransi'
      case 'terlambat': return 'Terlambat'
      case 'izin': return 'Izin'
      case 'sakit': return 'Sakit'
      case 'alpha': return 'Alpha'
      default: return status || 'Belum Absen'
    }
  }

  return (
    <div style={{ padding: '0' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ 
          fontSize: '24px', 
          fontWeight: 700, 
          margin: '0 0 8px 0',
          color: 'var(--color-on-surface)'
        }}>
          Absensi
        </h1>
        <p style={{ 
          margin: 0, 
          color: 'var(--color-on-surface-variant)',
          fontSize: '14px'
        }}>
          Catat kehadiran Anda hari ini
        </p>
      </div>

      {/* Status Hari Ini */}
      {todayAttendance && (
        <div style={{
          background: getGradColor(todayAttendance.status),
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          marginBottom: '24px',
          color: '#fff',
          transition: 'all 0.3s'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '4px' }}>Status Hari Ini</div>
              <div style={{ fontSize: '20px', fontWeight: 700, textTransform: 'capitalize' }}>
                {getStatusLabel(todayAttendance.status)}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '32px' }}>
              <div>
                <div style={{ fontSize: '12px', opacity: 0.9 }}>Jam Masuk</div>
                <div style={{ fontSize: '16px', fontWeight: 600 }}>{todayAttendance.jam_masuk || '-'}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', opacity: 0.9 }}>Jam Keluar</div>
                <div style={{ fontSize: '16px', fontWeight: 600 }}>{todayAttendance.jam_keluar || '-'}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: '8px', 
        marginBottom: '24px',
        borderBottom: '1px solid var(--color-outline)',
        paddingBottom: '0'
      }}>
        <button
          onClick={() => setActiveTab('absen')}
          style={{
            padding: '12px 24px',
            background: activeTab === 'absen' ? 'var(--color-primary)' : 'transparent',
            color: activeTab === 'absen' ? '#fff' : 'var(--color-on-surface-variant)',
            border: 'none',
            borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          Absen Masuk/Pulang
        </button>
        <button
          onClick={() => setActiveTab('izin-sakit')}
          style={{
            padding: '12px 24px',
            background: activeTab === 'izin-sakit' ? 'var(--color-primary)' : 'transparent',
            color: activeTab === 'izin-sakit' ? '#fff' : 'var(--color-on-surface-variant)',
            border: 'none',
            borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          Lapor Izin/Sakit
        </button>
      </div>

      {/* Message */}
      {message && (
        <div style={{
          background: messageType === 'success' ? '#d1fae5' : '#fee2e2',
          border: `1px solid ${messageType === 'success' ? '#10b981' : '#ef4444'}`,
          borderRadius: 'var(--radius-md)',
          padding: '12px 16px',
          marginBottom: '20px',
          color: messageType === 'success' ? '#065f46' : '#991b1b',
          fontSize: '14px'
        }}>
          {message}
        </div>
      )}

      {/* Tab Content */}
      {activeTab === 'absen' ? (
        <div>
          {/* Step Instructions */}
          <div style={{
            background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-container) 100%)',
            borderRadius: 'var(--radius-lg)',
            padding: '20px',
            marginBottom: '24px',
            color: '#fff'
          }}>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: 600, 
              margin: '0 0 12px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
                info
              </span>
              Cara Menggunakan Absensi
            </h3>
            <ol style={{ 
              margin: 0, 
              paddingLeft: '20px',
              fontSize: '14px',
              lineHeight: '1.8'
            }}>
              <li>Klik tombol <strong>"Deteksi Lokasi Saya"</strong> di bawah</li>
              <li>Tunggu sampai lokasi terdeteksi dan jarak dari sekolah muncul</li>
              <li>Pastikan jarak <strong>dalam radius</strong> sekolah</li>
              <li>Klik <strong>"Absen Masuk"</strong> saat tiba di sekolah</li>
              <li>Klik <strong>"Absen Pulang"</strong> saat pulang dari sekolah</li>
            </ol>
          </div>

          {/* Step 1: Location Detection */}
          <div style={{
            background: 'var(--color-surface-variant)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            marginBottom: '24px',
            border: '1px solid var(--color-outline)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Step Number Badge */}
            <div style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: location ? '#10b981' : 'var(--color-primary)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              fontWeight: 700
            }}>
              {location ? '✓' : '1'}
            </div>

            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: 600, 
              margin: '0 0 8px 0',
              color: 'var(--color-on-surface)',
              paddingRight: '48px'
            }}>
              Deteksi Lokasi
            </h3>
            <p style={{ 
              margin: '0 0 20px', 
              color: 'var(--color-on-surface-variant)',
              fontSize: '14px'
            }}>
              Klik tombol di bawah untuk mendeteksi lokasi Anda saat ini
            </p>
            
            <button
              onClick={getCurrentLocation}
              disabled={loading || location}
              style={{
                background: loading || location ? 'var(--color-surface-variant)' : 'var(--color-primary)',
                color: loading || location ? 'var(--color-on-surface-variant)' : '#fff',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                padding: '16px 32px',
                fontSize: '16px',
                fontWeight: 600,
                cursor: loading || location ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'all 0.2s',
                width: '100%',
                justifyContent: 'center'
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
                {location ? 'check_circle' : 'location_on'}
              </span>
              {loading ? 'Mendeteksi...' : location ? 'Lokasi Terdeteksi ✓' : 'Deteksi Lokasi Saya'}
            </button>

            {locationError && (
              <div style={{
                marginTop: '16px',
                padding: '16px',
                background: '#fee2e2',
                border: '1px solid #ef4444',
                borderRadius: 'var(--radius-md)',
                color: '#991b1b',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                  error
                </span>
                {locationError}
              </div>
            )}

            {location && (
              <div style={{ marginTop: '20px', padding: '16px', background: '#d1fae5', borderRadius: 'var(--radius-md)', border: '1px solid #10b981' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#065f46', fontSize: '16px', fontWeight: 600 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                    check_circle
                  </span>
                  Lokasi Berhasil Terdeteksi!
                </div>
                
                {distance !== null && schoolLocation && (
                  <div style={{
                    marginTop: '12px',
                    padding: '12px',
                    background: distance <= schoolLocation.radius ? '#ecfdf5' : '#fef2f2',
                    border: `2px solid ${distance <= schoolLocation.radius ? '#10b981' : '#ef4444'}`,
                    borderRadius: 'var(--radius-md)',
                    color: distance <= schoolLocation.radius ? '#065f46' : '#991b1b',
                    fontSize: '15px',
                    fontWeight: 600
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
                        {distance <= schoolLocation.radius ? 'location_on' : 'location_off'}
                      </span>
                      <div>
                        Jarak dari sekolah: <strong>{Math.round(distance)} meter</strong>
                        <div style={{ fontSize: '13px', fontWeight: 400, marginTop: '4px' }}>
                          {distance <= schoolLocation.radius ? (
                            <span>✅ Anda berada dalam radius sekolah (maks: {schoolLocation.radius}m)</span>
                          ) : (
                            <span>❌ Anda di luar radius sekolah (maks: {schoolLocation.radius}m). Dekatkan ke sekolah!</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Step 2: Attendance Actions */}
          <div style={{
            background: location ? 'var(--color-surface-variant)' : '#f3f4f6',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            border: location ? '1px solid var(--color-outline)' : '1px dashed var(--color-outline)',
            opacity: location ? 1 : 0.6,
            transition: 'all 0.3s'
          }}>
            {/* Step Number Badge */}
            <div style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: location ? 'var(--color-primary)' : '#9ca3af',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              fontWeight: 700
            }}>
              2
            </div>

            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: 600, 
              margin: '0 0 8px 0',
              color: 'var(--color-on-surface)',
              paddingRight: '48px'
            }}>
              Lakukan Absensi
            </h3>
            <p style={{ 
              margin: '0 0 20px', 
              color: 'var(--color-on-surface-variant)',
              fontSize: '14px'
            }}>
              {location ? 'Pilih jenis absensi yang ingin Anda lakukan' : 'lakukan deteksi lokasi terlebih dahulu'}
            </p>

            {!location && (
              <div style={{
                padding: '16px',
                background: '#fff3cd',
                border: '1px solid #ffc107',
                borderRadius: 'var(--radius-md)',
                color: '#856404',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '16px'
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                  warning
                </span>
                Silakan deteksi lokasi terlebih dahulu sebelum melakukan absensi
              </div>
            )}

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
              gap: '16px' 
            }}>
              <button
                onClick={handleAbsenMasuk}
                disabled={loading || !location || (todayAttendance && todayAttendance.jam_masuk)}
                style={{
                  background: !location || (todayAttendance && todayAttendance.jam_masuk) ? 'var(--color-surface)' : '#10b981',
                  color: !location || (todayAttendance && todayAttendance.jam_masuk) ? 'var(--color-on-surface-variant)' : '#fff',
                  border: !location || (todayAttendance && todayAttendance.jam_masuk) ? '1px solid var(--color-outline)' : '2px solid #10b981',
                  borderRadius: 'var(--radius-lg)',
                  padding: '24px',
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: loading || !location || (todayAttendance && todayAttendance.jam_masuk) ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'all 0.2s',
                  boxShadow: location && !(todayAttendance && todayAttendance.jam_masuk) ? '0 4px 12px rgba(16, 185, 129, 0.3)' : 'none'
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '48px' }}>
                  login
                </span>
                <div>
                  <div>Absen Masuk</div>
                  <div style={{ fontSize: '12px', fontWeight: 400, marginTop: '4px', opacity: 0.8 }}>
                    Saat tiba di sekolah
                  </div>
                </div>
              </button>

              <button
                onClick={handleAbsenPulang}
                disabled={loading || !location || !todayAttendance || !todayAttendance.jam_masuk || todayAttendance.jam_keluar}
                style={{
                  background: !location || !todayAttendance || !todayAttendance.jam_masuk || todayAttendance.jam_keluar ? 'var(--color-surface)' : '#f59e0b',
                  color: !location || !todayAttendance || !todayAttendance.jam_masuk || todayAttendance.jam_keluar ? 'var(--color-on-surface-variant)' : '#fff',
                  border: !location || !todayAttendance || !todayAttendance.jam_masuk || todayAttendance.jam_keluar ? '1px solid var(--color-outline)' : '2px solid #f59e0b',
                  borderRadius: 'var(--radius-lg)',
                  padding: '24px',
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: loading || !location || !todayAttendance || !todayAttendance.jam_masuk || todayAttendance.jam_keluar ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'all 0.2s',
                  boxShadow: location && todayAttendance && todayAttendance.jam_masuk && !todayAttendance.jam_keluar ? '0 4px 12px rgba(245, 158, 11, 0.3)' : 'none'
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '48px' }}>
                  logout
                </span>
                <div>
                  <div>Absen Pulang</div>
                  <div style={{ fontSize: '12px', fontWeight: 400, marginTop: '4px', opacity: 0.8 }}>
                    Saat pulang dari sekolah
                  </div>
                </div>
              </button>
            </div>

            {todayAttendance && todayAttendance.jam_masuk && (
              <div style={{
                marginTop: '16px',
                padding: '12px',
                background: '#dbeafe',
                border: '1px solid #3b82f6',
                borderRadius: 'var(--radius-md)',
                color: '#1e40af',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                  info
                </span>
                Anda sudah absen masuk pada jam {todayAttendance.jam_masuk}
              </div>
            )}

            {todayAttendance && todayAttendance.jam_keluar && (
              <div style={{
                marginTop: '16px',
                padding: '12px',
                background: '#d1fae5',
                border: '1px solid #10b981',
                borderRadius: 'var(--radius-md)',
                color: '#065f46',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                  check_circle
                </span>
                Anda sudah absen pulang pada jam {todayAttendance.jam_keluar}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <form onSubmit={handleIzinSakit} style={{ 
            background: 'var(--color-surface-variant)',
            borderRadius: 'var(--radius-md)',
            padding: '24px',
            border: '1px solid var(--color-outline)'
          }}>
            <h3 style={{ 
              fontSize: '16px', 
              fontWeight: 600, 
              margin: '0 0 20px 0',
              color: 'var(--color-on-surface)'
            }}>
              Form Lapor Izin/Sakit
            </h3>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                color: 'var(--color-on-surface)',
                fontSize: '14px',
                fontWeight: 500
              }}>
                Jenis
              </label>
              <select
                value={izinForm.status}
                onChange={(e) => setIzinForm(prev => ({ ...prev, status: e.target.value }))}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid var(--color-outline)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '14px',
                  background: 'var(--color-surface)',
                  color: 'var(--color-on-surface)',
                  boxSizing: 'border-box'
                }}
              >
                <option value="izin">Izin</option>
                <option value="sakit">Sakit</option>
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                color: 'var(--color-on-surface)',
                fontSize: '14px',
                fontWeight: 500
              }}>
                Tanggal
              </label>
              <input
                type="date"
                value={izinForm.tanggal}
                onChange={(e) => setIzinForm(prev => ({ ...prev, tanggal: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid var(--color-outline)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '14px',
                  background: 'var(--color-surface)',
                  color: 'var(--color-on-surface)',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                color: 'var(--color-on-surface)',
                fontSize: '14px',
                fontWeight: 500
              }}>
                Keterangan
              </label>
              <textarea
                value={izinForm.keterangan}
                onChange={(e) => setIzinForm(prev => ({ ...prev, keterangan: e.target.value }))}
                placeholder="Jelaskan alasan izin/sakit..."
                rows={4}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid var(--color-outline)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '14px',
                  background: 'var(--color-surface)',
                  color: 'var(--color-on-surface)',
                  boxSizing: 'border-box',
                  resize: 'vertical'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                background: loading ? 'var(--color-surface-variant)' : 'var(--color-primary)',
                color: loading ? 'var(--color-on-surface-variant)' : '#fff',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                padding: '14px 24px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                width: '100%',
                transition: 'all 0.2s'
              }}
            >
              {loading ? 'Mengirim...' : 'Kirim Laporan'}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}