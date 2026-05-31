/**
 * components/shared/FilmCard.jsx
 * Card de filme reutilizável. Exibe poster, badge Novo/Clássico,
 * título, ano e botão de favorito (opcional).
 */
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const YEAR_CLASSICO = 2015

export default function FilmCard({ filme, favoritado, onToggleFav, showHeart = true }) {
  const navigate = useNavigate()
  const { user } = useAuth()

  const isNovo     = filme.ano >= YEAR_CLASSICO
  const badgeLabel = isNovo ? 'Novo' : 'Clássico'
  const badgeCls   = isNovo ? 'film-card__badge--novo' : 'film-card__badge--classico'

  function handleCardClick() {
    navigate(`/filmes/${filme.id_filme}`)
  }

  function handleHeart(e) {
    e.stopPropagation()
    if (!user) { navigate('/login'); return }
    onToggleFav?.(filme.id_filme)
  }

  return (
    <article className="film-card" onClick={handleCardClick} tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleCardClick()}
      aria-label={`${filme.titulo}, ${filme.ano}`}
    >
      <img
        className="film-card__poster"
        src={filme.poster ?? 'https://placehold.co/200x300/1a1a1a/7C3AED?text=Sem+Poster'}
        alt={`Poster de ${filme.titulo}`}
        loading="lazy"
      />

      <div className={`film-card__badge ${badgeCls}`}>{badgeLabel}</div>

      {showHeart && (
        <button
          className={`film-card__heart${favoritado ? ' film-card__heart--active' : ''}`}
          onClick={handleHeart}
          aria-label={favoritado ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          aria-pressed={favoritado}
        >
          {favoritado ? '♥' : '♡'}
        </button>
      )}

      <div className="film-card__info">
        <p className="film-card__title">{filme.titulo}</p>
        <p className="film-card__year">
          {filme.classificacao && (
            <span style={{ background:'#16a34a', color:'#fff', borderRadius:'4px', padding:'1px 6px', marginRight:'6px', fontSize:'0.72rem' }}>
              {filme.classificacao}
            </span>
          )}
          {filme.ano}
        </p>
      </div>
    </article>
  )
}
