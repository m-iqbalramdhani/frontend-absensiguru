/**
 * Misc UI Components — SMK Binatama Design System
 *
 * Exports:
 *  - PageHeader    : judul halaman + subtitle + action
 *  - SectionHeader : judul section dalam halaman
 *  - EmptyState    : tampilan data kosong
 *  - LoadingSpinner: loading indikator
 *  - LoadingSkeleton: skeleton loading card
 *  - Avatar        : avatar user dengan inisial fallback
 *  - ListItem      : item baris list dengan avatar + keterangan + badge
 *  - Divider       : garis pemisah
 *  - Toast         : notifikasi toast (dikontrol dari luar)
 */

/* ── PageHeader ── */
export function PageHeader({ title, subtitle, action }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start',
      justifyContent: 'space-between', gap: 12,
      marginBottom: 'var(--space-lg)',
    }}>
      <div>
        <h1 style={{
          margin: 0, fontSize: '22px', fontWeight: 700,
          color: 'var(--color-primary-container)',
          fontFamily: 'var(--font-family)',
          lineHeight: 1.2,
        }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{
            margin: '4px 0 0', fontSize: '13px',
            color: 'var(--color-on-surface-variant)',
          }}>
            {subtitle}
          </p>
        )}
      </div>
      {action && <div style={{ flexShrink: 0 }}>{action}</div>}
    </div>
  )
}

/* ── SectionHeader ── */
export function SectionHeader({ title, action, style: extraStyle = {} }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
      ...extraStyle,
    }}>
      <h2 style={{
        margin: 0, fontSize: '15px', fontWeight: 700,
        color: 'var(--color-on-surface)',
        fontFamily: 'var(--font-family)',
      }}>
        {title}
      </h2>
      {action}
    </div>
  )
}

/* ── LoadingSpinner ── */
export function LoadingSpinner({ size = 28, color = 'var(--color-primary-container)' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-xl)' }}>
      <div style={{
        width: size, height: size,
        border: `2.5px solid ${color}25`,
        borderTopColor: color,
        borderRadius: '50%',
        animation: 'spin .65s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

/* ── LoadingSkeleton ── */
export function LoadingSkeleton({ lines = 3, height = 80 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} style={{
          height, borderRadius: 'var(--radius-xl)',
          background: 'linear-gradient(90deg, var(--color-surface-low) 25%, var(--color-surface-container) 50%, var(--color-surface-low) 75%)',
          backgroundSize: '200% 100%',
          animation: `shimmer 1.5s infinite ${i * .15}s`,
        }} />
      ))}
      <style>{`
        @keyframes shimmer {
          0%   { background-position:  200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  )
}

/* ── EmptyState ── */
export function EmptyState({ icon = 'inbox', title = 'Data kosong', subtitle, action }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: 'var(--space-xl) var(--space-lg)',
      textAlign: 'center',
    }}>
      <div style={{
        width: 64, height: 64, borderRadius: 'var(--radius-xl)',
        background: 'var(--color-surface-container)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 16,
      }}>
        <span className="material-symbols-outlined" style={{
          fontSize: '32px', color: 'var(--color-outline)',
        }}>
          {icon}
        </span>
      </div>
      <p style={{
        margin: '0 0 4px', fontSize: '15px', fontWeight: 600,
        color: 'var(--color-on-surface)',
      }}>
        {title}
      </p>
      {subtitle && (
        <p style={{
          margin: '0 0 16px', fontSize: '13px',
          color: 'var(--color-on-surface-variant)',
          lineHeight: 1.5,
        }}>
          {subtitle}
        </p>
      )}
      {action}
    </div>
  )
}

/* ── Avatar ── */
export function Avatar({ name = '', size = 40, src, style: extraStyle = {} }) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase()

  // Warna konsisten berdasarkan nama
  const COLORS = [
    { bg: 'var(--color-primary-fixed)', color: 'var(--color-primary-container)' },
    { bg: '#dcfce7', color: '#16a34a' },
    { bg: '#fef3c7', color: '#d97706' },
    { bg: '#fee2e2', color: '#dc2626' },
    { bg: '#f3e8ff', color: '#7c3aed' },
  ]
  const colorIdx = name.charCodeAt(0) % COLORS.length
  const { bg, color } = COLORS[colorIdx] || COLORS[0]

  return (
    <div style={{
      width: size, height: size,
      borderRadius: '50%',
      background: src ? 'transparent' : bg,
      color,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.36,
      fontWeight: 700,
      fontFamily: 'var(--font-family)',
      overflow: 'hidden',
      flexShrink: 0,
      border: '2px solid rgba(255,255,255,0.8)',
      ...extraStyle,
    }}>
      {src
        ? <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        : initials || <span className="material-symbols-outlined" style={{ fontSize: size * 0.5 }}>person</span>
      }
    </div>
  )
}

/* ── ListItem — baris dalam daftar ── */
export function ListItem({ avatar, name, sub, badge, action, onClick, borderBottom = true }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 16px',
        borderBottom: borderBottom ? '1px solid var(--color-outline-variant)' : 'none',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'background .15s',
        background: 'transparent',
      }}
      onMouseOver={e => { if (onClick) e.currentTarget.style.background = 'var(--color-surface-low)' }}
      onMouseOut={e => { e.currentTarget.style.background = 'transparent' }}
    >
      {avatar}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          margin: 0, fontSize: '14px', fontWeight: 600,
          color: 'var(--color-on-surface)',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {name}
        </p>
        {sub && (
          <p style={{
            margin: '2px 0 0', fontSize: '12px',
            color: 'var(--color-on-surface-variant)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {sub}
          </p>
        )}
      </div>
      {badge}
      {action}
    </div>
  )
}

/* ── Divider ── */
export function Divider({ label, style: extraStyle = {} }) {
  if (!label) return (
    <hr style={{
      border: 'none',
      borderTop: '1px solid var(--color-outline-variant)',
      margin: '8px 0',
      ...extraStyle,
    }} />
  )

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      margin: '12px 0', ...extraStyle,
    }}>
      <div style={{ flex: 1, height: '1px', background: 'var(--color-outline-variant)' }} />
      <span style={{
        fontSize: '11px', fontWeight: 600,
        color: 'var(--color-outline)',
        textTransform: 'uppercase', letterSpacing: '0.06em',
        whiteSpace: 'nowrap',
      }}>
        {label}
      </span>
      <div style={{ flex: 1, height: '1px', background: 'var(--color-outline-variant)' }} />
    </div>
  )
}

/* ── InfoRow — baris keterangan key: value ── */
export function InfoRow({ icon, label, value, style: extraStyle = {} }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '8px 0',
      borderBottom: '1px solid var(--color-outline-variant)',
      ...extraStyle,
    }}>
      {icon && (
        <span className="material-symbols-outlined" style={{
          fontSize: '16px', color: 'var(--color-outline)', flexShrink: 0,
        }}>
          {icon}
        </span>
      )}
      <span style={{ fontSize: '13px', color: 'var(--color-outline)', flex: 1 }}>{label}</span>
      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-on-surface)' }}>{value}</span>
    </div>
  )
}
