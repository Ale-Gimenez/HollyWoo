import { createContext, useContext, useState, useEffect } from 'react'
import { apiLogin, apiCadastrar, apiLogout, apiGetMe } from '../service/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [favoritos, setFavoritos] = useState([])
  const [loadingAuth, setLoadingAuth] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) { setLoadingAuth(false); return }
    apiGetMe()
      .then(u => {
        setUser(normalizeUser(u))
      })
      .catch(() => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
      })
      .finally(() => setLoadingAuth(false))
  }, [])

  function normalizeUser(u) {
    return {
      id: u.id_usuario,
      nome: u.nome + (u.sobrenome ? ` ${u.sobrenome}` : ''),
      username: u.apelido || u.nome,
      email: u.email,
      role: u.role,
      avatar: u.imagem || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.nome)}&background=7833e2&color=fff&size=150`,
      dataNascimento: u.data_nascimento || '',
      dataIngresso: u.data_criacao
        ? new Date(u.data_criacao).toLocaleDateString('pt-BR')
        : '',
    }
  }

  const isLoggedIn = !!user
  const isAdmin = user?.role === 'admin'

  async function login(email, senha) {
    try {
      await apiLogin(email, senha)
      const me = await apiGetMe()
      setUser(normalizeUser(me))
      setFavoritos([])
      return { ok: true, role: me.role }
    } catch (err) {
      return { ok: false, msg: err.message || 'E-mail ou senha inválidos.' }
    }
  }

  async function cadastrar(form) {
    try {
      await apiCadastrar(form)

      const loginResult = await login(form.email, form.senha)
      return loginResult
    } catch (err) {
      return { ok: false, msg: err.message || 'Erro ao cadastrar.' }
    }
  }

  async function logout() {
    await apiLogout()
    setUser(null)
    setFavoritos([])
  }

  function updateUser(data) {
    setUser(prev => ({ ...prev, ...data }))
  }

  function isFavorito(id) { return favoritos.includes(id) }

  function toggleFavorito(id) {
    setFavoritos(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    )
  }

  return (
    <AuthContext.Provider value={{
      user, isLoggedIn, isAdmin, favoritos, loadingAuth,
      login, cadastrar, logout, updateUser,
      isFavorito, toggleFavorito,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
