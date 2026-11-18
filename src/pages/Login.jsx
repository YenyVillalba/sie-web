import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import logo from '../assets/logoSIE1.png'
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5'
import './Login.css'

export default function Login() {
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [verPassword, setVerPassword] = useState(false)
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setCargando(true)

    try {
      const res = await api.post('/auth/login', { correo, password })
      const { token, refresh_token, usuario } = res.data.data

      // Solo superadmin y admin pueden acceder al panel web
      if (!['superadmin', 'admin'].includes(usuario.rol)) {
        setError('No tienes acceso al panel administrativo.')
        setCargando(false)
        return
      }

      login(token, refresh_token, usuario)
      navigate(usuario.rol === 'superadmin' ? '/dashboard' : '/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <img src={logo} alt="SIE Logo" className="login-logo" />
          <p>Sistema Integral Empresarial</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="correo">Correo electrónico</label>
            <input
              id="correo"
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="correo@ejemplo.com"
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <div className="input-password-wrapper">
              <input
                id="password"
                type={verPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setVerPassword(!verPassword)}
              >
                {verPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
              </button>
            </div>
          </div>

          {error && <div className="error-msg">{error}</div>}

          <button type="submit" disabled={cargando} className="btn-login">
            {cargando ? 'Ingresando...' : 'Iniciar sesión'}
          </button>
        </form>
      </div>
    </div>
  )
}
