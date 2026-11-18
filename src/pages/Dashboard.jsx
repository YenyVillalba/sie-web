import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import './Dashboard.css'

export default function Dashboard() {
  const { usuario } = useAuth()
  const [stats, setStats] = useState({ empresas: 0, admins: 0, usuarios: 0, roles: 0 })
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const cargarStats = async () => {
      try {
        const [empRes, admRes, usrRes, rolRes] = await Promise.all([
          api.get('/empresas').catch(() => ({ data: { data: [] } })),
          api.get('/admins').catch(() => ({ data: { data: [] } })),
          api.get('/usuarios').catch(() => ({ data: { data: [] } })),
          api.get('/roles').catch(() => ({ data: { data: [] } })),
        ])
        setStats({
          empresas: empRes.data.data?.length  ?? 0,
          admins:   admRes.data.data?.length  ?? 0,
          usuarios: usrRes.data.data?.length  ?? 0,
          roles:    rolRes.data.data?.length  ?? 0,
        })
      } finally {
        setCargando(false)
      }
    }
    cargarStats()
  }, [])

  const tarjetas = usuario?.rol === 'superadmin'
    ? [
        { label: 'Empresas',          valor: stats.empresas, icon: '🏢', color: '#1e3a5f' },
        { label: 'Administradores',   valor: stats.admins,   icon: '👤', color: '#2d6a9f' },
        { label: 'Usuarios',          valor: stats.usuarios, icon: '👥', color: '#3a86d4' },
        { label: 'Roles',             valor: stats.roles,    icon: '🔑', color: '#4fc3f7' },
      ]
    : [
        { label: 'Usuarios',          valor: stats.usuarios, icon: '👥', color: '#1e3a5f' },
        { label: 'Roles',             valor: stats.roles,    icon: '🔑', color: '#2d6a9f' },
      ]

  return (
    <Layout titulo="Dashboard">
      <div className="dashboard-bienvenida">
        <h2>Bienvenido, {usuario?.nombre} 👋</h2>
        <p>Rol: <strong>{usuario?.rol}</strong></p>
      </div>

      {cargando ? (
        <p>Cargando estadísticas...</p>
      ) : (
        <div className="dashboard-cards">
          {tarjetas.map((t) => (
            <div key={t.label} className="stat-card" style={{ borderTop: `4px solid ${t.color}` }}>
              <div className="stat-icon">{t.icon}</div>
              <div className="stat-info">
                <span className="stat-valor">{t.valor}</span>
                <span className="stat-label">{t.label}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  )
}
