import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import api from '../../services/api'

export default function RiwayatPage() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [attendanceHistory, setAttendanceHistory] = useState([])
  const [filter, setFilter] = useState('all')
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [stats, setStats] = useState({ hadir: 0, izin: 0, sakit: 0, alpha: 0, total: 0 })

  // Load data saat filter berubah
  useEffect(() => { loadAttendanceHistory() }, [filter, selectedMonth, selectedYear, startDate, endDate])

  const loadAttendanceHistory = async () => {
    try {
      setLoading(true)
      let url = '/api/absensi/riwayat'

      if (filter === 'bulan') {
        url += `?bulan=${selectedMonth + 1}&tahun=${selectedYear}`
      } else if (filter === 'custom' && startDate && endDate) {
        url += `?mulai=${startDate}&sampai=${endDate}`
      }

      const res = await api.get(url)
      const data = res.data.data || []
      setAttendanceHistory(data)

      // Calculate stats
      const summary = data.reduce((acc, item) => {
        acc.total++
        if (['hadir', 'toleransi', 'terlambat'].includes(item.status)) acc.hadir++
        else if (item.status === 'izin') acc.izin++
        else if (item.status === 'sakit') acc.sakit++
        else if (item.status === 'alpha') acc.alpha++
        return acc
      }, { hadir: 0, izin: 0, sakit: 0, alpha: 0, total: 0 })
      setStats(summary)
    } catch {
      // Silently fail
    } finally {
      setLoading(false)
    }
  }

  const handleExportCSV = () => {
    // Create CSV content
    const headers = ['Tanggal', 'Jam Masuk', 'Jam Keluar', 'Status', 'Keterangan']
    const rows = attendanceHistory.map(item => [
      item.tanggal,
      item.jam_masuk || '-',
      item.jam_keluar || '-',
      item.status,
      item.keterangan || '-'
    ])
    
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n')
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `riwayat-absensi-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleExportPDF = () => {
    // Add print-specific styles
    const printStyles = `
      @media print {
        body * {
          visibility: hidden;
        }
        #riwayat-table, #riwayat-table * {
          visibility: visible;
        }
        #riwayat-table {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
        }
        .no-print {
          display: none !important;
        }
      }
    `
    
    // Create style element
    const style = document.createElement('style')
    style.textContent = printStyles
    document.head.appendChild(style)
    
    // Print
    window.print()
    
    // Remove style after print
    setTimeout(() => {
      document.head.removeChild(style)
    }, 1000)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'hadir': return '#10b981'
      case 'toleransi': return '#d97706'
      case 'terlambat': return '#dc2626'
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

  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ]

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i)

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
          Riwayat Kehadiran
        </h1>
        <p style={{ 
          margin: 0, 
          color: 'var(--color-on-surface-variant)',
          fontSize: '14px'
        }}>
          Lihat riwayat absensi Anda
        </p>
      </div>

      {/* Filter Section */}
      <div style={{
        background: 'var(--color-surface-variant)',
        borderRadius: 'var(--radius-md)',
        padding: '20px',
        marginBottom: '24px',
        border: '1px solid var(--color-outline)'
      }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          {/* Filter Type */}
          <div style={{ flex: '1', minWidth: '200px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              color: 'var(--color-on-surface)',
              fontSize: '14px',
              fontWeight: 500
            }}>
              Filter
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid var(--color-outline)',
                borderRadius: 'var(--radius-md)',
                fontSize: '14px',
                background: 'var(--color-surface)',
                color: 'var(--color-on-surface)',
                boxSizing: 'border-box'
              }}
            >
              <option value="all">Semua Data</option>
              <option value="bulan">Per Bulan</option>
              <option value="custom">Rentang Tanggal</option>
            </select>
          </div>

          {/* Month Filter */}
          {filter === 'bulan' && (
            <>
              <div style={{ flex: '1', minWidth: '150px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  color: 'var(--color-on-surface)',
                  fontSize: '14px',
                  fontWeight: 500
                }}>
                  Bulan
                </label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid var(--color-outline)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '14px',
                    background: 'var(--color-surface)',
                    color: 'var(--color-on-surface)',
                    boxSizing: 'border-box'
                  }}
                >
                  {months.map((month, index) => (
                    <option key={index} value={index}>{month}</option>
                  ))}
                </select>
              </div>

              <div style={{ flex: '1', minWidth: '120px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  color: 'var(--color-on-surface)',
                  fontSize: '14px',
                  fontWeight: 500
                }}>
                  Tahun
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid var(--color-outline)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '14px',
                    background: 'var(--color-surface)',
                    color: 'var(--color-on-surface)',
                    boxSizing: 'border-box'
                  }}
                >
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* Custom Date Range */}
          {filter === 'custom' && (
            <>
              <div style={{ flex: '1', minWidth: '150px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  color: 'var(--color-on-surface)',
                  fontSize: '14px',
                  fontWeight: 500
                }}>
                  Tanggal Mulai
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid var(--color-outline)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '14px',
                    background: 'var(--color-surface)',
                    color: 'var(--color-on-surface)',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ flex: '1', minWidth: '150px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  color: 'var(--color-on-surface)',
                  fontSize: '14px',
                  fontWeight: 500
                }}>
                  Tanggal Akhir
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid var(--color-outline)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '14px',
                    background: 'var(--color-surface)',
                    color: 'var(--color-on-surface)',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </>
          )}

          {/* Export Buttons */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleExportCSV}
              disabled={loading || attendanceHistory.length === 0}
              style={{
                background: loading || attendanceHistory.length === 0 ? 'var(--color-surface-variant)' : '#10b981',
                color: loading || attendanceHistory.length === 0 ? 'var(--color-on-surface-variant)' : '#fff',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                padding: '10px 20px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: loading || attendanceHistory.length === 0 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                table_view
              </span>
              Export CSV
            </button>

            <button
              onClick={handleExportPDF}
              disabled={loading || attendanceHistory.length === 0}
              style={{
                background: loading || attendanceHistory.length === 0 ? 'var(--color-surface-variant)' : '#ef4444',
                color: loading || attendanceHistory.length === 0 ? 'var(--color-on-surface-variant)' : '#fff',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                padding: '10px 20px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: loading || attendanceHistory.length === 0 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                picture_as_pdf
              </span>
              Export PDF
            </button>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div style={{
          background: 'var(--color-surface-variant)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          border: '1px solid var(--color-outline)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', marginBottom: '4px' }}>
            Total
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-on-surface)' }}>
            {stats.total}
          </div>
        </div>
        <div style={{
          background: 'var(--color-surface-variant)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          border: '1px solid var(--color-outline)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', marginBottom: '4px' }}>
            Hadir
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#10b981' }}>
            {stats.hadir}
          </div>
        </div>
        <div style={{
          background: 'var(--color-surface-variant)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          border: '1px solid var(--color-outline)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', marginBottom: '4px' }}>
            Izin
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#f59e0b' }}>
            {stats.izin}
          </div>
        </div>
        <div style={{
          background: 'var(--color-surface-variant)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          border: '1px solid var(--color-outline)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', marginBottom: '4px' }}>
            Sakit
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#ef4444' }}>
            {stats.sakit}
          </div>
        </div>
        <div style={{
          background: 'var(--color-surface-variant)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          border: '1px solid var(--color-outline)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', marginBottom: '4px' }}>
            Alpha
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#6b7280' }}>
            {stats.alpha}
          </div>
        </div>
      </div>

      {/* Table */}
      <div 
        id="riwayat-table"
        style={{
          background: 'var(--color-surface-variant)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-outline)',
          overflow: 'hidden'
        }}
      >
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-on-surface-variant)' }}>
            Memuat data...
          </div>
        ) : attendanceHistory.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-on-surface-variant)' }}>
            Tidak ada data riwayat kehadiran
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--color-surface)' }}>
                  <th style={{ 
                    padding: '16px', 
                    textAlign: 'left', 
                    fontSize: '14px', 
                    fontWeight: 600,
                    color: 'var(--color-on-surface)',
                    borderBottom: '1px solid var(--color-outline)'
                  }}>
                    Tanggal
                  </th>
                  <th style={{ 
                    padding: '16px', 
                    textAlign: 'left', 
                    fontSize: '14px', 
                    fontWeight: 600,
                    color: 'var(--color-on-surface)',
                    borderBottom: '1px solid var(--color-outline)'
                  }}>
                    Jam Masuk
                  </th>
                  <th style={{ 
                    padding: '16px', 
                    textAlign: 'left', 
                    fontSize: '14px', 
                    fontWeight: 600,
                    color: 'var(--color-on-surface)',
                    borderBottom: '1px solid var(--color-outline)'
                  }}>
                    Jam Keluar
                  </th>
                  <th style={{ 
                    padding: '16px', 
                    textAlign: 'left', 
                    fontSize: '14px', 
                    fontWeight: 600,
                    color: 'var(--color-on-surface)',
                    borderBottom: '1px solid var(--color-outline)'
                  }}>
                    Status
                  </th>
                  <th style={{ 
                    padding: '16px', 
                    textAlign: 'left', 
                    fontSize: '14px', 
                    fontWeight: 600,
                    color: 'var(--color-on-surface)',
                    borderBottom: '1px solid var(--color-outline)'
                  }}>
                    Keterangan
                  </th>
                </tr>
              </thead>
              <tbody>
                {attendanceHistory.map((item) => (
                  <tr 
                    key={item.id}
                    style={{ 
                      borderBottom: '1px solid var(--color-outline)',
                      transition: 'background 0.2s'
                    }}
                    onMouseOver={e => e.currentTarget.style.background = 'var(--color-surface)'}
                    onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '16px', fontSize: '14px', color: 'var(--color-on-surface)' }}>
                      {formatDate(item.tanggal)}
                    </td>
                    <td style={{ padding: '16px', fontSize: '14px', color: 'var(--color-on-surface)' }}>
                      {item.jam_masuk || '-'}
                    </td>
                    <td style={{ padding: '16px', fontSize: '14px', color: 'var(--color-on-surface)' }}>
                      {item.jam_keluar || '-'}
                    </td>
                    <td style={{ padding: '16px' }}>
                      {getStatusBadge(item.status)}
                    </td>
                    <td style={{ padding: '16px', fontSize: '14px', color: 'var(--color-on-surface-variant)' }}>
                      {item.keterangan || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}