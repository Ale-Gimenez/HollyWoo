import { useCallback, useEffect, useState } from 'react'
import { filmeService, dadosService, favoritoService } from '../services/api'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/shared/Navbar'
import Footer from '../components/shared/Footer'
import FilmCard from '../components/shared/FilmCard'
import Pagination from '../components/shared/Pagination'
import Toast from '../components/shared/Toast'
import './CatalogoPage.css'

const LIMIT = 8
const CLASSIFICACOES = ['L','6','10','12','14','16','18']
const ESTILOS        = ['2D','3D','Stop Motion','Anime']

export default function CatalogoPage() {
  const { user } = useAuth()

  /* dados auxiliares */
  const [categorias,  setCategorias]  = useState([])
  const [sagas,       setSagas]       = useState([])

  /* filtros */
  const [busca,          setBusca]          = useState('')
  const [selCategorias,  setSelCategorias]  = useState([])
  const [selClassif,     setSelClassif]     = useState([])
  const [selEstilos,     setSelEstilos]     = useState([])
  const [filtroAno,      setFiltroAno]      = useState('')

  /* filmes */
  const [filmes,     setFilmes]     = useState([])
  const [total,      setTotal]      = useState(0)
  const [pagina,     setPagina]     = useState(1)
  const [loading,    setLoading]    = useState(false)
  const [erro,       setErro]       = useState('')

  /* favoritos */
  const [favSet, setFavSet] = useState(new Set())

  /* toast */
  const [toast, setToast] = useState({ msg: '', type: 'success' })

  /* carrega aux */
  useEffect(() => {
    dadosService.categorias().then(setCategorias).catch(() => {})
    dadosService.sagas().then(setSagas).catch(() => {})
    if (user) {
      favoritoService.listar().then(favs => setFavSet(new Set(favs.map(f => f.id_filme)))).catch(() => {})
    }
  }, [user])

  /* carrega filmes */
  const buscarFilmes = useCallback(() => {
    setLoading(true)
    setErro('')
    const params = {
      limit: LIMIT,
      skip: (pagina - 1) * LIMIT,
      ...(busca         && { titulo: busca }),
      ...(filtroAno     && { ano: filtroAno }),
      ...(selCategorias.length === 1 && { categoria: selCategorias[0] }),
      ...(selClassif.length   === 1 && { classificacao: selClassif[0] }),
      ...(selEstilos.length   === 1 && { estilo_visual: selEstilos[0] }),
    }
    filmeService.listar(params)
      .then(data => {
        setFilmes(data)
        setTotal(Math.ceil(data.length / LIMIT) || 1)   // quando tiver paginação real no backend, usar o total
      })
      .catch(e => setErro(e.message))
      .finally(() => setLoading(false))
  }, [pagina, busca, filtroAno, selCategorias, selClassif, selEstilos])

  useEffect(() => { buscarFilmes() }, [buscarFilmes])

  /* toggle seleção de filtro multi */
  function toggleMulti(setter, val) {
    setter(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val])
    setPagina(1)
  }

  /* favoritar/desfavoritar */
  async function handleToggleFav(id) {
    if (!user) return
    try {
      if (favSet.has(id)) {
        await favoritoService.remover(id)
        setFavSet(s => { const n = new Set(s); n.delete(id); return n })
        setToast({ msg: 'Removido dos favoritos', type: 'success' })
      } else {
        await favoritoService.adicionar(id)
        setFavSet(s => new Set(s).add(id))
        setToast({ msg: 'Adicionado aos favoritos!', type: 'success' })
      }
    } catch (e) {
      setToast({ msg: e.message, type: 'error' })
    }
  }

  return (
    <>
      <Navbar />
      <Toast message={toast.msg} type={toast.type} onClose={() => setToast({ msg: '' })} />

      <div className="catalogo-layout">
        {/* ── Sidebar de filtros ── */}
        <aside className="catalogo-sidebar" aria-label="Filtros">
          <div className="catalogo-sidebar__inner">
            <h2 className="catalogo-sidebar__title">Filtros</h2>

            {/* Gênero */}
            <div className="filter-group">
              <h3>Gênero</h3>
              <div className="filter-tags">
                {categorias.map(c => (
                  <button key={c.id_categoria}
                    className={`filter-tag${selCategorias.includes(c.id_categoria) ? ' filter-tag--active' : ''}`}
                    onClick={() => toggleMulti(setSelCategorias, c.id_categoria)}>
                    {selCategorias.includes(c.id_categoria) ? '✕ ' : ''}{c.nome}
                  </button>
                ))}
              </div>
            </div>

            {/* Classificação */}
            <div className="filter-group">
              <h3>Classificação Indicativa</h3>
              <div className="filter-tags">
                {CLASSIFICACOES.map(cl => (
                  <button key={cl}
                    className={`filter-tag${selClassif.includes(cl) ? ' filter-tag--active' : ''}`}
                    onClick={() => toggleMulti(setSelClassif, cl)}>
                    {selClassif.includes(cl) ? '✕ ' : ''}{cl === 'L' ? 'Livre' : `+${cl}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Estilo Visual */}
            <div className="filter-group">
              <h3>Estilo Visual</h3>
              <div className="filter-tags">
                {ESTILOS.map(es => (
                  <button key={es}
                    className={`filter-tag${selEstilos.includes(es) ? ' filter-tag--active' : ''}`}
                    onClick={() => toggleMulti(setSelEstilos, es)}>
                    {selEstilos.includes(es) ? '✕ ' : ''}{es}
                  </button>
                ))}
              </div>
            </div>

            <button className="btn btn--ghost btn--sm" style={{ marginTop: '8px' }}
              onClick={() => { setSelCategorias([]); setSelClassif([]); setSelEstilos([]); setFiltroAno(''); setBusca('') }}>
              Limpar filtros
            </button>
          </div>
        </aside>

        {/* ── Conteúdo ── */}
        <main className="catalogo-main">
          <h1 className="section-title">Catálogo de Filmes</h1>

          {/* Search bar */}
          <div className="catalogo-search">
            <div className="input-field">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input type="search" placeholder="Está procurando um filme, ator ou diretor em específico?"
                value={busca} onChange={e => { setBusca(e.target.value); setPagina(1) }} />
            </div>
          </div>

          {/* Barra de info */}
          <div className="catalogo-info">
            <span>{loading ? 'Carregando...' : `${filmes.length} filmes exibidos`}</span>
            <label className="catalogo-ano">
              Filtrar por Ano:
              <select value={filtroAno} onChange={e => { setFiltroAno(e.target.value); setPagina(1) }}>
                <option value="">Todos</option>
                {Array.from({ length: 30 }, (_, i) => 2025 - i).map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </label>
          </div>

          {/* Estado de carregamento */}
          {loading && (
            <div>
              <div className="spinner" />
              <p className="loading-text">Carregando catálogo...</p>
            </div>
          )}

          {/* Erro */}
          {!loading && erro && (
            <div className="catalogo-erro">
              <span>⚠️</span>
              <div>
                <strong>Erro: {erro}</strong>
                <p>Catálogo de Filmes não encontrado</p>
              </div>
            </div>
          )}

          {/* Grid */}
          {!loading && !erro && (
            <>
              <div className="catalogo-grid">
                {filmes.map(f => (
                  <FilmCard key={f.id_filme} filme={f}
                    favoritado={favSet.has(f.id_filme)}
                    onToggleFav={handleToggleFav}
                    showHeart={!!user} />
                ))}
              </div>
              {filmes.length === 0 && (
                <p className="catalogo-vazio">Nenhum filme encontrado com esses filtros.</p>
              )}
              <Pagination current={pagina} total={total} onChange={setPagina} />
            </>
          )}
        </main>
      </div>

      <Footer />
    </>
  )
}
