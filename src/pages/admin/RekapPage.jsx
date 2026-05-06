import { useState, useEffect, useMemo } from 'react'
import adminService from '../../services/adminService'
import {
  PageHeader, Badge, useToast,
  LoadingSkeleton, EmptyState, SectionHeader,
  StatBanner, Select
} from '../../components/ui'
import {
  getBulanSekarang, getTahunSekarang,
  formatJam, getInisial, getAvatarColor, hitungPersen
} from '../../utils/helpers'

const BULAN_OPTIONS = [
  {value:'1',label:'Januari'},{value:'2',label:'Februari'},
  {value:'3',label:'Maret'},{value:'4',label:'April'},
  {value:'5',label:'Mei'},{value:'6',label:'Juni'},
  {value:'7',label:'Juli'},{value:'8',label:'Agustus'},
  {value:'9',label:'September'},{value:'10',label:'Oktober'},
  {value:'11',label:'November'},{value:'12',label:'Desember'},
]

const TAHUN_OPTIONS = Array.from({ length:5 }, (_,i) => {
  const y = getTahunSekarang() - i
  return { value: String(y), label: String(y) }
})

export default function RekapPage() {
  const toast = useToast()
  const [tab, setTab]           = useState('bulanan') // 'bulanan' | 'harian'
  const [bulan, setBulan]       = useState(String(getBulanSekarang()))
  const [tahun, setTahun]       = useState(String(getTahunSekarang()))
  const [tanggal, setTanggal]   = useState(new Date().toISOString().split('T')[0])
  const [data, setData]         = useState([])
  const [summary, setSummary]   = useState(null)
  const [loading, setLoading]   = useState(false)
  const [search, setSearch]     = useState('')

  const load = async () => {
    setLoading(true)
    try {
      if (tab === 'bulanan') {
        const res = await adminService.getRekapBulanan(bulan, tahun)
        setData(res.data || [])
        setSummary(res.summary || null)
      } else {
        const res = await adminService.getRekapHarian(tanggal)
        setData(res.data || [])
        setSummary(null)
      }
    } catch { toast.error('Gagal memuat rekap absensi') }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [tab, bulan, tahun, tanggal])

  const filtered = useMemo(() => {
    if (!search) return data
    const q = search.toLowerCase()
    return data.filter(d =>
      d.nama_guru?.toLowerCase().includes(q) || d.nip?.includes(q)
    )
  }, [data, search])

  const namaBulan = BULAN_OPTIONS.find(b => b.value === bulan)?.label || ''

  return (
    <div>
      <PageHeader title="Rekap Absensi" subtitle="Laporan kehadiran guru" />

      {/* Summary Banner — hanya di tab bulanan */}
      {tab === 'bulanan' && summary && (
        <StatBanner
          title={`${namaBulan} ${tahun}`}
          subtitle="Rekap Bulanan"
          icon="assessment"
          stats={[
            { label:'Total Guru',  value: summary.total_guru  || 0 },
            { label:'Total Hadir', value: summary.total_hadir || 0 },
            { label:'Izin',        value: summary.total_izin  || 0 },
            { label:'Sakit',       value: summary.total_sakit || 0 },
          ]}
          style={{ marginBottom:16 }}
        />
      )}

      {/* Tab switcher */}
      <div style={{ display:'flex', gap:0, marginBottom:16, background:'var(--color-surface-low)', borderRadius:'var(--radius-lg)', padding:4 }}>
        {['bulanan','harian'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex:1, padding:'8px', fontSize:13, fontWeight:600,
            border:'none', cursor:'pointer', borderRadius:'var(--radius-md)',
            background: tab === t ? '#fff' : 'transparent',
            color: tab === t ? 'var(--color-primary-container)' : 'var(--color-outline)',
            boxShadow: tab === t ? 'var(--shadow-sm)' : 'none',
            transition:'all .15s', fontFamily:'var(--font-family)',
            textTransform:'capitalize',
          }}>
            {t === 'bulanan' ? '📅 Bulanan' : '📋 Harian'}
          </button>
        ))}
      </div>

      {/* Filter */}
      <div style={{ display:'flex', gap:10, marginBottom:16, flexWrap:'wrap' }}>
        {tab === 'bulanan' ? (
          <>
            <div style={{ flex:1, minWidth:120 }}>
              <Select value={bulan} onChange={e => setBulan(e.target.value)} options={BULAN_OPTIONS} />
            </div>
            <div style={{ flex:1, minWidth:100 }}>
              <Select value={tahun} onChange={e => setTahun(e.target.value)} options={TAHUN_OPTIONS} />
            </div>
          </>
        ) : (
          <input type="date" value={tanggal} onChange={e => setTanggal(e.target.value)}
            style={{ height:44, padding:'0 14px', fontSize:14, fontFamily:'var(--font-family)', border:'1.5px solid var(--color-outline-variant)', borderRadius:'var(--radius-lg)', outline:'none', background:'#fff', flex:1 }}
          />
        )}
        {/* Search */}
        <div style={{ position:'relative', flex:2, minWidth:160 }}>
          <span className="material-symbols-outlined" style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', fontSize:17, color:'var(--color-outline)', pointerEvents:'none' }}>search</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari guru..."
            style={{ width:'100%', height:44, padding:'0 14px 0 38px', fontSize:14, fontFamily:'var(--font-family)', border:'1.5px solid var(--color-outline-variant)', borderRadius:'var(--radius-lg)', outline:'none', background:'#fff' }}
          />
        </div>
      </div>

      {/* Table */}
      <div style={{ background:'#fff', border:'1px solid var(--color-outline-variant)', borderRadius:'var(--radius-xl)', overflow:'hidden', boxShadow:'var(--shadow-sm)' }}>
        {/* Header tabel */}
        <div style={{
          display:'grid',
          gridTemplateColumns: tab === 'bulanan' ? '1fr 56px 56px 56px 56px 80px' : '1fr 80px 80px 80px',
          padding:'10px 16px',
          background:'var(--color-surface-low)',
          borderBottom:'1px solid var(--color-outline-variant)',
          gap:8,
        }}>
          {['Guru', ...(tab === 'bulanan' ? ['Hadir','Izin','Sakit','Alpha','%'] : ['Jam Masuk','Jam Pulang','Status'])].map(h => (
            <span key={h} style={{ fontSize:10, fontWeight:700, color:'var(--color-outline)', textTransform:'uppercase', letterSpacing:'.06em', textAlign: h === 'Guru' ? 'left' : 'center' }}>{h}</span>
          ))}
        </div>

        {loading ? (
          <div style={{ padding:16 }}><LoadingSkeleton lines={5} height={52} /></div>
        ) : filtered.length === 0 ? (
          <EmptyState icon="assessment" title="Belum ada data" subtitle="Coba ubah filter periode" />
        ) : (
          filtered.map((item, idx) => (
            tab === 'bulanan'
              ? <RekapBulananRow key={item.guru_id||idx} item={item} isLast={idx===filtered.length-1} />
              : <RekapHarianRow key={item.id||idx} item={item} isLast={idx===filtered.length-1} />
          ))
        )}
      </div>

      {/* Total info */}
      {!loading && filtered.length > 0 && (
        <p style={{ fontSize:12, color:'var(--color-outline)', marginTop:10, textAlign:'right' }}>
          Menampilkan {filtered.length} dari {data.length} data
        </p>
      )}
    </div>
  )
}

/* ── Row Rekap Bulanan ── */
function RekapBulananRow({ item, isLast }) {
  const { bg, color } = getAvatarColor(item.nama_guru || '')
  const persen = hitungPersen(item.hadir, item.total_hari)
  const persenNum = item.total_hari ? Math.round((item.hadir / item.total_hari) * 100) : 0

  return (
    <div style={{
      display:'grid', gridTemplateColumns:'1fr 56px 56px 56px 56px 80px',
      padding:'10px 16px', gap:8, alignItems:'center',
      borderBottom: isLast ? 'none' : '1px solid var(--color-outline-variant)',
      transition:'background .12s',
    }}
      onMouseOver={e => e.currentTarget.style.background = 'var(--color-surface-low)'}
      onMouseOut={e => e.currentTarget.style.background = 'transparent'}
    >
      <div style={{ display:'flex', alignItems:'center', gap:10, minWidth:0 }}>
        <div style={{ width:34, height:34, borderRadius:'50%', background:bg, color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, flexShrink:0 }}>
          {getInisial(item.nama_guru||'')}
        </div>
        <div style={{ minWidth:0 }}>
          <p style={{ margin:0, fontSize:13, fontWeight:600, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.nama_guru}</p>
          <p style={{ margin:0, fontSize:10, color:'var(--color-outline)' }}>{item.nip || 'NIP -'}</p>
        </div>
      </div>
      <CellNum val={item.hadir}  color="#16a34a" />
      <CellNum val={item.izin}   color="#2563eb" />
      <CellNum val={item.sakit}  color="#dc2626" />
      <CellNum val={item.alpha}  color="#64748b" />
      {/* Persentase */}
      <div style={{ textAlign:'center' }}>
        <p style={{ margin:'0 0 3px', fontSize:12, fontWeight:700, color: persenNum >= 90 ? '#16a34a' : persenNum >= 75 ? '#d97706' : '#dc2626' }}>{persen}</p>
        <div style={{ height:4, background:'var(--color-surface-container)', borderRadius:2, overflow:'hidden' }}>
          <div style={{ width:`${Math.min(persenNum,100)}%`, height:'100%', borderRadius:2, background: persenNum >= 90 ? '#16a34a' : persenNum >= 75 ? '#f59e0b' : '#dc2626' }} />
        </div>
      </div>
    </div>
  )
}

function CellNum({ val, color }) {
  return (
    <p style={{ margin:0, fontSize:14, fontWeight:700, color: val > 0 ? color : 'var(--color-outline-variant)', textAlign:'center' }}>
      {val || 0}
    </p>
  )
}

/* ── Row Rekap Harian ── */
function RekapHarianRow({ item, isLast }) {
  const { bg, color } = getAvatarColor(item.nama_guru || '')
  return (
    <div style={{
      display:'grid', gridTemplateColumns:'1fr 80px 80px 80px',
      padding:'10px 16px', gap:8, alignItems:'center',
      borderBottom: isLast ? 'none' : '1px solid var(--color-outline-variant)',
      transition:'background .12s',
    }}
      onMouseOver={e => e.currentTarget.style.background = 'var(--color-surface-low)'}
      onMouseOut={e => e.currentTarget.style.background = 'transparent'}
    >
      <div style={{ display:'flex', alignItems:'center', gap:10, minWidth:0 }}>
        <div style={{ width:34, height:34, borderRadius:'50%', background:bg, color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, flexShrink:0 }}>
          {getInisial(item.nama_guru||'')}
        </div>
        <div style={{ minWidth:0 }}>
          <p style={{ margin:0, fontSize:13, fontWeight:600, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.nama_guru}</p>
          <p style={{ margin:0, fontSize:10, color:'var(--color-outline)' }}>{item.nip || 'NIP -'}</p>
        </div>
      </div>
      <p style={{ margin:0, fontSize:13, fontWeight:600, textAlign:'center', color:'var(--color-on-surface)' }}>
        {item.jam_masuk ? formatJam(item.jam_masuk) : '--:--'}
      </p>
      <p style={{ margin:0, fontSize:13, fontWeight:600, textAlign:'center', color:'var(--color-on-surface)' }}>
        {item.jam_keluar ? formatJam(item.jam_keluar) : '--:--'}
      </p>
      <div style={{ display:'flex', justifyContent:'center' }}>
        <Badge status={item.status} size="sm" />
      </div>
    </div>
  )
}
