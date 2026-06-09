import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useFilmes } from '../context/FilmesContext'
import { useAuth } from '../context/AuthContext'
import FilmCard from '../components/FilmCard'
import FilmForm from '../components/FilmForm'
import '../styles/DetalhesPage.css'
import '../styles/Shared.css'

const LANG_FLAGS = { 'Inglês': '🇺🇸', 'Português': '🇧🇷', 'Espanhol': '🇪🇸', 'Japonês': '🇯🇵', 'Francês': '🇫🇷', 'Italiano': '🇮🇹', 'Alemão': '🇩🇪', 'Coreano': '🇰🇷', 'Mandarim': '🇨🇳' }

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

function PopupVerSugestao({ sugestao, filmeAtual, onAprovar, onRecusar, onClose }) {
  const campos = [
    { label: 'Título', atual: filmeAtual.titulo, proposto: sugestao.titulo },
    { label: 'Ano', atual: filmeAtual.ano, proposto: sugestao.ano },
    { label: 'Sinopse', atual: filmeAtual.sinopse, proposto: sugestao.sinopse },
    { label: 'Classificação', atual: filmeAtual.classificacao, proposto: sugestao.classificacao },
    { label: 'Poster', atual: filmeAtual.poster, proposto: sugestao.poster },
    { label: 'Trailer', atual: filmeAtual.trailer, proposto: sugestao.trailer },
  ].filter(c => c.proposto && String(c.proposto) !== String(c.atual || ''))

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: '600px' }}>
        <h2 className="modal-title">Sugestão de {sugestao.nome}</h2>
        <p style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: '20px' }}>
          Mudanças propostas para: <strong style={{ color: '#fff' }}>{filmeAtual.titulo}</strong>
        </p>
        {campos.length === 0 ? (
          <p style={{ color: '#888' }}>Nenhuma alteração detectada.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
            {campos.map((c, i) => (
              <div key={i} style={{ background: '#252525', borderRadius: '10px', padding: '14px 16px' }}>
                <p style={{ fontWeight: 800, color: 'var(--purple-light)', fontSize: '0.8rem', marginBottom: '8px', textTransform: 'uppercase' }}>{c.label}</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <p style={{ fontSize: '0.72rem', color: '#888', marginBottom: '4px' }}>Atual</p>
                    <p style={{ fontSize: '0.85rem', color: '#ccc', wordBreak: 'break-word' }}>{c.atual || '—'}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.72rem', color: '#4caf50', marginBottom: '4px' }}>Proposto</p>
                    <p style={{ fontSize: '0.85rem', color: '#fff', wordBreak: 'break-word' }}>{c.proposto}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-primary" onClick={onAprovar}>✓ Aceitar Alterações</button>
          <button className="btn btn-delete" onClick={onRecusar}>✕ Recusar</button>
          <button className="btn btn-outline" onClick={onClose}>Fechar</button>
        </div>
      </div>
    </div>
  )
}

function PopupSugestoesFilme({ filme, onClose }) {
  const [sugestaoVendo, setSugestaoVendo] = useState(null)
  const [sugestoes, setSugestoes] = useState([
    { id: 1, nome: 'Matheus Soares', avatar: 'https://i.pravatar.cc/40?img=12',
      titulo: filme.titulo + ' (Edit)', ano: filme.ano ? filme.ano + 1 : null,
      sinopse: 'Sinopse alternativa proposta pelo usuário com mais detalhes sobre a trama do filme.',
      classificacao: '14', poster: filme.poster, trailer: filme.trailer },
    { id: 2, nome: 'Gabriella Esturrari', avatar: 'https://i.pravatar.cc/40?img=25',
      titulo: null, ano: filme.ano ? filme.ano - 1 : null,
      classificacao: '16', sinopse: null, poster: null, trailer: null },
  ])

  function getMudancasTexto(s) {
    const campos = []
    if (s.titulo && s.titulo !== filme.titulo) campos.push('Título')
    if (s.ano && String(s.ano) !== String(filme.ano)) campos.push('Ano')
    if (s.sinopse && s.sinopse !== filme.sinopse) campos.push('Sinopse')
    if (s.classificacao && s.classificacao !== filme.classificacao) campos.push('Classificação')
    if (s.poster && s.poster !== filme.poster) campos.push('Poster')
    if (s.trailer && s.trailer !== filme.trailer) campos.push('Trailer')
    return campos.length > 0 ? campos.join(', ') : 'Sem alterações detectadas'
  }

  function handleAprovar() {
    setSugestoes(prev => prev.filter(s => s.id !== sugestaoVendo.id))
    setSugestaoVendo(null)
  }

  function handleRecusar() {
    setSugestoes(prev => prev.filter(s => s.id !== sugestaoVendo.id))
    setSugestaoVendo(null)
  }

  if (sugestaoVendo) {
    return (
      <PopupVerSugestao
        sugestao={sugestaoVendo}
        filmeAtual={filme}
        onAprovar={handleAprovar}
        onRecusar={handleRecusar}
        onClose={() => setSugestaoVendo(null)}
      />
    )
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <h2 className="modal-title">Sugestões: {filme.titulo}</h2>
        {sugestoes.length === 0 ? (
          <p style={{ color: '#888', marginBottom: '20px' }}>Nenhuma sugestão pendente para este filme.</p>
        ) : (
          <div className="popup-sugestoes-list">
            {sugestoes.map(s => (
              <div
                key={s.id}
                className="popup-sugestoes-item"
                style={{ cursor: 'pointer' }}
                onClick={() => setSugestaoVendo(s)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && setSugestaoVendo(s)}
              >
                <div className="popup-sugestoes-info">
                  <img src={s.avatar} alt={s.nome} className="circle-avatar" width={36} height={36} />
                  <div className="popup-sugestoes-text">
                    <p className="popup-sugestoes-name">{s.nome}</p>
                    <p className="popup-sugestoes-changes">Mudanças Propostas: {getMudancasTexto(s)}</p>
                  </div>
                </div>
                <div className="popup-sugestoes-btns" onClick={e => e.stopPropagation()}>
                  <button
                    className="btn-icon btn-icon-green"
                    title="Ver sugestão"
                    aria-label="Ver"
                    onClick={() => setSugestaoVendo(s)}
                  >👁</button>
                  <button
                    className="btn-icon btn-icon-red"
                    title="Recusar"
                    aria-label="Recusar"
                    onClick={() => setSugestoes(prev => prev.filter(x => x.id !== s.id))}
                  >✕</button>
                </div>
              </div>
            ))}
          </div>
        )}
        <button
          className="btn btn-delete"
          style={{ fontSize: '0.85rem' }}
          onClick={() => setSugestoes([])}
        >🗑 Limpar Sugestões</button>
      </div>
    </div>
  )
}

function PopupSolicitarEdicao({ filme, onClose }) {
  const [enviado, setEnviado] = useState(false)

  function handleEnviar(data) {
    // TODO: integrar com endpoint de sugestões quando disponível
    console.log('Sugestão de edição enviada:', data)
    setEnviado(true)
  }

  if (enviado) {
    return (
      <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
        <div className="modal-box modal-box-sm" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '2rem' }}>✅</p>
          <h2 className="modal-title">Sugestão Enviada!</h2>
          <p style={{ color: '#aaa', marginBottom: '16px' }}>Obrigado pela colaboração. Um admin irá revisar sua sugestão em breve.</p>
          <button className="btn btn-primary" onClick={onClose}>Fechar</button>
        </div>
      </div>
    )
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: '780px' }}>
        <h2 className="modal-title">Editar Filme: {filme.titulo}</h2>
        <FilmForm
          initial={filme}
          onSubmit={handleEnviar}
          onCancel={onClose}
          submitLabel="Solicitar Edição"
        />
      </div>
    </div>
  )
}

export default function DetalhesPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { filmes, getFilmeDetalhes, updateFilme, deleteFilme } = useFilmes()
  const { isAdmin, isLoggedIn, isFavorito, toggleFavorito } = useAuth()

  const [filmeDetalhes, setFilmeDetalhes] = useState(null)
  const [loadingDetalhes, setLoadingDetalhes] = useState(true)

  useEffect(() => {
    setLoadingDetalhes(true)
    setFilmeDetalhes(null)
    getFilmeDetalhes(id)
      .then(data => setFilmeDetalhes(data))
      .catch(() => setFilmeDetalhes(null))
      .finally(() => setLoadingDetalhes(false))
  }, [id])

  // Enquanto carrega os detalhes, usa o filme da listagem como fallback
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
        <p style={{ fontSize: '1.2rem', color: '#aaa' }}>Filme não encontrado.</p>
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
      // Backend retorna "HH:MM:SS" ou "HH:MM"
      const parts = filme.duracao.split(':')
      const h = parseInt(parts[0], 10)
      const m = parseInt(parts[1] || '0', 10)
      return h > 0 ? `${h}h ${m}min` : `${m}min`
    }
    // Caso numérico (segundos) — fallback
    return `${Math.floor(filme.duracao / 60)}h ${filme.duracao % 60}min`
  })()

  const pais = (filme.paises?.[0]) || ''
  const paisFlag = { 'Estados Unidos': '🇺🇸', 'Japão': '🇯🇵', 'Reino Unido': '🇬🇧', 'França': '🇫🇷', 'Brasil': '🇧🇷' }[pais] || '🌐'

  function handleDelete() {
    deleteFilme(filme.id)
    navigate('/catalogo')
  }

  function handleEdit(data) {
    updateFilme(filme.id, data)
    setShowEdit(false)
  }

  return (
    <>
      {/* HERO */}
      <section className="detalhes-hero" aria-label={`Detalhes de ${filme.titulo}`}>
        <div className="detalhes-hero-bg" style={{ backgroundImage: `url(${bgUrl})` }} />
        <div className="detalhes-hero-gradient" />
        <div className="detalhes-hero-content">
          <h1 className="detalhes-title">{filme.titulo}</h1>

          <div className="detalhes-meta">
            {pais && <span className="detalhes-meta-item">{paisFlag} {pais}</span>}
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
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {filme.categorias.map((cat, i) => (
                <span key={i} style={{
                  background: 'rgba(120,51,226,0.35)',
                  border: '1px solid rgba(120,51,226,0.5)',
                  borderRadius: '20px',
                  padding: '3px 12px',
                  fontSize: '0.78rem',
                  color: '#d4b8ff',
                  fontWeight: 700,
                }}>{cat}</span>
              ))}
            </div>
          )}

          {filme.sinopse && (
            <p className="detalhes-synopsis">{filme.sinopse}</p>
          )}

          {(filme.linguagens?.length > 0) && (
            <div>
              <p className="detalhes-lang-label">Linguagens:</p>
              <div className="lang-flags">
                {filme.linguagens.map((l, i) => (
                  <span key={i} className="lang-flag" title={l}>
                    {LANG_FLAGS[l] || '🌐'}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="detalhes-actions">
            {isAdmin ? (
              <>
                <button className="btn btn-edit" onClick={() => setShowEdit(true)}>✏️ Editar</button>
                <button className="btn btn-suggest" onClick={() => setShowSugestoes(true)}>🚀 Sugestões</button>
                <button className="btn btn-delete" onClick={() => setShowDelete(true)}>🗑 Apagar</button>
              </>
            ) : isLoggedIn ? (
              <>
                <button className="btn btn-suggest" onClick={() => setShowSolicitar(true)}>
                  🚀 Solicitar Edição
                </button>
                <button
                  className={`btn-fav${isFavorito(filme.id) ? ' active' : ''}`}
                  onClick={() => toggleFavorito(filme.id)}
                  aria-label={isFavorito(filme.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                  style={{ fontSize: '1.2rem' }}
                >
                  {isFavorito(filme.id) ? '♥' : '♡'}
                </button>
              </>
            ) : null}
          </div>
        </div>
      </section>

      {/* BODY */}
      <div className="detalhes-body">
        <div className="detalhes-info-grid">
          {/* Diretores */}
          <section aria-labelledby="diretores-title">
            <h2 id="diretores-title" className="section-title">Diretores</h2>
            <div className="person-grid">
              {(filme.diretores || []).slice(0, 3).map((d, i) => {
                const nome = typeof d === 'string' ? d : d.nome
                const foto = typeof d === 'string' ? null : d.foto
                return (
                  <div key={i} className="person-card">
                    <img
                      src={foto || `https://ui-avatars.com/api/?name=${encodeURIComponent(nome)}&background=7833e2&color=fff&size=80`}
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
          </section>

          {/* Saga */}
          <section aria-labelledby="saga-title">
            <h2 id="saga-title" className="section-title">Da Saga</h2>
            {filme.sagas && filme.sagas.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {filme.sagas.map(saga => (
                  <div key={saga.id} className="saga-card">
                    <div className="saga-info">
                      <p className="saga-title">{saga.nome}</p>
                      {saga.descricao && (
                        <p className="saga-year" style={{ marginTop: '4px' }}>{saga.descricao}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#666', fontSize: '0.9rem' }}>Não pertence a uma saga.</p>
            )}
          </section>

          {/* Trailer */}
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

        {/* Elenco */}
        {(filme.elenco?.length > 0) && (
          <section className="detalhes-section" aria-labelledby="elenco-title">
            <h2 id="elenco-title" className="section-title">Elenco</h2>
            <div className="person-grid" style={{ flexWrap: 'wrap' }}>
              {filme.elenco.slice(0, 8).map((a, i) => {
                const nome = typeof a === 'string' ? a : a.nome
                const personagem = typeof a === 'string' ? '' : a.personagem
                const foto = typeof a === 'string' ? null : a.foto
                return (
                  <div key={i} className="person-card">
                    <img
                      src={foto || `https://ui-avatars.com/api/?name=${encodeURIComponent(nome)}&background=333&color=fff&size=80`}
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

        {/* Similares */}
        <section aria-labelledby="similares-title">
          <h2 id="similares-title" className="section-title">Similares</h2>
          <div className="similares-grid">
            {similares.map(f => <FilmCard key={f.id} filme={f} showInfo={false} />)}
          </div>
        </section>
      </div>

      {/* POPUPS */}
      {showDelete && (
        <PopupDeletar
          titulo={filme.titulo}
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
        />
      )}

      {showEdit && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowEdit(false)}>
          <div className="modal-box" style={{ maxWidth: '780px' }}>
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
