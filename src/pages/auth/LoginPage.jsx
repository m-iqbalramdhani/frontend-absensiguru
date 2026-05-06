import useLogin from '../../hooks/useLogin'

/* ─────────────────────────────────────────────
   LoginPage — SMK Binatama
   Sesuai design system prototipe:
   • Background gradient biru dari AuthLayout
   • Card putih rounded-xl di tengah
   • Logo + brand di atas form
   • Input email + password dengan icon
   • Tombol login primary full-width
   • Error state dari server
───────────────────────────────────────────── */
export default function LoginPage() {
  const { form, errors, loading, serverError, handleChange, handleSubmit } = useLogin()

  return (
    <div>

      {/* ── Kartu Login ── */}
      <div style={{
        background: '#ffffff',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 24px 64px rgba(0,0,0,0.20)',
      }}>

        {/* ── Header kartu — brand strip ── */}
        <div style={{
          background: 'var(--color-primary)',
          padding: '28px 32px 24px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Dekorasi lingkaran */}
          <div style={{
            position: 'absolute', top: -40, right: -40,
            width: 160, height: 160, borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', bottom: -30, left: 60,
            width: 100, height: 100, borderRadius: '50%',
            background: 'rgba(255,255,255,0.04)',
            pointerEvents: 'none',
          }} />

          {/* Logo + Nama sekolah */}
          <div style={{
            display: 'flex', alignItems: 'center',
            gap: '14px', position: 'relative', zIndex: 1,
          }}>
            <div style={{
              width: 52, height: 52,
              borderRadius: '14px',
              background: 'rgba(255,255,255,0.12)',
              border: '1.5px solid rgba(255,255,255,0.20)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <span className="material-symbols-outlined" style={{
                color: '#fff', fontSize: '28px',
              }}>
                school
              </span>
            </div>
            <div>
              <div style={{
                color: '#fff', fontWeight: 800,
                fontSize: '18px', lineHeight: 1.2,
                letterSpacing: '-0.01em',
              }}>
                SMK BINATAMA
              </div>
              <div style={{
                color: 'rgba(255,255,255,0.60)',
                fontSize: '12px', fontWeight: 500,
                marginTop: '2px',
              }}>
                Sistem Informasi Absensi
              </div>
            </div>
          </div>

          {/* Judul halaman */}
          <div style={{ marginTop: '20px', position: 'relative', zIndex: 1 }}>
            <h1 style={{
              color: '#fff', margin: 0,
              fontSize: '22px', fontWeight: 700,
              lineHeight: 1.3, letterSpacing: '-0.01em',
            }}>
              Selamat Datang
            </h1>
            <p style={{
              color: 'rgba(255,255,255,0.60)',
              fontSize: '13px', margin: '4px 0 0',
            }}>
              Masuk untuk melanjutkan ke sistem absensi
            </p>
          </div>
        </div>

        {/* ── Body form ── */}
        <div style={{ padding: '28px 32px 32px' }}>

          {/* Error dari server */}
          {serverError && (
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: '10px',
              padding: '12px 14px',
              background: 'var(--color-danger-bg)',
              border: '1px solid rgba(220,38,38,0.20)',
              borderRadius: '12px',
              marginBottom: '20px',
            }}>
              <span className="material-symbols-outlined" style={{
                fontSize: '18px', color: 'var(--color-danger)',
                flexShrink: 0, marginTop: '1px',
              }}>
                error
              </span>
              <p style={{
                margin: 0, fontSize: '13px',
                color: 'var(--color-danger)',
                fontWeight: 500, lineHeight: 1.5,
              }}>
                {serverError}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

              {/* ── Input Email ── */}
              <InputField
                label="Email"
                type="email"
                icon="email"
                placeholder="nama@sekolah.com"
                value={form.email}
                onChange={handleChange('email')}
                error={errors.email}
                required
                autoComplete="email"
                autoFocus
              />

              {/* ── Input Password ── */}
              <PasswordField
                label="Password"
                placeholder="Masukkan password"
                value={form.password}
                onChange={handleChange('password')}
                error={errors.password}
                required
                autoComplete="current-password"
              />

            </div>

            {/* ── Tombol Login ── */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                height: '48px',
                marginTop: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                background: loading
                  ? 'var(--color-primary-container)'
                  : 'var(--color-primary-container)',
                color: '#fff',
                border: 'none',
                borderRadius: '14px',
                fontSize: '15px',
                fontWeight: 700,
                fontFamily: 'var(--font-family)',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.75 : 1,
                transition: 'all .15s',
                boxShadow: loading
                  ? 'none'
                  : '0 4px 16px rgba(0,45,114,0.30)',
                letterSpacing: '0.01em',
              }}
              onMouseOver={e => {
                if (!loading) {
                  e.currentTarget.style.background = '#003580'
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,45,114,0.40)'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                }
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = 'var(--color-primary-container)'
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,45,114,0.30)'
                e.currentTarget.style.transform = 'none'
              }}
            >
              {loading ? (
                <>
                  <span style={{
                    width: 18, height: 18,
                    border: '2.5px solid rgba(255,255,255,0.35)',
                    borderTopColor: '#fff',
                    borderRadius: '50%',
                    animation: 'spin .65s linear infinite',
                    flexShrink: 0,
                  }} />
                  Memproses...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                    login
                  </span>
                  Masuk
                </>
              )}
            </button>
          </form>

          {/* ── Footer info ── */}
          <div style={{
            marginTop: '20px',
            paddingTop: '16px',
            borderTop: '1px solid var(--color-outline-variant)',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: '6px',
          }}>
            <span className="material-symbols-outlined" style={{
              fontSize: '14px', color: 'var(--color-outline)',
            }}>
              info
            </span>
            <p style={{
              margin: 0, fontSize: '12px',
              color: 'var(--color-outline)',
              textAlign: 'center',
            }}>
              Akun diberikan oleh administrator sekolah
            </p>
          </div>
        </div>
      </div>

      {/* ── Footer bawah ── */}
      <p style={{
        textAlign: 'center', marginTop: '20px',
        fontSize: '11px', color: 'rgba(255,255,255,0.40)',
      }}>
        © 2026 SMK Binatama · Sistem Absensi
      </p>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}

/* ─────────────────────────────────────
   Sub-komponen lokal: InputField
   (hanya dipakai di LoginPage ini)
───────────────────────────────────── */
function InputField({
  label, type = 'text', icon, placeholder,
  value, onChange, error, required,
  autoComplete, autoFocus,
}) {
  return (
    <div>
      <label style={{
        display: 'block',
        fontSize: '13px', fontWeight: 600,
        color: error
          ? 'var(--color-danger)'
          : 'var(--color-on-surface-variant)',
        marginBottom: '7px',
      }}>
        {label}
        {required && (
          <span style={{ color: 'var(--color-secondary-container)', marginLeft: '3px' }}>
            *
          </span>
        )}
      </label>
      <div style={{ position: 'relative' }}>
        {icon && (
          <span className="material-symbols-outlined" style={{
            position: 'absolute', left: '13px',
            top: '50%', transform: 'translateY(-50%)',
            fontSize: '18px', lineHeight: 1,
            color: error ? 'var(--color-danger)' : 'var(--color-outline)',
            pointerEvents: 'none',
            transition: 'color .15s',
          }}>
            {icon}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          style={{
            width: '100%', height: '46px',
            padding: `0 14px 0 ${icon ? '42px' : '14px'}`,
            fontSize: '14px',
            fontFamily: 'var(--font-family)',
            color: 'var(--color-on-surface)',
            background: error ? '#fff5f5' : '#fff',
            border: `1.5px solid ${error
              ? 'var(--color-danger)'
              : 'var(--color-outline-variant)'}`,
            borderRadius: '12px',
            outline: 'none',
            transition: 'border-color .15s, box-shadow .15s, background .15s',
          }}
          onFocus={e => {
            e.target.style.borderColor = error
              ? 'var(--color-danger)'
              : 'var(--color-primary-container)'
            e.target.style.boxShadow = error
              ? '0 0 0 3px rgba(220,38,38,0.12)'
              : '0 0 0 3px rgba(0,45,114,0.12)'
          }}
          onBlur={e => {
            e.target.style.borderColor = error
              ? 'var(--color-danger)'
              : 'var(--color-outline-variant)'
            e.target.style.boxShadow = 'none'
          }}
        />
      </div>
      {error && (
        <p style={{
          margin: '5px 0 0',
          fontSize: '12px',
          color: 'var(--color-danger)',
          display: 'flex', alignItems: 'center', gap: '4px',
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>
            error
          </span>
          {error}
        </p>
      )}
    </div>
  )
}

/* ─────────────────────────────────────
   Sub-komponen lokal: PasswordField
   Toggle show/hide password
───────────────────────────────────── */
import { useState } from 'react'

function PasswordField({
  label, placeholder, value, onChange,
  error, required, autoComplete,
}) {
  const [show, setShow] = useState(false)

  return (
    <div>
      <label style={{
        display: 'block',
        fontSize: '13px', fontWeight: 600,
        color: error
          ? 'var(--color-danger)'
          : 'var(--color-on-surface-variant)',
        marginBottom: '7px',
      }}>
        {label}
        {required && (
          <span style={{ color: 'var(--color-secondary-container)', marginLeft: '3px' }}>
            *
          </span>
        )}
      </label>
      <div style={{ position: 'relative' }}>
        {/* Icon lock kiri */}
        <span className="material-symbols-outlined" style={{
          position: 'absolute', left: '13px',
          top: '50%', transform: 'translateY(-50%)',
          fontSize: '18px', lineHeight: 1,
          color: error ? 'var(--color-danger)' : 'var(--color-outline)',
          pointerEvents: 'none',
        }}>
          lock
        </span>

        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          style={{
            width: '100%', height: '46px',
            padding: '0 44px 0 42px',
            fontSize: '14px',
            fontFamily: 'var(--font-family)',
            color: 'var(--color-on-surface)',
            background: error ? '#fff5f5' : '#fff',
            border: `1.5px solid ${error
              ? 'var(--color-danger)'
              : 'var(--color-outline-variant)'}`,
            borderRadius: '12px',
            outline: 'none',
            transition: 'border-color .15s, box-shadow .15s',
          }}
          onFocus={e => {
            e.target.style.borderColor = error
              ? 'var(--color-danger)'
              : 'var(--color-primary-container)'
            e.target.style.boxShadow = error
              ? '0 0 0 3px rgba(220,38,38,0.12)'
              : '0 0 0 3px rgba(0,45,114,0.12)'
          }}
          onBlur={e => {
            e.target.style.borderColor = error
              ? 'var(--color-danger)'
              : 'var(--color-outline-variant)'
            e.target.style.boxShadow = 'none'
          }}
        />

        {/* Toggle visibility kanan */}
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setShow(v => !v)}
          style={{
            position: 'absolute', right: '12px',
            top: '50%', transform: 'translateY(-50%)',
            background: 'none', border: 'none',
            cursor: 'pointer', padding: '4px',
            color: 'var(--color-outline)',
            display: 'flex', alignItems: 'center',
            borderRadius: '6px',
            transition: 'color .15s',
          }}
          onMouseOver={e => e.currentTarget.style.color = 'var(--color-primary-container)'}
          onMouseOut={e => e.currentTarget.style.color = 'var(--color-outline)'}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
            {show ? 'visibility_off' : 'visibility'}
          </span>
        </button>
      </div>

      {error && (
        <p style={{
          margin: '5px 0 0',
          fontSize: '12px',
          color: 'var(--color-danger)',
          display: 'flex', alignItems: 'center', gap: '4px',
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>
            error
          </span>
          {error}
        </p>
      )}
    </div>
  )
}
