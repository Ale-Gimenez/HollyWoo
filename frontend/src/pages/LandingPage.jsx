import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { homeService, filmeService } from '../services/api'
import Footer from '../components/shared/Footer'
import FilmCard from '../components/shared/FilmCard'
import './LandingPage.css'

export default function LandingPage() {
  const navigate = useNavigate()
  const [destaques,    setDestaques]    = useState([])
  const [tendencias,   setTendencias]   = useState([])
  const [recomendados, setRecomendados] = useState([])
  const [heroIdx,      setHeroIdx]      = useState(0)

  useEffect(() => {
    homeService.destaques()
      .then(d => setDestaques(d.map(x => x.filme)))
      .catch(() => {})

    filmeService.listar({ limit: 6 })
      .then(setTendencias)
      .catch(() => {})

    filmeService.listar({ limit: 3, skip: 3 })
      .then(setRecomendados)
      .catch(() => {})
  }, [])

  function interceptar(e) {
    e.preventDefault()
    navigate('/login')
  }

  const hero = destaques[heroIdx] ?? tendencias[0]

  return (
    <>
      <header className="landing-nav">
        <div className="container landing-nav__inner">
          <span className="landing-nav__logo">🎬 <strong>Holly</strong>Woo</span>
          <nav aria-label="Menu da landing page">
            <a href="#tendencias" onClick={interceptar}>Home</a>
            <a href="#tendencias" onClick={interceptar}>Catálogo</a>
            <a href="#tendencias" onClick={interceptar}>Favoritos</a>
          </nav>
          <button className="btn btn--ghost btn--sm" onClick={() => navigate('/login')}>Entrar</button>
        </div>
      </header>

      <main>
        {/* ── Hero ── */}
        {hero && (
          <section className="hero" style={{ backgroundImage: `url(${hero.banner ?? hero.poster})` }} aria-label={`Destaque: ${hero.titulo}`}>
            <div className="hero__overlay" />
            <div className="container hero__content">
              <h1>{hero.titulo}</h1>
              <p className="hero__sinopse">{hero.sinopse}</p>
              <div className="hero__actions">
                <button className="btn btn--primary" onClick={interceptar}>Detalhes ›</button>
                <button className="btn btn--ghost hero__heart" onClick={interceptar} aria-label="Favoritar">♡</button>
              </div>
            </div>
            {destaques.length > 1 && (
              <div className="hero__dots">
                {destaques.map((_, i) => (
                  <button key={i}
                    className={`hero__dot${i === heroIdx ? ' hero__dot--active' : ''}`}
                    onClick={() => setHeroIdx(i)} aria-label={`Destaque ${i + 1}`} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── Tendências ── */}
        <section id="tendencias" className="container landing-section">
          <h2 className="section-title">Filmes em Tendência</h2>
          <div className="landing-grid">
            {tendencias.map(f => (
              <FilmCard key={f.id_filme} filme={f} showHeart={false}
                onToggleFav={() => navigate('/login')} />
            ))}
          </div>
        </section>

        {/* ── Banners CTA ── */}
        <section className="container landing-banners" aria-label="Chamadas para ação">
          <div className="landing-banner landing-banner--purple">
            <div>
              <h3>Ache os Melhores Filmes</h3>
              <p className="landing-banner__sub">Visite as Opções</p>
              <p>Nosso site oferece toda a informação e diversão que você merece</p>
              <button className="btn btn--ghost btn--sm" onClick={() => navigate('/login')}>📋 Catálogo</button>
            </div>
            <span className="landing-banner__emoji">🎟️</span>
          </div>

          <div className="landing-banner landing-banner--dark">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Anna_Frozen_Disney.png/220px-Anna_Frozen_Disney.png"
              alt="Personagem animado" className="landing-banner__char" />
            <div>
              <h3>Não Achou?</h3>
              <p>Não conseguiu achar algum filme que queria? Solicite a adição do filme agora!</p>
              <button className="btn btn--primary btn--sm" onClick={() => navigate('/login')}>+ Adicionar Filme</button>
            </div>
          </div>
        </section>

        {/* ── Recomendados ── */}
        {recomendados.length > 0 && (
          <section className="container landing-section">
            <h2 className="section-title">Provavelmente Você vai Gostar</h2>
            <div className="landing-recommend">
              {recomendados.map(f => (
                <article key={f.id_filme} className="recommend-card" onClick={() => navigate('/login')}>
                  <img src={f.poster ?? ''} alt={f.titulo} />
                  <div className="recommend-card__info">
                    <strong>{f.titulo}</strong>
                    <span className="recommend-card__badge">
                      {f.classificacao && <em style={{ background:'#16a34a', color:'#fff', borderRadius:'4px', padding:'1px 5px', fontSize:'0.7rem' }}>{f.classificacao}</em>}
                      {f.ano}
                    </span>
                    <button className="btn btn--primary btn--sm" onClick={() => navigate('/login')}>Detalhes ›</button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  )
}
