import api from './api'

/* ══════════════════════════════════════
   adminService.js
   Semua API call untuk Admin Panel
══════════════════════════════════════ */

const adminService = {

  // ── GURU ──────────────────────────────
  getGuru: ()                          => api.get('/api/guru').then(r => r.data),
  getGuruById: (id)                    => api.get(`/api/guru/${id}`).then(r => r.data),
  createGuru: (data)                   => api.post('/api/guru', data).then(r => r.data),
  updateGuru: (id, data)               => api.put(`/api/guru/${id}`, data).then(r => r.data),
  deleteGuru: (id)                     => api.delete(`/api/guru/${id}`).then(r => r.data),

  // ── MAPEL ─────────────────────────────
  getMapel: ()                         => api.get('/api/mapel').then(r => r.data),
  createMapel: (data)                  => api.post('/api/mapel', data).then(r => r.data),
  updateMapel: (id, data)              => api.put(`/api/mapel/${id}`, data).then(r => r.data),
  deleteMapel: (id)                    => api.delete(`/api/mapel/${id}`).then(r => r.data),

  // ── JADWAL ────────────────────────────
  getJadwal: ()                        => api.get('/api/jadwal').then(r => r.data),
  createJadwal: (data)                 => api.post('/api/jadwal', data).then(r => r.data),
  updateJadwal: (id, data)             => api.put(`/api/jadwal/${id}`, data).then(r => r.data),
  deleteJadwal: (id)                   => api.delete(`/api/jadwal/${id}`).then(r => r.data),

  // ── REKAP ─────────────────────────────
  getRekapBulanan: (bulan, tahun)      => api.get(`/api/absensi/rekap-bulanan?bulan=${bulan}&tahun=${tahun}`).then(r => r.data),
  getRekapHarian: (tanggal, guru_id)   => {
    let url = '/api/absensi/rekap'
    const params = []
    if (tanggal) params.push(`tanggal=${tanggal}`)  
    if (guru_id) params.push(`guru_id=${guru_id}`)
    if (params.length) url += '?' + params.join('&')
    return api.get(url).then(r => r.data)
  },
  updateStatusAbsensi: (id, data)      => api.put(`/api/absensi/${id}/status`, data).then(r => r.data),
}

export default adminService