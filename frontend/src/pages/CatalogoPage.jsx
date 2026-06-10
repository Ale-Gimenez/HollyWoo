import { useState, useMemo, useEffect, useRef } from 'react'
import { useFilmes } from '../context/FilmesContext'
import FilmCard from '../components/FilmCard'
import Toast from '../components/Toast'
import '../styles/CatalogoPage.css'
import '../styles/Shared.css'

// Categorias reais do banco (tabela `categoria`)
const GENEROS = [
  'Animação', 'Aventura', 'Comédia', 'Fantasia',
  'Musical', 'Família', 'Ficção Científica',
]

const CLASSIFICACOES = ['L', '+6', '+10', '+12', '+14', '+16', '+18']

// Temas reais do banco (tabela `tema`)
const TEMAS = [
  { emoji: '🦕', label: 'Dinossauros' },
  { emoji: '🚀', label: 'Espaço' },
  { emoji: '🦸', label: 'Super-Heróis' },
  { emoji: '🤖', label: 'Robôs' },
  { emoji: '🐾', label: 'Animais' },
  { emoji: '👸', label: 'Princesas' },
  { emoji: '✨', label: 'Magia' },
  { emoji: '☠️', label: 'Piratas' },
  { emoji: '👨‍👩‍👧', label: 'Família' },
  { emoji: '🚗', label: 'Carros' },
]

// Estilos reais do banco (coluna `estilo_visual`)
const ESTILOS = ['3D', '2D', 'Stop Motion', 'Anime']

const PER_PAGE = 8

export default function CatalogoPage() {
  const { filmes, loading } = useFilmes()
  const [search, setSearch]                 = useState('')
  const [activeGeneros, setActiveGeneros]   = useState([])
  const [activeClassifs, setActiveClassifs] = useState([])
  const [activeTemas, setActiveTemas]       = useState([])
  const [activeEstilos, setActiveEstilos]   = useState([])
  const [anoFiltro, setAnoFiltro]           = useState('Todos')
  const [activeEra, setActiveEra]           = useState('')
  const [page, setPage]                     = useState(1)
  const [toast, setToast]                   = useState(null)
  const prevFilteredCount = useRef(null)

  function toggleChip(arr, setArr, val) {
    setArr(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val])
    setPage(1)
  }

  function clearAll() {
    setActiveGeneros([]); setActiveClassifs([])
    setActiveTemas([]); setActiveEstilos([])
    setSearch(''); setAnoFiltro('Todos'); setActiveEra(''); setPage(1)
  }

  const filtered = useMemo(() => {
    let list = filmes

    // Busca por texto
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(f =>
        f.titulo?.toLowerCase().includes(q) ||
        (f.diretores || []).some(d => (typeof d === 'string' ? d : d.nome)?.toLowerCase().includes(q)) ||
        (f.elenco || []).some(a => (typeof a === 'string' ? a : a.nome)?.toLowerCase().includes(q))
      )
    }

    // Filtro por gênero/categoria (vem da tabela `categoria` via `filme_categoria`)
    if (activeGeneros.length) {
      list = list.filter(f =>
        (f.categorias || []).some(c => activeGeneros.includes(c))
      )
    }

    // Filtro por classificação indicativa
    if (activeClassifs.length) {
      list = list.filter(f => {
        const classif = f.classificacao || 'L'
        return activeClassifs.includes(classif)
      })
    }

    // Filtro por tema (vem da tabela `tema` via `filme_tema`)
    if (activeTemas.length) {
      list = list.filter(f =>
        (f.temas || []).some(t => activeTemas.includes(t))
      )
    }

    // Filtro por estilo visual (coluna `estilo_visual` no filme)
    if (activeEstilos.length) {
      list = list.filter(f => {
        const estilo = f.estilo_visual
        if (!estilo) return false
        const estilos = Array.isArray(estilo) ? estilo : [estilo]
        return estilos.some(e =>
          activeEstilos.some(a => e?.toLowerCase().trim() === a.toLowerCase().trim())
        )
      })
    }

    // Filtro por era (clássico / novo)
    if (activeEra) {
      list = list.filter(f => f.era === activeEra)
    }

    // Filtro por década
    if (anoFiltro !== 'Todos') {
      const yr = Number(anoFiltro)
      list = list.filter(f => f.ano != null && f.ano >= yr && f.ano < yr + 10)
    }

    return list
  }, [filmes, search, activeGeneros, activeClassifs, activeTemas, activeEstilos, anoFiltro, activeEra])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const pageFilmes = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  // Dispara toast de erro quando a busca textual não encontrar nada
  useEffect(() => {
    if (loading) return
    const buscando = search.trim().length > 0
    // prevFilteredCount.current === null significa primeira renderização — não disparar
    if (buscando && filtered.length === 0 && prevFilteredCount.current !== null && prevFilteredCount.current !== 0) {
      setToast({ message: `404 — Nenhum filme encontrado para "${search.trim()}"`, type: 'error' })
    }
    prevFilteredCount.current = filtered.length
  }, [filtered, search, loading])

  const anos = ['Todos', '2020', '2010', '2000', '1990', '1980']

  const hasFilters = activeGeneros.length || activeClassifs.length ||
    activeTemas.length || activeEstilos.length || anoFiltro !== 'Todos' || activeEra || search.trim()

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
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      {/* SIDEBAR */}
      <aside className="catalogo-sidebar" aria-label="Filtros">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 className="catalogo-sidebar-title">Filtros</h2>
          {hasFilters && (
            <button
              className="btn-clear-filters"
              onClick={clearAll}
              style={{ margin: 0, padding: '4px 10px', fontSize: '0.78rem' }}
            >
              Limpar
            </button>
          )}
        </div>

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

        <div>
          <p className="filter-group-title">Era do Filme</p>
          <div className="filter-chips">
            {[{ val: 'classico', label: '🎞 Clássico' }, { val: 'novo', label: '✨ Novo' }].map(e => (
              <button
                key={e.val}
                className={`chip filter-chip${activeEra === e.val ? ' active' : ''}`}
                onClick={() => { setActiveEra(prev => prev === e.val ? '' : e.val); setPage(1) }}
              >
                {activeEra === e.val && <span className="chip-remove">✕</span>}
                {e.label}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* MAIN */
      <main>
        <h1 className="catalogo-title">Catálogo de Filmes</h1>

        <div className="search-bar" style={{ marginBottom: '20px' }}>
          <span className="search-icon"><i className="fi fi-sr-search"></i></span>
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
              {anos.map(a => (
                <option key={a} value={a}>{a === 'Todos' ? 'Todos' : `${a}s`}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Chips ativos */}
        {hasFilters && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
            {activeGeneros.map(g => (
              <span key={g} className="chip filter-chip active" style={{ fontSize: '0.78rem', cursor: 'pointer' }}
                onClick={() => toggleChip(activeGeneros, setActiveGeneros, g)}>
                {g} <span className="chip-remove">✕</span>
              </span>
            ))}
            {activeClassifs.map(c => (
              <span key={c} className="chip filter-chip active" style={{ fontSize: '0.78rem', cursor: 'pointer' }}
                onClick={() => toggleChip(activeClassifs, setActiveClassifs, c)}>
                {c} <span className="chip-remove">✕</span>
              </span>
            ))}
            {activeTemas.map(t => (
              <span key={t} className="chip filter-chip active" style={{ fontSize: '0.78rem', cursor: 'pointer' }}
                onClick={() => toggleChip(activeTemas, setActiveTemas, t)}>
                {TEMAS.find(x => x.label === t)?.emoji} {t} <span className="chip-remove">✕</span>
              </span>
            ))}
            {activeEstilos.map(e => (
              <span key={e} className="chip filter-chip active" style={{ fontSize: '0.78rem', cursor: 'pointer' }}
                onClick={() => toggleChip(activeEstilos, setActiveEstilos, e)}>
                {e} <span className="chip-remove">✕</span>
              </span>
            ))}
            {activeEra && (
              <span className="chip filter-chip active" style={{ fontSize: '0.78rem', cursor: 'pointer' }}
                onClick={() => { setActiveEra(''); setPage(1) }}>
                {activeEra === 'classico' ? '🎞 Clássico' : '✨ Novo'} <span className="chip-remove">✕</span>
              </span>
            )}
            {anoFiltro !== 'Todos' && (
              <span className="chip filter-chip active" style={{ fontSize: '0.78rem', cursor: 'pointer' }}
                onClick={() => { setAnoFiltro('Todos'); setPage(1) }}>
                {anoFiltro}s <span className="chip-remove">✕</span>
              </span>
            )}
          </div>
        )}

        {pageFilmes.length === 0 ? (
          <div className="catalogo-empty">
            <p className="catalogo-empty-icon">🎬</p>
            <p>Nenhum filme encontrado com os filtros aplicados.</p>
            {hasFilters && (
              <button className="btn-clear-filters" onClick={clearAll} style={{ marginTop: '12px' }}>
                Limpar filtros
              </button>
            )}
          </div>
        ) : (
          <div className="catalogo-grid">
            {pageFilmes.map(f => <FilmCard key={f.id} filme={f} />)}
          </div>
        )}

        {totalPages > 1 && (
          <nav className="pagination" aria-label="Paginação">
            <button className="page-btn" onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1} aria-label="Página anterior">‹</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button key={n}
                className={`page-btn${page === n ? ' active' : ''}`}
                onClick={() => setPage(n)}
                aria-label={`Página ${n}`}
                aria-current={page === n ? 'page' : undefined}
              >{n}</button>
            ))}
            <button className="page-btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages} aria-label="Próxima página">›</button>
          </nav>
        )}
      </main>
    </div>
  )
}
