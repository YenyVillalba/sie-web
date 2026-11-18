import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import logo from '../assets/logoSIE.png'
import './Layout.css'

const menuSuperadmin = [
  { path: '/dashboard',   icon: '🏠', label: 'Dashboard'       },
  { path: '/empresas',    icon: '🏢', label: 'Empresas'        },
  { path: '/admins',      icon: '👤', label: 'Administradores' },
  { path: '/usuarios',    icon: '👥', label: 'Usuarios'        },
  { path: '/roles',       icon: '🔑', label: 'Roles'           },
]

const menuAdmin = [
  { path: '/dashboard',   icon: '🏠', label: 'Dashboard' },
  { path: '/usuarios',    icon: '👥', label: 'Usuarios'  },
  { path: '/roles',       icon: '🔑', label: 'Roles'     },
]

export default function Layout({ children, titulo }) {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()

  const menu = usuario?.rol === 'superadmin' ? menuSuperadmin : menuAdmin

  const handleLogout = async () => {
    try { await api.post('/auth/logout') } catch (_) {}
    logout()
    navigate('/login')
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <img src={logo} alt="SIE" className="sidebar-logo-img" />
        </div>

        <div className="sidebar-user">
          <div className="user-name">{usuario?.nombre}</div>
          <div className="user-rol">{usuario?.rol}</div>
        </div>

        <nav className="sidebar-nav">
          {menu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="btn-logout" onClick={handleLogout}>
            <span className="nav-icon">🚪</span>
            Cerrar sesión
          </button>
        </div>
      </aside>

      <div className="main-content">
        <div className="topbar">
          <h1>{titulo}</h1>
          <span style={{ color: '#666', fontSize: '0.85rem' }}>
            {new Date().toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>
        <div className="page-content">
          {children}
        </div>
      </div>
    </div>
  )
}
