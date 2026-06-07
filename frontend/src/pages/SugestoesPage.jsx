import { useState, useEffect } from 'react'
import { useFilmes } from '../context/FilmesContext'
import '../styles/Pages.css'
import '../styles/Shared.css'

export default function SugestoesPage() {
  const { getPendentes, aprovarFilme, deleteFilme } = useFilmes()
  const [search, setSearch] = useState('')
  const [pendentes, setPendentes] = useState([])
  const [loadingPage, setLoadingPage] = useState(true)
  const [error, setError] = useState(null)

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
    } catch (err) {
      alert('Erro ao aprovar: ' + err.message)
    }
  }

  async function handleRecusar(id) {
    if (!confirm('Tem certeza que deseja recusar e excluir esta sugestão?')) return
    try {
      await deleteFilme(id)
      setPendentes(prev => prev.filter(f => f.id !== id))
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
              <article key={f.id} className="sugestao-card">
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
                <div className="sugestao-actions">
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
                    onClick={() => handleRecusar(f.id)}
                  >✕</button>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  )
}
