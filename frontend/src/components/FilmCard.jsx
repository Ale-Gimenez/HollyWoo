import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/Shared.css'

export default function FilmCard({ filme, showInfo = true }) {
  const navigate = useNavigate()
  const { isLoggedIn, isFavorito, toggleFavorito } = useAuth()

  function handleClick(e) {
    if (e.target.closest('.film-card-fav')) return
    navigate(`/detalhes/${filme.id}`)
  }

  function handleFav(e) {
    e.stopPropagation()
    if (!isLoggedIn) { navigate('/login'); return }
    toggleFavorito(filme.id)
  }

  return (
    <article className="film-card-wrapper">
      <div className="film-card" onClick={handleClick}>
        <img
          className="film-card-img"
          src={filme.poster}
          alt={filme.titulo}
          loading="lazy"
          onError={e => { e.target.src = 'https://via.placeholder.com/200x300/2a2a2a/666?text=Sem+Poster' }}
        />

        {isLoggedIn && (
          <button
            className={`film-card-fav${isFavorito(filme.id) ? ' active' : ''}`}
            onClick={handleFav}
            aria-label={isFavorito(filme.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          >
            {isFavorito(filme.id) ? '♥' : '♡'}
          </button>
        )}

        {filme.era && (
          <div className={`film-card-badge ${filme.era === 'classico' ? 'classico' : 'novo'}`}>
            {filme.era === 'classico' ? 'Clássico' : 'Novo'}
          </div>
        )}
      </div>

      {showInfo && (
        <div className="film-card-info">
          <h3>{filme.titulo}</h3>
          <p>{filme.ano}</p>
        </div>
      )}
    </article>
  )
}
