import usePWA from '../../hooks/usePWA'

/* ══════════════════════════════════════
   PWAManager
   Taruh 1x di MainLayout — menampilkan:
   • Banner install ke home screen
   • Toast offline/online
   • Banner update tersedia
══════════════════════════════════════ */
export default function PWAManager() {
  const { isOnline, canInstall, updateAvailable, triggerInstall, applyUpdate } = usePWA()

  return (
    <>
      {/* ── Offline Banner ── */}
      {!isOnline && <OfflineBanner />}

      {/* ── Install Banner ── */}
      {canInstall && <InstallBanner onInstall={triggerInstall} />}

      {/* ── Update Banner ── */}
      {updateAvailable && <UpdateBanner onUpdate={applyUpdate} />}
    </>
  )
}

/* ── Offline Banner ── */
function OfflineBanner() {
  return (
    <div style={{
      position: 'fixed', top: 64, left: 0, right: 0,
      zIndex: 200,
      background: '#1e293b',
      color: '#fff',
      padding: '10px 16px',
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', gap: 8,
      fontSize: 13, fontWeight: 600,
      fontFamily: 'var(--font-family)',
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    }}>
      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>wifi_off</span>
      Anda sedang offline — data mungkin tidak terbaru
    </div>
  )
}

/* ── Install Banner ── */
function InstallBanner({ onInstall }) {
  return (
    <div style={{
      position: 'fixed', bottom: 76, left: 12, right: 12,
      zIndex: 200,
      background: 'var(--color-primary-container)',
      borderRadius: 'var(--radius-xl)',
      padding: '14px 16px',
      display: 'flex', alignItems: 'center', gap: 12,
      boxShadow: '0 8px 24px rgba(0,45,114,0.25)',
      fontFamily: 'var(--font-family)',
    }}
      className="d-md-none"
    >
      {/* Icon */}
      <div style={{
        width: 42, height: 42, borderRadius: 12,
        background: 'rgba(255,255,255,0.15)',
        border: '1.5px solid rgba(255,255,255,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <span className="material-symbols-outlined" style={{ fontSize: 22, color: '#fff' }}>
          install_mobile
        </span>
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#fff', lineHeight: 1.3 }}>
          Pasang di Home Screen
        </p>
        <p style={{ margin: '2px 0 0', fontSize: 11, color: 'rgba(255,255,255,0.65)' }}>
          Akses lebih cepat seperti aplikasi native
        </p>
      </div>

      {/* Tombol Install */}
      <button
        onClick={onInstall}
        style={{
          background: '#fff',
          color: 'var(--color-primary-container)',
          border: 'none', borderRadius: 10,
          padding: '8px 14px',
          fontSize: 12, fontWeight: 700,
          cursor: 'pointer', flexShrink: 0,
          fontFamily: 'var(--font-family)',
          transition: 'opacity .15s',
        }}
        onMouseOver={e => e.currentTarget.style.opacity = '.85'}
        onMouseOut={e => e.currentTarget.style.opacity = '1'}
      >
        Pasang
      </button>
    </div>
  )
}

/* ── Update Banner ── */
function UpdateBanner({ onUpdate }) {
  return (
    <div style={{
      position: 'fixed', top: 64, left: 0, right: 0,
      zIndex: 201,
      background: 'var(--color-success-bg)',
      borderBottom: '1px solid #bbf7d0',
      padding: '10px 16px',
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', gap: 10,
      fontFamily: 'var(--font-family)',
    }}>
      <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#16a34a' }}>
        system_update
      </span>
      <p style={{ margin: 0, fontSize: 13, color: '#15803d', fontWeight: 600 }}>
        Update tersedia!
      </p>
      <button
        onClick={onUpdate}
        style={{
          background: '#16a34a', color: '#fff',
          border: 'none', borderRadius: 8,
          padding: '5px 14px',
          fontSize: 12, fontWeight: 700,
          cursor: 'pointer', marginLeft: 4,
          fontFamily: 'var(--font-family)',
        }}
      >
        Perbarui
      </button>
    </div>
  )
}
