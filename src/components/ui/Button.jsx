import { useState } from 'react'

/**
 * Button — SMK Binatama Design System
 *
 * Props:
 *  variant   : 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success'
 *  size      : 'sm' | 'md' | 'lg'
 *  icon      : string  — Material Symbol name (opsional)
 *  iconPos   : 'left' | 'right'
 *  loading   : bool
 *  fullWidth : bool
 *  disabled  : bool
 *  onClick   : fn
 *  children  : ReactNode
 */

const VARIANTS = {
  primary: {
    background: 'var(--color-primary-container)',
    color: '#ffffff',
    border: 'none',
    hoverBg: '#003580',
    shadowColor: 'rgba(0,45,114,0.25)',
  },
  secondary: {
    background: 'var(--color-secondary-container)',
    color: '#ffffff',
    border: 'none',
    hoverBg: '#c91a20',
    shadowColor: 'rgba(187,0,20,0.25)',
  },
  outline: {
    background: 'transparent',
    color: 'var(--color-primary-container)',
    border: '1.5px solid var(--color-primary-container)',
    hoverBg: 'var(--color-primary-fixed)',
    shadowColor: 'rgba(0,45,114,0.10)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--color-primary-container)',
    border: 'none',
    hoverBg: 'var(--color-surface-container)',
    shadowColor: 'transparent',
  },
  danger: {
    background: 'var(--color-danger-bg)',
    color: 'var(--color-danger)',
    border: '1px solid rgba(220,38,38,0.2)',
    hoverBg: '#fee2e2',
    shadowColor: 'rgba(220,38,38,0.15)',
  },
  success: {
    background: 'var(--color-success-bg)',
    color: 'var(--color-success)',
    border: '1px solid rgba(22,163,74,0.2)',
    hoverBg: '#dcfce7',
    shadowColor: 'rgba(22,163,74,0.15)',
  },
}

const SIZES = {
  sm: { padding: '7px 14px', fontSize: '12px', height: '32px', iconSize: '16px', gap: '5px' },
  md: { padding: '10px 20px', fontSize: '14px', height: '40px', iconSize: '18px', gap: '6px' },
  lg: { padding: '13px 28px', fontSize: '15px', height: '48px', iconSize: '20px', gap: '8px' },
}

export default function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconPos = 'left',
  loading = false,
  fullWidth = false,
  disabled = false,
  onClick,
  children,
  type = 'button',
  style: extraStyle = {},
  ...rest
}) {
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)

  const v = VARIANTS[variant] || VARIANTS.primary
  const s = SIZES[size] || SIZES.md

  const isDisabled = disabled || loading

  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s.gap,
    padding: s.padding,
    height: s.height,
    fontSize: s.fontSize,
    fontWeight: 600,
    fontFamily: 'var(--font-family)',
    borderRadius: 'var(--radius-lg)',
    border: v.border,
    background: hovered && !isDisabled ? v.hoverBg : v.background,
    color: v.color,
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    opacity: isDisabled ? 0.55 : 1,
    width: fullWidth ? '100%' : 'auto',
    transition: 'background .15s, transform .1s, box-shadow .15s',
    transform: pressed && !isDisabled ? 'scale(0.97)' : 'scale(1)',
    boxShadow: hovered && !isDisabled && v.shadowColor !== 'transparent'
      ? `0 4px 12px ${v.shadowColor}`
      : 'none',
    userSelect: 'none',
    letterSpacing: '0.01em',
    whiteSpace: 'nowrap',
    outline: 'none',
    textDecoration: 'none',
    ...extraStyle,
  }

  return (
    <button
      type={type}
      style={baseStyle}
      disabled={isDisabled}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false) }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      {...rest}
    >
      {/* Loading spinner */}
      {loading && (
        <span style={{
          width: s.iconSize,
          height: s.iconSize,
          border: `2px solid ${v.color}40`,
          borderTopColor: v.color,
          borderRadius: '50%',
          animation: 'btn-spin .6s linear infinite',
          flexShrink: 0,
        }} />
      )}

      {/* Icon kiri */}
      {!loading && icon && iconPos === 'left' && (
        <span className="material-symbols-outlined" style={{ fontSize: s.iconSize, lineHeight: 1 }}>
          {icon}
        </span>
      )}

      {/* Label */}
      {children}

      {/* Icon kanan */}
      {!loading && icon && iconPos === 'right' && (
        <span className="material-symbols-outlined" style={{ fontSize: s.iconSize, lineHeight: 1 }}>
          {icon}
        </span>
      )}

      <style>{`
        @keyframes btn-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </button>
  )
}

/* ── Icon-only Button ── */
export function IconButton({ icon, onClick, title, size = 'md', variant = 'ghost', ...rest }) {
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)
  const v = VARIANTS[variant] || VARIANTS.ghost
  const sz = { sm: 32, md: 38, lg: 44 }[size] || 38
  const iconSz = { sm: '18px', md: '20px', lg: '22px' }[size] || '20px'

  return (
    <button
      title={title}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false) }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        width: sz, height: sz,
        borderRadius: 'var(--radius-full)',
        border: v.border,
        background: hovered ? v.hoverBg : v.background,
        color: v.color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
        transition: 'background .15s, transform .1s',
        transform: pressed ? 'scale(0.93)' : 'scale(1)',
        flexShrink: 0,
      }}
      {...rest}
    >
      <span className="material-symbols-outlined" style={{ fontSize: iconSz }}>{icon}</span>
    </button>
  )
}
