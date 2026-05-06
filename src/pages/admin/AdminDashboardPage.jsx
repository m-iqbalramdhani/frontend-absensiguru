import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import api from '../../services/api'
import { formatTanggalPanjang, getBulanSekarang } from '../../utils/helpers'

export default function AdminDashboardPage() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalGuru: 0,
    hadirHariIni: 0,
    izinHariIni: 0,
    sakitHariIni: 0,
    alphaHariIni: 0,
    totalAbsensiBulanIni: 0
  })
  const [recentAttendance, setRecentAttendance] = useState([])
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update waktu setiap detik
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Load data saat mount
  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)

      const today = new Date().toISOString().split('T')[0]

      // Load total guru
      const guruRes = await api.get('/api/guru')
      const totalGuru = guruRes.data?.length || 0

      // Load rekap absensi hari ini
      const rekapRes = await api.get(`/api/absensi/rekap?tanggal=${today}`)
      const rekapData = rekapRes.data || {}

      setStats({
        totalGuru: totalGuru,
        hadirHariIni: rekapData.hadir || 0,
        izinHariIni: rekapData.izin || 0,
        sakitHariIni: rekapData.sakit || 0,
        alphaHariIni: rekapData.alpha || 0,
        totalAbsensiBulanIni: rekapData.total || 0
      })
      setRecentAttendance(rekapData.riwayat?.slice(0, 5) || [])
    } catch (error) {
      console.error('[AdminDashboard] Error:', error.response?.status)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'hadir': return '#10b981'
      case 'izin': return '#f59e0b'
      case 'sakit': return '#ef4444'
      case 'alpha': return '#6b7280'
      default: return '#6b7280'
    }
  }

  const getStatusBadge = (status) => {
    const color = getStatusColor(status)
    return (
      <span style={{
        background: `${color}20`,
        color: color,
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: 600,
        textTransform: 'capitalize'
      }}>
        {status}
      </span>
    )
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    })
  }

  return (
    <div style={{ padding: '0' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-container) 100%)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
        marginBottom: '24px',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative circles */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-30px',
          left: '100px',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)',
          pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <p style={{ 
                margin: '0 0 4px', 
                fontSize: '14px', 
                opacity: 0.9,
                fontWeight: 500
              }}>
                {formatTanggalPanjang(new Date())}
              </p>
              <h1 style={{ 
                margin: '0 0 8px', 
                fontSize: '28px', 
                fontWeight: 700,
                lineHeight: 1.2
              }}>
                Selamat Datang, {user?.name || 'Admin'}
              </h1>
              <p style={{ 
                margin: 0, 
                fontSize: '14px', 
                opacity: 0.8 
              }}>
                {getBulanSekarang()} · {formatTime(currentTime)}
              </p>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.15)',
              padding: '12px 20px',
              borderRadius: 'var(--radius-md)',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '4px' }}>
                Total Guru
              </div>
              <div style={{ fontSize: '24px', fontWeight: 700 }}>
                {stats.totalGuru}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '16px',
        marginBottom: '24px'
      }}>
        {/* Hadir */}
        <div style={{
          background: 'var(--color-surface-variant)',
          borderRadius: 'var(--radius-md)',
          padding: '20px',
          border: '1px solid var(--color-outline)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-20px',
            right: '-20px',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'rgba(16, 185, 129, 0.1)',
            pointerEvents: 'none'
          }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: 'var(--radius-md)',
              background: '#10b981',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: '20px' }}>
                check_circle
              </span>
            </div>
            <div style={{ fontSize: '14px', color: 'var(--color-on-surface-variant)', fontWeight: 500 }}>
              Hadir Hari Ini
            </div>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--color-on-surface)', marginBottom: '4px' }}>
            {stats.hadirHariIni}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>
            {Math.round((stats.hadirHariIni / stats.totalGuru) * 100)}% dari total guru
          </div>
        </div>

        {/* Izin */}
        <div style={{
          background: 'var(--color-surface-variant)',
          borderRadius: 'var(--radius-md)',
          padding: '20px',
          border: '1px solid var(--color-outline)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-20px',
            right: '-20px',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'rgba(245, 158, 11, 0.1)',
            pointerEvents: 'none'
          }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: 'var(--radius-md)',
              background: '#f59e0b',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: '20px' }}>
                event_available
              </span>
            </div>
            <div style={{ fontSize: '14px', color: 'var(--color-on-surface-variant)', fontWeight: 500 }}>
              Izin
            </div>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--color-on-surface)', marginBottom: '4px' }}>
            {stats.izinHariIni}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>
            {Math.round((stats.izinHariIni / stats.totalGuru) * 100)}% dari total guru
          </div>
        </div>

        {/* Sakit */}
        <div style={{
          background: 'var(--color-surface-variant)',
          borderRadius: 'var(--radius-md)',
          padding: '20px',
          border: '1px solid var(--color-outline)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-20px',
            right: '-20px',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'rgba(239, 68, 68, 0.1)',
            pointerEvents: 'none'
          }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: 'var(--radius-md)',
              background: '#ef4444',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: '20px' }}>
                sick
              </span>
            </div>
            <div style={{ fontSize: '14px', color: 'var(--color-on-surface-variant)', fontWeight: 500 }}>
              Sakit
            </div>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--color-on-surface)', marginBottom: '4px' }}>
            {stats.sakitHariIni}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>
            {Math.round((stats.sakitHariIni / stats.totalGuru) * 100)}% dari total guru
          </div>
        </div>

        {/* Alpha */}
        <div style={{
          background: 'var(--color-surface-variant)',
          borderRadius: 'var(--radius-md)',
          padding: '20px',
          border: '1px solid var(--color-outline)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-20px',
            right: '-20px',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'rgba(107, 114, 128, 0.1)',
            pointerEvents: 'none'
          }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: 'var(--radius-md)',
              background: '#6b7280',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: '20px' }}>
                cancel
              </span>
            </div>
            <div style={{ fontSize: '14px', color: 'var(--color-on-surface-variant)', fontWeight: 500 }}>
              Alpha
            </div>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--color-on-surface)', marginBottom: '4px' }}>
            {stats.alphaHariIni}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>
            {Math.round((stats.alphaHariIni / stats.totalGuru) * 100)}% dari total guru
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ 
          fontSize: '18px', 
          fontWeight: 600, 
          margin: '0 0 16px 0',
          color: 'var(--color-on-surface)'
        }}>
          Aksi Cepat
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '16px' 
        }}>
          <button
            onClick={() => navigate('/admin/guru')}
            style={{
              background: 'var(--color-surface-variant)',
              border: '1px solid var(--color-outline)',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              textAlign: 'left'
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = 'var(--color-surface)'
              e.currentTarget.style.borderColor = 'var(--color-primary)'
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = 'var(--color-surface-variant)'
              e.currentTarget.style.borderColor = 'var(--color-outline)'
            }}
          >
            <div style={{
              width: '40px', height: '40px', borderRadius: 'var(--radius-md)',
              background: 'var(--color-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: '20px' }}>
                people
              </span>
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-on-surface)' }}>
                Kelola Guru
              </div>
              <div style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>
                Tambah/Edit data guru
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate('/admin/jadwal')}
            style={{
              background: 'var(--color-surface-variant)',
              border: '1px solid var(--color-outline)',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              textAlign: 'left'
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = 'var(--color-surface)'
              e.currentTarget.style.borderColor = 'var(--color-primary)'
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = 'var(--color-surface-variant)'
              e.currentTarget.style.borderColor = 'var(--color-outline)'
            }}
          >
            <div style={{
              width: '40px', height: '40px', borderRadius: 'var(--radius-md)',
              background: '#8b5cf6',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: '20px' }}>
                calendar_month
              </span>
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-on-surface)' }}>
                Kelola Jadwal
              </div>
              <div style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>
                Atur jadwal mengajar
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate('/admin/rekap')}
            style={{
              background: 'var(--color-surface-variant)',
              border: '1px solid var(--color-outline)',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              textAlign: 'left'
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = 'var(--color-surface)'
              e.currentTarget.style.borderColor = 'var(--color-primary)'
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = 'var(--color-surface-variant)'
              e.currentTarget.style.borderColor = 'var(--color-outline)'
            }}
          >
            <div style={{
              width: '40px', height: '40px', borderRadius: 'var(--radius-md)',
              background: '#06b6d4',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: '20px' }}>
                assessment
              </span>
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-on-surface)' }}>
                Rekap Absensi
              </div>
              <div style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>
                Lihat laporan kehadiran
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate('/admin/mapel')}
            style={{
              background: 'var(--color-surface-variant)',
              border: '1px solid var(--color-outline)',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              textAlign: 'left'
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = 'var(--color-surface)'
              e.currentTarget.style.borderColor = 'var(--color-primary)'
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = 'var(--color-surface-variant)'
              e.currentTarget.style.borderColor = 'var(--color-outline)'
            }}
          >
            <div style={{
              width: '40px', height: '40px', borderRadius: 'var(--radius-md)',
              background: '#f97316',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: '20px' }}>
                book
              </span>
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-on-surface)' }}>
                Kelola Mapel
              </div>
              <div style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>
                Atur mata pelajaran
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Attendance */}
      <div>
        <h2 style={{ 
          fontSize: '18px', 
          fontWeight: 600, 
          margin: '0 0 16px 0',
          color: 'var(--color-on-surface)'
        }}>
          Kehadiran Terbaru
        </h2>
        <div style={{
          background: 'var(--color-surface-variant)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-outline)',
          overflow: 'hidden'
        }}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-on-surface-variant)' }}>
              Memuat data...
            </div>
          ) : recentAttendance.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-on-surface-variant)' }}>
              Belum ada data kehadiran hari ini
            </div>
          ) : (
            <div>
              {recentAttendance.map((item, index) => (
                <div
                  key={item.id}
                  style={{
                    padding: '16px 20px',
                    borderBottom: index < recentAttendance.length - 1 ? '1px solid var(--color-outline)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    transition: 'background 0.2s'
                  }}
                  onMouseOver={e => e.currentTarget.style.background = 'var(--color-surface)'}
                  onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                >
                  {/* Avatar */}
                  <div style={{
                    width: '44px', height: '44px',
                    borderRadius: '50%',
                    background: 'var(--color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: '16px',
                    fontWeight: 600
                  }}>
                    {item.nama.charAt(0)}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-on-surface)', marginBottom: '4px' }}>
                      {item.nama}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>
                      {item.mapel} · Kelas {item.kelas}
                    </div>
                  </div>

                  {/* Jam */}
                  <div style={{ fontSize: '14px', color: 'var(--color-on-surface-variant)', minWidth: '60px', textAlign: 'right' }}>
                    {item.jam}
                  </div>

                  {/* Status */}
                  {getStatusBadge(item.status)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}