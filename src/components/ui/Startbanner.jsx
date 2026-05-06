/**
 * StatBanner — Banner header kartu besar bergaya primary-container
 * Sesuai prototipe riwayat absensi: kartu besar biru gelap dengan dekorasi
 *
 * Props:
 *  title   : string — judul utama
 *  subtitle: string — subjudul/keterangan
 *  stats   : [{ label, value }] — daftar statistik di dalam banner
 *  icon    : string — Material Symbol nama ikon dekorasi
 */

export default function StatBanner({
  title,
  subtitle,
  stats = [],
  icon = 'calendar_month',
  style: extraStyle = {},
}) {
  return (
    <div style={{
      background: 'var(--color-primary-container)',
      borderRadius: 'var(--radius-xl)',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-md)',
      ...extraStyle,
    }}>
      {/* Ikon dekorasi pojok kanan */}
      <span className="material-symbols-outlined" style={{
        position: 'absolute', top: 12, right: 12,
        fontSize: '72px',
        color: 'rgba(255,255,255,0.08)',
        pointerEvents: 'none',
        lineHeight: 1,
      }}>
        {icon}
      </span>

      {/* Lingkaran dekoratif */}
      <div style={{
        position: 'absolute', bottom: -20, left: -20,
        width: 100, height: 100, borderRadius: '50%',
        background: 'rgba(255,255,255,0.04)',
        pointerEvents: 'none',
      }} />

      {/* Konten */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {subtitle && (
          <p style={{
            margin: '0 0 4px',
            fontSize: '12px', fontWeight: 600,
            color: 'var(--color-on-primary-container)',
            opacity: 0.8, letterSpacing: '0.02em',
          }}>
            {subtitle}
          </p>
        )}
        <h2 style={{
          margin: '0 0 16px',
          fontSize: '22px', fontWeight: 700,
          color: '#ffffff',
          fontFamily: 'var(--font-family)',
          lineHeight: 1.2,
        }}>
          {title}
        </h2>

        {/* Stats row */}
        {stats.length > 0 && (
          <div style={{
            display: 'flex', alignItems: 'center',
            gap: 20, flexWrap: 'wrap',
          }}>
            {stats.map((stat, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                {idx > 0 && (
                  <div style={{
                    width: 1, height: 28,
                    background: 'rgba(255,255,255,0.20)',
                  }} />
                )}
                <div>
                  <p style={{
                    margin: 0, fontSize: '20px', fontWeight: 700,
                    color: '#ffffff', lineHeight: 1,
                  }}>
                    {stat.value}
                  </p>
                  <p style={{
                    margin: '3px 0 0', fontSize: '11px', fontWeight: 500,
                    color: 'rgba(255,255,255,0.65)',
                  }}>
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
