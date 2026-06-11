import { useState, useEffect } from 'react'
import { useFilmes } from '../context/FilmesContext'
import '../styles/Pages.css'
import '../styles/Shared.css'

function PopupDetalheAdicao({ filme, onAprovar, onRecusar, onClose }) {
  const [confirmando, setConfirmando] = useState(false)

  function listNomes(arr) {
    if (!arr || arr.length === 0) return null
    return arr.map(x => typeof x === 'string' ? x : x.nome).join(', ')
  }

  const infoRows = [
    { label: 'Título',        valor: filme.titulo },
    { label: 'Ano',           valor: filme.ano },
    { label: 'Classificação', valor: filme.classificacao },
    { label: 'Duração',       valor: filme.duracao },
    { label: 'Orçamento',     valor: filme.orcamento ? `$ ${Number(filme.orcamento).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : null },
    { label: 'Categorias',    valor: listNomes(filme.categorias) },
    { label: 'Linguagens',    valor: listNomes(filme.linguagens) },
    { label: 'Países',        valor: listNomes(filme.paises) },
    { label: 'Diretores',     valor: listNomes(filme.diretores) },
    { label: 'Elenco',        valor: listNomes(filme.elenco) },
    { label: 'Saga',          valor: listNomes(filme.sagas) },
    { label: 'Trailer',       valor: filme.trailer },
  ].filter(r => r.valor)

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box modal-sm-plus">
        <h2 className="modal-title"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="svg-inline"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg> Sugestão de Adição</h2>
        <div className="popup-adic-body">
          <img src={filme.poster} alt={filme.titulo}
            className="popup-adic-poster" onError={e => { e.target.src = 'https://via.placeholder.com/100x140/2a2a2a/666' }} />
          <div className="popup-adic-info">
            {infoRows.map((r, i) => (
              <div key={i} className="popup-adic-row">
                <span className="popup-adic-label">{r.label}:</span>
                <span className="popup-adic-value">{r.valor}</span>
              </div>
            ))}
          </div>
        </div>
        {filme.sinopse && (
          <div className="popup-adic-sinopse">
            <p className="popup-adic-sinopse-label">SINOPSE</p>
            <p className="popup-adic-sinopse-text">{filme.sinopse}</p>
          </div>
        )}
        {confirmando ? (
          <div className="confirm-recusa-box">
            <p className="confirm-recusa-text">⚠ Tem certeza que deseja recusar esta sugestão?</p>
            <div className="confirm-recusa-actions">
              <button className="btn btn-delete" onClick={onRecusar}>Sim, recusar</button>
              <button className="btn btn-outline" onClick={() => setConfirmando(false)}>Cancelar</button>
            </div>
          </div>
        ) : (
          <div className="modal-actions">
            <button className="btn btn-primary" onClick={onAprovar}>✓ Aprovar Filme</button>
            <button className="btn btn-delete" onClick={() => setConfirmando(true)}>✕ Recusar</button>
            <button className="btn btn-outline" onClick={onClose}>Fechar</button>
          </div>
        )}
      </div>
    </div>
  )
}

function PopupDetalheEdicao({ sugestao, dadosAuxiliares, onAprovar, onRecusar, onClose }) {
  const [confirmando, setConfirmando] = useState(false)

  function resolveNomes(ids, lista, idKey) {
    if (!ids || !ids.length) return null
    return lista.filter(item => ids.includes(item[idKey])).map(item => item.nome).join(', ') || null
  }

  function listNomes(arr) {
    if (!arr || arr.length === 0) return '—'
    return arr.map(x => typeof x === 'string' ? x : x.nome).join(', ')
  }

  const campos = [
    { label: 'Título',        atual: sugestao.filmeAtual?.titulo,        proposto: sugestao.titulo },
    { label: 'Ano',           atual: sugestao.filmeAtual?.ano,           proposto: sugestao.ano },
    { label: 'Sinopse',       atual: sugestao.filmeAtual?.sinopse,       proposto: sugestao.sinopse },
    { label: 'Classificação', atual: sugestao.filmeAtual?.classificacao, proposto: sugestao.classificacao },
    { label: 'Poster',        atual: sugestao.filmeAtual?.poster,        proposto: sugestao.poster },
    { label: 'Trailer',       atual: sugestao.filmeAtual?.trailer,       proposto: sugestao.trailer },
    { label: 'Duração',       atual: sugestao.filmeAtual?.duracao,       proposto: sugestao.duracao },
    { label: 'Orçamento',     atual: sugestao.filmeAtual?.orcamento,     proposto: sugestao.orcamento },
    { label: 'Estilo Visual', atual: sugestao.filmeAtual?.estilo_visual, proposto: sugestao.estilo_visual },
    {
      label: 'Categorias',
      atual: sugestao.filmeAtual?.categorias?.join(', ') || '—',
      proposto: resolveNomes(sugestao.ids_categorias, dadosAuxiliares.categorias, 'id_categoria'),
    },
    {
      label: 'Linguagens',
      atual: listNomes(sugestao.filmeAtual?.linguagens),
      proposto: resolveNomes(sugestao.ids_linguagens, dadosAuxiliares.linguagens, 'id_linguagem'),
    },
    {
      label: 'Países',
      atual: listNomes(sugestao.filmeAtual?.paises),
      proposto: resolveNomes(sugestao.ids_paises, dadosAuxiliares.paises, 'id_pais'),
    },
    {
      label: 'Sagas',
      atual: sugestao.filmeAtual?.sagas?.map(s => s.nome).join(', ') || '—',
      proposto: resolveNomes(sugestao.ids_sagas, dadosAuxiliares.sagas, 'id_saga'),
    },
  ].filter(c => c.proposto != null && String(c.proposto) !== String(c.atual ?? ''))

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box modal-md">
        <div className="popup-sug-header">
          <img src={sugestao.filmeAtual?.poster} alt={sugestao.filmeAtual?.titulo}
            className="popup-sug-poster" onError={e => { e.target.src = 'https://via.placeholder.com/48x68/2a2a2a/666' }} />
          <div>
            <h2 className="modal-title modal-title-sm"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="svg-inline"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg> Sugestão de Edição</h2>
            <p className="popup-sug-subtitle">
              Sugerido por <strong className="text-white">{sugestao.nome_usuario}</strong> para{' '}
              <strong className="text-purple">{sugestao.filmeAtual?.titulo || `Filme #${sugestao.id_filme}`}</strong>
            </p>
          </div>
        </div>
        {campos.length === 0 ? (
          <p className="no-changes-text">Nenhuma alteração detectada nesta sugestão.</p>
        ) : (
          <div className="campos-diff-list">
            {campos.map((c, i) => (
              <div key={i} className="campo-diff-item">
                <p className="campo-diff-label">
                  {c.label}
                </p>
                <div className="campo-diff-grid">
                  <div>
                    <p className="campo-diff-heading campo-diff-heading-atual">ATUAL</p>
                    <p className="campo-diff-value campo-diff-value-atual">{c.atual || '—'}</p>
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
        {confirmando ? (
          <div className="confirm-recusa-box">
            <p className="confirm-recusa-text">⚠ Tem certeza que deseja recusar esta sugestão?</p>
            <div className="confirm-recusa-actions">
              <button className="btn btn-delete" onClick={onRecusar}>Sim, recusar</button>
              <button className="btn btn-outline" onClick={() => setConfirmando(false)}>Cancelar</button>
            </div>
          </div>
        ) : (
          <div className="modal-actions">
            <button className="btn btn-primary" onClick={onAprovar}>✓ Aceitar Alterações</button>
            <button className="btn btn-delete" onClick={() => setConfirmando(true)}>✕ Recusar</button>
            <button className="btn btn-outline" onClick={onClose}>Fechar</button>
          </div>
        )}
      </div>
    </div>
  )
}

function SugestaoCard({ titulo, poster, meta, resumo, tipo, onVer, onAprovar, onRecusar }) {
  return (
    <article className="sugestao-card" onClick={onVer} role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && onVer()}>
      <img src={poster} alt={titulo} className="sugestao-poster"
        onError={e => { e.target.src = 'https://via.placeholder.com/72x100/2a2a2a/666' }} />
      <div className="sugestao-info">
        <h3 className="sugestao-film-title">{titulo}</h3>
        <p className="sugestao-meta">{meta}</p>
        {resumo && <p className="sugestao-changes">{resumo.substring(0, 120)}{resumo.length > 120 ? '...' : ''}</p>}
        <span className={`sugestao-tipo-badge ${tipo === 'edicao' ? 'sugestao-tipo-edicao' : 'sugestao-tipo-adicao'}`}>
          {tipo === 'edicao' ? 'Edição' : 'Adição'}
        </span>
      </div>
      <div className="sugestao-actions" onClick={e => e.stopPropagation()}>
        <button className="btn-icon btn-icon-green" title="Ver detalhes" onClick={onVer}>👁</button>
        <button className="btn-icon btn-icon-green" title="Aprovar" onClick={onAprovar}>✓</button>
        <button className="btn-icon btn-icon-red" title="Recusar" onClick={onRecusar}>✕</button>
      </div>
    </article>
  )
}

export default function SugestoesPage() {
  const {
    getPendentes, aprovarFilme, deleteFilme,
    getSugestoes, aprovarSugestao, recusarSugestao,
    getFilmeDetalhes, dadosAuxiliares,
  } = useFilmes()

  const [search, setSearch] = useState('')
  const [loadingPage, setLoadingPage] = useState(true)
  const [error, setError] = useState(null)

  const [pendentes, setPendentes] = useState([])
  const [adicaoSelecionada, setAdicaoSelecionada] = useState(null)

  const [edicoes, setEdicoes] = useState([])
  const [edicaoSelecionada, setEdicaoSelecionada] = useState(null)

  useEffect(() => {
    setLoadingPage(true)
    Promise.all([getPendentes(), getSugestoes()])
      .then(async ([pend, sugs]) => {
        setPendentes(pend)

        const sugsComFilme = await Promise.all(
          sugs.map(async s => {
            try {
              const filmeAtual = await getFilmeDetalhes(s.id_filme)
              return { ...s, filmeAtual }
            } catch {
              return { ...s, filmeAtual: null }
            }
          })
        )
        setEdicoes(sugsComFilme)
      })
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

  async function handleAprovarEdicao(sugId) {
    try {
      await aprovarSugestao(sugId)
      setEdicoes(prev => prev.filter(e => e.id !== sugId))
      setEdicaoSelecionada(null)
    } catch (err) {
      alert('Erro ao aprovar edição: ' + err.message)
    }
  }

  async function handleRecusarEdicao(sugId) {
    try {
      await recusarSugestao(sugId)
      setEdicoes(prev => prev.filter(e => e.id !== sugId))
      setEdicaoSelecionada(null)
    } catch (err) {
      alert('Erro ao recusar edição: ' + err.message)
    }
  }

  const s = search.toLowerCase().trim()
  const adicoesFiltradas = pendentes.filter(f => !s || f.titulo.toLowerCase().includes(s))
  const edicoesFiltradas = edicoes.filter(e =>
    !s || (e.filmeAtual?.titulo || '').toLowerCase().includes(s) || e.nome_usuario.toLowerCase().includes(s)
  )

  function getCamposAlterados(sug) {
    const campos = []
    if (sug.titulo)        campos.push('Título')
    if (sug.ano)           campos.push('Ano')
    if (sug.sinopse)       campos.push('Sinopse')
    if (sug.classificacao) campos.push('Classificação')
    if (sug.trailer)       campos.push('Trailer')
    if (sug.duracao)       campos.push('Duração')
    if (sug.orcamento)     campos.push('Orçamento')
    if (sug.estilo_visual) campos.push('Estilo Visual')
    if (sug.ids_categorias?.length) campos.push('Categorias')
    if (sug.ids_linguagens?.length) campos.push('Linguagens')
    if (sug.ids_paises?.length)     campos.push('Países')
    if (sug.ids_sagas?.length)      campos.push('Sagas')
    return campos.length ? campos.join(', ') : 'Nenhuma alteração'
  }

  if (loadingPage) return <div className="loading-state"><div className="spinner" /><p>Carregando sugestões...</p></div>
  if (error) return <div className="loading-state"><p className="error-text">Erro: {error}</p></div>

  return (
    <main className="sugestoes-page">
      <h1 className="sugestoes-title"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="svg-inline"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg> Sugestões Filmes</h1>

      <div className="search-bar search-bar-mb-lg">
        <span className="search-icon"><i className="fi fi-sr-search"></i></span>
        <input
          type="search"
          placeholder="Está procurando um filme em específico?"
          value={search}
          onChange={e => setSearch(e.target.value)}
          aria-label="Buscar sugestões"
        />
      </div>

      
      <section className="sugestoes-section" aria-labelledby="adicoes-title">
        <div className="sugestoes-section-header">
          <h2 id="adicoes-title" className="sugestoes-section-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="svg-inline"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg> Adições Pendentes ({adicoesFiltradas.length})
          </h2>
        </div>
        <div className="sugestoes-list">
          {adicoesFiltradas.length === 0 ? (
            <p className="empty-text">Nenhuma adição pendente.</p>
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
                onRecusar={() => { if (confirm('Recusar e excluir esta sugestão?')) handleRecusarAdicao(f.id) }}
              />
            ))
          )}
        </div>
      </section>

      
      <section className="sugestoes-section">
        <div className="sugestoes-section-header">
          <h2 id="edicoes-title" className="sugestoes-section-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="svg-inline"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg> Edições Sugeridas ({edicoesFiltradas.length})
          </h2>
        </div>
        <div className="sugestoes-list">
          {edicoesFiltradas.length === 0 ? (
            <p className="empty-text">Nenhuma edição sugerida pendente.</p>
          ) : (
            edicoesFiltradas.map(e => (
              <SugestaoCard
                key={e.id}
                titulo={e.filmeAtual?.titulo || `Filme #${e.id_filme}`}
                poster={e.filmeAtual?.poster || ''}
                meta={`Por ${e.nome_usuario} · Alterações: ${getCamposAlterados(e)}`}
                resumo={null}
                tipo="edicao"
                onVer={() => setEdicaoSelecionada(e)}
                onAprovar={() => handleAprovarEdicao(e.id)}
                onRecusar={() => { if (confirm('Recusar esta sugestão de edição?')) handleRecusarEdicao(e.id) }}
              />
            ))
          )}
        </div>
      </section>

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
          dadosAuxiliares={dadosAuxiliares}
          onAprovar={() => handleAprovarEdicao(edicaoSelecionada.id)}
          onRecusar={() => handleRecusarEdicao(edicaoSelecionada.id)}
          onClose={() => setEdicaoSelecionada(null)}
        />
      )}
    </main>
  )
}