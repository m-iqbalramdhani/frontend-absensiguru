import { useState, useEffect, useMemo } from 'react'
import adminService from '../../services/adminService'
import {
  PageHeader, Button, Select, Modal,
  ConfirmDialog, useToast, LoadingSkeleton,
  EmptyState, Badge, SectionHeader
} from '../../components/ui'

const HARI = ['Senin','Selasa','Rabu','Kamis','Jumat','Sabtu']
const HARI_OPTIONS = HARI.map(h => ({ value:h, label:h }))

export default function KelolaJadwalPage() {
  const toast = useToast()
  const [jadwal, setJadwal]   = useState([])
  const [guru, setGuru]       = useState([])
  const [mapel, setMapel]     = useState([])
  const [loading, setLoading] = useState(true)
  const [filterHari, setFilterHari] = useState('')
  const [modalAdd, setModalAdd] = useState(false)
  const [modalEdit, setModalEdit] = useState(false)
  const [modalDel, setModalDel]  = useState(false)
  const [selected, setSelected]  = useState(null)
  const [saving, setSaving]      = useState(false)

  const emptyForm = { guru_id:'', mapel_id:'', hari:'', jam_mulai:'', jam_selesai:'' }
  const [form, setForm]   = useState(emptyForm)
  const [errors, setErrors] = useState({})

  const load = async () => {
    setLoading(true)
    try {
      const [jRes, gRes, mRes] = await Promise.all([
        adminService.getJadwal(),
        adminService.getGuru(),
        adminService.getMapel(),
      ])
      setJadwal(jRes.data || [])
      setGuru(gRes.data || [])
      setMapel(mRes.data || [])
    } catch { toast.error('Gagal memuat data jadwal') }
    finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])

  const guruOptions  = guru.map(g  => ({ value: String(g.id), label: g.nama }))
  const mapelOptions = mapel.map(m => ({ value: String(m.id), label: m.nama_mapel }))

  const filtered = useMemo(() =>
    filterHari ? jadwal.filter(j => j.hari === filterHari) : jadwal
  , [jadwal, filterHari])

  // Group by hari
  const grouped = useMemo(() => {
    const g = {}
    HARI.forEach(h => { g[h] = [] })
    filtered.forEach(j => { if (g[j.hari]) g[j.hari].push(j) })
    return g
  }, [filtered])

  const setField = k => e => {
    setForm(p => ({ ...p, [k]: e.target.value }))
    if (errors[k]) setErrors(p => ({ ...p, [k]:'' }))
  }

  const validate = () => {
    const e = {}
    if (!form.guru_id)    e.guru_id    = 'Pilih guru'
    if (!form.mapel_id)   e.mapel_id   = 'Pilih mapel'
    if (!form.hari)       e.hari       = 'Pilih hari'
    if (!form.jam_mulai)  e.jam_mulai  = 'Masukkan jam mulai'
    if (!form.jam_selesai) e.jam_selesai = 'Masukkan jam selesai'
    if (form.jam_mulai && form.jam_selesai && form.jam_mulai >= form.jam_selesai)
      e.jam_selesai = 'Jam selesai harus setelah jam mulai'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleAdd = async () => {
    if (!validate()) return
    setSaving(true)
    try {
      await adminService.createJadwal({ ...form, guru_id: Number(form.guru_id), mapel_id: Number(form.mapel_id) })
      toast.success('Jadwal berhasil ditambahkan')
      setModalAdd(false); setForm(emptyForm); load()
    } catch (err) { toast.error(err?.response?.data?.message || 'Gagal menambah jadwal') }
    finally { setSaving(false) }
  }

  const openEdit = item => {
    setSelected(item)
    setForm({
      guru_id: String(item.guru_id), mapel_id: String(item.mapel_id),
      hari: item.hari, jam_mulai: item.jam_mulai?.substring(0,5),
      jam_selesai: item.jam_selesai?.substring(0,5),
    })
    setErrors({}); setModalEdit(true)
  }
  const handleEdit = async () => {
    if (!validate()) return
    setSaving(true)
    try {
      await adminService.updateJadwal(selected.id, { ...form, guru_id: Number(form.guru_id), mapel_id: Number(form.mapel_id) })
      toast.success('Jadwal berhasil diupdate')
      setModalEdit(false); load()
    } catch (err) { toast.error(err?.response?.data?.message || 'Gagal update jadwal') }
    finally { setSaving(false) }
  }

  const openDel = item => { setSelected(item); setModalDel(true) }
  const handleDel = async () => {
    setSaving(true)
    try {
      await adminService.deleteJadwal(selected.id)
      toast.success('Jadwal berhasil dihapus')
      setModalDel(false); load()
    } catch (err) { toast.error('Gagal menghapus jadwal') }
    finally { setSaving(false) }
  }

  return (
    <div>
      <PageHeader
        title="Kelola Jadwal"
        subtitle={`${jadwal.length} jadwal tersimpan`}
        action={<Button icon="add" onClick={() => { setForm(emptyForm); setErrors({}); setModalAdd(true) }}>Tambah Jadwal</Button>}
      />

      {/* Filter hari */}
      <div style={{ display:'flex', gap:6, marginBottom:16, flexWrap:'wrap' }}>
        {['', ...HARI].map(h => (
          <button key={h||'all'} onClick={() => setFilterHari(h)}
            style={{
              padding:'6px 14px', borderRadius:'var(--radius-full)', fontSize:12, fontWeight:600,
              cursor:'pointer', border:'1.5px solid',
              borderColor: filterHari === h ? 'var(--color-primary-container)' : 'var(--color-outline-variant)',
              background: filterHari === h ? 'var(--color-primary-container)' : '#fff',
              color: filterHari === h ? '#fff' : 'var(--color-on-surface-variant)',
              transition:'all .15s', fontFamily:'var(--font-family)',
            }}>
            {h || 'Semua'}
          </button>
        ))}
      </div>

      {/* Grouped by hari */}
      {loading ? (
        <LoadingSkeleton lines={4} height={70} />
      ) : filtered.length === 0 ? (
        <EmptyState icon="calendar_today" title="Belum ada jadwal" subtitle="Tambahkan jadwal mengajar guru" />
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {HARI.map(hari => {
            const items = grouped[hari]
            if (!items || items.length === 0) return null
            return (
              <div key={hari}>
                <SectionHeader title={hari} style={{ marginBottom:8 }} />
                <div style={{ background:'#fff', border:'1px solid var(--color-outline-variant)', borderRadius:'var(--radius-xl)', overflow:'hidden', boxShadow:'var(--shadow-sm)' }}>
                  {items.map((item, idx) => (
                    <JadwalRow key={item.id} item={item} isLast={idx===items.length-1} onEdit={openEdit} onDel={openDel} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal Tambah / Edit */}
      {[
        { open:modalAdd, onClose:()=>setModalAdd(false), title:'Tambah Jadwal', onConfirm:handleAdd },
        { open:modalEdit, onClose:()=>setModalEdit(false), title:'Edit Jadwal', onConfirm:handleEdit },
      ].map(m => (
        <Modal key={m.title} open={m.open} onClose={m.onClose} title={m.title}
          onConfirm={m.onConfirm} confirmLabel="Simpan" loading={saving}>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <Select label="Guru" value={form.guru_id} onChange={setField('guru_id')}
              options={guruOptions} placeholder="Pilih guru..." error={errors.guru_id} required />
            <Select label="Mata Pelajaran" value={form.mapel_id} onChange={setField('mapel_id')}
              options={mapelOptions} placeholder="Pilih mapel..." error={errors.mapel_id} required />
            <Select label="Hari" value={form.hari} onChange={setField('hari')}
              options={HARI_OPTIONS} placeholder="Pilih hari..." error={errors.hari} required />
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              <TimeInput label="Jam Mulai" value={form.jam_mulai} onChange={setField('jam_mulai')} error={errors.jam_mulai} />
              <TimeInput label="Jam Selesai" value={form.jam_selesai} onChange={setField('jam_selesai')} error={errors.jam_selesai} />
            </div>
          </div>
        </Modal>
      ))}

      <ConfirmDialog open={modalDel} onClose={() => setModalDel(false)} onConfirm={handleDel}
        title="Hapus Jadwal"
        message={`Hapus jadwal ${selected?.nama_mapel} - ${selected?.hari} (${selected?.jam_mulai?.substring(0,5)} - ${selected?.jam_selesai?.substring(0,5)})?`}
        confirmLabel="Ya, Hapus" loading={saving} />
    </div>
  )
}

function JadwalRow({ item, isLast, onEdit, onDel }) {
  return (
    <div style={{
      display:'flex', alignItems:'center', gap:12, padding:'12px 16px',
      borderBottom: isLast ? 'none' : '1px solid var(--color-outline-variant)',
      transition:'background .12s',
    }}
      onMouseOver={e => e.currentTarget.style.background = 'var(--color-surface-low)'}
      onMouseOut={e => e.currentTarget.style.background = 'transparent'}
    >
      {/* Jam */}
      <div style={{ textAlign:'center', flexShrink:0, minWidth:48 }}>
        <p style={{ margin:0, fontSize:12, fontWeight:700, color:'var(--color-primary-container)', lineHeight:1 }}>{item.jam_mulai?.substring(0,5)}</p>
        <p style={{ margin:'1px 0', fontSize:10, color:'var(--color-outline)' }}>—</p>
        <p style={{ margin:0, fontSize:12, fontWeight:700, color:'var(--color-primary-container)', lineHeight:1 }}>{item.jam_selesai?.substring(0,5)}</p>
      </div>
      <div style={{ width:1, height:32, background:'var(--color-outline-variant)', flexShrink:0 }} />
      <div style={{ flex:1, minWidth:0 }}>
        <p style={{ margin:0, fontSize:14, fontWeight:600, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.nama_mapel}</p>
        <p style={{ margin:'2px 0 0', fontSize:11, color:'var(--color-on-surface-variant)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.nama_guru}</p>
      </div>
      <div style={{ display:'flex', gap:4 }}>
        <button onClick={() => onEdit(item)} style={actionStyle} onMouseOver={e => hov(e,'#fef3c7','#d97706')} onMouseOut={e => unhov(e)}>
          <span className="material-symbols-outlined" style={{ fontSize:17 }}>edit</span>
        </button>
        <button onClick={() => onDel(item)} style={actionStyle} onMouseOver={e => hov(e,'#fee2e2','#dc2626')} onMouseOut={e => unhov(e)}>
          <span className="material-symbols-outlined" style={{ fontSize:17 }}>delete</span>
        </button>
      </div>
    </div>
  )
}

const actionStyle = { width:30, height:30, borderRadius:'var(--radius-md)', background:'transparent', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--color-outline)', transition:'all .15s' }
const hov = (e, bg, c) => { e.currentTarget.style.background = bg; e.currentTarget.style.color = c }
const unhov = (e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-outline)' }

function TimeInput({ label, value, onChange, error }) {
  return (
    <div>
      <label style={{ display:'block', fontSize:13, fontWeight:600, color: error ? 'var(--color-danger)' : 'var(--color-on-surface-variant)', marginBottom:6 }}>
        {label} <span style={{ color:'var(--color-secondary-container)' }}>*</span>
      </label>
      <input type="time" value={value} onChange={onChange}
        style={{
          width:'100%', height:44, padding:'0 12px',
          fontSize:14, fontFamily:'var(--font-family)',
          border:`1.5px solid ${error ? 'var(--color-danger)' : 'var(--color-outline-variant)'}`,
          borderRadius:'var(--radius-lg)', outline:'none',
          background: error ? '#fff5f5' : '#fff',
        }}
      />
      {error && <p style={{ fontSize:12, color:'var(--color-danger)', marginTop:4 }}>{error}</p>}
    </div>
  )
}
