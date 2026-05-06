import { Component } from 'react'

/* ══════════════════════════════════════
   ErrorBoundary — tangkap error React
   Pasang di App.jsx sebagai wrapper utama
══════════════════════════════════════ */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div style={{
        minHeight: '100dvh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#f6f3f2', padding: 24, fontFamily: 'Inter, sans-serif',
      }}>
        <div style={{
          background: '#fff', borderRadius: 16, padding: '32px 28px',
          maxWidth: 420, width: '100%', textAlign: 'center',
          boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
          border: '1px solid #fee2e2',
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14,
            background: '#fee2e2', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 28, color: '#dc2626' }}>
              error
            </span>
          </div>
          <h2 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 700, color: '#1c1b1b' }}>
            Terjadi Kesalahan
          </h2>
          <p style={{ margin: '0 0 20px', fontSize: 13, color: '#747782', lineHeight: 1.6 }}>
            Aplikasi mengalami error yang tidak terduga. Silakan muat ulang halaman.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: '#002d72', color: '#fff', border: 'none',
              borderRadius: 12, padding: '10px 24px', fontSize: 14,
              fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            Muat Ulang
          </button>
          {import.meta.env.DEV && (
            <pre style={{
              marginTop: 16, textAlign: 'left', fontSize: 11,
              color: '#dc2626', background: '#fff5f5', borderRadius: 8,
              padding: 12, overflow: 'auto', maxHeight: 120,
            }}>
              {this.state.error?.toString()}
            </pre>
          )}
        </div>
      </div>
    )
  }
}
