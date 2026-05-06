/**
 * Table — SMK Binatama Design System
 * Sesuai prototipe: header abu muda, row hover, border subtle
 * Responsive: scroll horizontal di mobile
 *
 * Props:
 *  columns : [{ key, label, align, width, render }]
 *  data    : array of objects
 *  loading : bool
 *  emptyIcon    : string
 *  emptyTitle   : string
 *  emptySubtitle: string
 *  stickyHeader : bool
 *  onRowClick   : fn(row)
 *  rowKey       : string — field untuk key unik (default: 'id')
 */

import { LoadingSkeleton, EmptyState } from './Misc'

export default function Table({
  columns = [],
  data = [],
  loading = false,
  emptyIcon = 'table_rows',
  emptyTitle = 'Belum ada data',
  emptySubtitle = '',
  onRowClick,
  rowKey = 'id',
  style: extraStyle = {},
}) {
  return (
    <div style={{
      background: '#ffffff',
      border: '1px solid var(--color-outline-variant)',
      borderRadius: 'var(--radius-xl)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-sm)',
      ...extraStyle,
    }}>
      {/* Scroll wrapper untuk mobile */}
      <div style={{ overflowX: 'auto', width: '100%' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontFamily: 'var(--font-family)',
          minWidth: '500px',
        }}>
          {/* Header */}
          <thead>
            <tr style={{
              background: 'var(--color-surface-low)',
              borderBottom: '1px solid var(--color-outline-variant)',
            }}>
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{
                    padding: '12px 16px',
                    textAlign: col.align || 'left',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: 'var(--color-outline)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    whiteSpace: 'nowrap',
                    width: col.width || 'auto',
                  }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} style={{ padding: '24px 16px' }}>
                  <LoadingSkeleton lines={4} height={40} />
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>
                  <EmptyState
                    icon={emptyIcon}
                    title={emptyTitle}
                    subtitle={emptySubtitle}
                  />
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <TableRow
                  key={row[rowKey] ?? idx}
                  row={row}
                  columns={columns}
                  idx={idx}
                  onClick={onRowClick}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ── Row internal ── */
function TableRow({ row, columns, idx, onClick }) {
  const isClickable = !!onClick

  return (
    <tr
      onClick={() => onClick?.(row)}
      style={{
        borderBottom: '1px solid var(--color-outline-variant)',
        background: idx % 2 === 0 ? '#ffffff' : 'var(--color-surface-low)',
        cursor: isClickable ? 'pointer' : 'default',
        transition: 'background .12s',
      }}
      onMouseOver={e => {
        if (isClickable) e.currentTarget.style.background = 'var(--color-surface-container)'
      }}
      onMouseOut={e => {
        e.currentTarget.style.background = idx % 2 === 0
          ? '#ffffff'
          : 'var(--color-surface-low)'
      }}
    >
      {columns.map((col) => (
        <td
          key={col.key}
          style={{
            padding: '12px 16px',
            fontSize: '13px',
            fontWeight: 400,
            color: 'var(--color-on-surface)',
            textAlign: col.align || 'left',
            verticalAlign: 'middle',
            whiteSpace: col.noWrap ? 'nowrap' : 'normal',
          }}
        >
          {col.render
            ? col.render(row[col.key], row, idx)
            : row[col.key] ?? '-'}
        </td>
      ))}
    </tr>
  )
}

/* ── Pagination ── */
export function Pagination({
  page,
  totalPages,
  onPageChange,
  style: extraStyle = {},
}) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  const visible = pages.filter(p =>
    p === 1 || p === totalPages || Math.abs(p - page) <= 1
  )

  // Sisipkan ellipsis
  const withEllipsis = []
  let prev = null
  for (const p of visible) {
    if (prev && p - prev > 1) withEllipsis.push('...')
    withEllipsis.push(p)
    prev = p
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      gap: 6, padding: '16px 0',
      ...extraStyle,
    }}>
      {/* Prev */}
      <PaginationBtn
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        icon="chevron_left"
      />

      {withEllipsis.map((p, i) =>
        p === '...' ? (
          <span key={`e${i}`} style={{
            width: 32, textAlign: 'center',
            color: 'var(--color-outline)', fontSize: '13px',
          }}>
            …
          </span>
        ) : (
          <PaginationBtn
            key={p}
            label={p}
            active={p === page}
            onClick={() => onPageChange(p)}
          />
        )
      )}

      {/* Next */}
      <PaginationBtn
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        icon="chevron_right"
      />
    </div>
  )
}

function PaginationBtn({ label, icon, active, disabled, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: 32, height: 32,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: 'var(--radius-md)',
        border: active
          ? 'none'
          : '1px solid var(--color-outline-variant)',
        background: active
          ? 'var(--color-primary-container)'
          : 'transparent',
        color: active
          ? '#ffffff'
          : disabled
          ? 'var(--color-outline-variant)'
          : 'var(--color-on-surface)',
        fontSize: '13px', fontWeight: active ? 700 : 500,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all .15s',
        fontFamily: 'var(--font-family)',
      }}
    >
      {icon
        ? <span className="material-symbols-outlined" style={{ fontSize: '17px' }}>{icon}</span>
        : label
      }
    </button>
  )
}
