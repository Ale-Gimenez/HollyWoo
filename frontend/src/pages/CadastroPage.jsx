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

export default function CadastroPage() {
  const { cadastrar } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ nome: '', username: '', email: '', senha: '', confirmar: '', dataNascimento: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function set(f, v) { setForm(p => ({ ...p, [f]: v })) }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (form.senha !== form.confirmar) { setError('As senhas não coincidem.'); return }
    if (form.senha.length < 6) { setError('Senha deve ter ao menos 6 caracteres.'); return }
    setLoading(true)
    const result = await cadastrar(form)
    setLoading(false)
    if (!result.ok) { setError(result.msg); return }
    navigate('/')
  }

  return (
    <main className="auth-page">
      <div className="auth-card auth-card-wide">
        <div className="auth-logo-wrap" style={{ alignItems: 'center', marginBottom: '16px' }}>
          <Logo />
          <span className="auth-brand-name">HollyWoo</span>
          <span className="auth-slogan">Diversão para os pequenos</span>
        </div>

        <h1 className="cadastro-title">SE CADASTRE</h1>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-row form-row-2">
            <div className="form-group">
              <label className="form-label" htmlFor="cad-nome">Nome e Sobrenome</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">👤</span>
                <input id="cad-nome" placeholder="Ex: Fulano DeTal" value={form.nome} onChange={e => set('nome', e.target.value)} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="cad-user">Nome de Usuário</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">👤</span>
                <input id="cad-user" placeholder="Ex: FulanoDeTal" value={form.username} onChange={e => set('username', e.target.value)} required />
              </div>
            </div>
          </div>

          <div className="form-row form-row-2">
            <div className="form-group">
              <label className="form-label" htmlFor="cad-nasc">Data Nascimento</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">📅</span>
                <input id="cad-nasc" type="date" value={form.dataNascimento} onChange={e => set('dataNascimento', e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="cad-email">E-mail</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">✉</span>
                <input id="cad-email" type="email" placeholder="Ex: Fulano@gmail.com" value={form.email} onChange={e => set('email', e.target.value)} required autoComplete="email" />
              </div>
            </div>
          </div>

          <div className="form-row form-row-2">
            <div className="form-group">
              <label className="form-label" htmlFor="cad-senha">Senha</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">🔒</span>
                <input id="cad-senha" type="password" placeholder="Mínimo 6 caracteres" value={form.senha} onChange={e => set('senha', e.target.value)} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="cad-conf">Confirmar Senha</label>
              <div className="auth-input-wrap">
                <span className="auth-input-icon">🔒</span>
                <input id="cad-conf" type="password" placeholder="Repita a senha" value={form.confirmar} onChange={e => set('confirmar', e.target.value)} required />
              </div>
            </div>
          </div>

          {error && <div className="inline-error">⚠ {error}</div>}

          <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
            {loading ? 'Criando conta...' : '▶ Cadastrar'}
          </button>

          <p className="auth-hint">
            Já possui cadastro?{' '}
            <Link to="/login" className="auth-hint-link">Faça Login</Link>
          </p>
        </form>
      </div>
    </main>
  )
}
