import { Outlet } from 'react-router-dom'
import AppHeader        from '../components/layout/AppHeader'
import BottomNav        from '../components/layout/BottomNav'
import SidebarNav       from '../components/layout/SidebarNav'
import ToastContainer   from '../components/ui/Toast'
import PWAManager       from '../components/ui/PWAManajer'

export default function MainLayout() {
  return (
    <div style={{ minHeight: '100dvh', background: 'var(--color-background)' }}>
      <AppHeader />

      <div style={{ display: 'flex' }}>
        <SidebarNav />

        <main
          style={{
            flex: 1,
            marginTop: '64px',
            paddingBottom: '80px',
            minHeight: 'calc(100dvh - 64px)',
          }}
        >
          {/* Desktop: geser kanan agar tidak tertutup sidebar */}
          <div style={{
            maxWidth: '768px',
            margin: '0 auto',
            padding: 'var(--space-md)',
          }}
            className="main-content-inner"
          >
            <Outlet />
          </div>
        </main>
      </div>

      <BottomNav />

      {/* Toast global — muncul di atas semua halaman */}
      <ToastContainer />
      
      {/* PWA Manager */}
      <PWAManager />
      
      <style>{`
        @media (min-width: 768px) {
          .main-content-inner {
            margin-left: 240px !important;
            max-width: none !important;
          }
        }
      `}</style>
    </div>
  )
}
