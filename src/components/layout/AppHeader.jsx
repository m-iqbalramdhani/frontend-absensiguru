import { useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'

export default function AppHeader() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      height: '64px',
      background: 'var(--color-primary-container)',
      borderBottom: '1px solid rgba(255,255,255,0.1)',
      boxShadow: '0 2px 8px rgba(0,29,72,0.15)',
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 var(--space-md)',
    }}>
      {/* Kiri: Logo + Nama */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '32px', height: '32px', borderRadius: 'var(--radius-md)',
          background: 'rgba(255,255,255,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: '18px' }}>school</span>
        </div>
        <div>
          <div style={{ color: '#fff', fontWeight: 700, fontSize: '15px', lineHeight: 1 }}>SMK Binatama</div>
          <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '11px', fontWeight: 500 }}>
            Sistem Absensi
          </div>
        </div>
      </div>

      {/* Kanan: Notif + Avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <button style={{
          background: 'none', border: 'none', cursor: 'pointer',
          padding: '8px', borderRadius: 'var(--radius-full)',
          color: 'rgba(255,255,255,0.8)',
          transition: 'background .15s',
        }}
          onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          onMouseOut={e => e.currentTarget.style.background = 'none'}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>notifications</span>
        </button>

        <button
          onClick={handleLogout}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '8px', borderRadius: 'var(--radius-full)',
            color: 'rgba(255,255,255,0.8)',
            transition: 'background .15s',
          }}
          onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          onMouseOut={e => e.currentTarget.style.background = 'none'}
          title="Logout"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>logout</span>
        </button>
      </div>
    </header>
  )
}