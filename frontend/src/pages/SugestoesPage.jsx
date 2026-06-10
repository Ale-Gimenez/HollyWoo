import { useState, useEffect } from 'react'
import { useFilmes } from '../context/FilmesContext'
import '../styles/Pages.css'
import '../styles/Shared.css'

/* ─── Popup: detalhe de sugestão de ADIÇÃO ──────────────────────────────── */
function PopupDetalheAdicao({ filme, onAprovar, onRecusar, onClose }) {
  const [confirmando, setConfirmando] = useState(false)

  const infoRows = [
    { label: 'Título',       valor: filme.titulo },
    { label: 'Ano',          valor: filme.ano },
    { label: 'Classificação',valor: filme.classificacao },
    { label: 'Duração',      valor: filme.duracao },
    { label: 'Orçamento',    valor: filme.orcamento ? `$ ${Number(filme.orcamento).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : null },
    { label: 'Categorias',   valor: filme.categorias?.length > 0 ? filme.categorias.join(', ') : null },
    { label: 'Linguagens',   valor: filme.linguagens?.length > 0 ? filme.linguagens.join(', ') : null },
    { label: 'Países',       valor: filme.paises?.length > 0 ? filme.paises.join(', ') : null },
    { label: 'Trailer',      valor: filme.trailer },
  ].filter(r => r.valor)

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: '620px' }}>
        <h2 className="modal-title">Sugestão de Adição</h2>

        <div style={{ display: 'flex', gap: '20px', marginBottom: '24px' }}>
          <img
            src={filme.poster}
            alt={filme.titulo}
            style={{ width: 100, height: 140, objectFit: 'cover', borderRadius: 10, flexShrink: 0 }}
            onError={e => { e.target.src = 'https://via.placeholder.com/100x140/2a2a2a/666' }}
          />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {infoRows.map((r, i) => (
              <div key={i} style={{ display: 'flex', gap: '8px', fontSize: '0.88rem' }}>
                <span style={{ color: 'var(--purple-light)', fontWeight: 700, minWidth: 90, flexShrink: 0 }}>{r.label}:</span>
                <span style={{ color: '#e0e0e0', wordBreak: 'break-word' }}>{r.valor}</span>
              </div>
            ))}
          </div>
        </div>

        {filme.sinopse && (
          <div style={{ background: '#252525', borderRadius: 10, padding: '12px 16px', marginBottom: '20px' }}>
            <p style={{ color: 'var(--purple-light)', fontWeight: 700, fontSize: '0.8rem', marginBottom: '6px' }}>SINOPSE</p>
            <p style={{ fontSize: '0.88rem', color: '#ccc', lineHeight: 1.6 }}>{filme.sinopse}</p>
          </div>
        )}

        {confirmando ? (
          <div style={{ background: '#1a1a0a', border: '1px solid #7a4500', borderRadius: 10, padding: '14px 16px', marginBottom: '20px' }}>
            <p style={{ color: '#ffcc80', fontWeight: 700, marginBottom: '10px' }}>⚠ Tem certeza que deseja recusar esta sugestão?</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn btn-delete" onClick={onRecusar}>Sim, recusar</button>
              <button className="btn btn-outline" onClick={() => setConfirmando(false)}>Cancelar</button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn btn-primary" onClick={onAprovar}>✓ Aprovar Filme</button>
            <button className="btn btn-delete" onClick={() => setConfirmando(true)}>✕ Recusar</button>
            <button className="btn btn-outline" onClick={onClose}>Fechar</button>
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Popup: detalhe de sugestão de EDIÇÃO (comparativo antes × depois) ── */
function PopupDetalheEdicao({ sugestao, onAprovar, onRecusar, onClose }) {
  const [confirmando, setConfirmando] = useState(false)

  // Resolve IDs de volta para nomes para exibição
  function resolveNomes(ids, lista, idKey) {
    if (!ids || !ids.length) return null
    return lista.filter(item => ids.includes(item[idKey])).map(item => item.nome).join(', ') || null
  }

  const campos = [
    { label: 'Título',        atual: sugestao.filmeAtual.titulo,         proposto: sugestao.titulo },
    { label: 'Ano',           atual: sugestao.filmeAtual.ano,            proposto: sugestao.ano },
    { label: 'Sinopse',       atual: sugestao.filmeAtual.sinopse,        proposto: sugestao.sinopse },
    { label: 'Classificação', atual: sugestao.filmeAtual.classificacao,  proposto: sugestao.classificacao },
    { label: 'Poster',        atual: sugestao.filmeAtual.poster,         proposto: sugestao.poster },
    { label: 'Trailer',       atual: sugestao.filmeAtual.trailer,        proposto: sugestao.trailer },
    { label: 'Duração',       atual: sugestao.filmeAtual.duracao,        proposto: sugestao.duracao },
    { label: 'Orçamento',     atual: sugestao.filmeAtual.orcamento,      proposto: sugestao.orcamento },
    { label: 'Estilo Visual', atual: sugestao.filmeAtual?.estilo_visual, proposto: sugestao.estilo_visual },
    {
      label: 'Categorias',
      atual: sugestao.filmeAtual?.categorias?.join(', '),
      proposto: resolveNomes(sugestao.ids_categorias, dadosAuxiliares.categorias, 'id_categoria'),
    },
    {
      label: 'Linguagens',
      atual: sugestao.filmeAtual?.linguagens?.join(', '),
      proposto: resolveNomes(sugestao.ids_linguagens, dadosAuxiliares.linguagens, 'id_linguagem'),
    },
    {
      label: 'Países',
      atual: sugestao.filmeAtual?.paises?.join(', '),
      proposto: resolveNomes(sugestao.ids_paises, dadosAuxiliares.paises, 'id_pais'),
    },
  ].filter(c => c.proposto != null && String(c.proposto) !== String(c.atual ?? ''))
  
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: '640px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '6px' }}>
          <img src={sugestao.filmeAtual?.poster} alt={sugestao.filmeAtual?.titulo}
            style={{ width: 48, height: 68, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }}
            onError={e => { e.target.src = 'https://via.placeholder.com/48x68/2a2a2a/666' }} />
          <div>
            <h2 className="modal-title" style={{ marginBottom: 2 }}>Sugestão de Edição</h2>
            <p style={{ color: '#aaa', fontSize: '0.85rem' }}>
              Sugerido por <strong style={{ color: '#fff' }}>{sugestao.nome_usuario}</strong> para{' '}
              <strong style={{ color: 'var(--purple-light)' }}>{sugestao.filmeAtual?.titulo}</strong>
            </p>
          </div>
        </div>
        {campos.length === 0 ? (
          <p style={{ color: '#888', margin: '20px 0' }}>Nenhuma alteração detectada nesta sugestão.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', margin: '20px 0' }}>
            {campos.map((c, i) => (
              <div key={i} style={{ background: '#252525', borderRadius: 10, padding: '12px 16px' }}>
                <p style={{ fontWeight: 800, color: 'var(--purple-light)', fontSize: '0.75rem', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {c.label}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <p style={{ fontSize: '0.7rem', color: '#666', marginBottom: '4px', fontWeight: 700 }}>ATUAL</p>
                    <p style={{ fontSize: '0.85rem', color: '#999', wordBreak: 'break-word', lineHeight: 1.5 }}>{c.atual || '—'}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.7rem', color: '#4caf50', marginBottom: '4px', fontWeight: 700 }}>PROPOSTO</p>
                    <p style={{ fontSize: '0.85rem', color: '#fff', wordBreak: 'break-word', lineHeight: 1.5 }}>{String(c.proposto)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {confirmando ? (
          <div style={{ background: '#1a1a0a', border: '1px solid #7a4500', borderRadius: 10, padding: '14px 16px', marginBottom: '16px' }}>
            <p style={{ color: '#ffcc80', fontWeight: 700, marginBottom: '10px' }}>⚠ Tem certeza que deseja recusar esta sugestão?</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn btn-delete" onClick={onRecusar}>Sim, recusar</button>
              <button className="btn btn-outline" onClick={() => setConfirmando(false)}>Cancelar</button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn btn-primary" onClick={onAprovar}>✓ Aceitar Alterações</button>
            <button className="btn btn-delete" onClick={() => setConfirmando(true)}>✕ Recusar</button>
            <button className="btn btn-outline" onClick={onClose}>Fechar</button>
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Card reutilizável ──────────────────────────────────────────────────── */
function SugestaoCard({ titulo, poster, meta, resumo, tipo, onVer, onAprovar, onRecusar }) {
  return (
    <article
      className="sugestao-card"
      style={{ cursor: 'pointer' }}
      onClick={onVer}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onVer()}
    >
      <img
        src={poster}
        alt={titulo}
        className="sugestao-poster"
        onError={e => { e.target.src = 'https://via.placeholder.com/72x100/2a2a2a/666' }}
      />
      <div className="sugestao-info">
        <h3 className="sugestao-film-title">{titulo}</h3>
        <p className="sugestao-meta">{meta}</p>
        {resumo && (
          <p className="sugestao-changes" style={{ marginTop: 4 }}>
            {resumo.substring(0, 120)}{resumo.length > 120 ? '...' : ''}
          </p>
        )}
        <span className={`sugestao-tipo-badge ${tipo === 'edicao' ? 'sugestao-tipo-edicao' : 'sugestao-tipo-adicao'}`}>
          {tipo === 'edicao' ? 'Edição' : 'Adição'}
        </span>
      </div>
      <div className="sugestao-actions" onClick={e => e.stopPropagation()}>
        <button className="btn-icon btn-icon-green" title="Ver detalhes" aria-label="Ver" onClick={onVer}>👁</button>
        <button className="btn-icon btn-icon-green" title="Aprovar" aria-label="Aprovar" onClick={onAprovar}>✓</button>
        <button className="btn-icon btn-icon-red" title="Recusar" aria-label="Recusar" onClick={onRecusar}>✕</button>
      </div>
    </article>
  )
}

/* ─── Página principal ───────────────────────────────────────────────────── */
export default function SugestoesPage() {
  const {
    getPendentes, aprovarFilme, deleteFilme,
    getSugestoes, aprovarSugestao, recusarSugestao,
    getFilmeDetalhes, dadosAuxiliares,
  } = useFilmes()

  const [search, setSearch] = useState('')
  const [loadingPage, setLoadingPage] = useState(true)
  const [error, setError] = useState(null)

  // Adições pendentes
  const [pendentes, setPendentes] = useState([])
  const [adicaoSelecionada, setAdicaoSelecionada] = useState(null)

  // Sugestões de edição
  const [edicoes, setEdicoes] = useState([])
  const [edicaoSelecionada, setEdicaoSelecionada] = useState(null)

  useEffect(() => {
    setLoadingPage(true)
    getPendentes()
      .then(setPendentes)
      .catch(err => setError(err.message))
      .finally(() => setLoadingPage(false))
  }, [])

  async function handleAprovarAdicao(id) {
    try {
      await aprovarFilme(id)
      setPendentes(prev => prev.filter(f => f.id !== id))
      setAdicaoSelecionada(null)
    } catch (err) {
      alert('Erro ao aprovar: ' + err.message)
    }
  }

  async function handleRecusarAdicao(id) {
    try {
      await deleteFilme(id)
      setPendentes(prev => prev.filter(f => f.id !== id))
      setAdicaoSelecionada(null)
    } catch (err) {
      alert('Erro ao recusar: ' + err.message)
    }
  }

  function handleAprovarEdicao(id) {
    setEdicoes(prev => prev.filter(e => e.id !== id))
    setEdicaoSelecionada(null)
  }

  function handleRecusarEdicao(id) {
    setEdicoes(prev => prev.filter(e => e.id !== id))
    setEdicaoSelecionada(null)
  }

  const s = search.toLowerCase().trim()

  const adicoesFiltradas = pendentes.filter(f =>
    !s || f.titulo.toLowerCase().includes(s)
  )

  const edicoesFiltradas = edicoes.filter(e =>
    !s || e.filmeAtual.titulo.toLowerCase().includes(s) || e.usuario.toLowerCase().includes(s)
  )

  function getCamposAlterados(sug) {
    const campos = []
    if (sug.titulo        && sug.titulo        !== sug.filmeAtual.titulo)                        campos.push('Título')
    if (sug.ano           && String(sug.ano)   !== String(sug.filmeAtual.ano))                   campos.push('Ano')
    if (sug.sinopse       && sug.sinopse       !== sug.filmeAtual.sinopse)                       campos.push('Sinopse')
    if (sug.classificacao && sug.classificacao !== sug.filmeAtual.classificacao)                 campos.push('Classificação')
    if (sug.trailer       && sug.trailer       !== sug.filmeAtual.trailer)                       campos.push('Trailer')
    if (sug.duracao       && sug.duracao       !== sug.filmeAtual.duracao)                       campos.push('Duração')
    if (sug.orcamento     && String(sug.orcamento) !== String(sug.filmeAtual.orcamento))         campos.push('Orçamento')
    if (sug.categorias    && sug.categorias.join(',') !== (sug.filmeAtual.categorias||[]).join(',')) campos.push('Categorias')
    if (sug.linguagens    && sug.linguagens.join(',') !== (sug.filmeAtual.linguagens||[]).join(',')) campos.push('Linguagens')
    if (sug.poster        && sug.poster        !== sug.filmeAtual.poster)                        campos.push('Poster')
    return campos.length ? campos.join(', ') : 'Nenhuma alteração'
  }

  if (loadingPage) return <div className="loading-state"><div className="spinner" /><p>Carregando sugestões...</p></div>
  if (error) return <div className="loading-state"><p style={{ color: '#f66' }}>Erro: {error}</p></div>

  return (
    <main className="sugestoes-page">
      <h1 className="sugestoes-title">Sugestões Filmes</h1>

      <div className="search-bar" style={{ marginBottom: '32px' }}>
        <span className="search-icon">🔍</span>
        <input
          type="search"
          placeholder="Está procurando um filme em específico?"
          value={search}
          onChange={e => setSearch(e.target.value)}
          aria-label="Buscar sugestões"
        />
      </div>

      {/* ── Seção: Adições Pendentes ── */}
      <section className="sugestoes-section" aria-labelledby="adicoes-title">
        <div className="sugestoes-section-header">
          <h2 id="adicoes-title" className="sugestoes-section-title">
            Adições Pendentes ({adicoesFiltradas.length})
          </h2>
        </div>
        <div className="sugestoes-list">
          {adicoesFiltradas.length === 0 ? (
            <p style={{ color: '#666', fontSize: '0.9rem' }}>Nenhuma adição pendente.</p>
          ) : (
            adicoesFiltradas.map(f => (
              <SugestaoCard
                key={f.id}
                titulo={f.titulo}
                poster={f.poster}
                meta={`Ano: ${f.ano || '—'} · Solicitação de adição`}
                resumo={f.sinopse}
                tipo="adicao"
                onVer={() => setAdicaoSelecionada(f)}
                onAprovar={() => handleAprovarAdicao(f.id)}
                onRecusar={() => {
                  if (confirm('Recusar e excluir esta sugestão?')) handleRecusarAdicao(f.id)
                }}
              />
            ))
          )}
        </div>
      </section>

      {/* ── Seção: Edições Sugeridas ── */}
      <section className="sugestoes-section" aria-labelledby="edicoes-title" style={{ marginTop: '40px' }}>
        <div className="sugestoes-section-header">
          <h2 id="edicoes-title" className="sugestoes-section-title">
            Edições Sugeridas ({edicoesFiltradas.length})
          </h2>
        </div>
        <div className="sugestoes-list">
          {edicoesFiltradas.length === 0 ? (
            <p style={{ color: '#666', fontSize: '0.9rem' }}>Nenhuma edição sugerida pendente.</p>
          ) : (
            edicoesFiltradas.map(e => (
              <SugestaoCard
                key={e.id}
                titulo={e.filmeAtual.titulo}
                poster={e.filmeAtual.poster}
                meta={`Sugerido por ${e.usuario} · Alterações: ${getCamposAlterados(e)}`}
                resumo={null}
                tipo="edicao"
                onVer={() => setEdicaoSelecionada(e)}
                onAprovar={() => handleAprovarEdicao(e.id)}
                onRecusar={() => {
                  if (confirm('Recusar esta sugestão de edição?')) handleRecusarEdicao(e.id)
                }}
              />
            ))
          )}
        </div>
      </section>

      {/* ── Popups ── */}
      {adicaoSelecionada && (
        <PopupDetalheAdicao
          filme={adicaoSelecionada}
          onAprovar={() => handleAprovarAdicao(adicaoSelecionada.id)}
          onRecusar={() => handleRecusarAdicao(adicaoSelecionada.id)}
          onClose={() => setAdicaoSelecionada(null)}
        />
      )}

      {edicaoSelecionada && (
        <PopupDetalheEdicao
          sugestao={edicaoSelecionada}
          onAprovar={() => handleAprovarEdicao(edicaoSelecionada.id)}
          onRecusar={() => handleRecusarEdicao(edicaoSelecionada.id)}
          onClose={() => setEdicaoSelecionada(null)}
        />
      )}
    </main>
  )
}
