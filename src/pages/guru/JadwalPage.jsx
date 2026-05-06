import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import api from '../../services/api'

export default function JadwalPage() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [schedule, setSchedule] = useState([])
  const [selectedDay, setSelectedDay] = useState(new Date().getDay())
  const [viewMode, setViewMode] = useState('daily') // 'daily' or 'weekly'

  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']

  // Load data saat mount
  useEffect(() => {
    loadSchedule()
  }, [selectedDay])

  const loadSchedule = async () => {
    try {
      setLoading(true)
      // Mock data untuk sekarang - nanti diganti dengan API
      const mockSchedule = [
        { id: 1, hari: 'Senin', mapel: 'Matematika', kelas: 'X-A', jam: '07:00 - 08:30', ruang: 'R-101', guru: 'Budi Santoso' },
        { id: 2, hari: 'Senin', mapel: 'Matematika', kelas: 'X-B', jam: '09:00 - 10:30', ruang: 'R-102', guru: 'Budi Santoso' },
        { id: 3, hari: 'Selasa', mapel: 'Fisika', kelas: 'XI-A', jam: '07:00 - 08:30', ruang: 'Lab-1', guru: 'Budi Santoso' },
        { id: 4, hari: 'Selasa', mapel: 'Fisika', kelas: 'XI-B', jam: '09:00 - 10:30', ruang: 'Lab-1', guru: 'Budi Santoso' },
        { id: 5, hari: 'Rabu', mapel: 'Kimia', kelas: 'XII-A', jam: '07:00 - 08:30', ruang: 'Lab-2', guru: 'Budi Santoso' },
        { id: 6, hari: 'Rabu', mapel: 'Kimia', kelas: 'XII-B', jam: '09:00 - 10:30', ruang: 'Lab-2', guru: 'Budi Santoso' },
        { id: 7, hari: 'Kamis', mapel: 'Matematika', kelas: 'X-C', jam: '07:00 - 08:30', ruang: 'R-103', guru: 'Budi Santoso' },
        { id: 8, hari: 'Jumat', mapel: 'Fisika', kelas: 'X-A', jam: '07:00 - 08:30', ruang: 'Lab-1', guru: 'Budi Santoso' },
      ]
      
      // Filter berdasarkan hari yang dipilih
      const filteredSchedule = mockSchedule.filter(item => {
        const dayIndex = days.indexOf(item.hari)
        return dayIndex === selectedDay
      })
      
      setSchedule(filteredSchedule)
    } catch (error) {
      console.error('Error loading schedule:', error)
    } finally {
      setLoading(false)
    }
  }

  const getSubjectColor = (mapel) => {
    const colors = {
      'Matematika': '#3b82f6',
      'Fisika': '#8b5cf6',
      'Kimia': '#10b981',
      'Biologi': '#ef4444',
      'Bahasa Indonesia': '#f59e0b',
      'Bahasa Inggris': '#06b6d4',
      'Sejarah': '#6b7280',
      'Geografi': '#84cc16',
      'Ekonomi': '#f97316',
      'Sosiologi': '#ec4899'
    }
    return colors[mapel] || '#6b7280'
  }

  const isToday = (dayIndex) => {
    return dayIndex === new Date().getDay()
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
          Jadwal Mengajar
        </h1>
        <p style={{ 
          margin: 0, 
          color: 'var(--color-on-surface-variant)',
          fontSize: '14px'
        }}>
          Lihat jadwal mengajar Anda
        </p>
      </div>

      {/* Day Selector */}
      <div style={{
        background: 'var(--color-surface-variant)',
        borderRadius: 'var(--radius-md)',
        padding: '16px',
        marginBottom: '24px',
        border: '1px solid var(--color-outline)'
      }}>
        <div style={{ 
          display: 'flex', 
          gap: '8px', 
          overflowX: 'auto',
          paddingBottom: '4px'
        }}>
          {days.map((day, index) => (
            <button
              key={index}
              onClick={() => setSelectedDay(index)}
              style={{
                padding: '12px 20px',
                background: selectedDay === index 
                  ? 'var(--color-primary)' 
                  : isToday(index) 
                    ? 'var(--color-primary-container)' 
                    : 'transparent',
                color: selectedDay === index 
                  ? '#fff' 
                  : isToday(index) 
                    ? 'var(--color-primary)' 
                    : 'var(--color-on-surface-variant)',
                border: selectedDay === index 
                  ? 'none' 
                  : isToday(index) 
                    ? '1px solid var(--color-primary)' 
                    : '1px solid var(--color-outline)',
                borderRadius: 'var(--radius-md)',
                fontSize: '14px',
                fontWeight: selectedDay === index || isToday(index) ? 600 : 400,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
                minWidth: '80px'
              }}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Schedule List */}
      <div style={{
        background: 'var(--color-surface-variant)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-outline)',
        overflow: 'hidden'
      }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-on-surface-variant)' }}>
            Memuat jadwal...
          </div>
        ) : schedule.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-on-surface-variant)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '48px', marginBottom: '16px', display: 'block' }}>
              event_busy
            </span>
            <div style={{ fontSize: '16px', marginBottom: '8px' }}>
              Tidak ada jadwal mengajar
            </div>
            <div style={{ fontSize: '14px' }}>
              {days[selectedDay]} ini Anda libur
            </div>
          </div>
        ) : (
          <div>
            {schedule.map((item, index) => (
              <div
                key={item.id}
                style={{
                  padding: '20px',
                  borderBottom: index < schedule.length - 1 ? '1px solid var(--color-outline)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  transition: 'background 0.2s'
                }}
                onMouseOver={e => e.currentTarget.style.background = 'var(--color-surface)'}
                onMouseOut={e => e.currentTarget.style.background = 'transparent'}
              >
                {/* Time */}
                <div style={{ 
                  minWidth: '120px',
                  textAlign: 'center',
                  padding: '12px',
                  background: 'var(--color-surface)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-outline)'
                }}>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-on-surface)' }}>
                    {item.jam.split(' - ')[0]}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', marginTop: '4px' }}>
                    {item.jam.split(' - ')[1]}
                  </div>
                </div>

                {/* Subject Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <div style={{
                      padding: '6px 12px',
                      background: `${getSubjectColor(item.mapel)}20`,
                      color: getSubjectColor(item.mapel),
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 600
                    }}>
                      {item.mapel}
                    </div>
                    <div style={{ fontSize: '14px', color: 'var(--color-on-surface-variant)' }}>
                      Kelas {item.kelas}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: 'var(--color-on-surface-variant)' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                        meeting_room
                      </span>
                      {item.ruang}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: 'var(--color-on-surface-variant)' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                        person
                      </span>
                      {item.guru}
                    </div>
                  </div>
                </div>

                {/* Status Indicator */}
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: '#10b981',
                  boxShadow: '0 0 8px rgba(16, 185, 129, 0.4)'
                }} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary Card */}
      <div style={{
        marginTop: '24px',
        background: 'linear-gradient(135deg, var(--color-primary-container) 0%, var(--color-primary) 100%)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px',
        color: '#fff'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '4px' }}>
              Total Jadwal {days[selectedDay]}
            </div>
            <div style={{ fontSize: '28px', fontWeight: 700 }}>
              {schedule.length} Jam Pelajaran
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '4px' }}>
              Jam Mengajar
            </div>
            <div style={{ fontSize: '20px', fontWeight: 600 }}>
              {schedule.length * 1.5} Jam
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}