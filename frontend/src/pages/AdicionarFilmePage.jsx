import { useNavigate } from 'react-router-dom'
import { useFilmes } from '../context/FilmesContext'
import FilmForm from '../components/FilmForm'
import '../styles/Pages.css'
import '../styles/Shared.css'

export default function AdicionarFilmePage() {
  const { addFilme } = useFilmes()
  const navigate = useNavigate()

  function handleSubmit(data) {
    addFilme(data)
    navigate('/catalogo')
  }

  return (
    <div className="adicionar-page">
      <div className="adicionar-card">
        <h1 className="adicionar-title">Adicionar Filme</h1>
        <FilmForm
          onSubmit={handleSubmit}
          onCancel={() => navigate(-1)}
          submitLabel="Adicionar"
        />
      </div>
    </div>
  )
}
