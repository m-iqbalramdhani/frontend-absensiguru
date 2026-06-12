import { useState, useEffect, useMemo } from 'react'
import adminService from '../../services/adminService'
import {
  PageHeader, Button, Input, Select,
  Modal, ConfirmDialog, useToast,
  LoadingSkeleton, EmptyState, Badge, Pagination
} from '../../components/ui'
import { getInisial, getAvatarColor, formatTanggalPendek } from '../../utils/helpers'

const HARI_OPTIONS = [
  {value:'Senin',label:'Senin'},{value:'Selasa',label:'Selasa'},
  {value:'Rabu',label:'Rabu'},{value:'Kamis',label:'Kamis'},
  {value:'Jumat',label:'Jumat'},{value:'Sabtu',label:'Sabtu'},
]

const ITEMS_PER_PAGE = 8

export default function DataGuruPage() {
  const toast = useToast()

  const [guru, setGuru]             = useState([])
  const [loading, setLoading]       = useState(true)
  const [search, setSearch]         = useState('')
  const [page, setPage]             = useState(1)

  // Modal states
  const [modalAdd, setModalAdd]     = useState(false)
  const [modalEdit, setModalEdit]   = useState(false)
  const [modalDel, setModalDel]     = useState(false)
  const [selected, setSelected]     = useState(null)
  const [saving, setSaving]         = useState(false)

  // Form state
  const emptyForm = { id:'', name:'', email:'', password:'', nip:'', nama:'', no_hp:'' }
  const [form, setForm]             = useState(emptyForm)
  const [errors, setErrors]         = useState({})

  // Load data
  const load = async () => {
    setLoading(true)
    try {
      const res = await adminService.getGuru()
      setGuru(res.data || [])
    } catch {
      toast.error('Gagal memuat data guru')
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  // Filter + paginate
  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return guru.filter(g =>
      g.nama?.toLowerCase().includes(q) ||
      g.nip?.includes(q) ||
      g.email?.toLowerCase().includes(q) ||
      g.no_hp?.includes(q)
    )
  }, [guru, search])

  const totalPages  = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const pageData    = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  // Form handlers
  const setField = (key) => (e) => {
    setForm(p => ({ ...p, [key]: e.target.value }))
    if (errors[key]) setErrors(p => ({ ...p, [key]: '' }))
  }

  const validate = (isEdit = false) => {
    const e = {}
    if (!form.nama.trim())  e.nama  = 'Nama wajib diisi'
    if (!isEdit) {
      if (!form.id)              e.id       = 'ID Guru wajib diisi'
      if (!form.name.trim())     e.name     = 'Nama akun wajib diisi'
      if (!form.email.trim())    e.email    = 'Email wajib diisi'
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Format email tidak valid'
      if (!form.password)        e.password = 'Password wajib diisi'
      else if (form.password.length < 6) e.password = 'Minimal 6 karakter'
    } else {
      if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Format email tidak valid'
      if (form.password && form.password.length < 6) e.password = 'Minimal 6 karakter'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  // ADD
  const handleAdd = async () => {
    if (!validate(false)) return
    setSaving(true)
    try {
      await adminService.createGuru(form)
      toast.success('Guru berhasil ditambahkan')
      setModalAdd(false)
      setForm(emptyForm)
      load()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Gagal menambah guru')
    } finally { setSaving(false) }
  }

  // EDIT
  const openEdit = (item) => {
    setSelected(item)
    setForm({ id: item.id||'', name: item.name||'', email: item.email||'', password: '', nip: item.nip||'', nama: item.nama||'', no_hp: item.no_hp||'' })
    setErrors({})
    setModalEdit(true)
  }
  const handleEdit = async () => {
    if (!validate(true)) return
    setSaving(true)
    try {
      await adminService.updateGuru(selected.id, { nip: form.nip, nama: form.nama, no_hp: form.no_hp, name: form.name, email: form.email, password: form.password || undefined })
      toast.success('Data guru berhasil diupdate')
      setModalEdit(false)
      load()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Gagal mengupdate guru')
    } finally { setSaving(false) }
  }

  // DELETE
  const openDel = (item) => { setSelected(item); setModalDel(true) }
  const handleDel = async () => {
    setSaving(true)
    try {
      await adminService.deleteGuru(selected.id)
      toast.success('Guru berhasil dihapus')
      setModalDel(false)
      load()
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Gagal menghapus guru')
    } finally { setSaving(false) }
  }

  return (
    <div>
      <PageHeader
        title="Data Guru"
        subtitle="Kelola akun dan data tenaga pendidik"
        action={
          <Button icon="add" onClick={() => { setForm(emptyForm); setErrors({}); setModalAdd(true) }}>
            Tambah Guru
          </Button>
        }
      />

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom:20 }}>
        {[
          { icon:'group',      bg:'#dae2ff', color:'#002d72', label:'Total Guru',   val: guru.length },
          { icon:'badge',      bg:'#dcfce7', color:'#16a34a', label:'Aktif',        val: guru.length },
          { icon:'person_add', bg:'#fef3c7', color:'#d97706', label:'Baru Bulan Ini', val: 0 },
        ].map(s => (
          <div key={s.label} style={{
            background:'#fff', border:'1px solid var(--color-outline-variant)',
            borderRadius:'var(--radius-xl)', padding:'14px', boxShadow:'var(--shadow-sm)',
            display:'flex', alignItems:'center', gap:10,
          }}>
            <div style={{ width:38, height:38, borderRadius:'var(--radius-md)', background:s.bg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <span className="material-symbols-outlined" style={{ fontSize:20, color:s.color }}>{s.icon}</span>
            </div>
            <div>
              <p style={{ margin:0, fontSize:11, color:'var(--color-on-surface-variant)', fontWeight:600 }}>{s.label}</p>
              <p style={{ margin:0, fontSize:20, fontWeight:700 }}>{s.val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ position:'relative', marginBottom:14 }}>
        <span className="material-symbols-outlined" style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', fontSize:18, color:'var(--color-outline)', pointerEvents:'none' }}>search</span>
        <input
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
          placeholder="Cari nama, NIP, atau email..."
          style={{
            width:'100%', height:42, padding:'0 14px 0 40px',
            fontSize:14, fontFamily:'var(--font-family)',
            border:'1.5px solid var(--color-outline-variant)',
            borderRadius:'var(--radius-full)', outline:'none',
            background:'#fff', color:'var(--color-on-surface)',
          }}
        />
      </div>

      {/* Table / List */}
      <div style={{ background:'#fff', border:'1px solid var(--color-outline-variant)', borderRadius:'var(--radius-xl)', overflow:'hidden', boxShadow:'var(--shadow-sm)' }}>
        {loading ? (
          <div style={{ padding:16 }}><LoadingSkeleton lines={5} height={60} /></div>
        ) : pageData.length === 0 ? (
          <EmptyState icon="group" title="Belum ada data guru" subtitle={search ? 'Guru tidak ditemukan' : 'Tambahkan guru pertama'} />
        ) : (
          pageData.map((item, idx) => (
            <GuruRow key={item.id} item={item} isLast={idx === pageData.length - 1} onEdit={openEdit} onDelete={openDel} />
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 4px 0' }}>
          <p style={{ fontSize:12, color:'var(--color-outline)' }}>
            {filtered.length} guru ditemukan
          </p>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}

      {/* Modal Tambah */}
      <Modal open={modalAdd} onClose={() => setModalAdd(false)} title="Tambah Guru Baru"
        onConfirm={handleAdd} confirmLabel="Simpan" loading={saving}>
        <GuruForm form={form} setField={setField} errors={errors} isEdit={false} />
      </Modal>

      {/* Modal Edit */}
      <Modal open={modalEdit} onClose={() => setModalEdit(false)} title="Edit Data Guru"
        onConfirm={handleEdit} confirmLabel="Update" loading={saving}>
        <GuruForm form={form} setField={setField} errors={errors} isEdit={true} />
      </Modal>

      {/* Confirm Delete */}
      <ConfirmDialog
        open={modalDel} onClose={() => setModalDel(false)} onConfirm={handleDel}
        title="Hapus Guru"
        message={`Hapus data guru "${selected?.nama}"? Akun login dan semua data absensi terkait akan ikut terhapus.`}
        confirmLabel="Ya, Hapus" loading={saving}
      />
    </div>
  )
}

/* ── Baris Guru ── */
function GuruRow({ item, isLast, onEdit, onDelete }) {
  const { bg, color } = getAvatarColor(item.nama || '')
  return (
    <div style={{
      display:'flex', alignItems:'center', gap:12, padding:'12px 16px',
      borderBottom: isLast ? 'none' : '1px solid var(--color-outline-variant)',
      transition:'background .12s',
    }}
      onMouseOver={e => e.currentTarget.style.background = 'var(--color-surface-low)'}
      onMouseOut={e => e.currentTarget.style.background = 'transparent'}
    >
      {/* Avatar */}
      <div style={{ width:40, height:40, borderRadius:'50%', background:bg, color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:700, flexShrink:0 }}>
        {getInisial(item.nama||'')}
      </div>
      {/* Info */}
      <div style={{ flex:1, minWidth:0 }}>
        <p style={{ margin:0, fontSize:14, fontWeight:600, color:'var(--color-on-surface)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.nama}</p>
        <p style={{ margin:'2px 0 0', fontSize:11, color:'var(--color-on-surface-variant)' }}>
          {item.nip ? `NIP: ${item.nip}` : 'NIP belum diisi'} · {item.email}
        </p>
      </div>
      {/* No HP */}
      <p style={{ fontSize:12, color:'var(--color-outline)', display:'none', flexShrink:0 }} className="d-md-block">
        {item.no_hp || '-'}
      </p>
      {/* Actions */}
      <div style={{ display:'flex', gap:4, flexShrink:0 }}>
        <ActionBtn icon="edit" color="#d97706" bg="#fef3c7" onClick={() => onEdit(item)} title="Edit" />
        <ActionBtn icon="delete" color="#dc2626" bg="#fee2e2" onClick={() => onDelete(item)} title="Hapus" />
      </div>
    </div>
  )
}

function ActionBtn({ icon, color, bg, onClick, title }) {
  return (
    <button onClick={onClick} title={title} style={{
      width:32, height:32, borderRadius:'var(--radius-md)',
      background:'transparent', border:'none', cursor:'pointer',
      display:'flex', alignItems:'center', justifyContent:'center',
      color:'var(--color-outline)', transition:'all .15s',
    }}
      onMouseOver={e => { e.currentTarget.style.background = bg; e.currentTarget.style.color = color }}
      onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-outline)' }}
    >
      <span className="material-symbols-outlined" style={{ fontSize:18 }}>{icon}</span>
    </button>
  )
}

/* ── Form Guru ── */
function GuruForm({ form, setField, errors, isEdit }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
      {isEdit && (
        <>
          <p style={{ margin:0, fontSize:12, fontWeight:600, color:'var(--color-on-surface-variant)', padding:'8px 12px', background:'var(--color-surface-low)', borderRadius:'var(--radius-md)' }}>
            🔐 Data Akun Login
          </p>
          <Input label="Nama Akun" placeholder="Nama untuk akun login" value={form.name} onChange={setField('name')} error={errors.name} icon="person" />
          <Input label="Email" type="email" placeholder="email@sekolah.com" value={form.email} onChange={setField('email')} error={errors.email} icon="email" />
          <Input label="Password (kosongkan jika tidak ingin mengubah)" type="password" placeholder="Minimal 6 karakter" value={form.password} onChange={setField('password')} error={errors.password} />
          <p style={{ margin:0, fontSize:12, fontWeight:600, color:'var(--color-on-surface-variant)', padding:'8px 12px', background:'var(--color-surface-low)', borderRadius:'var(--radius-md)' }}>
            👤 Data Profil Guru
          </p>
        </>
      )}
      {!isEdit && (
        <>
          <p style={{ margin:0, fontSize:12, fontWeight:600, color:'var(--color-on-surface-variant)', padding:'8px 12px', background:'var(--color-surface-low)', borderRadius:'var(--radius-md)' }}>
            🔐 Data Akun Login
          </p>
          <Input label="ID Guru" type="number" placeholder="Contoh: 1" value={form.id} onChange={setField('id')} error={errors.id} required icon="tag" />
          <Input label="Nama Akun" placeholder="Nama lengkap untuk akun" value={form.name} onChange={setField('name')} error={errors.name} required icon="person" />
          <Input label="Email" type="email" placeholder="email@sekolah.com" value={form.email} onChange={setField('email')} error={errors.email} required icon="email" />
          <Input label="Password" type="password" placeholder="Minimal 6 karakter" value={form.password} onChange={setField('password')} error={errors.password} required />
          <p style={{ margin:0, fontSize:12, fontWeight:600, color:'var(--color-on-surface-variant)', padding:'8px 12px', background:'var(--color-surface-low)', borderRadius:'var(--radius-md)' }}>
            👤 Data Profil Guru
          </p>
        </>
      )}
      <Input label="Nama Guru" placeholder="Nama lengkap + gelar" value={form.nama} onChange={setField('nama')} error={errors.nama} required icon="badge" />
      <Input label="NIP" placeholder="18 digit NIP (opsional)" value={form.nip} onChange={setField('nip')} icon="pin" />
      <Input label="No. HP" type="tel" placeholder="08xxxxxxxxxx" value={form.no_hp} onChange={setField('no_hp')} icon="phone" />
    </div>
  )
}
