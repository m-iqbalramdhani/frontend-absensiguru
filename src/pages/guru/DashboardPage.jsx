import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import api from '../../services/api'
import useJadwal from '../../hooks/useJadwal'

export default function DashboardPage() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const { jadwal, loading: jadwalLoading } = useJadwal()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [loading, setLoading] = useState(true)
  const [attendanceStats, setAttendanceStats] = useState({
    hadir: 0,
    izin: 0,
    sakit: 0,
    alpha: 0,
    total: 0
  })
  const [todayAttendance, setTodayAttendance] = useState(null)

  // Update waktu setiap detik
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Load data dashboard
  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)

      // Test 1: Panggil endpoint sederhana
      const today = new Date().toISOString().split('T')[0]
      console.log('[Dashboard] Fetching riwayat for date:', today)

      const attendanceRes = await api.get(`/api/absensi/riwayat?tanggal=${today}`)
      console.log('[Dashboard] Riwayat response:', attendanceRes.data)
      setTodayAttendance(attendanceRes.data?.[0] || null)

      // Test 2: Rekap bulanan
      const now = new Date()
      const statsRes = await api.get(`/api/absensi/rekap-saya?bulan=${now.getMonth() + 1}&tahun=${now.getFullYear()}`)
      console.log('[Dashboard] Rekap response:', statsRes.data)
      if (statsRes.data?.summary) {
        setAttendanceStats(statsRes.data.summary)
      }

    } catch (error) {
      console.error('[Dashboard] Error:', error.response?.status, error.response?.data)
      // Default data kosong jika error
      setTodayAttendance(null)
      setAttendanceStats({ hadir: 0, izin: 0, sakit: 0, alpha: 0, total: 0 })
    } finally {
      setLoading(false)
    }
  }

  const handleAbsen = () => {
    navigate('/absensi')
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    })
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('id-ID', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  if (loading || jadwalLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', marginBottom: '16px' }}>⏳</div>
          <div style={{ color: 'var(--color-on-surface-variant)' }}>Memuat data...</div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '0' }}>
      {/* Header Dashboard */}
      <div style={{
        marginBottom: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: 700, 
            margin: '0 0 8px 0',
            color: 'var(--color-on-surface)'
          }}>
            Selamat Datang, {user?.name || 'Guru'} 👋
          </h1>
          <p style={{ 
            margin: 0, 
            color: 'var(--color-on-surface-variant)',
            fontSize: '14px'
          }}>
            {formatDate(currentTime)}
          </p>
        </div>

        {/* Tombol Absen Cepat */}
        <button
          onClick={handleAbsen}
          style={{
            background: 'var(--color-primary)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            padding: '12px 24px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
          }}
          onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
            {todayAttendance?.jam_keluar ? 'check_circle' : 'fingerprint'}
          </span>
          {todayAttendance?.jam_keluar ? 'Sudah Absen' : 'Absen Sekarang'}
        </button>
      </div>

      {/* Status Kehadiran Hari Ini */}
      {todayAttendance && (
        <div style={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          marginBottom: '24px',
          color: '#fff'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '4px' }}>Status Hari Ini</div>
              <div style={{ fontSize: '20px', fontWeight: 700 }}>
                {todayAttendance.status === 'hadir' ? 'Hadir' : todayAttendance.status}
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

      {/* Statistik Kehadiran Bulan Ini */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ 
          fontSize: '18px', 
          fontWeight: 600, 
          margin: '0 0 16px 0',
          color: 'var(--color-on-surface)'
        }}>
          Ringkasan Kehadiran Bulan Ini
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '16px' 
        }}>
          {/* Hadir */}
          <div style={{
            background: 'var(--color-surface-variant)',
            borderRadius: 'var(--radius-md)',
            padding: '20px',
            border: '1px solid var(--color-outline)',
          }}>
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
              <div>
                <div style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>Hadir</div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-on-surface)' }}>
                  {attendanceStats.hadir}
                </div>
              </div>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>
              {attendanceStats.total > 0 ? Math.round((attendanceStats.hadir / attendanceStats.total) * 100) : 0}% dari total
            </div>
          </div>

          {/* Izin */}
          <div style={{
            background: 'var(--color-surface-variant)',
            borderRadius: 'var(--radius-md)',
            padding: '20px',
            border: '1px solid var(--color-outline)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: 'var(--radius-md)',
                background: '#f59e0b',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: '20px' }}>
                  event_busy
                </span>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>Izin</div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-on-surface)' }}>
                  {attendanceStats.izin}
                </div>
              </div>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>
              {attendanceStats.total > 0 ? Math.round((attendanceStats.izin / attendanceStats.total) * 100) : 0}% dari total
            </div>
          </div>

          {/* Sakit */}
          <div style={{
            background: 'var(--color-surface-variant)',
            borderRadius: 'var(--radius-md)',
            padding: '20px',
            border: '1px solid var(--color-outline)',
          }}>
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
              <div>
                <div style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>Sakit</div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-on-surface)' }}>
                  {attendanceStats.sakit}
                </div>
              </div>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>
              {attendanceStats.total > 0 ? Math.round((attendanceStats.sakit / attendanceStats.total) * 100) : 0}% dari total
            </div>
          </div>

          {/* Alpha */}
          <div style={{
            background: 'var(--color-surface-variant)',
            borderRadius: 'var(--radius-md)',
            padding: '20px',
            border: '1px solid var(--color-outline)',
          }}>
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
              <div>
                <div style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>Alpha</div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-on-surface)' }}>
                  {attendanceStats.alpha}
                </div>
              </div>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>
              {attendanceStats.total > 0 ? Math.round((attendanceStats.alpha / attendanceStats.total) * 100) : 0}% dari total
            </div>
          </div>
        </div>
      </div>

      {/* Jadwal Hari Ini */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ 
          fontSize: '18px', 
          fontWeight: 600, 
          margin: '0 0 16px 0',
          color: 'var(--color-on-surface)'
        }}>
          Jadwal Mengajar Hari Ini
        </h2>
        <div style={{
          background: 'var(--color-surface-variant)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-outline)',
          overflow: 'hidden'
        }}>
          {jadwal.length > 0 ? (
            jadwal.map((schedule) => (
              <div
                key={schedule.id}
                style={{
                  padding: '16px 20px',
                  borderBottom: '1px solid var(--color-outline)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'background 0.2s'
                }}
                onMouseOver={e => e.currentTarget.style.background = 'var(--color-surface)'}
                onMouseOut={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: 'var(--radius-md)',
                    background: 'var(--color-primary-container)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: '24px' }}>
                      class
                    </span>
                  </div>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-on-surface)' }}>
                      {schedule.mapel}
                    </div>
                    <div style={{ fontSize: '14px', color: 'var(--color-on-surface-variant)' }}>
                      Kelas {schedule.kelas} • Ruang {schedule.ruang}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-on-surface)' }}>
                    {schedule.jam}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-on-surface-variant)' }}>
              Tidak ada jadwal mengajar hari ini
            </div>
          )}
        </div>
      </div>

      {/* Waktu Server & Status Sistem */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '16px'
      }}>
        {/* Waktu Server */}
        <div style={{
          background: 'var(--color-surface-variant)',
          borderRadius: 'var(--radius-md)',
          padding: '20px',
          border: '1px solid var(--color-outline)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '24px', color: 'var(--color-primary)' }}>
              schedule
            </span>
            <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-on-surface)' }}>
              Waktu Server
            </div>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 700, color: 'var(--color-on-surface)', marginBottom: '8px' }}>
            {formatTime(currentTime)}
          </div>
          <div style={{ fontSize: '14px', color: 'var(--color-on-surface-variant)' }}>
            {formatDate(currentTime)}
          </div>
        </div>

        {/* Status Sistem */}
        <div style={{
          background: 'var(--color-surface-variant)',
          borderRadius: 'var(--radius-md)',
          padding: '20px',
          border: '1px solid var(--color-outline)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '24px', color: '#10b981' }}>
              check_circle
            </span>
            <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-on-surface)' }}>
              Status Sistem
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', color: 'var(--color-on-surface-variant)' }}>Database</span>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#10b981' }}>Terhubung</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', color: 'var(--color-on-surface-variant)' }}>API Server</span>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#10b981' }}>Online</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}