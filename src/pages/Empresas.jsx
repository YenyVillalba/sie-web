import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import api from '../api/axios'
import './Tabla.css'

export default function Empresas() {
  const [empresas, setEmpresas] = useState([])
  const [form, setForm] = useState({ nombre: '', identificacion: '' })
  const [editId, setEditId] = useState(null)
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')

  const cargar = async () => {
    const res = await api.get('/empresas')
    setEmpresas(res.data.data || [])
  }

  useEffect(() => { cargar() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(''); setMsg('')
    try {
      if (editId) {
        await api.put(`/empresas/${editId}`, { ...form, estado: 'Activa' })
        setMsg('Empresa actualizada')
      } else {
        await api.post('/empresas', form)
        setMsg('Empresa creada')
      }
      setForm({ nombre: '', identificacion: '' })
      setEditId(null)
      cargar()
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar')
    }
  }

  const editar = (emp) => {
    setEditId(emp.id_empresa)
    setForm({ nombre: emp.nombre, identificacion: emp.identificacion || '' })
  }

  const eliminar = async (id) => {
    if (!confirm('¿Eliminar esta empresa?')) return
    await api.delete(`/empresas/${id}`)
    cargar()
  }

  return (
    <Layout titulo="Gestión de Empresas">
      <div className="form-card">
        <h3>{editId ? 'Editar empresa' : 'Nueva empresa'}</h3>
        {error && <div className="alert error">{error}</div>}
        {msg   && <div className="alert ok">{msg}</div>}
        <form onSubmit={handleSubmit} className="form-row">
          <input
            placeholder="Nombre de la empresa"
            value={form.nombre}
            onChange={e => setForm({ ...form, nombre: e.target.value })}
            required
          />
          <input
            placeholder="RUC / Identificación"
            value={form.identificacion}
            onChange={e => setForm({ ...form, identificacion: e.target.value })}
          />
          <button type="submit" className="btn-primary">
            {editId ? 'Actualizar' : 'Crear'}
          </button>
          {editId && (
            <button type="button" className="btn-secondary"
              onClick={() => { setEditId(null); setForm({ nombre: '', identificacion: '' }) }}>
              Cancelar
            </button>
          )}
        </form>
      </div>

      <div className="table-card">
        <table className="tabla">
          <thead>
            <tr>
              <th>ID</th><th>Nombre</th><th>Identificación</th><th>Estado</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {empresas.length === 0
              ? <tr><td colSpan={5} className="empty">No hay empresas registradas</td></tr>
              : empresas.map(emp => (
                <tr key={emp.id_empresa}>
                  <td>{emp.id_empresa}</td>
                  <td>{emp.nombre}</td>
                  <td>{emp.identificacion || '—'}</td>
                  <td><span className={`badge ${emp.estado === 'Activa' ? 'activo' : 'inactivo'}`}>{emp.estado}</span></td>
                  <td>
                    <button className="btn-edit" onClick={() => editar(emp)}>Editar</button>
                    <button className="btn-delete" onClick={() => eliminar(emp.id_empresa)}>Eliminar</button>
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
