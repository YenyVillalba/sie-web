import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Empresas from './pages/Empresas'
import Admins from './pages/Admins'
import Usuarios from './pages/Usuarios'
import Roles from './pages/Roles'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />

          <Route path="/empresas" element={
            <PrivateRoute roles={['superadmin']}>
              <Empresas />
            </PrivateRoute>
          } />

          <Route path="/admins" element={
            <PrivateRoute roles={['superadmin']}>
              <Admins />
            </PrivateRoute>
          } />

          <Route path="/usuarios" element={
            <PrivateRoute roles={['superadmin', 'admin']}>
              <Usuarios />
            </PrivateRoute>
          } />

          <Route path="/roles" element={
            <PrivateRoute roles={['superadmin', 'admin']}>
              <Roles />
            </PrivateRoute>
          } />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
