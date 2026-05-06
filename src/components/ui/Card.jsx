import { useState } from 'react'

/**
 * Card — SMK Binatama Design System
 *
 * Props:
 *  variant   : 'default' | 'elevated' | 'filled' | 'primary'
 *  hoverable : bool — aktifkan hover shadow effect
 *  padding   : 'sm' | 'md' | 'lg' | 'none'
 *  onClick   : fn — jadikan card clickable
 *  style     : object — override style tambahan
 *  children  : ReactNode
 */

const VARIANTS = {
  default: {
    background: '#ffffff',
    border: '1px solid var(--color-outline-variant)',
    shadow: 'var(--shadow-sm)',
  },
  elevated: {
    background: '#ffffff',
    border: '1px solid var(--color-outline-variant)',
    shadow: 'var(--shadow-md)',
  },
  filled: {
    background: 'var(--color-surface-low)',
    border: '1px solid var(--color-outline-variant)',
    shadow: 'none',
  },
  primary: {
    background: 'var(--color-primary-container)',
    border: 'none',
    shadow: 'var(--shadow-md)',
    color: '#ffffff',
  },
}

const PADDINGS = {
  none: '0',
  sm:   '12px',
  md:   '16px',
  lg:   '24px',
}

export default function Card({
  variant = 'default',
  hoverable = false,
  padding = 'md',
  onClick,
  style: extraStyle = {},
  children,
  ...rest
}) {
  const [hovered, setHovered] = useState(false)
  const v = VARIANTS[variant] || VARIANTS.default
  const p = PADDINGS[padding] ?? PADDINGS.md

  const isClickable = !!onClick

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: v.background,
        border: v.border,
        borderRadius: 'var(--radius-xl)',
        padding: p,
        boxShadow: hoverable && hovered ? 'var(--shadow-md)' : v.shadow,
        color: v.color || 'inherit',
        cursor: isClickable ? 'pointer' : 'default',
        transition: 'box-shadow .2s, transform .15s',
        transform: hoverable && hovered ? 'translateY(-1px)' : 'none',
        position: 'relative',
        overflow: 'hidden',
        ...extraStyle,
      }}
      {...rest}
    >
      {children}
    </div>
  )
}

/* ── MetricCard — kartu statistik dengan icon, label, value ── */
export function MetricCard({ icon, iconBg, iconColor, label, value, sub, badge, badgeColor }) {
  return (
    <Card variant="default" hoverable>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        {/* Icon */}
        <div style={{
          width: 40, height: 40,
          borderRadius: 'var(--radius-md)',
          background: iconBg || 'var(--color-primary-fixed)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: iconColor || 'var(--color-primary-container)',
          flexShrink: 0,
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>{icon}</span>
        </div>

        {/* Badge opsional */}
        {badge && (
          <span style={{
            fontSize: '10px', fontWeight: 600,
            padding: '2px 8px', borderRadius: 'var(--radius-full)',
            background: badgeColor?.bg || 'var(--color-primary-fixed)',
            color: badgeColor?.text || 'var(--color-primary-container)',
          }}>
            {badge}
          </span>
        )}
      </div>

      <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-on-surface-variant)', margin: '0 0 4px' }}>
        {label}
      </p>
      <p style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-on-surface)', margin: 0, lineHeight: 1.2 }}>
        {value}
      </p>
      {sub && (
        <p style={{ fontSize: '11px', color: 'var(--color-outline)', marginTop: 4 }}>{sub}</p>
      )}
    </Card>
  )
}

/* ── ActionCard — grid icon action button ── */
export function ActionCard({ icon, label, onClick, active = false }) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '20px 12px', gap: 8,
        background: active
          ? 'var(--color-primary-container)'
          : hovered ? 'var(--color-surface-low)' : '#ffffff',
        color: active ? '#ffffff' : 'var(--color-primary-container)',
        border: active ? 'none' : '1px solid var(--color-outline-variant)',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-sm)',
        cursor: 'pointer',
        transition: 'all .15s',
        transform: hovered ? 'scale(0.97)' : 'scale(1)',
        width: '100%',
      }}
    >
      <span className="material-symbols-outlined" style={{ fontSize: '26px' }}>{icon}</span>
      <span style={{ fontSize: '13px', fontWeight: 600 }}>{label}</span>
    </button>
  )
}
