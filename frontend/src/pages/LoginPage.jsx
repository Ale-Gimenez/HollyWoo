import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/AuthPages.css'
import '../styles/Shared.css'

function Logo() {
  return (
    <img src="/logoprin.png" alt="HollyWoo" width="52" height="52" style={{ objectFit: 'contain' }} />
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
