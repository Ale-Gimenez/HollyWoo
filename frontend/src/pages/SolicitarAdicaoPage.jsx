import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFilmes } from '../context/FilmesContext'
import FilmForm from '../components/FilmForm'
import '../styles/Pages.css'
import '../styles/Shared.css'

export default function SolicitarAdicaoPage() {
  const { addFilme } = useFilmes()
  const navigate = useNavigate()
  const [sent, setSent] = useState(false)
  const [erro, setErro] = useState(null)
  const [salvando, setSalvando] = useState(false)

  async function handleSubmit(data) {
    setSalvando(true)
    setErro(null)
    try {
      await addFilme(data)
      setSent(true)
      setTimeout(() => navigate('/'), 2000)
    } catch (err) {
      setErro(err.message || 'Erro ao enviar sugestão. Tente novamente.')
    } finally {
      setSalvando(false)
    }
  }

  if (sent) {
    return (
      <div className="solicitar-page">
        <div className="adicionar-card" style={{ maxWidth: '800px', textAlign: 'center', padding: '40px 20px' }}>
          <p style={{ fontSize: '2.5rem', marginBottom: '12px' }}>✅</p>
          <h2 style={{ color: '#fff', marginBottom: '8px' }}>Solicitação Enviada!</h2>
          <p style={{ color: '#aaa', fontSize: '0.9rem' }}>Obrigado pela colaboração. Um admin irá revisar sua sugestão em breve.</p>
          <p style={{ color: '#666', fontSize: '0.85rem', marginTop: '6px' }}>Redirecionando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="solicitar-page">
      <div className="adicionar-card" style={{ maxWidth: '800px' }}>
        <h1 className="adicionar-title">Sugerir Adição de Filme</h1>
        {erro && (
          <div style={{
            background: '#2a0a0a', border: '1px solid #cc0000', borderRadius: 8,
            padding: '12px 16px', marginBottom: 20, color: '#ff6b6b', fontSize: '0.9rem'
          }}>
            ⊙ {erro}
          </div>
        )}
        {salvando ? (
          <div className="loading-state">
            <div className="spinner" />
            <p>Enviando sugestão...</p>
          </div>
        ) : (
          <FilmForm
            onSubmit={handleSubmit}
            onCancel={() => navigate(-1)}
            submitLabel="Solicitar Adição"
          />
        )}
      </div>
    </div>
  )
}
