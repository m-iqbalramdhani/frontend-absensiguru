import api from './api'

/* ══════════════════════════════════════
   absensiService.js
   Semua API call untuk fitur Absensi Guru
══════════════════════════════════════ */

const absensiService = {

  // Absen masuk — kirim koordinat GPS
  absenMasuk: (koordinat) =>
    api.post('/api/absensi/masuk', koordinat).then(r => r.data),

  // Absen pulang — kirim koordinat GPS
  absenPulang: (koordinat) =>
    api.post('/api/absensi/pulang', koordinat).then(r => r.data),

  // Lapor izin atau sakit (tanpa GPS)
  laporIzinSakit: (data) =>
    api.post('/api/absensi/izin-sakit', data).then(r => r.data),

  // Riwayat absensi milik guru yang login
  getRiwayat: () =>
    api.get('/api/absensi/riwayat').then(r => r.data),

  // Rekap bulanan milik guru sendiri
  getRekapSaya: (bulan, tahun) =>
    api.get(`/api/absensi/rekap-saya?bulan=${bulan}&tahun=${tahun}`).then(r => r.data),
}

export default absensiService