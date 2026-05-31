/**
 * context/AuthContext.jsx
 * Gerencia o estado global de autenticação.
 * Disponibiliza: user, isAdmin, isLoading, login, logout
 */

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { authService, usuarioService } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,      setUser]      = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  /* Carrega o perfil se houver token salvo */
  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) { setIsLoading(false); return }

    usuarioService.me()
      .then(setUser)
      .catch(() => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
      })
      .finally(() => setIsLoading(false))
  }, [])

  const login = useCallback(async ({ email, senha }) => {
    const tokens = await authService.login({ email, senha })
    localStorage.setItem('access_token',  tokens.access_token)
    localStorage.setItem('refresh_token', tokens.refresh_token)
    const me = await usuarioService.me()
    setUser(me)
    return me
  }, [])

  const logout = useCallback(async () => {
    const refreshToken = localStorage.getItem('refresh_token')
    try { await authService.logout(refreshToken) } catch { /* ignora */ }
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    setUser(null)
  }, [])

  const isAdmin = user?.role === 'admin'

  return (
    <AuthContext.Provider value={{ user, isAdmin, isLoading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return ctx
}
