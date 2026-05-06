import { useState, forwardRef } from 'react'

/**
 * Input — SMK Binatama Design System
 *
 * Props:
 *  label       : string
 *  placeholder : string
 *  type        : string  (text | email | password | number | tel | date | time)
 *  value       : string
 *  onChange    : fn
 *  error       : string  — pesan error
 *  hint        : string  — pesan bantuan di bawah field
 *  icon        : string  — Material Symbol name di kiri
 *  iconRight   : string  — Material Symbol name di kanan
 *  onIconRightClick : fn
 *  disabled    : bool
 *  required    : bool
 *  fullWidth   : bool    (default true)
 */

const Input = forwardRef(function Input({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  error,
  hint,
  icon,
  iconRight,
  onIconRightClick,
  disabled = false,
  required = false,
  fullWidth = true,
  style: extraStyle = {},
  ...rest
}, ref) {
  const [focused, setFocused] = useState(false)
  const [showPw, setShowPw]   = useState(false)

  const isPassword = type === 'password'
  const inputType  = isPassword ? (showPw ? 'text' : 'password') : type

  const borderColor = error
    ? 'var(--color-danger)'
    : focused
    ? 'var(--color-primary-container)'
    : 'var(--color-outline-variant)'

  const boxShadow = error
    ? '0 0 0 3px rgba(220,38,38,0.12)'
    : focused
    ? '0 0 0 3px rgba(0,45,114,0.12)'
    : 'none'

  return (
    <div style={{ width: fullWidth ? '100%' : 'auto', ...extraStyle }}>

      {/* Label */}
      {label && (
        <label style={{
          display: 'block',
          fontSize: '13px',
          fontWeight: 600,
          color: error ? 'var(--color-danger)' : 'var(--color-on-surface-variant)',
          marginBottom: 6,
          fontFamily: 'var(--font-family)',
        }}>
          {label}
          {required && <span style={{ color: 'var(--color-secondary-container)', marginLeft: 3 }}>*</span>}
        </label>
      )}

      {/* Input wrapper */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>

        {/* Icon kiri */}
        {icon && (
          <span className="material-symbols-outlined" style={{
            position: 'absolute', left: 12,
            fontSize: '18px', lineHeight: 1,
            color: focused
              ? 'var(--color-primary-container)'
              : 'var(--color-outline)',
            pointerEvents: 'none',
            transition: 'color .15s',
            zIndex: 1,
          }}>
            {icon}
          </span>
        )}

        <input
          ref={ref}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: '100%',
            height: '44px',
            padding: `0 ${(iconRight || isPassword) ? '44px' : '14px'} 0 ${icon ? '40px' : '14px'}`,
            fontSize: '14px',
            fontWeight: 400,
            fontFamily: 'var(--font-family)',
            color: 'var(--color-on-surface)',
            background: disabled ? 'var(--color-surface-low)' : '#ffffff',
            border: `1.5px solid ${borderColor}`,
            borderRadius: 'var(--radius-lg)',
            outline: 'none',
            boxShadow,
            transition: 'border-color .15s, box-shadow .15s',
            cursor: disabled ? 'not-allowed' : 'text',
            opacity: disabled ? 0.6 : 1,
          }}
          {...rest}
        />

        {/* Icon kanan: password toggle atau iconRight */}
        {isPassword ? (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPw(v => !v)}
            style={{
              position: 'absolute', right: 12,
              background: 'none', border: 'none',
              cursor: 'pointer', padding: 0,
              color: 'var(--color-outline)',
              display: 'flex', alignItems: 'center',
              transition: 'color .15s',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
              {showPw ? 'visibility_off' : 'visibility'}
            </span>
          </button>
        ) : iconRight ? (
          <button
            type="button"
            tabIndex={-1}
            onClick={onIconRightClick}
            style={{
              position: 'absolute', right: 12,
              background: 'none', border: 'none',
              cursor: onIconRightClick ? 'pointer' : 'default',
              padding: 0, color: 'var(--color-outline)',
              display: 'flex', alignItems: 'center',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{iconRight}</span>
          </button>
        ) : null}
      </div>

      {/* Error / Hint */}
      {(error || hint) && (
        <p style={{
          fontSize: '12px',
          marginTop: 5,
          color: error ? 'var(--color-danger)' : 'var(--color-outline)',
          display: 'flex', alignItems: 'center', gap: 4,
        }}>
          {error && (
            <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>error</span>
          )}
          {error || hint}
        </p>
      )}
    </div>
  )
})

export default Input

/* ── Select / Dropdown ── */
export function Select({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Pilih...',
  error,
  hint,
  disabled = false,
  required = false,
  fullWidth = true,
  style: extraStyle = {},
  ...rest
}) {
  const [focused, setFocused] = useState(false)

  const borderColor = error
    ? 'var(--color-danger)'
    : focused
    ? 'var(--color-primary-container)'
    : 'var(--color-outline-variant)'

  return (
    <div style={{ width: fullWidth ? '100%' : 'auto', ...extraStyle }}>
      {label && (
        <label style={{
          display: 'block',
          fontSize: '13px', fontWeight: 600,
          color: error ? 'var(--color-danger)' : 'var(--color-on-surface-variant)',
          marginBottom: 6,
        }}>
          {label}
          {required && <span style={{ color: 'var(--color-secondary-container)', marginLeft: 3 }}>*</span>}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        <select
          value={value}
          onChange={onChange}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: '100%', height: '44px',
            padding: '0 40px 0 14px',
            fontSize: '14px',
            fontFamily: 'var(--font-family)',
            color: value ? 'var(--color-on-surface)' : 'var(--color-outline)',
            background: disabled ? 'var(--color-surface-low)' : '#ffffff',
            border: `1.5px solid ${borderColor}`,
            borderRadius: 'var(--radius-lg)',
            outline: 'none',
            appearance: 'none',
            cursor: disabled ? 'not-allowed' : 'pointer',
            boxShadow: focused ? '0 0 0 3px rgba(0,45,114,0.12)' : 'none',
            transition: 'border-color .15s, box-shadow .15s',
          }}
          {...rest}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <span className="material-symbols-outlined" style={{
          position: 'absolute', right: 12, top: '50%',
          transform: 'translateY(-50%)',
          fontSize: '18px',
          color: 'var(--color-outline)',
          pointerEvents: 'none',
        }}>
          expand_more
        </span>
      </div>
      {(error || hint) && (
        <p style={{ fontSize: '12px', marginTop: 5, color: error ? 'var(--color-danger)' : 'var(--color-outline)' }}>
          {error || hint}
        </p>
      )}
    </div>
  )
}

/* ── Textarea ── */
export function Textarea({
  label, value, onChange, placeholder, rows = 4,
  error, hint, disabled = false, required = false,
  fullWidth = true, style: extraStyle = {}, ...rest
}) {
  const [focused, setFocused] = useState(false)
  const borderColor = error
    ? 'var(--color-danger)'
    : focused ? 'var(--color-primary-container)' : 'var(--color-outline-variant)'

  return (
    <div style={{ width: fullWidth ? '100%' : 'auto', ...extraStyle }}>
      {label && (
        <label style={{
          display: 'block', fontSize: '13px', fontWeight: 600,
          color: error ? 'var(--color-danger)' : 'var(--color-on-surface-variant)',
          marginBottom: 6,
        }}>
          {label}
          {required && <span style={{ color: 'var(--color-secondary-container)', marginLeft: 3 }}>*</span>}
        </label>
      )}
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%', padding: '12px 14px',
          fontSize: '14px', fontFamily: 'var(--font-family)',
          color: 'var(--color-on-surface)',
          background: disabled ? 'var(--color-surface-low)' : '#ffffff',
          border: `1.5px solid ${borderColor}`,
          borderRadius: 'var(--radius-lg)',
          outline: 'none', resize: 'vertical',
          boxShadow: focused ? '0 0 0 3px rgba(0,45,114,0.12)' : 'none',
          transition: 'border-color .15s, box-shadow .15s',
        }}
        {...rest}
      />
      {(error || hint) && (
        <p style={{ fontSize: '12px', marginTop: 5, color: error ? 'var(--color-danger)' : 'var(--color-outline)' }}>
          {error || hint}
        </p>
      )}
    </div>
  )
}
