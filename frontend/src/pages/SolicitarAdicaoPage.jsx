import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FilmForm from '../components/FilmForm'
import '../styles/Pages.css'
import '../styles/Shared.css'

export default function SolicitarAdicaoPage() {
  const navigate = useNavigate()
  const [sent, setSent] = useState(false)

  function handleSubmit(data) {
    // TODO: integrar com endpoint de sugestões quando disponível
    console.log('Sugestão de adição enviada:', data)
    setSent(true)
    setTimeout(() => navigate('/'), 2000)
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
        <FilmForm
          onSubmit={handleSubmit}
          onCancel={() => navigate(-1)}
          submitLabel="Solicitar Adição"
        />
      </div>
    </div>
  )
}
