import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/api'
import { useAuth } from '../context/AuthContext'
import Toast from '../components/shared/Toast'
import './AuthPages.css'

export default function CadastroPage() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const [form, setForm] = useState({
    nome: '', apelido: '', data_nascimento: '', email: '', senha: '', confirmar: ''
  })
  const [erro,    setErro]    = useState('')
  const [loading, setLoading] = useState(false)

  function set(field) {
    return (e) => setForm(f => ({ ...f, [field]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    if (form.senha !== form.confirmar) { setErro('As senhas não conferem'); return }
    setLoading(true)
    try {
      const { confirmar, ...body } = form
      await authService.register(body)
      await login({ email: form.email, senha: form.senha })
      navigate('/home')
    } catch (err) {
      setErro(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-bg">
      <Toast message={erro} type="error" onClose={() => setErro('')} />

      <section className="auth-card auth-card--wide" aria-label="Formulário de cadastro">
        <div className="auth-card__logo">
          <span className="auth-logo-icon">🎬</span>
          <span className="auth-logo-text"><strong>Holly</strong>Woo</span>
          <p className="auth-logo-sub">Diversão para os Pequenos</p>
        </div>

        <h1 className="auth-card__title">SE CADASTRE</h1>

        <form onSubmit={handleSubmit} noValidate>
          <div className="auth-form-grid">
            <div className="input-group">
              <label htmlFor="nome">Nome e Sobrenome</label>
              <div className="input-field">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>
                <input id="nome" type="text" placeholder="Ex: Fulano DeTal" value={form.nome} onChange={set('nome')} required />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="apelido">Nome de Usuário</label>
              <div className="input-field">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>
                <input id="apelido" type="text" placeholder="Ex: FulanoDeTal" value={form.apelido} onChange={set('apelido')} />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="nascimento">Data Nascimento</label>
              <div className="input-field">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                <input id="nascimento" type="date" value={form.data_nascimento} onChange={set('data_nascimento')} />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="cad-email">E-mail</label>
              <div className="input-field">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                <input id="cad-email" type="email" placeholder="Ex: Fulano@gmail.com" value={form.email} onChange={set('email')} required autoComplete="email" />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="cad-senha">Senha</label>
              <div className="input-field">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <input id="cad-senha" type="password" placeholder="Ex: 12345678" value={form.senha} onChange={set('senha')} required autoComplete="new-password" />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="confirmar">Confirmar Senha</label>
              <div className="input-field">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <input id="confirmar" type="password" placeholder="Ex: 12345678" value={form.confirmar} onChange={set('confirmar')} required autoComplete="new-password" />
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn--primary auth-card__submit" disabled={loading}>
            ▶ {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>
      </section>
    </main>
  )
}
