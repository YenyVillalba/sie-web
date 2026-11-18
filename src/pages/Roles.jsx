import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import api from '../api/axios'
import {
  IoShieldCheckmarkOutline, IoPersonOutline, IoBriefcaseOutline,
  IoPersonCircleOutline, IoCarOutline
} from 'react-icons/io5'
import './Tabla.css'

export default function Roles() {
  const [roles, setRoles] = useState([])

  useEffect(() => {
    api.get('/roles').then(res => setRoles(res.data.data || []))
  }, [])

  const descripciones = {
    superadmin:    'Acceso total al sistema. Gestiona empresas, administradores y configuración global.',
    admin:         'Administra su empresa. Crea y gestiona usuarios operativos.',
    vendedor:      'App móvil. Acceso a módulo de ventas.',
    cliente:       'App móvil. Acceso a módulo de inicio y perfil.',
    transportador: 'App móvil. Acceso a módulo de transporte.',
  }

  const iconos = {
    superadmin:    <IoShieldCheckmarkOutline />,
    admin:         <IoPersonOutline />,
    vendedor:      <IoBriefcaseOutline />,
    cliente:       <IoPersonCircleOutline />,
    transportador: <IoCarOutline />,
  }

  return (
    <Layout titulo="Gestión de Roles">
      <div className="table-card">
        <p style={{ marginBottom: '1rem', color: '#666', fontSize: '0.9rem' }}>
          Los roles son definidos por el sistema y determinan qué acciones puede realizar cada usuario.
        </p>
        <table className="tabla">
          <thead>
            <tr><th>ID</th><th>Rol</th><th>Descripción del sistema</th><th>Descripción</th></tr>
          </thead>
          <tbody>
            {roles.map(rol => (
              <tr key={rol.id_rol}>
                <td>{rol.id_rol}</td>
                <td>
                  <span style={{ fontSize: '1.1rem', marginRight: '6px', verticalAlign: 'middle', color: '#1e3a5f' }}>{iconos[rol.nombre]}</span>
                  <strong>{rol.nombre}</strong>
                </td>
                <td>{rol.descripcion}</td>
                <td style={{ color: '#555', fontSize: '0.85rem' }}>
                  {descripciones[rol.nombre] || '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  )
}
