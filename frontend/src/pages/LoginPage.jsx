import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Toast from '../components/shared/Toast'
import './AuthPages.css'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const [form,    setForm]  = useState({ email: '', senha: '' })
  const [erro,    setErro]  = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    setLoading(true)
    try {
      const user = await login(form)
      navigate(user.role === 'admin' ? '/home' : '/home')
    } catch (err) {
      setErro(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-bg">
      <Toast message={erro} type="error" onClose={() => setErro('')} />

      <section className="auth-card" aria-label="Formulário de login">
        {/* Logo */}
        <div className="auth-card__logo">
          <span className="auth-logo-icon">🎬</span>
          <span className="auth-logo-text"><strong>Holly</strong>Woo</span>
          <p className="auth-logo-sub">Diversão para os Pequenos</p>
        </div>

        <h1 className="auth-card__title">LOGIN</h1>

        <form onSubmit={handleSubmit} noValidate>
          <div className="input-group">
            <label htmlFor="email">E-mail</label>
            <div className="input-field">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              <input id="email" type="email" placeholder="Ex: Fulano@gmail.com"
                value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))}
                required autoComplete="email" />
            </div>
          </div>

          <div className="input-group" style={{ marginTop: '16px' }}>
            <label htmlFor="senha">Senha</label>
            <div className="input-field">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <input id="senha" type="password" placeholder="Ex: 12345678"
                value={form.senha} onChange={e => setForm(f => ({...f, senha: e.target.value}))}
                required autoComplete="current-password" />
            </div>
          </div>

          <p className="auth-card__link">
            Ainda não possui cadastro?{' '}
            <Link to="/cadastro">Clique Aqui</Link>
          </p>

          <button type="submit" className="btn btn--primary auth-card__submit" disabled={loading}>
            ▶ {loading ? 'Entrando...' : 'Login'}
          </button>
        </form>
      </section>
    </main>
  )
}
