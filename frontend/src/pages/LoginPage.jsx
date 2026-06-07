import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/AuthPages.css'
import '../styles/Shared.css'

function Logo() {
  return (
    <svg width="52" height="52" viewBox="0 0 36 36" fill="none">
      <rect width="36" height="36" rx="8" fill="#7833e2"/>
      <ellipse cx="12" cy="20" rx="4" ry="4.5" fill="#fff"/>
      <ellipse cx="24" cy="20" rx="4" ry="4.5" fill="#fff"/>
      <circle cx="12" cy="20" r="2" fill="#1a1a1a"/>
      <circle cx="24" cy="20" r="2" fill="#1a1a1a"/>
      <rect x="6" y="10" width="24" height="5" rx="2" fill="#b693ec"/>
      <rect x="4" y="8" width="5" height="3" rx="1" fill="#fff" transform="rotate(-20 4 8)"/>
      <rect x="27" y="8" width="5" height="3" rx="1" fill="#fff" transform="rotate(20 27 8)"/>
    </svg>
  )
}

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', senha: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await login(form.email, form.senha)
    setLoading(false)
    if (!result.ok) { setError(result.msg); return }
    navigate(result.role === 'admin' ? '/home' : '/')
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-logo-wrap">
          <Logo />
          <span className="auth-brand-name">HollyWoo</span>
          <span className="auth-slogan">Diversão para os pequenos</span>
        </div>

        <h1 className="auth-title">LOGIN</h1>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">E-mail</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon">✉</span>
              <input
                id="login-email"
                type="email"
                placeholder="Ex: Fulano@gmail.com"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-senha">Senha</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon">🔒</span>
              <input
                id="login-senha"
                type="password"
                placeholder="Ex: 12345678"
                value={form.senha}
                onChange={e => setForm(p => ({ ...p, senha: e.target.value }))}
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          {error && <div className="inline-error">⚠ {error}</div>}

          <p className="auth-hint">
            Ainda não possui cadastro?{' '}
            <Link to="/cadastro" className="auth-hint-link">Clique Aqui</Link>
          </p>

          <button
            type="submit"
            className="btn btn-primary auth-submit"
            disabled={loading}
          >
            {loading ? 'Entrando...' : '▶ Login'}
          </button>
        </form>
      </div>
    </main>
  )
}
