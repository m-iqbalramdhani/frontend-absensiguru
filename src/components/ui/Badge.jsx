/**
 * Badge — SMK Binatama Design System
 * Diambil langsung dari styling prototipe ZIP
 *
 * Props:
 *  status  : 'hadir' | 'izin' | 'sakit' | 'alpha' | 'terlambat' | 'libur'
 *            ATAU variant kustom:
 *  variant : 'success' | 'info' | 'warning' | 'danger' | 'neutral' | 'primary'
 *  size    : 'sm' | 'md'
 *  dot     : bool — tampilkan titik berwarna di kiri
 *  children: ReactNode — override label
 */

const STATUS_CONFIG = {
  hadir: {
    bg: '#dcfce7',
    color: '#16a34a',
    dot: '#16a34a',
    label: 'Hadir',
    icon: 'check_circle',
  },
  izin: {
    bg: '#dbeafe',
    color: '#2563eb',
    dot: '#2563eb',
    label: 'Izin',
    icon: 'event_busy',
  },
  sakit: {
    bg: '#fee2e2',
    color: '#dc2626',
    dot: '#dc2626',
    label: 'Sakit',
    icon: 'medical_services',
  },
  alpha: {
    bg: '#f1f5f9',
    color: '#64748b',
    dot: '#94a3b8',
    label: 'Alpha',
    icon: 'close',
  },
  terlambat: {
    bg: '#fef3c7',
    color: '#d97706',
    dot: '#f59e0b',
    label: 'Terlambat',
    icon: 'schedule',
  },
  libur: {
    bg: '#f3e8ff',
    color: '#7c3aed',
    dot: '#8b5cf6',
    label: 'Libur',
    icon: 'weekend',
  },
  // Alias variant
  success: {
    bg: '#dcfce7', color: '#16a34a', dot: '#16a34a', label: 'Sukses',
  },
  info: {
    bg: '#dbeafe', color: '#2563eb', dot: '#2563eb', label: 'Info',
  },
  warning: {
    bg: '#fef3c7', color: '#d97706', dot: '#f59e0b', label: 'Peringatan',
  },
  danger: {
    bg: '#fee2e2', color: '#dc2626', dot: '#dc2626', label: 'Bahaya',
  },
  neutral: {
    bg: '#f1f5f9', color: '#64748b', dot: '#94a3b8', label: 'Netral',
  },
  primary: {
    bg: 'var(--color-primary-fixed)',
    color: 'var(--color-primary-container)',
    dot: 'var(--color-primary-container)',
    label: 'Aktif',
  },
}

const SIZES = {
  sm: { fontSize: '10px', padding: '2px 8px', dotSize: 5, gap: 4 },
  md: { fontSize: '12px', padding: '4px 10px', dotSize: 6, gap: 5 },
}

export default function Badge({
  status,
  variant,
  size = 'md',
  dot = true,
  children,
  style: extraStyle = {},
}) {
  const key = status || variant || 'neutral'
  const cfg = STATUS_CONFIG[key] || STATUS_CONFIG.neutral
  const sz  = SIZES[size] || SIZES.md

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: sz.gap,
      padding: sz.padding,
      borderRadius: 'var(--radius-full)',
      background: cfg.bg,
      color: cfg.color,
      fontSize: sz.fontSize,
      fontWeight: 600,
      lineHeight: 1,
      letterSpacing: '0.01em',
      whiteSpace: 'nowrap',
      flexShrink: 0,
      ...extraStyle,
    }}>
      {dot && (
        <span style={{
          width: sz.dotSize,
          height: sz.dotSize,
          borderRadius: '50%',
          background: cfg.dot,
          flexShrink: 0,
        }} />
      )}
      {children || cfg.label}
    </span>
  )
}

/* ── StatusBadge dengan icon Material Symbol ── */
export function StatusBadge({ status, size = 'md' }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.neutral
  const sz  = SIZES[size] || SIZES.md

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: sz.gap,
      padding: sz.padding,
      borderRadius: 'var(--radius-full)',
      background: cfg.bg,
      color: cfg.color,
      fontSize: sz.fontSize,
      fontWeight: 600,
      lineHeight: 1,
      whiteSpace: 'nowrap',
      flexShrink: 0,
    }}>
      {cfg.icon && (
        <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>
          {cfg.icon}
        </span>
      )}
      {cfg.label}
    </span>
  )
}

/* ── RoleBadge — untuk tampilkan role admin/guru ── */
export function RoleBadge({ role }) {
  const isAdmin = role === 'admin'
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 10px',
      borderRadius: 'var(--radius-full)',
      background: isAdmin ? 'var(--color-primary-fixed)' : 'var(--color-surface-container)',
      color: isAdmin ? 'var(--color-primary-container)' : 'var(--color-on-surface-variant)',
      fontSize: '10px',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
    }}>
      {role}
    </span>
  )
}
