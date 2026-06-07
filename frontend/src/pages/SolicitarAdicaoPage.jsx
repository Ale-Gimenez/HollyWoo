import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Pages.css'
import '../styles/Shared.css'
import '../styles/AuthPages.css'

export default function SolicitarAdicaoPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ titulo: '', ano: '', sinopse: '', motivo: '' })
  const [sent, setSent] = useState(false)

  function set(f, v) { setForm(p => ({ ...p, [f]: v })) }

  function handleSubmit(e) {
    e.preventDefault()
    setSent(true)
    setTimeout(() => navigate('/'), 2000)
  }

  return (
    <div className="solicitar-page">
      <div className="adicionar-card" style={{ maxWidth: '560px' }}>
        <h1 className="adicionar-title">Solicitar Adição de Filme</h1>

        {sent ? (
          <div style={{ textAlign: 'center', padding: '20px 0', color: '#90ee90' }}>
            <p style={{ fontSize: '2rem', marginBottom: '12px' }}>✓</p>
            <p style={{ fontWeight: 700 }}>Solicitação enviada com sucesso!</p>
            <p style={{ color: '#aaa', fontSize: '0.9rem', marginTop: '6px' }}>Redirecionando...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="sol-titulo">Título do Filme *</label>
              <input id="sol-titulo" className="form-input" placeholder="Ex: Wonka" value={form.titulo} onChange={e => set('titulo', e.target.value)} required />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="sol-ano">Ano de Lançamento</label>
              <input id="sol-ano" className="form-input" type="number" placeholder="Ex: 2023" value={form.ano} onChange={e => set('ano', e.target.value)} min="1900" max="2099" />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="sol-sinopse">Sinopse (opcional)</label>
              <textarea id="sol-sinopse" className="form-textarea" placeholder="Descreva brevemente o filme..." value={form.sinopse} onChange={e => set('sinopse', e.target.value)} rows={3} />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="sol-motivo">Por que você quer esse filme?</label>
              <textarea id="sol-motivo" className="form-textarea" placeholder="Conte-nos por que esse filme deveria estar no catálogo..." value={form.motivo} onChange={e => set('motivo', e.target.value)} rows={3} />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="submit" className="btn btn-primary">🚀 Enviar Solicitação</button>
              <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>✕ Cancelar</button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
