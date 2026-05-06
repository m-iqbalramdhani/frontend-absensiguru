import { create } from 'zustand'
import { useEffect } from 'react'

/* ══════════════════════════════════════
   TOAST STORE — Zustand
   Cara pakai:
     import { useToast } from '../components/ui/Toast'
     const toast = useToast()
     toast.success('Berhasil disimpan!')
     toast.error('Terjadi kesalahan')
     toast.info('Informasi penting')
     toast.warning('Harap perhatikan ini')
══════════════════════════════════════ */

let _id = 0

const useToastStore = create((set) => ({
  toasts: [],

  add: (message, type = 'info', duration = 3500) => {
    const id = ++_id
    set(state => ({
      toasts: [...state.toasts, { id, message, type, duration }]
    }))
    setTimeout(() => {
      set(state => ({ toasts: state.toasts.filter(t => t.id !== id) }))
    }, duration)
    return id
  },

  remove: (id) => {
    set(state => ({ toasts: state.toasts.filter(t => t.id !== id) }))
  },
}))

/* Hook yang dipakai di seluruh app */
export function useToast() {
  const { add } = useToastStore()
  return {
    success: (msg, dur)  => add(msg, 'success', dur),
    error:   (msg, dur)  => add(msg, 'error',   dur || 5000),
    info:    (msg, dur)  => add(msg, 'info',    dur),
    warning: (msg, dur)  => add(msg, 'warning', dur),
  }
}

/* ── Konfigurasi tampilan per tipe ── */
const CONFIGS = {
  success: {
    icon: 'check_circle',
    bg: '#f0fdf4',
    border: '#bbf7d0',
    color: '#16a34a',
    iconColor: '#16a34a',
  },
  error: {
    icon: 'cancel',
    bg: '#fff1f2',
    border: '#fecdd3',
    color: '#dc2626',
    iconColor: '#dc2626',
  },
  warning: {
    icon: 'warning',
    bg: '#fffbeb',
    border: '#fde68a',
    color: '#d97706',
    iconColor: '#f59e0b',
  },
  info: {
    icon: 'info',
    bg: '#eff6ff',
    border: '#bfdbfe',
    color: '#2563eb',
    iconColor: '#3b82f6',
  },
}

/* ── Single Toast Item ── */
function ToastItem({ toast, onRemove }) {
  const cfg = CONFIGS[toast.type] || CONFIGS.info

  useEffect(() => {
    const t = setTimeout(() => onRemove(toast.id), toast.duration)
    return () => clearTimeout(t)
  }, [toast, onRemove])

  return (
    <div
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 10,
        padding: '12px 14px',
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
        minWidth: '280px', maxWidth: '360px',
        animation: 'toast-in .25s cubic-bezier(.32,1,.32,1)',
        fontFamily: 'var(--font-family)',
      }}
    >
      {/* Icon */}
      <span className="material-symbols-outlined filled" style={{
        fontSize: '20px', color: cfg.iconColor, flexShrink: 0, marginTop: '1px',
      }}>
        {cfg.icon}
      </span>

      {/* Pesan */}
      <p style={{
        flex: 1, margin: 0,
        fontSize: '13px', fontWeight: 500,
        color: cfg.color, lineHeight: 1.5,
      }}>
        {toast.message}
      </p>

      {/* Tombol tutup */}
      <button
        onClick={() => onRemove(toast.id)}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: cfg.color, padding: 0,
          display: 'flex', alignItems: 'center',
          opacity: 0.6, flexShrink: 0,
          marginTop: '1px',
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>close</span>
      </button>
    </div>
  )
}

/* ── ToastContainer — taruh 1x di App.jsx atau MainLayout ── */
export default function ToastContainer() {
  const { toasts, remove } = useToastStore()

  if (!toasts.length) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: '88px',   /* di atas bottom nav */
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 9999,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', gap: 8,
      pointerEvents: 'none',
    }}>
      {toasts.map(t => (
        <div key={t.id} style={{ pointerEvents: 'auto' }}>
          <ToastItem toast={t} onRemove={remove} />
        </div>
      ))}

      <style>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translateY(16px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
      `}</style>
    </div>
  )
}
