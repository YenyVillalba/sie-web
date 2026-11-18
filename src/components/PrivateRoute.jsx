import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function PrivateRoute({ children, roles }) {
  const { usuario, cargando } = useAuth()

  if (cargando) return <div style={{ padding: '2rem' }}>Cargando...</div>

  if (!usuario) return <Navigate to="/login" replace />

  if (roles && !roles.includes(usuario.rol)) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
