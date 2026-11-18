import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import api from '../api/axios'
import './Tabla.css'

export default function Admins() {
  const [admins, setAdmins] = useState([])
  const [empresas, setEmpresas] = useState([])
  const [form, setForm] = useState({ nombre: '', correo: '', password: '', id_empresa: '' })
  const [editId, setEditId] = useState(null)
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')

  const cargar = async () => {
    const [a, e] = await Promise.all([api.get('/admins'), api.get('/empresas')])
    setAdmins(a.data.data || [])
    setEmpresas(e.data.data || [])
  }

  useEffect(() => { cargar() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setMsg('')
    try {
      if (editId) {
        await api.put(`/admins/${editId}`, form)
        setMsg('Administrador actualizado')
      } else {
        await api.post('/admins', form)
        setMsg('Administrador creado')
      }
      setForm({ nombre: '', correo: '', password: '', id_empresa: '' })
      setEditId(null); cargar()
    } catch (err) { setError(err.response?.data?.message || 'Error al guardar') }
  }

  const editar = (a) => {
    setEditId(a.id_usuario)
    setForm({ nombre: a.nombre, correo: a.correo, password: '', id_empresa: a.id_empresa })
  }

  const desactivar = async (id) => {
    if (!confirm('¿Desactivar este administrador?')) return
    await api.delete(`/admins/${id}`); cargar()
  }

  return (
    <Layout titulo="Gestión de Administradores">
      <div className="form-card">
        <h3>{editId ? 'Editar administrador' : 'Nuevo administrador'}</h3>
        {error && <div className="alert error">{error}</div>}
        {msg   && <div className="alert ok">{msg}</div>}
        <form onSubmit={handleSubmit} className="form-row">
          <input placeholder="Nombre completo" value={form.nombre}
            onChange={e => setForm({ ...form, nombre: e.target.value })} required />
          <input placeholder="Correo" type="email" value={form.correo}
            onChange={e => setForm({ ...form, correo: e.target.value })} required />
          {!editId && (
            <input placeholder="Contraseña" type="password" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} required />
          )}
          <select value={form.id_empresa}
            onChange={e => setForm({ ...form, id_empresa: e.target.value })} required>
            <option value="">Seleccionar empresa</option>
            {empresas.map(emp => (
              <option key={emp.id_empresa} value={emp.id_empresa}>{emp.nombre}</option>
            ))}
          </select>
          <button type="submit" className="btn-primary">{editId ? 'Actualizar' : 'Crear'}</button>
          {editId && (
            <button type="button" className="btn-secondary"
              onClick={() => { setEditId(null); setForm({ nombre: '', correo: '', password: '', id_empresa: '' }) }}>
              Cancelar
            </button>
          )}
        </form>
      </div>

      <div className="table-card">
        <table className="tabla">
          <thead>
            <tr><th>ID</th><th>Nombre</th><th>Correo</th><th>Empresa</th><th>Estado</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {admins.length === 0
              ? <tr><td colSpan={6} className="empty">No hay administradores registrados</td></tr>
              : admins.map(a => (
                <tr key={a.id_usuario}>
                  <td>{a.id_usuario}</td>
                  <td>{a.nombre}</td>
                  <td>{a.correo}</td>
                  <td>{a.empresa_nombre || '—'}</td>
                  <td><span className={`badge ${a.estado === 'Activo' ? 'activo' : 'inactivo'}`}>{a.estado}</span></td>
                  <td>
                    <button className="btn-edit" onClick={() => editar(a)}>Editar</button>
                    <button className="btn-delete" onClick={() => desactivar(a.id_usuario)}>Desactivar</button>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </Layout>
  )
}
