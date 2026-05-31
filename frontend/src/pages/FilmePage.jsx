import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { filmeService, favoritoService } from '../services/api'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/shared/Navbar'
import Footer from '../components/shared/Footer'
import FilmCard from '../components/shared/FilmCard'
import ModalEditarFilme from '../components/filme/ModalEditarFilme'
import ModalDeletarFilme from '../components/filme/ModalDeletarFilme'
import ModalSugerirEdicao from '../components/filme/ModalSugerirEdicao'
import Toast from '../components/shared/Toast'
import './FilmePage.css'

export default function FilmePage() {
  const { id }    = useParams()
  const navigate  = useNavigate()
  const { user, isAdmin } = useAuth()

  const [filme,       setFilme]       = useState(null)
  const [similares,   setSimilares]   = useState([])
  const [favoritado,  setFavoritado]  = useState(false)
  const [loading,     setLoading]     = useState(true)
  const [erro,        setErro]        = useState('')
  const [toast,       setToast]       = useState({ msg: '', type: 'success' })

  const [showEditar,  setShowEditar]  = useState(false)
  const [showDeletar, setShowDeletar] = useState(false)
  const [showSugerir, setShowSugerir] = useState(false)

  useEffect(() => {
    setLoading(true)
    filmeService.detalhe(id)
      .then(f => {
        setFilme(f)
        // busca similares pela primeira categoria
        const catId = f.categorias?.[0]?.id_categoria
        if (catId) {
          filmeService.listar({ categoria: catId, limit: 6 })
            .then(data => setSimilares(data.filter(x => x.id_filme !== f.id_filme)))
            .catch(() => {})
        }
      })
      .catch(e => setErro(e.message))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (!user || !id) return
    favoritoService.verificar(id)
      .then(r => setFavoritado(r.favoritado))
      .catch(() => {})
  }, [user, id])

  async function handleToggleFav() {
    if (!user) { navigate('/login'); return }
    try {
      if (favoritado) {
        await favoritoService.remover(id)
        setFavoritado(false)
        setToast({ msg: 'Removido dos favoritos', type: 'success' })
      } else {
        await favoritoService.adicionar(id)
        setFavoritado(true)
        setToast({ msg: 'Adicionado aos favoritos!', type: 'success' })
      }
    } catch (e) {
      setToast({ msg: e.message, type: 'error' })
    }
  }

  if (loading) return (
    <>
      <Navbar />
      <div className="spinner" />
      <p className="loading-text">Carregando filme...</p>
    </>
  )

  if (erro || !filme) return (
    <>
      <Navbar />
      <div className="container" style={{ marginTop: '48px' }}>
        <p style={{ color: 'var(--color-danger)' }}>⚠️ {erro || 'Filme não encontrado.'}</p>
        <button className="btn btn--ghost btn--sm" style={{ marginTop: '16px' }} onClick={() => navigate(-1)}>← Voltar</button>
      </div>
    </>
  )

  const FLAG_EMOJI   = { 'Estados Unidos': '🇺🇸', 'Japão': '🇯🇵', 'Brasil': '🇧🇷', 'França': '🇫🇷', 'Itália': '🇮🇹' }
  const PRODUTORA_LOGO = { Disney: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Disney_wordmark.svg/220px-Disney_wordmark.svg.png' }

  return (
    <>
      <Navbar />
      <Toast message={toast.msg} type={toast.type} onClose={() => setToast({ msg: '' })} />

      {/* ── Hero banner ── */}
      <section className="filme-hero" style={{ backgroundImage: `url(${filme.banner ?? filme.poster})` }} aria-label={filme.titulo}>
        <div className="filme-hero__overlay" />
        <div className="container filme-hero__content">
          <h1>{filme.titulo}</h1>

          <div className="filme-hero__meta">
            <span>{FLAG_EMOJI[filme.pais_origem?.nome] ?? '🌍'}</span>
            <strong>{filme.ano}</strong>
            {filme.classificacao && (
              <span className="filme-hero__classif">{filme.classificacao}</span>
            )}
            {filme.produtoras?.[0] && (
              <span style={{ fontWeight: 600 }}>{filme.produtoras[0].nome}</span>
            )}
            {filme.orcamento && (
              <span>💰 $ {Number(filme.orcamento).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            )}
          </div>

          <p className="filme-hero__sinopse">{filme.sinopse}</p>

          {filme.linguagens?.length > 0 && (
            <div className="filme-hero__linguas">
              <strong>Linguagens:</strong>
              {filme.linguagens.map(l => (
                <span key={l.id_linguagem} className="filme-hero__lingua">{l.nome}</span>
              ))}
            </div>
          )}

          {/* Botões de ação */}
          <div className="filme-hero__actions">
            {isAdmin ? (
              <>
                <button className="btn btn--primary btn--sm" onClick={() => setShowEditar(true)}>✏️ Editar</button>
                <button className="btn btn--ghost   btn--sm" onClick={() => setShowDeletar(false) || setShowDeletar(true)}>🚀 Sugestões</button>
                <button className="btn btn--danger  btn--sm" onClick={() => setShowDeletar(true)}>🗑 Apagar</button>
              </>
            ) : (
              <>
                <button className="btn btn--ghost btn--sm" onClick={() => setShowSugerir(true)}>🚀 Solicitar Edição</button>
                <button
                  className={`btn btn--sm filme-hero__fav${favoritado ? ' filme-hero__fav--active' : ''}`}
                  onClick={handleToggleFav}
                  aria-label={favoritado ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                  aria-pressed={favoritado}
                >
                  {favoritado ? '♥' : '♡'}
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── Detalhes ── */}
      <div className="container filme-detalhes">
        <div className="filme-detalhes__cols">

          {/* Diretores */}
          {filme.diretores?.length > 0 && (
            <section className="filme-sec" aria-label="Diretores">
              <h2 className="section-title">Diretores</h2>
              <ul className="pessoa-lista">
                {filme.diretores.map(d => (
                  <li key={d.id_diretor} className="pessoa-card">
                    <div className="pessoa-card__avatar">{d.nome[0]}</div>
                    <p className="pessoa-card__nome">{d.nome} {d.sobrenome}</p>
                    <p className="pessoa-card__papel">Diretor</p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Saga */}
          {filme.sagas?.length > 0 && (
            <section className="filme-sec" aria-label="Da Saga">
              <h2 className="section-title">Da Saga</h2>
              <ul className="saga-lista">
                {filme.sagas.map(s => (
                  <li key={s.id_saga} className="saga-card">
                    <div className="saga-card__icon">🎬</div>
                    <div>
                      <strong>{s.nome}</strong>
                      {s.descricao && <p className="saga-card__desc">{s.descricao}</p>}
                      <button className="btn btn--primary btn--sm" style={{ marginTop: '8px' }}
                        onClick={() => navigate(`/catalogo?saga=${s.id_saga}`)}>
                        Ver filmes ›
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Trailer */}
          {filme.trailer && (
            <section className="filme-sec" aria-label="Trailer">
              <h2 className="section-title">Trailer</h2>
              <a href={filme.trailer} target="_blank" rel="noreferrer" className="trailer-thumb">
                <img src={filme.poster} alt={`Trailer de ${filme.titulo}`} />
                <span className="trailer-thumb__play" aria-hidden="true">▶</span>
              </a>
            </section>
          )}
        </div>

        {/* Elenco */}
        {filme.atores?.length > 0 && (
          <section className="filme-sec" aria-label="Elenco">
            <h2 className="section-title">Elenco</h2>
            <ul className="pessoa-lista pessoa-lista--elenco">
              {filme.atores.map(a => (
                <li key={a.id_ator} className="pessoa-card">
                  <div className="pessoa-card__avatar">{a.nome[0]}</div>
                  <p className="pessoa-card__nome">{a.nome}<br />{a.sobrenome}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Similares (só usr) */}
        {!isAdmin && similares.length > 0 && (
          <section className="filme-sec" aria-label="Filmes similares">
            <h2 className="section-title">Similares</h2>
            <div className="filme-similares">
              {similares.map(f => (
                <FilmCard key={f.id_filme} filme={f} showHeart={false} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* ── Modais ── */}
      {showEditar && (
        <ModalEditarFilme
          filme={filme}
          onClose={() => setShowEditar(false)}
          onSaved={(f) => { setFilme(f); setShowEditar(false); setToast({ msg: 'Filme editado!', type: 'success' }) }}
        />
      )}
      {showDeletar && (
        <ModalDeletarFilme
          filme={filme}
          onClose={() => setShowDeletar(false)}
          onDeleted={() => { navigate('/catalogo') }}
        />
      )}
      {showSugerir && (
        <ModalSugerirEdicao
          filme={filme}
          onClose={() => setShowSugerir(false)}
          onSent={() => { setShowSugerir(false); setToast({ msg: 'Sugestão enviada!', type: 'success' }) }}
        />
      )}

      {!isAdmin && <Footer />}
      {isAdmin && (
        <footer className="home-footer-simple">
          <p>Copyright {new Date().getFullYear()} — Todos os direitos reservados</p>
        </footer>
      )}
    </>
  )
}
