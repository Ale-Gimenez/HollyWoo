import { useState, useEffect } from 'react'
import { useFilmes } from '../context/FilmesContext'
import '../styles/Pages.css'
import '../styles/Shared.css'

function PopupDetalheSugestao({ filme, onAprovar, onRecusar, onClose }) {
  const [confirmando, setConfirmando] = useState(false)

  const infoRows = [
    { label: 'Título', valor: filme.titulo },
    { label: 'Ano', valor: filme.ano },
    { label: 'Classificação', valor: filme.classificacao },
    { label: 'Duração', valor: filme.duracao },
    { label: 'Orçamento', valor: filme.orcamento ? `$ ${Number(filme.orcamento).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : null },
    { label: 'Categorias', valor: filme.categorias?.length > 0 ? filme.categorias.join(', ') : null },
    { label: 'Linguagens', valor: filme.linguagens?.length > 0 ? filme.linguagens.join(', ') : null },
    { label: 'Países', valor: filme.paises?.length > 0 ? filme.paises.join(', ') : null },
    { label: 'Trailer', valor: filme.trailer },
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
            <p style={{ color: '#ffcc80', fontWeight: 700, marginBottom: '10px' }}>⚠ Tem certeza que deseja recusar e excluir esta sugestão?</p>
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

export default function SugestoesPage() {
  const { getPendentes, aprovarFilme, deleteFilme } = useFilmes()
  const [search, setSearch] = useState('')
  const [pendentes, setPendentes] = useState([])
  const [loadingPage, setLoadingPage] = useState(true)
  const [error, setError] = useState(null)
  const [filmeSelecionado, setFilmeSelecionado] = useState(null)

  useEffect(() => {
    setLoadingPage(true)
    getPendentes()
      .then(setPendentes)
      .catch(err => setError(err.message))
      .finally(() => setLoadingPage(false))
  }, [])

  async function handleAprovar(id) {
    try {
      await aprovarFilme(id)
      setPendentes(prev => prev.filter(f => f.id !== id))
      setFilmeSelecionado(null)
    } catch (err) {
      alert('Erro ao aprovar: ' + err.message)
    }
  }

  async function handleRecusar(id) {
    try {
      await deleteFilme(id)
      setPendentes(prev => prev.filter(f => f.id !== id))
      setFilmeSelecionado(null)
    } catch (err) {
      alert('Erro ao recusar: ' + err.message)
    }
  }

  const filtrados = pendentes.filter(f =>
    !search.trim() || f.titulo.toLowerCase().includes(search.toLowerCase())
  )

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

      <section className="sugestoes-section" aria-labelledby="adicoes-title">
        <div className="sugestoes-section-header">
          <h2 id="adicoes-title" className="sugestoes-section-title">
            Adições Pendentes ({filtrados.length})
          </h2>
        </div>

        <div className="sugestoes-list">
          {filtrados.length === 0 ? (
            <p style={{ color: '#666', fontSize: '0.9rem' }}>Nenhuma adição pendente.</p>
          ) : (
            filtrados.map(f => (
              <article
                key={f.id}
                className="sugestao-card"
                style={{ cursor: 'pointer' }}
                onClick={() => setFilmeSelecionado(f)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && setFilmeSelecionado(f)}
              >
                <img
                  src={f.poster}
                  alt={f.titulo}
                  className="sugestao-poster"
                  onError={e => { e.target.src = 'https://via.placeholder.com/72x100/2a2a2a/666' }}
                />
                <div className="sugestao-info">
                  <h3 className="sugestao-film-title">{f.titulo}</h3>
                  <p className="sugestao-meta">
                    Ano: {f.ano || '—'} · Solicitação de adição
                  </p>
                  {f.sinopse && (
                    <p className="sugestao-changes" style={{ marginTop: 4 }}>
                      {f.sinopse.substring(0, 120)}{f.sinopse.length > 120 ? '...' : ''}
                    </p>
                  )}
                  <span className="sugestao-tipo-badge sugestao-tipo-adicao">Adição</span>
                </div>
                <div className="sugestao-actions" onClick={e => e.stopPropagation()}>
                  <button
                    className="btn-icon btn-icon-green"
                    title="Ver detalhes"
                    aria-label="Ver"
                    onClick={() => setFilmeSelecionado(f)}
                  >👁</button>
                  <button
                    className="btn-icon btn-icon-green"
                    title="Aprovar"
                    aria-label="Aprovar"
                    onClick={() => handleAprovar(f.id)}
                  >✓</button>
                  <button
                    className="btn-icon btn-icon-red"
                    title="Recusar"
                    aria-label="Recusar"
                    onClick={() => {
                      if (confirm('Tem certeza que deseja recusar e excluir esta sugestão?')) {
                        handleRecusar(f.id)
                      }
                    }}
                  >✕</button>
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      {filmeSelecionado && (
        <PopupDetalheSugestao
          filme={filmeSelecionado}
          onAprovar={() => handleAprovar(filmeSelecionado.id)}
          onRecusar={() => handleRecusar(filmeSelecionado.id)}
          onClose={() => setFilmeSelecionado(null)}
        />
      )}
    </main>
  )
}
