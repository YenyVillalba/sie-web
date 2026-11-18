import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import './Tabla.css'

export default function Usuarios() {
  const { usuario } = useAuth()
  const [usuarios, setUsuarios] = useState([])
  const [roles, setRoles] = useState([])
  const [empresas, setEmpresas] = useState([])
  const [form, setForm] = useState({ nombre: '', correo: '', password: '', id_rol: '', id_empresa: '' })
  const [editId, setEditId] = useState(null)
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')

  const rolesOperativos = ['vendedor', 'cliente', 'transportador']

  const cargar = async () => {
    const [u, r] = await Promise.all([api.get('/usuarios'), api.get('/roles')])
    setUsuarios(u.data.data || [])
    const filtrados = usuario?.rol === 'admin'
      ? (r.data.data || []).filter(rol => rolesOperativos.includes(rol.nombre))
      : r.data.data || []
    setRoles(filtrados)
    if (usuario?.rol === 'superadmin') {
      const e = await api.get('/empresas')
      setEmpresas(e.data.data || [])
    }
  }

  useEffect(() => { cargar() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setMsg('')
    try {
      const data = { ...form }
      if (usuario?.rol === 'admin') delete data.id_empresa
      if (editId) {
        await api.put(`/usuarios/${editId}`, data)
        setMsg('Usuario actualizado')
      } else {
        await api.post('/usuarios', data)
        setMsg('Usuario creado')
      }
      setForm({ nombre: '', correo: '', password: '', id_rol: '', id_empresa: '' })
      setEditId(null); cargar()
    } catch (err) { setError(err.response?.data?.message || 'Error al guardar') }
  }

  const editar = (u) => {
    setEditId(u.id_usuario)
    setForm({ nombre: u.nombre, correo: u.correo, password: '', id_rol: u.id_rol, id_empresa: u.id_empresa })
  }

  return (
    <Layout titulo="Gestión de Usuarios">
      <div className="form-card">
        <h3>{editId ? 'Editar usuario' : 'Nuevo usuario'}</h3>
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
          <select value={form.id_rol} onChange={e => setForm({ ...form, id_rol: e.target.value })} required>
            <option value="">Seleccionar rol</option>
            {roles.map(r => <option key={r.id_rol} value={r.id_rol}>{r.nombre}</option>)}
          </select>
          {usuario?.rol === 'superadmin' && (
            <select value={form.id_empresa} onChange={e => setForm({ ...form, id_empresa: e.target.value })}>
              <option value="">Sin empresa</option>
              {empresas.map(emp => <option key={emp.id_empresa} value={emp.id_empresa}>{emp.nombre}</option>)}
            </select>
          )}
          <button type="submit" className="btn-primary">{editId ? 'Actualizar' : 'Crear'}</button>
          {editId && (
            <button type="button" className="btn-secondary"
              onClick={() => { setEditId(null); setForm({ nombre: '', correo: '', password: '', id_rol: '', id_empresa: '' }) }}>
              Cancelar
            </button>
          )}
        </form>
      </div>

      <div className="table-card">
        <table className="tabla">
          <thead>
            <tr><th>ID</th><th>Nombre</th><th>Correo</th><th>Rol</th><th>Estado</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {usuarios.length === 0
              ? <tr><td colSpan={6} className="empty">No hay usuarios registrados</td></tr>
              : usuarios.map(u => (
                <tr key={u.id_usuario}>
                  <td>{u.id_usuario}</td>
                  <td>{u.nombre}</td>
                  <td>{u.correo}</td>
                  <td><span className="badge activo">{u.rol_nombre}</span></td>
                  <td><span className={`badge ${u.estado === 'Activo' ? 'activo' : 'inactivo'}`}>{u.estado}</span></td>
                  <td><button className="btn-edit" onClick={() => editar(u)}>Editar</button></td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </Layout>
  )
}
