import { useEffect } from 'react'
import Button from './Button'

/**
 * Modal — SMK Binatama Design System
 *
 * Props:
 *  open      : bool
 *  onClose   : fn
 *  title     : string
 *  size      : 'sm' | 'md' | 'lg'
 *  footer    : ReactNode — override footer kustom
 *  onConfirm : fn — tombol konfirmasi
 *  confirmLabel : string
 *  confirmVariant : 'primary' | 'danger' | dll
 *  loading   : bool — state loading konfirmasi
 *  children  : ReactNode — konten modal
 */

const SIZES = {
  sm: '380px',
  md: '480px',
  lg: '600px',
}

export default function Modal({
  open,
  onClose,
  title,
  size = 'md',
  footer,
  onConfirm,
  confirmLabel = 'Simpan',
  confirmVariant = 'primary',
  cancelLabel = 'Batal',
  loading = false,
  children,
}) {
  // Tutup modal dengan Escape
  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (e.key === 'Escape') onClose?.() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  // Cegah scroll body saat modal terbuka
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  const maxW = SIZES[size] || SIZES.md

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose?.() }}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
        animation: 'modal-fade-in .2s ease',
      }}
    >
      <div style={{
        width: '100%',
        maxWidth: maxW,
        background: '#ffffff',
        borderRadius: 'var(--radius-md)',
        boxShadow: '0 4px 32px rgba(0,0,0,0.18)',
        overflow: 'hidden',
        animation: 'modal-zoom-in .25s cubic-bezier(.32,1,.32,1)',
        maxHeight: '90dvh',
        display: 'flex', flexDirection: 'column',
      }}
      /* Desktop: center modal */
      className="modal-sheet"
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: '1px solid var(--color-outline-variant)',
          flexShrink: 0,
        }}>
          <h3 style={{
            margin: 0, fontSize: '16px', fontWeight: 700,
            color: 'var(--color-primary-container)',
            fontFamily: 'var(--font-family)',
          }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--color-outline)', padding: '4px',
              borderRadius: 'var(--radius-full)',
              display: 'flex', alignItems: 'center',
              transition: 'background .15s',
            }}
            onMouseOver={e => e.currentTarget.style.background = 'var(--color-surface-low)'}
            onMouseOut={e => e.currentTarget.style.background = 'none'}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>close</span>
          </button>
        </div>

        {/* Body */}
        <div style={{
          padding: '20px',
          overflowY: 'auto',
          flex: 1,
        }}>
          {children}
        </div>

        {/* Footer */}
        {(footer !== undefined ? footer : (onConfirm || onClose)) && (
          <div style={{
            padding: '12px 20px',
            borderTop: '1px solid var(--color-outline-variant)',
            display: 'flex', gap: 10, justifyContent: 'flex-end',
            flexShrink: 0,
            background: 'var(--color-surface-low)',
          }}>
            {footer || (
              <>
                <Button variant="outline" onClick={onClose}>
                  {cancelLabel}
                </Button>
                {onConfirm && (
                  <Button variant={confirmVariant} onClick={onConfirm} loading={loading}>
                    {confirmLabel}
                  </Button>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes modal-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes modal-zoom-in {
          from { transform: scale(0.95); opacity: 0; }
          to   { transform: scale(1);    opacity: 1; }
        }
        @keyframes modal-slide-up {
          from { transform: translateY(40px); opacity: 0; }
          to   { transform: translateY(0);   opacity: 1; }
        }
        @media (max-width: 640px) {
          .modal-sheet {
            width: 100% !important;
            border-radius: var(--radius-xl) var(--radius-xl) 0 0 !important;
            max-height: 85dvh;
            animation: modal-slide-up .25s cubic-bezier(.32,1,.32,1) !important;
          }
        }
      `}</style>
    </div>
  )
}

/* ── ConfirmDialog — modal konfirmasi hapus/aksi destructive ── */
export function ConfirmDialog({
  open, onClose, onConfirm,
  title = 'Konfirmasi',
  message = 'Apakah Anda yakin?',
  confirmLabel = 'Ya, Lanjutkan',
  variant = 'danger',
  loading = false,
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      onConfirm={onConfirm}
      confirmLabel={confirmLabel}
      confirmVariant={variant}
      loading={loading}
    >
      <p style={{
        fontSize: '14px', color: 'var(--color-on-surface-variant)',
        lineHeight: 1.6, margin: 0,
      }}>
        {message}
      </p>
    </Modal>
  )
}
