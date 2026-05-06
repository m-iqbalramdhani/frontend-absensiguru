import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import AuthLayout from './layouts/AuthLayout'
import ErrorBoundary from './components/ui/ErrorBoundary'

// Auth Pages
import LoginPage    from './pages/auth/LoginPage'

// Guru Pages (placeholder dulu)
import DashboardPage  from './pages/guru/DashboardPage'
import AbsensiPage    from './pages/guru/AbsensiPage'
import JadwalPage     from './pages/guru/JadwalPage'
import RiwayatPage    from './pages/guru/RiwayatPage'

// Admin Pages (placeholder dulu)
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import DataGuruPage       from './pages/admin/DataGuruPage'
import MapelPage          from './pages/admin/MapelPage'
import RekapPage          from './pages/admin/RekapPage'
import KelolJadwalPage    from './pages/admin/KelolaJadwalPage'

// Guard
import ProtectedRoute from './components/ui/ProtectedRoute'

function App() {
  return (
    <ErrorBoundary>
    <BrowserRouter>
      <Routes>

        {/* ── Auth Routes ── */}
        <Route element={<AuthLayout />}>
          <Route path="/login"    element={<LoginPage />} />
        </Route>

        {/* ── Guru Routes ── */}
        <Route element={<ProtectedRoute role="guru"><MainLayout /></ProtectedRoute>}>
          <Route path="/dashboard"  element={<DashboardPage />} />
          <Route path="/absensi"    element={<AbsensiPage />} />
          <Route path="/jadwal"     element={<JadwalPage />} />
          <Route path="/riwayat"    element={<RiwayatPage />} />
        </Route>

        {/* ── Admin Routes ── */}
        <Route element={<ProtectedRoute role="admin"><MainLayout /></ProtectedRoute>}>
          <Route path="/admin"              element={<AdminDashboardPage />} />
          <Route path="/admin/guru"         element={<DataGuruPage />} />
          <Route path="/admin/mapel"        element={<MapelPage />} />
          <Route path="/admin/jadwal"       element={<KelolJadwalPage />} />
          <Route path="/admin/rekap"        element={<RekapPage />} />
        </Route>

        {/* ── Default Redirect ── */}
        <Route path="/"  element={<Navigate to="/login" replace />} />
        <Route path="*"  element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App