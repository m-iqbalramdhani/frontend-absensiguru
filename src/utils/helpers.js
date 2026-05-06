// Format jam dari format 24h ke format yang lebih readable
export const formatJam = (jam) => {
  if (!jam) return '-'
  return jam
}

// Format tanggal pendek (DD/MM/YYYY)
export const formatTanggalPendek = (tanggal) => {
  if (!tanggal) return '-'
  const date = new Date(tanggal)
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

// Format tanggal panjang (Senin, 1 Januari 2026)
export const formatTanggalPanjang = (tanggal) => {
  if (!tanggal) return '-'
  const date = new Date(tanggal)
  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

// Mendapatkan bulan sekarang dalam format angka (1-12)
export const getBulanSekarang = () => {
  const date = new Date()
  return date.getMonth() + 1 // getMonth() returns 0-11
}

// Mendapatkan array nama bulan Indonesia
export const getNamaBulan = () => {
  return [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ]
}

// Mendapatkan tahun sekarang
export const getTahunSekarang = () => {
  return new Date().getFullYear()
}

// Mendapatkan array tahun (5 tahun terakhir)
export const getDaftarTahun = (jumlah = 5) => {
  const tahunSekarang = new Date().getFullYear()
  return Array.from({ length: jumlah }, (_, i) => tahunSekarang - i)
}

// Format angka dengan pemisah ribuan
export const formatNumber = (angka) => {
  if (angka === null || angka === undefined) return '0'
  return new Intl.NumberFormat('id-ID').format(angka)
}

// Format ke Rupiah
export const formatRupiah = (angka) => {
  if (angka === null || angka === undefined) return 'Rp 0'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(angka)
}

// Mendapatkan status absensi dengan warna
export const getStatusAbsensi = (status) => {
  const statusMap = {
    hadir: { label: 'Hadir', color: '#10b981', bg: '#d1fae5' },
    izin: { label: 'Izin', color: '#f59e0b', bg: '#fef3c7' },
    sakit: { label: 'Sakit', color: '#ef4444', bg: '#fee2e2' },
    alpha: { label: 'Alpha', color: '#6b7280', bg: '#f3f4f6' }
  }
  return statusMap[status] || { label: status, color: '#6b7280', bg: '#f3f4f6' }
}

// Mendapatkan inisial dari nama
export const getInisial = (nama) => {
  if (!nama) return '?'
  const words = nama.split(' ')
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase()
  }
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase()
}

// Mendapatkan warna avatar berdasarkan inisial
export const getAvatarColor = (nama) => {
  if (!nama) return '#6b7280'
  const colors = [
    '#ef4444', '#f97316', '#f59e0b', '#84cc16', '#10b981',
    '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', '#f43f5e'
  ]
  const index = nama.charCodeAt(0) % colors.length
  return colors[index]
}

// Menghitung persentase
export const hitungPersen = (nilai, total) => {
  if (!total || total === 0) return 0
  return Math.round((nilai / total) * 100)
}
