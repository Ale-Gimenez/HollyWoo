import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFilmes } from '../context/FilmesContext'
import FilmForm from '../components/FilmForm'
import '../styles/Pages.css'
import '../styles/Shared.css'

export default function AdicionarFilmePage() {
  const { addFilme } = useFilmes()
  const navigate = useNavigate()
  const [erro, setErro] = useState(null)
  const [salvando, setSalvando] = useState(false)

  async function handleSubmit(data) {
    setSalvando(true)
    setErro(null)
    try {
      await addFilme(data)
      navigate('/catalogo')
    } catch (err) {
      setErro(err.message || 'Erro ao adicionar filme. Tente novamente.')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="adicionar-page">
      <div className="adicionar-card">
        <h1 className="adicionar-title">Adicionar Filme</h1>
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
            <p>Enviando filme para aprovação...</p>
          </div>
        ) : (
          <FilmForm
            onSubmit={handleSubmit}
            onCancel={() => navigate(-1)}
            submitLabel="Adicionar"
          />
        )}
      </div>
    </div>
  )
}
