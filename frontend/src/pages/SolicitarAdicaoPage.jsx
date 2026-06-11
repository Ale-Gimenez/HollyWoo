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
        <div className="adicionar-card" className="adicionar-card-center">
          <p className="success-icon">✅</p>
          <h2 className="success-title">Solicitação Enviada!</h2>
          <p className="success-text">Obrigado pela colaboração. Um admin irá revisar sua sugestão em breve.</p>
          <p className="success-redirect">Redirecionando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="solicitar-page">
      <div className="adicionar-card" className="adicionar-card-wide">
        <h1 className="adicionar-title">Sugerir Adição de Filme</h1>
        {erro && (
          <div className="inline-error-box">
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
