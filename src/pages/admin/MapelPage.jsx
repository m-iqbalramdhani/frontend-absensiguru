import { useState, useEffect, useMemo } from 'react'
import adminService from '../../services/adminService'
import {
  PageHeader, Button, Input, Modal,
  ConfirmDialog, useToast, LoadingSkeleton, EmptyState
} from '../../components/ui'

export default function MapelPage() {
  const toast = useToast()
  const [mapel, setMapel]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [modalAdd, setModalAdd] = useState(false)
  const [modalEdit, setModalEdit] = useState(false)
  const [modalDel, setModalDel] = useState(false)
  const [selected, setSelected] = useState(null)
  const [saving, setSaving]     = useState(false)
  const [form, setForm]         = useState({ id: '', nama_mapel: '' })
  const [errors, setErrors]     = useState({})

  const load = async () => {
    setLoading(true)
    try {
      const res = await adminService.getMapel()
      setMapel(res.data || [])
    } catch { toast.error('Gagal memuat data mapel') }
    finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])

  const filtered = useMemo(() =>
    mapel.filter(m => m.nama_mapel?.toLowerCase().includes(search.toLowerCase()))
  , [mapel, search])

  const validate = (isEdit = false) => {
    const e = {}
    if (!isEdit && !form.id.trim()) e.id = 'ID mapel wajib diisi'
    if (!form.nama_mapel.trim()) e.nama_mapel = 'Nama mapel wajib diisi'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleAdd = async () => {
    if (!validate(false)) return
    setSaving(true)
    try {
      await adminService.createMapel(form)
      toast.success('Mapel berhasil ditambahkan')
      setModalAdd(false); setForm({ id:'', nama_mapel:'' }); load()
    } catch (err) { toast.error(err?.response?.data?.message || 'Gagal menambah mapel') }
    finally { setSaving(false) }
  }

  const openEdit = (item) => { setSelected(item); setForm({ id: item.id, nama_mapel: item.nama_mapel }); setErrors({}); setModalEdit(true) }
  const handleEdit = async () => {
    if (!validate(true)) return
    setSaving(true)
    try {
      await adminService.updateMapel(selected.id, { nama_mapel: form.nama_mapel })
      toast.success('Mapel berhasil diupdate')
      setModalEdit(false); load()
    } catch (err) { toast.error(err?.response?.data?.message || 'Gagal update mapel') }
    finally { setSaving(false) }
  }

  const openDel = (item) => { setSelected(item); setModalDel(true) }
  const handleDel = async () => {
    setSaving(true)
    try {
      await adminService.deleteMapel(selected.id)
      toast.success('Mapel berhasil dihapus')
      setModalDel(false); load()
    } catch (err) { toast.error(err?.response?.data?.message || 'Gagal menghapus mapel') }
    finally { setSaving(false) }
  }

  return (
    <div>
      <PageHeader
        title="Mata Pelajaran"
        subtitle={`${mapel.length} mapel terdaftar`}
        action={
          <Button icon="add" onClick={() => { setForm({ id:'', nama_mapel:'' }); setErrors({}); setModalAdd(true) }}>
            Tambah Mapel
          </Button>
        }
      />

      {/* Search */}
      <div style={{ position:'relative', marginBottom:14 }}>
        <span className="material-symbols-outlined" style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', fontSize:18, color:'var(--color-outline)', pointerEvents:'none' }}>search</span>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari nama mapel..."
          style={{ width:'100%', height:42, padding:'0 14px 0 40px', fontSize:14, fontFamily:'var(--font-family)', border:'1.5px solid var(--color-outline-variant)', borderRadius:'var(--radius-full)', outline:'none', background:'#fff' }}
        />
      </div>

      {/* List */}
      <div style={{ background:'#fff', border:'1px solid var(--color-outline-variant)', borderRadius:'var(--radius-xl)', overflow:'hidden', boxShadow:'var(--shadow-sm)' }}>
        {loading ? (
          <div style={{ padding:16 }}><LoadingSkeleton lines={5} height={52} /></div>
        ) : filtered.length === 0 ? (
          <EmptyState icon="book" title="Belum ada mata pelajaran" subtitle={search ? 'Mapel tidak ditemukan' : 'Tambahkan mapel pertama'} />
        ) : (
          filtered.map((item, idx) => (
            <div key={item.id} style={{
              display:'flex', alignItems:'center', gap:12, padding:'12px 16px',
              borderBottom: idx === filtered.length-1 ? 'none' : '1px solid var(--color-outline-variant)',
              transition:'background .12s',
            }}
              onMouseOver={e => e.currentTarget.style.background = 'var(--color-surface-low)'}
              onMouseOut={e => e.currentTarget.style.background = 'transparent'}
            >
              {/* Icon */}
              <div style={{ width:38, height:38, borderRadius:'var(--radius-md)', background:'var(--color-primary-fixed)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <span className="material-symbols-outlined" style={{ fontSize:20, color:'var(--color-primary-container)' }}>book</span>
              </div>
              {/* Nama */}
              <div style={{ flex:1 }}>
                <p style={{ margin:0, fontSize:14, fontWeight:600 }}>{item.nama_mapel}</p>
                <p style={{ margin:'2px 0 0', fontSize:11, color:'var(--color-outline)' }}>ID: {item.id}</p>
              </div>
              {/* Actions */}
              <div style={{ display:'flex', gap:4 }}>
                <MapelActionBtn icon="edit"   color="#d97706" bg="#fef3c7" onClick={() => openEdit(item)} />
                <MapelActionBtn icon="delete" color="#dc2626" bg="#fee2e2" onClick={() => openDel(item)} />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Tambah */}
      <Modal open={modalAdd} onClose={() => setModalAdd(false)} title="Tambah Mata Pelajaran"
        onConfirm={handleAdd} confirmLabel="Simpan" loading={saving} size="sm">
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <Input label="ID Mata Pelajaran (Kode)" placeholder="cth: h atau b" value={form.id}
            onChange={e => { setForm(p => ({ ...p, id: e.target.value })); setErrors(p => ({ ...p, id: '' })) }}
            error={errors.id} required icon="tag" autoFocus />
          <Input label="Nama Mata Pelajaran" placeholder="cth: Matematika Wajib" value={form.nama_mapel}
            onChange={e => { setForm(p => ({ ...p, nama_mapel: e.target.value })); setErrors(p => ({ ...p, nama_mapel: '' })) }}
            error={errors.nama_mapel} required icon="book" />
        </div>
      </Modal>

      {/* Modal Edit */}
      <Modal open={modalEdit} onClose={() => setModalEdit(false)} title="Edit Mata Pelajaran"
        onConfirm={handleEdit} confirmLabel="Update" loading={saving} size="sm">
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <Input label="ID Mata Pelajaran" value={form.id} disabled icon="tag" />
          <Input label="Nama Mata Pelajaran" value={form.nama_mapel}
            onChange={e => { setForm(p => ({ ...p, nama_mapel: e.target.value })); setErrors(p => ({ ...p, nama_mapel: '' })) }}
            error={errors.nama_mapel} required icon="book" autoFocus />
        </div>
      </Modal>

      <ConfirmDialog open={modalDel} onClose={() => setModalDel(false)} onConfirm={handleDel}
        title="Hapus Mapel"
        message={`Hapus mata pelajaran "${selected?.nama_mapel}"? Jadwal yang menggunakan mapel ini akan ikut terhapus.`}
        confirmLabel="Ya, Hapus" loading={saving} />
    </div>
  )
}

function MapelActionBtn({ icon, color, bg, onClick }) {
  return (
    <button onClick={onClick} style={{ width:32, height:32, borderRadius:'var(--radius-md)', background:'transparent', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--color-outline)', transition:'all .15s' }}
      onMouseOver={e => { e.currentTarget.style.background = bg; e.currentTarget.style.color = color }}
      onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-outline)' }}
    >
      <span className="material-symbols-outlined" style={{ fontSize:18 }}>{icon}</span>
    </button>
  )
}
