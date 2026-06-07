import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useFilmes } from '../context/FilmesContext'
import FilmCard from '../components/FilmCard'
import '../styles/Pages.css'
import '../styles/Shared.css'

const PER_PAGE = 10

export default function FavoritosPage() {
  const { favoritos } = useAuth()
  const { filmes } = useFilmes()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const favFilmes = filmes.filter(f => favoritos.includes(f.id))
  const filtered = search.trim()
    ? favFilmes.filter(f => f.titulo?.toLowerCase().includes(search.toLowerCase()))
    : favFilmes

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const pageFilmes = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  return (
    <main className="favoritos-page">
      <h1 className="section-title favoritos-title">Filmes Favoritos</h1>

      <div className="search-bar" style={{ marginBottom: '20px' }}>
        <span className="search-icon">🔍</span>
        <input
          type="search"
          placeholder="Está procurando um filme em específico?"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
          aria-label="Buscar favoritos"
        />
      </div>

      <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '20px' }}>
        <strong>{filtered.length}</strong> filmes exibidos
      </p>

      {pageFilmes.length === 0 ? (
        <div className="favoritos-empty">
          <p className="favoritos-empty-icon">❤️</p>
          <p>Você ainda não tem filmes favoritos.</p>
          <button className="btn btn-primary" style={{ marginTop: '16px' }} onClick={() => navigate('/catalogo')}>
            Explorar Catálogo
          </button>
        </div>
      ) : (
        <div className="favoritos-grid">
          {pageFilmes.map(f => <FilmCard key={f.id} filme={f} />)}
        </div>
      )}

      {totalPages > 1 && (
        <nav className="pagination" aria-label="Paginação">
          <button className="page-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} aria-label="Anterior">‹</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
            <button key={n} className={`page-btn${page === n ? ' active' : ''}`} onClick={() => setPage(n)} aria-current={page === n ? 'page' : undefined}>{n}</button>
          ))}
          <button className="page-btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} aria-label="Próxima">›</button>
        </nav>
      )}
    </main>
  )
}
