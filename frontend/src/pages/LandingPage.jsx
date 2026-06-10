import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFilmes } from '../context/FilmesContext'
import { useAuth } from '../context/AuthContext'
import { apiGetDestaques } from '../service/api'
import FilmCard from '../components/FilmCard'
import '../styles/LandingPage.css'
import '../styles/Shared.css'

export default function LandingPage() {
  const { filmes, loading, normalizeDestaques } = useFilmes()
  const { isLoggedIn, isFavorito, toggleFavorito } = useAuth()
  const navigate = useNavigate()
  const [heroIdx, setHeroIdx] = useState(0)
  const [heroFilmes, setHeroFilmes] = useState([])

  // Carrega destaques reais da home
  useEffect(() => {
    apiGetDestaques()
      .then(data => {
        const normalized = normalizeDestaques(data)
        // Se não há destaques configurados, usa os primeiros filmes como fallback
        setHeroFilmes(normalized.length > 0 ? normalized : filmes.slice(0, 5))
      })
      .catch(() => {
        setHeroFilmes(filmes.slice(0, 5))
      })
  }, [filmes])

  const trending = filmes.slice(0, 6)
  const recommendations = filmes.slice(2, 5)

  useEffect(() => {
    if (heroFilmes.length < 2) return
    const t = setInterval(() => setHeroIdx(i => (i + 1) % heroFilmes.length), 6000)
    return () => clearInterval(t)
  }, [heroFilmes.length])

  const hero = heroFilmes[heroIdx]

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner" />
        <span>Carregando filmes...</span>
      </div>
    )
  }

  return (
    <div>
      {/* HERO */}
      {hero && (
        <section className="landing-hero" aria-label="Destaque">
          <div
            className="landing-hero-bg"
            style={{ backgroundImage: `url(${hero.poster_bg || hero.poster})` }}
          />
          <div className="landing-hero-gradient" />
          <div className="landing-hero-content">
            <div className="landing-hero-text">
              <h1 className="landing-hero-title">{hero.titulo}</h1>
              <p className="landing-hero-synopsis">
                {hero.sinopse
                  ? hero.sinopse.substring(0, 150) + (hero.sinopse.length > 150 ? '...' : '')
                  : 'Clique em Detalhes para saber mais sobre este filme.'}
              </p>
              <div className="landing-hero-actions">
                <button className="btn btn-primary" onClick={() => navigate(`/detalhes/${hero.id}`)}>
                  Detalhes &rsaquo;
                </button>
                {isLoggedIn && (
                  <button
                    className={`btn-fav${isFavorito(hero.id) ? ' active' : ''}`}
                    onClick={() => toggleFavorito(hero.id)}
                    aria-label="Favoritar"
                  >
                    {isFavorito(hero.id) ? '♥' : '♡'}
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="landing-hero-dots" role="tablist" aria-label="Slides">
            {heroFilmes.map((_, i) => (
              <button
                key={i}
                className={`landing-hero-dot${i === heroIdx ? ' active' : ''}`}
                onClick={() => setHeroIdx(i)}
                role="tab"
                aria-selected={i === heroIdx}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </section>
      )}

      <div className="landing-body">
        {/* TRENDING */}
        <section className="landing-trending">
          <h2 className="section-title">Filmes em Tendência</h2>
          <div className="landing-films-grid-6">
            {trending.map(f => <FilmCard key={f.id} filme={f} />)}
          </div>
        </section>

        {/* PROMO BANNERS */}
        <section className="landing-promo" aria-label="Promoções">
          <div className="promo-card promo-card-purple">
            <div className="promo-card-content">
              <p className="promo-card-title">Ache os Melhores Filmes</p>
              <p className="promo-card-subtitle">Visite as Opções</p>
              <p className="promo-card-text">
                Nosso site oferece toda a informação e diversão que você merece
              </p>
              <button
                className="btn"
                style={{ background: '#fff', color: '#7833e2', fontWeight: 800, fontSize: '0.85rem', marginTop: '8px' }}
                onClick={() => navigate('/catalogo')}
              >
                🎬 Catálogo
              </button>
            </div>
            <img src="/tickets.png" alt="" className="promo-card-img" aria-hidden="true" />
          </div>

          <div className="promo-card promo-card-dark">
            <div className="promo-card-content">
              <p className="promo-card-title">Não Achou?</p>
              <p className="promo-card-text">
                Não conseguiu achar algum filme que queria? Solicite a adição do filme agora!
              </p>
              <button
                className="btn btn-primary"
                style={{ marginTop: '8px' }}
                onClick={() => isLoggedIn ? navigate('/solicitar-adicao') : navigate('/login')}
              >
                + Adicionar Filme
              </button>
            </div>
            <img src="/menina.webp" alt="" className="promo-card-img" aria-hidden="true" />
          </div>
        </section>

        {/* RECOMMENDATIONS */}
        <section aria-label="Recomendações">
          <h2 className="section-title">Provavelmente Você vai Gostar</h2>
          <div className="landing-recommendations">
            {recommendations.map(f => (
              <article key={f.id} className="rec-card" onClick={() => navigate(`/detalhes/${f.id}`)}>
                <img
                  className="rec-card-poster"
                  src={f.poster}
                  alt={f.titulo}
                  onError={e => { e.target.src = 'https://via.placeholder.com/80x100/2a2a2a/666' }}
                />
                <div className="rec-card-body">
                  <p className="rec-card-title">{f.titulo}</p>
                  <div className="rec-card-meta">
                    <span className="badge-classif">{f.classificacao || 'L'}</span>
                    <span style={{ color: '#aaa', fontSize: '0.85rem' }}>{f.ano}</span>
                  </div>
                  <button
                    className="btn btn-primary"
                    style={{ fontSize: '0.8rem', padding: '6px 14px' }}
                    onClick={e => { e.stopPropagation(); navigate(`/detalhes/${f.id}`) }}
                  >
                    Detalhes &rsaquo;
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
