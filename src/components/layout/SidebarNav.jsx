import { NavLink } from 'react-router-dom'
import useAuthStore from '../../store/authStore'

const guruItems = [
  { to: '/dashboard', icon: 'home',           label: 'Beranda'  },
  { to: '/absensi',   icon: 'fingerprint',    label: 'Absensi'  },
  { to: '/jadwal',    icon: 'calendar_today', label: 'Jadwal'   },
  { to: '/riwayat',   icon: 'history',        label: 'Riwayat'  },
]

const adminItems = [
  { to: '/admin',         icon: 'dashboard',     label: 'Dashboard' },
  { to: '/admin/guru',    icon: 'group',         label: 'Data Guru' },
  { to: '/admin/mapel',   icon: 'book',          label: 'Mapel'     },
  { to: '/admin/jadwal',  icon: 'calendar_today',label: 'Jadwal'    },
  { to: '/admin/rekap',   icon: 'assessment',    label: 'Rekap'     },
]

export default function SidebarNav() {
  const { user } = useAuthStore()

  // Tunggu user tersedia dari persist storage
  if (!user) return null

  const items = user?.role === 'admin' ? adminItems : guruItems

  return (
    <aside
      className="d-none d-md-flex"
      style={{
        width: '240px', flexShrink: 0,
        position: 'fixed', left: 0, top: '64px',
        height: 'calc(100vh - 64px)',
        background: 'var(--color-primary-container)',
        display: 'flex', flexDirection: 'column',
        paddingTop: 'var(--space-md)',
        borderRight: '1px solid rgba(255,255,255,0.08)',
        overflowY: 'auto',
      }}
    >
      {/* User info */}
      <div style={{ padding: 'var(--space-xs) var(--space-md) var(--space-md)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{
          width: '40px', height: '40px', borderRadius: 'var(--radius-full)',
          background: 'rgba(255,255,255,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '8px',
        }}>
          <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: '20px' }}>person</span>
        </div>
        <div style={{ color: '#fff', fontWeight: 600, fontSize: '13px' }}>{user?.name || 'User'}</div>
        <div style={{
          display: 'inline-block', marginTop: '4px',
          background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.85)',
          fontSize: '10px', fontWeight: 600, padding: '2px 8px',
          borderRadius: 'var(--radius-full)', textTransform: 'uppercase', letterSpacing: '0.5px',
        }}>
          {user?.role}
        </div>
      </div>

      {/* Nav items */}
      <nav style={{ padding: 'var(--space-sm) 0', flex: 1 }}>
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/dashboard' || item.to === '/admin'}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '11px var(--space-md)',
              textDecoration: 'none',
              color: isActive ? '#fff' : 'rgba(255,255,255,0.65)',
              background: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
              borderLeft: isActive ? '3px solid #E31E24' : '3px solid transparent',
              fontWeight: isActive ? 600 : 400,
              fontSize: '14px',
              transition: 'all .15s',
            })}
          >
            <span className={`material-symbols-outlined${true ? '' : ''}`} style={{ fontSize: '20px' }}>
              {item.icon}
            </span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}