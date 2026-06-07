import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFilmes } from '../context/FilmesContext'
import FilmCard from '../components/FilmCard'
import '../styles/CatalogoPage.css'
import '../styles/Shared.css'

const GENEROS = ['Ação','Animação','Aventura','Comédia','Drama','Fantasia','Ficção Científica','Musical','Romance','Suspense','Terror']
const CLASSIFICACOES = ['Livre','+6','+10','+12','+14']
const TEMAS = [
  { emoji: '🦕', label: 'Dinossauros' },
  { emoji: '🚀', label: 'Espaço' },
  { emoji: '🦸', label: 'Super-Heróis' },
  { emoji: '🤖', label: 'Robôs' },
  { emoji: '🐾', label: 'Animais' },
  { emoji: '👸', label: 'Princesas' },
  { emoji: '✨', label: 'Magia' },
  { emoji: '🏴‍☠️', label: 'Piratas' },
  { emoji: '👨‍👩‍👧', label: 'Família' },
  { emoji: '🏎️', label: 'Carros' },
]
const ESTILOS = ['3D','Stop Motion','2D','Anime']
const PER_PAGE = 8

export default function CatalogoPage() {
  const { filmes, loading } = useFilmes()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [activeGeneros, setActiveGeneros] = useState([])
  const [activeClassifs, setActiveClassifs] = useState([])
  const [activeTemas, setActiveTemas] = useState([])
  const [activeEstilos, setActiveEstilos] = useState([])
  const [anoFiltro, setAnoFiltro] = useState('Todos')
  const [page, setPage] = useState(1)

  function toggleChip(arr, setArr, val) {
    setArr(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val])
    setPage(1)
  }

  function clearAll() {
    setActiveGeneros([]); setActiveClassifs([])
    setActiveTemas([]); setActiveEstilos([])
    setSearch(''); setAnoFiltro('Todos'); setPage(1)
  }

  const filtered = useMemo(() => {
    let list = filmes
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(f =>
        f.titulo?.toLowerCase().includes(q) ||
        (f.diretores || []).some(d => (typeof d === 'string' ? d : d.nome)?.toLowerCase().includes(q)) ||
        (f.elenco || []).some(a => (typeof a === 'string' ? a : a.nome)?.toLowerCase().includes(q))
      )
    }
    if (activeGeneros.length) {
      list = list.filter(f => (f.categorias || []).some(c => activeGeneros.includes(c)))
    }
    if (activeClassifs.length) {
      list = list.filter(f => activeClassifs.includes(f.classificacao))
    }
    if (activeEstilos.length) {
      list = list.filter(f => (f.estilo_visual || []).some(e => activeEstilos.includes(e)))
    }
    if (anoFiltro !== 'Todos') {
      const yr = Number(anoFiltro)
      list = list.filter(f => f.ano >= yr && f.ano < yr + 10)
    }
    return list
  }, [filmes, search, activeGeneros, activeClassifs, activeTemas, activeEstilos, anoFiltro])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const pageFilmes = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const anos = ['Todos', '2020', '2010', '2000', '1990']

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner" />
        <span>Carregando catálogo...</span>
      </div>
    )
  }

  return (
    <div className="catalogo-layout">
      {/* SIDEBAR */}
      <aside className="catalogo-sidebar" aria-label="Filtros">
        <h2 className="catalogo-sidebar-title">Filtros</h2>

        <div>
          <p className="filter-group-title">Gênero</p>
          <div className="filter-chips">
            {GENEROS.map(g => (
              <button
                key={g}
                className={`chip filter-chip${activeGeneros.includes(g) ? ' active' : ''}`}
                onClick={() => toggleChip(activeGeneros, setActiveGeneros, g)}
              >
                {activeGeneros.includes(g) && <span className="chip-remove">✕</span>}
                {g}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="filter-group-title">Classificação Indicativa</p>
          <div className="filter-chips">
            {CLASSIFICACOES.map(c => (
              <button
                key={c}
                className={`chip filter-chip${activeClassifs.includes(c) ? ' active' : ''}`}
                onClick={() => toggleChip(activeClassifs, setActiveClassifs, c)}
              >
                {activeClassifs.includes(c) && <span className="chip-remove">✕</span>}
                {c}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="filter-group-title">Tema do Filme</p>
          <div className="filter-chips">
            {TEMAS.map(t => (
              <button
                key={t.label}
                className={`chip filter-chip${activeTemas.includes(t.label) ? ' active' : ''}`}
                onClick={() => toggleChip(activeTemas, setActiveTemas, t.label)}
              >
                {activeTemas.includes(t.label) && <span className="chip-remove">✕</span>}
                {t.emoji} {t.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="filter-group-title">Estilo Visual</p>
          <div className="filter-chips">
            {ESTILOS.map(e => (
              <button
                key={e}
                className={`chip filter-chip${activeEstilos.includes(e) ? ' active' : ''}`}
                onClick={() => toggleChip(activeEstilos, setActiveEstilos, e)}
              >
                {activeEstilos.includes(e) && <span className="chip-remove">✕</span>}
                {e}
              </button>
            ))}
          </div>
        </div>

        <button className="btn-clear-filters" onClick={clearAll}>Limpar filtros</button>
      </aside>

      {/* MAIN */}
      <main>
        <h1 className="catalogo-title">Catálogo de Filmes</h1>

        <div className="search-bar" style={{ marginBottom: '20px' }}>
          <span className="search-icon">🔍</span>
          <input
            type="search"
            placeholder="Está procurando um filme, ator ou diretor em específico?"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            aria-label="Buscar filmes"
          />
        </div>

        <div className="catalogo-controls">
          <p className="catalogo-count">
            <strong>{filtered.length}</strong> filmes exibidos
          </p>
          <div className="year-filter">
            <label className="year-filter-label" htmlFor="year-select">Filtrar por Ano:</label>
            <select
              id="year-select"
              className="form-select year-select"
              value={anoFiltro}
              onChange={e => { setAnoFiltro(e.target.value); setPage(1) }}
            >
              {anos.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
        </div>

        {pageFilmes.length === 0 ? (
          <div className="catalogo-empty">
            <p className="catalogo-empty-icon">🎬</p>
            <p>Nenhum filme encontrado com os filtros aplicados.</p>
          </div>
        ) : (
          <div className="catalogo-grid">
            {pageFilmes.map(f => <FilmCard key={f.id} filme={f} />)}
          </div>
        )}

        {/* Paginação */}
        {totalPages > 1 && (
          <nav className="pagination" aria-label="Paginação">
            <button
              className="page-btn"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              aria-label="Página anterior"
            >
              ‹
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button
                key={n}
                className={`page-btn${page === n ? ' active' : ''}`}
                onClick={() => setPage(n)}
                aria-label={`Página ${n}`}
                aria-current={page === n ? 'page' : undefined}
              >
                {n}
              </button>
            ))}
            <button
              className="page-btn"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              aria-label="Próxima página"
            >
              ›
            </button>
          </nav>
        )}
      </main>
    </div>
  )
}
