import { NavLink } from 'react-router-dom'
import useAuthStore from '../../store/authStore'

const guruNavItems = [
  { to: '/dashboard', icon: 'home',          label: 'Beranda' },
  { to: '/absensi',   icon: 'fingerprint',   label: 'Absensi' },
  { to: '/jadwal',    icon: 'calendar_today',label: 'Jadwal'  },
  { to: '/riwayat',   icon: 'history',       label: 'Riwayat' },
]

const adminNavItems = [
  { to: '/admin',         icon: 'dashboard',    label: 'Dashboard' },
  { to: '/admin/guru',    icon: 'group',        label: 'Guru'      },
  { to: '/admin/jadwal',  icon: 'calendar_today',label: 'Jadwal'   },
  { to: '/admin/rekap',   icon: 'assessment',   label: 'Rekap'     },
]

export default function BottomNav() {
  const { user } = useAuthStore()

  // Tunggu user tersedia dari persist storage
  if (!user) return null

  const items = user?.role === 'admin' ? adminNavItems : guruNavItems

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
      background: 'var(--color-surface-white)',
      borderTop: '1px solid var(--color-outline-variant)',
      boxShadow: '0 -2px 12px rgba(0,29,72,0.08)',
      height: '68px',
      display: 'flex',
      alignItems: 'center',
      // Sembunyikan di desktop md+
    }}
      className="d-flex d-md-none"
    >
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/dashboard' || item.to === '/admin'}
          style={({ isActive }) => ({
            flex: 1,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: '3px',
            textDecoration: 'none',
            color: isActive ? 'var(--color-primary-container)' : 'var(--color-outline)',
            transition: 'color .15s',
            padding: '8px 0',
          })}
        >
          {({ isActive }) => (
            <>
              <span
                className={`material-symbols-outlined${isActive ? ' filled' : ''}`}
                style={{ fontSize: '22px' }}
              >
                {item.icon}
              </span>
              <span style={{ fontSize: '10px', fontWeight: 600 }}>{item.label}</span>
              {isActive && (
                <div style={{
                  position: 'absolute', bottom: '0',
                  width: '40px', height: '3px',
                  background: 'var(--color-primary-container)',
                  borderRadius: '3px 3px 0 0',
                }} />
              )}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}