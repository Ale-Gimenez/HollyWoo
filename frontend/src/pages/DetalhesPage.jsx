import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useFilmes } from '../context/FilmesContext'
import { useAuth } from '../context/AuthContext'
import FilmCard from '../components/FilmCard'
import FilmForm from '../components/FilmForm'
import '../styles/DetalhesPage.css'
import '../styles/Shared.css'

const LANG_FLAGS_EMOJI = {
  'Inglês': '🇺🇸', 'Português': '🇧🇷', 'Espanhol': '🇪🇸',
  'Japonês': '🇯🇵', 'Francês': '🇫🇷', 'Italiano': '🇮🇹',
  'Alemão': '🇩🇪', 'Coreano': '🇰🇷', 'Mandarim': '🇨🇳',
  'Árabe': '🇸🇦', 'Hindi': '🇮🇳', 'Russo': '🇷🇺',
}

const PAIS_FLAGS_EMOJI = {
  'Estados Unidos': '🇺🇸', 'Japão': '🇯🇵', 'Reino Unido': '🇬🇧',
  'França': '🇫🇷', 'Brasil': '🇧🇷', 'Itália': '🇮🇹',
  'Alemanha': '🇩🇪', 'Espanha': '🇪🇸', 'Coreia do Sul': '🇰🇷',
  'China': '🇨🇳', 'Canadá': '🇨🇦', 'Austrália': '🇦🇺',
  'Índia': '🇮🇳', 'México': '🇲🇽', 'Argentina': '🇦🇷',
}

function PopupDeletar({ titulo, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onCancel()}>
      <div className="modal-box modal-box-sm popup-deletar">
        <div className="popup-deletar-icon" aria-hidden="true">🗑️</div>
        <h2 className="popup-deletar-title">Deletar Filme</h2>
        <p className="popup-deletar-subtitle">Você está prestes a deletar permanentemente:</p>
        <p className="popup-deletar-filmname">"{titulo}"</p>
        <div className="inline-error popup-deletar-warning">
          ⚠ Esta ação não pode ser desfeita. O filme será removido permanentemente do catálogo.
        </div>
        <div className="popup-deletar-actions">
          <button className="btn btn-delete" onClick={onConfirm}>🗑 Deletar</button>
          <button className="btn btn-outline" onClick={onCancel}>✕ Cancelar</button>
        </div>
      </div>
    </div>
  )
}

function PopupSugestoesFilme({ filme, onClose }) {
  const { getSugestoesFilme, aprovarSugestao, recusarSugestao, dadosAuxiliares } = useFilmes()
  const [sugestaoVendo, setSugestaoVendo] = useState(null)
  const [sugestoes, setSugestoes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSugestoesFilme(filme.id)
      .then(data => setSugestoes(data.map(s => ({ ...s, filmeAtual: filme }))))
      .catch(() => setSugestoes([]))
      .finally(() => setLoading(false))
  }, [filme.id])

  async function handleAprovar() {
    try {
      await aprovarSugestao(sugestaoVendo.id)
      setSugestoes(prev => prev.filter(s => s.id !== sugestaoVendo.id))
      setSugestaoVendo(null)
    } catch (err) {
      alert('Erro ao aprovar: ' + err.message)
    }
  }

  async function handleRecusar() {
    try {
      await recusarSugestao(sugestaoVendo.id)
      setSugestoes(prev => prev.filter(s => s.id !== sugestaoVendo.id))
      setSugestaoVendo(null)
    } catch (err) {
      alert('Erro ao recusar: ' + err.message)
    }
  }

  function getMudancasTexto(s) {
    const campos = []
    if (s.titulo)        campos.push('Título')
    if (s.ano)           campos.push('Ano')
    if (s.sinopse)       campos.push('Sinopse')
    if (s.classificacao) campos.push('Classificação')
    if (s.poster)        campos.push('Poster')
    if (s.trailer)       campos.push('Trailer')
    if (s.ids_categorias?.length) campos.push('Categorias')
    if (s.ids_linguagens?.length) campos.push('Linguagens')
    if (s.ids_paises?.length)     campos.push('Países')
    if (s.ids_sagas?.length)      campos.push('Sagas')
    return campos.length > 0 ? campos.join(', ') : 'Sem alterações detectadas'
  }

  if (sugestaoVendo) {
    function resolveNomes(ids, lista, idKey) {
      if (!ids || !ids.length) return null
      const nomes = lista.filter(i => ids.includes(i[idKey])).map(i => i.nome)
      return nomes.length ? nomes.join(', ') : null
    }

    const paisesAtuais = (filme.paises || []).map(p => typeof p === 'string' ? p : p.nome).join(', ')
    const linguagensAtuais = (filme.linguagens || []).map(l => typeof l === 'string' ? l : l.nome).join(', ')

    const campos = [
      { label: 'Título',        atual: filme.titulo,         proposto: sugestaoVendo.titulo },
      { label: 'Ano',           atual: filme.ano,            proposto: sugestaoVendo.ano },
      { label: 'Sinopse',       atual: filme.sinopse,        proposto: sugestaoVendo.sinopse },
      { label: 'Classificação', atual: filme.classificacao,  proposto: sugestaoVendo.classificacao },
      { label: 'Estilo Visual', atual: filme.estilo_visual,  proposto: sugestaoVendo.estilo_visual },
      { label: 'Duração',       atual: filme.duracao,        proposto: sugestaoVendo.duracao },
      { label: 'Orçamento',     atual: filme.orcamento,      proposto: sugestaoVendo.orcamento },
      { label: 'Poster',        atual: filme.poster,         proposto: sugestaoVendo.poster },
      { label: 'Banner',        atual: filme.poster_bg,      proposto: sugestaoVendo.banner },
      { label: 'Trailer',       atual: filme.trailer,        proposto: sugestaoVendo.trailer },
      {
        label: 'Categorias',
        atual: filme.categorias?.join(', ') || '—',
        proposto: resolveNomes(sugestaoVendo.ids_categorias, dadosAuxiliares.categorias, 'id_categoria'),
      },
      {
        label: 'Linguagens',
        atual: linguagensAtuais || '—',
        proposto: resolveNomes(sugestaoVendo.ids_linguagens, dadosAuxiliares.linguagens, 'id_linguagem'),
      },
      {
        label: 'Países',
        atual: paisesAtuais || '—',
        proposto: resolveNomes(sugestaoVendo.ids_paises, dadosAuxiliares.paises, 'id_pais'),
      },
      {
        label: 'Sagas',
        atual: filme.sagas?.map(s => s.nome).join(', ') || '—',
        proposto: resolveNomes(sugestaoVendo.ids_sagas, dadosAuxiliares.sagas, 'id_saga'),
      },
    ].filter(c => c.proposto != null && String(c.proposto) !== String(c.atual ?? ''))

    return (
      <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
        <div className="modal-box modal-md">
          <div className="popup-sug-header">
            <img src={filme.poster} alt={filme.titulo}
              className="popup-sug-poster"
              onError={e => { e.target.src = 'https://via.placeholder.com/48x68/2a2a2a/666' }} />
            <div>
              <h2 className="modal-title modal-title-sm"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="svg-inline"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg> Sugestão de Edição</h2>
              <p className="popup-sug-subtitle">
                Por <strong className="text-white">{sugestaoVendo.nome_usuario}</strong> →{' '}
                <strong className="text-purple">{filme.titulo}</strong>
              </p>
            </div>
          </div>
          {campos.length === 0 ? (
            <p className="no-changes-text">Nenhuma alteração detectada nesta sugestão.</p>
          ) : (
            <div className="campos-diff-list">
              {campos.map((c, i) => (
                <div key={i} className="campo-diff-item">
                  <p className="campo-diff-label">{c.label}</p>
                  <div className="campo-diff-grid">
                    <div>
                      <p className="campo-diff-heading campo-diff-heading-atual">ATUAL</p>
                      <p className="campo-diff-value campo-diff-value-atual">{String(c.atual || '—')}</p>
                    </div>
                    <div>
                      <p className="campo-diff-heading campo-diff-heading-proposto">PROPOSTO</p>
                      <p className="campo-diff-value campo-diff-value-proposto">{String(c.proposto)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="modal-actions">
            <button className="btn btn-primary" onClick={handleAprovar}>✓ Aprovar Alterações</button>
            <button className="btn btn-delete" onClick={handleRecusar}>✕ Recusar</button>
            <button className="btn btn-outline" onClick={() => setSugestaoVendo(null)}>← Voltar</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <h2 className="modal-title"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="svg-inline"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg> Sugestões: {filme.titulo}</h2>
        {loading ? (
          <div className="loading-state"><div className="spinner" /></div>
        ) : sugestoes.length === 0 ? (
          <p className="no-changes-text">Nenhuma sugestão pendente para este filme.</p>
        ) : (
          <div className="popup-sugestoes-list">
            {sugestoes.map(s => (
              <div key={s.id} className="popup-sugestoes-item" 
                onClick={() => setSugestaoVendo(s)} role="button" tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && setSugestaoVendo(s)}>
                <div className="popup-sugestoes-info">
                  <img src={s.avatar_usuario || `https://ui-avatars.com/api/?name=${encodeURIComponent(s.nome_usuario)}&background=333&color=fff`}
                    alt={s.nome_usuario} className="circle-avatar" width={36} height={36} />
                  <div className="popup-sugestoes-text">
                    <p className="popup-sugestoes-name">{s.nome_usuario}</p>
                    <p className="popup-sugestoes-changes">Mudanças: {getMudancasTexto(s)}</p>
                  </div>
                </div>
                <div className="popup-sugestoes-btns" onClick={e => e.stopPropagation()}>
                  <button className="btn-icon btn-icon-green" title="Ver sugestão" onClick={() => setSugestaoVendo(s)}>👁</button>
                  <button className="btn-icon btn-icon-red" title="Recusar" onClick={async () => {
                    try { await recusarSugestao(s.id); setSugestoes(prev => prev.filter(x => x.id !== s.id)) }
                    catch (err) { alert('Erro: ' + err.message) }
                  }}>✕</button>
                </div>
              </div>
            ))}
          </div>
        )}
        <button className="btn btn-outline" onClick={onClose}>Fechar</button>
      </div>
    </div>
  )
}

function PopupSolicitarEdicao({ filme, onClose }) {
  const { criarSugestao } = useFilmes()
  const [enviado, setEnviado] = useState(false)
  const [erro, setErro] = useState(null)
  const [enviando, setEnviando] = useState(false)

  async function handleEnviar(data) {
    setEnviando(true)
    setErro(null)
    try {
      await criarSugestao(filme.id, data)
      setEnviado(true)
    } catch (err) {
      setErro(err.message || 'Erro ao enviar sugestão. Tente novamente.')
    } finally {
      setEnviando(false)
    }
  }

  if (enviado) {
    return (
      <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
        <div className="modal-box modal-box-sm" className="modal-center">
          <p className="success-icon-sm">✅</p>
          <h2 className="modal-title"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="svg-inline"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg> Sugestão Enviada!</h2>
          <p className="success-text">Obrigado pela colaboração. Um admin irá revisar sua sugestão em breve.</p>
          <button className="btn btn-primary" onClick={onClose}>Fechar</button>
        </div>
      </div>
    )
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box modal-lg">
        <h2 className="modal-title">Editar Filme: {filme.titulo}</h2>
        {erro && (
          <div className="inline-error-box">
            ⊙ {erro}
          </div>
        )}
        {enviando ? (
          <div className="loading-state"><div className="spinner" /><p>Enviando sugestão...</p></div>
        ) : (
          <FilmForm
            initial={filme}
            onSubmit={handleEnviar}
            onCancel={onClose}
            submitLabel="Solicitar Edição"
          />
        )}
      </div>
    </div>
  )
}

export default function DetalhesPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { filmes, getFilmeDetalhes, updateFilme, deleteFilme, criarSugestao, getSugestoesFilme, aprovarSugestao, recusarSugestao, dadosAuxiliares } = useFilmes()
  const { isAdmin, isLoggedIn, isFavorito, toggleFavorito } = useAuth()

  const [filmeDetalhes, setFilmeDetalhes] = useState(null)
  const [loadingDetalhes, setLoadingDetalhes] = useState(true)
  const [deleteError, setDeleteError] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    setLoadingDetalhes(true)
    setFilmeDetalhes(null)
    getFilmeDetalhes(id)
      .then(data => setFilmeDetalhes(data))
      .catch(() => setFilmeDetalhes(null))
      .finally(() => setLoadingDetalhes(false))
  }, [id])

  const filme = filmeDetalhes || filmes.find(f => String(f.id) === String(id))

  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [showSugestoes, setShowSugestoes] = useState(false)
  const [showSolicitar, setShowSolicitar] = useState(false)

  if (loadingDetalhes && !filme) {
    return (
      <div className="loading-state">
        <div className="spinner" />
        <p>Carregando detalhes...</p>
      </div>
    )
  }

  if (!filme) {
    return (
      <div className="loading-state">
        <p className="text-not-found">Filme não encontrado.</p>
        <button className="btn btn-primary" onClick={() => navigate('/catalogo')}>
          Voltar ao Catálogo
        </button>
      </div>
    )
  }

  const similares = filmes.filter(f => String(f.id) !== String(id)).slice(0, 6)
  const bgUrl = filme.poster_bg || filme.poster

  const dur = (() => {
    if (!filme.duracao) return ''
    if (typeof filme.duracao === 'string') {
      const parts = filme.duracao.split(':')
      const h = parseInt(parts[0], 10)
      const m = parseInt(parts[1] || '0', 10)
      return h > 0 ? `${h}h ${m}min` : `${m}min`
    }
    return `${Math.floor(filme.duracao / 60)}h ${filme.duracao % 60}min`
  })()

  const primeiroPais = filme.paises?.[0]
  const paisNome = typeof primeiroPais === 'string' ? primeiroPais : primeiroPais?.nome || ''
  const paisImg  = typeof primeiroPais === 'object' && primeiroPais?.img ? primeiroPais.img : null
  const paisFlag = paisImg ? null : (PAIS_FLAGS_EMOJI[paisNome] || '🌐')

  async function handleDelete() {
    setDeleting(true)
    setDeleteError(null)
    try {
      await deleteFilme(filme.id)
      navigate('/catalogo')
    } catch (err) {
      setDeleteError(err.message || 'Erro ao deletar filme.')
      setDeleting(false)
      setShowDelete(false)
    }
  }

  function handleEdit(data) {
    updateFilme(filme.id, data)
      .then(updated => {
        setFilmeDetalhes(updated)
        setShowEdit(false)
      })
      .catch(err => console.error('Erro ao atualizar:', err))
  }

  return (
    <>
      {deleteError && (
        <div className="delete-error-toast">
          ⊙ {deleteError}
          <button onClick={() => setDeleteError(null)} className="delete-error-close">✕</button>
        </div>
      )}

      
      <section className="detalhes-hero" aria-label={`Detalhes de ${filme.titulo}`}>
        <div className="detalhes-hero-bg" style={{ backgroundImage: `url(${bgUrl})` }} />
        <div className="detalhes-hero-gradient" />
        <div className="detalhes-hero-content">
          <h1 className="detalhes-title">{filme.titulo}</h1>

          <div className="detalhes-meta">
            
            {paisNome && (
              <span className="detalhes-meta-item detalhes-meta-pais">
                {paisImg
                  ? <img src={paisImg} alt={paisNome} className="pais-flag-img" onError={e => { e.target.style.display='none' }} />
                  : <span>{paisFlag}</span>
                }
                {paisNome}
              </span>
            )}
            {filme.ano && <span className="detalhes-meta-item">📅 {filme.ano}</span>}
            {filme.classificacao && (
              <span className="badge-classif">{filme.classificacao}</span>
            )}
            {filme.produtora_principal && (
              <span className="detalhes-produtora">
                {typeof filme.produtora_principal === 'string'
                  ? filme.produtora_principal
                  : filme.produtora_principal.nome}
              </span>
            )}
            {filme.orcamento > 0 && (
              <span className="detalhes-meta-item">
                <span className="detalhes-orcamento-badge">$</span>
                {Number(filme.orcamento).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            )}
            {dur && (
              <span className="detalhes-meta-item">⏱ {dur}</span>
            )}
          </div>

          {(filme.categorias?.length > 0) && (
            <div className="categorias-row">
              {filme.categorias.map((cat, i) => (
                <span key={i} className="categoria-badge">{cat}</span>
              ))}
            </div>
          )}

          {filme.sinopse && (
            <p className="detalhes-synopsis">{filme.sinopse}</p>
          )}

          
          {(filme.linguagens?.length > 0) && (
            <div className="detalhes-lang-section">
              <p className="detalhes-lang-label">Linguagens:</p>
              <div className="lang-flags">
                {filme.linguagens.map((l, i) => {
                  const nome = typeof l === 'string' ? l : l.nome
                  const img  = typeof l === 'object' && l.img ? l.img : null
                  const emoji = LANG_FLAGS_EMOJI[nome] || '🌐'
                  return (
                    <span key={i} className="lang-flag lang-flag-wrap">
                      {img
                        ? <img src={img} alt={nome} className="lang-flag-img" onError={e => { e.target.style.display='none'; e.target.nextSibling && (e.target.nextSibling.style.display='inline') }} />
                        : null
                      }
                      <span className="lang-flag-emoji">{emoji}</span>
                    </span>
                  )
                })}
              </div>
            </div>
          )}

          <div className="detalhes-actions">
            {isAdmin ? (
              <>
                <button className="btn btn-edit" onClick={() => setShowEdit(true)}>✏️ Editar</button>
                <button className="btn btn-suggest" onClick={() => setShowSugestoes(true)}><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg> Sugestões</button>
                <button className="btn btn-delete" onClick={() => setShowDelete(true)} disabled={deleting}>
                  {deleting ? '⏳ Deletando...' : '🗑 Apagar'}
                </button>
              </>
            ) : isLoggedIn ? (
              <>
                <button className="btn btn-suggest" onClick={() => setShowSolicitar(true)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg> Solicitar Edição
                </button>
                <button
                  className={`btn-fav${isFavorito(filme.id) ? ' active' : ''}`}
                  onClick={() => toggleFavorito(filme.id)}
                  aria-label={isFavorito(filme.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                >
                  {isFavorito(filme.id) ? '♥' : '♡'}
                </button>
              </>
            ) : null}
          </div>
        </div>
      </section>

      
      <div className="detalhes-body">
        <div className="detalhes-info-grid">
          
          <section aria-labelledby="diretores-title">
            <h2 id="diretores-title" className="section-title">Diretores</h2>
            {(filme.diretores || []).length === 0 ? (
              <p className="empty-text">Nenhum diretor cadastrado.</p>
            ) : (
              <div className="person-grid">
                {(filme.diretores || []).slice(0, 3).map((d, i) => {
                  const nome = typeof d === 'string' ? d : d.nome
                  const foto = typeof d === 'string' ? null : d.foto
                  return (
                    <div key={i} className="person-card">
                      <img
                        src={foto && foto !== '' ? foto : `https://ui-avatars.com/api/?name=${encodeURIComponent(nome)}&background=7833e2&color=fff&size=80`}
                        alt={nome}
                        className="circle-avatar person-avatar"
                        onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(nome)}&background=7833e2&color=fff&size=80` }}
                      />
                      <p className="person-name">{nome}</p>
                      <p className="person-role">Diretor</p>
                    </div>
                  )
                })}
              </div>
            )}
          </section>

          
          <section aria-labelledby="saga-title">
            <h2 id="saga-title" className="section-title">Da Saga</h2>
            {filme.sagas && filme.sagas.length > 0 ? (
              <div className="sagas-list">
                {filme.sagas.map((saga, i) => (
                  <div key={saga.id || i} className="saga-card">
                    <div className="saga-info">
                      <p className="saga-title">{saga.nome}</p>
                      {saga.descricao && (
                        <p className="saga-year">{saga.descricao}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-text">Não pertence a uma saga.</p>
            )}
          </section>

          
          <section aria-labelledby="trailer-title">
            <h2 id="trailer-title" className="section-title">Trailer</h2>
            <div
              className="trailer-thumb"
              onClick={() => filme.trailer && window.open(filme.trailer, '_blank')}
            >
              <img
                src={bgUrl}
                alt={`Trailer de ${filme.titulo}`}
                onError={e => { e.target.src = 'https://via.placeholder.com/300x170/111/333' }}
              />
              <div className="trailer-play">
                <div className="trailer-play-btn" aria-label="Reproduzir trailer">▶</div>
              </div>
            </div>
          </section>
        </div>

        
        {(filme.elenco?.length > 0) && (
          <section className="detalhes-section" aria-labelledby="elenco-title">
            <h2 id="elenco-title" className="section-title">Elenco</h2>
            <div className="person-grid person-grid-wrap">
              {filme.elenco.slice(0, 8).map((a, i) => {
                const nome = typeof a === 'string' ? a : a.nome
                const personagem = typeof a === 'string' ? '' : a.personagem
                const foto = typeof a === 'string' ? null : a.foto
                return (
                  <div key={i} className="person-card">
                    <img
                      src={foto && foto !== '' ? foto : `https://ui-avatars.com/api/?name=${encodeURIComponent(nome)}&background=333&color=fff&size=80`}
                      alt={nome}
                      className="circle-avatar person-avatar"
                      onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(nome)}&background=333&color=fff&size=80` }}
                    />
                    <p className="person-name">{nome}</p>
                    {personagem && <p className="person-role">{personagem}</p>}
                  </div>
                )
              })}
            </div>
          </section>
        )}

        
        <section aria-labelledby="similares-title">
          <h2 id="similares-title" className="section-title">Similares</h2>
          <div className="similares-grid">
            {similares.map(f => <FilmCard key={f.id} filme={f} showInfo={false} />)}
          </div>
        </section>
      </div>

      
      {showDelete && (
        <PopupDeletar
          titulo={filme.titulo}
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
        />
      )}

      {showEdit && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowEdit(false)}>
          <div className="modal-box modal-lg">
            <h2 className="modal-title">Editar Filme: {filme.titulo}</h2>
            <FilmForm
              initial={filme}
              onSubmit={handleEdit}
              onCancel={() => setShowEdit(false)}
              submitLabel="Salvar Câmbios"
            />
          </div>
        </div>
      )}

      {showSugestoes && (
        <PopupSugestoesFilme filme={filme} onClose={() => setShowSugestoes(false)} />
      )}

      {showSolicitar && (
        <PopupSolicitarEdicao filme={filme} onClose={() => setShowSolicitar(false)} />
      )}
    </>
  )
}