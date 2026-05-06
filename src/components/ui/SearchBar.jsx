import { useState, useRef } from 'react'

/**
 * SearchBar — SMK Binatama Design System
 * Sesuai prototipe: input rounded dengan icon search kiri + clear button
 *
 * Props:
 *  value       : string
 *  onChange    : fn(value: string)
 *  placeholder : string
 *  onSearch    : fn(value) — dipanggil saat tekan Enter / klik icon
 *  loading     : bool
 *  style       : object
 */
export default function SearchBar({
  value = '',
  onChange,
  placeholder = 'Cari...',
  onSearch,
  loading = false,
  style: extraStyle = {},
}) {
  const [focused, setFocused] = useState(false)
  const inputRef = useRef(null)

  const handleKey = (e) => {
    if (e.key === 'Enter') onSearch?.(value)
  }

  const handleClear = () => {
    onChange?.('')
    inputRef.current?.focus()
  }

  return (
    <div style={{
      position: 'relative',
      display: 'flex', alignItems: 'center',
      width: '100%',
      ...extraStyle,
    }}>
      {/* Icon search kiri */}
      <span className="material-symbols-outlined" style={{
        position: 'absolute', left: 12,
        fontSize: '18px', lineHeight: 1,
        color: focused
          ? 'var(--color-primary-container)'
          : 'var(--color-outline)',
        transition: 'color .15s',
        pointerEvents: 'none',
        zIndex: 1,
      }}>
        {loading ? 'hourglass_top' : 'search'}
      </span>

      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={e => onChange?.(e.target.value)}
        onKeyDown={handleKey}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        style={{
          width: '100%',
          height: '42px',
          padding: `0 ${value ? '40px' : '14px'} 0 40px`,
          fontSize: '14px',
          fontFamily: 'var(--font-family)',
          color: 'var(--color-on-surface)',
          background: '#ffffff',
          border: `1.5px solid ${focused
            ? 'var(--color-primary-container)'
            : 'var(--color-outline-variant)'}`,
          borderRadius: 'var(--radius-full)',
          outline: 'none',
          boxShadow: focused ? '0 0 0 3px rgba(0,45,114,0.10)' : 'none',
          transition: 'border-color .15s, box-shadow .15s',
        }}
      />

      {/* Clear button */}
      {value && (
        <button
          type="button"
          onClick={handleClear}
          style={{
            position: 'absolute', right: 10,
            background: 'var(--color-surface-container)',
            border: 'none',
            borderRadius: 'var(--radius-full)',
            width: 22, height: 22,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--color-outline)',
            transition: 'background .15s',
          }}
          onMouseOver={e => e.currentTarget.style.background = 'var(--color-surface-high)'}
          onMouseOut={e => e.currentTarget.style.background = 'var(--color-surface-container)'}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>close</span>
        </button>
      )}
    </div>
  )
}

/* ── FilterBar — search + filter button combo ── */
export function FilterBar({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Cari...',
  onFilter,
  filterActive = false,
  children,
  style: extraStyle = {},
}) {
  return (
    <div style={{
      display: 'flex', gap: 8, alignItems: 'center',
      marginBottom: 16,
      ...extraStyle,
    }}>
      <div style={{ flex: 1 }}>
        <SearchBar
          value={searchValue}
          onChange={onSearchChange}
          placeholder={searchPlaceholder}
        />
      </div>

      {onFilter && (
        <button
          onClick={onFilter}
          style={{
            height: 42,
            padding: '0 14px',
            display: 'flex', alignItems: 'center', gap: 6,
            background: filterActive
              ? 'var(--color-primary-fixed)'
              : '#ffffff',
            border: `1.5px solid ${filterActive
              ? 'var(--color-primary-container)'
              : 'var(--color-outline-variant)'}`,
            borderRadius: 'var(--radius-lg)',
            color: filterActive
              ? 'var(--color-primary-container)'
              : 'var(--color-on-surface-variant)',
            fontSize: '13px', fontWeight: 600,
            cursor: 'pointer',
            transition: 'all .15s',
            flexShrink: 0,
            fontFamily: 'var(--font-family)',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '17px' }}>filter_list</span>
          Filter
          {filterActive && (
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: 'var(--color-secondary-container)',
              flexShrink: 0,
            }} />
          )}
        </button>
      )}

      {children}
    </div>
  )
}
