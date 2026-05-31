import { useEffect, useState } from 'react'
import { favoritoService } from '../services/api'
import Navbar from '../components/shared/Navbar'
import Footer from '../components/shared/Footer'
import FilmCard from '../components/shared/FilmCard'
import Pagination from '../components/shared/Pagination'
import Toast from '../components/shared/Toast'
import './FavoritosPage.css'

const PER_PAGE = 10

export default function FavoritosPage() {
  const [favoritos, setFavoritos] = useState([])
  const [busca,     setBusca]     = useState('')
  const [pagina,    setPagina]    = useState(1)
  const [loading,   setLoading]   = useState(true)
  const [toast,     setToast]     = useState({ msg: '', type: 'success' })

  useEffect(() => {
    favoritoService.listar()
      .then(data => setFavoritos(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function handleRemover(id) {
    try {
      await favoritoService.remover(id)
      setFavoritos(prev => prev.filter(f => f.id_filme !== id))
      setToast({ msg: 'Removido dos favoritos', type: 'success' })
    } catch (e) {
      setToast({ msg: e.message, type: 'error' })
    }
  }

  const filtrados = favoritos.filter(f =>
    f.filme.titulo.toLowerCase().includes(busca.toLowerCase())
  )
  const totalPags = Math.ceil(filtrados.length / PER_PAGE) || 1
  const pagAtual  = filtrados.slice((pagina - 1) * PER_PAGE, pagina * PER_PAGE)

  return (
    <>
      <Navbar />
      <Toast message={toast.msg} type={toast.type} onClose={() => setToast({ msg: '' })} />

      <main className="container favoritos-page">
        <h1 className="section-title">Filmes Favoritos</h1>

        {/* Busca */}
        <div className="favoritos-search">
          <div className="input-field">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input type="search" placeholder="Está procurando um filme em específico?"
              value={busca} onChange={e => { setBusca(e.target.value); setPagina(1) }} />
          </div>
        </div>

        <p className="favoritos-count">{filtrados.length} filmes exibidos</p>

        {loading && <div className="spinner" />}

        {!loading && filtrados.length === 0 && (
          <p className="catalogo-vazio">
            {busca ? 'Nenhum favorito encontrado com esse título.' : 'Você ainda não tem filmes favoritos.'}
          </p>
        )}

        {!loading && pagAtual.length > 0 && (
          <div className="favoritos-grid">
            {pagAtual.map(fav => (
              <FilmCard
                key={fav.id_favorito}
                filme={fav.filme}
                favoritado={true}
                onToggleFav={handleRemover}
                showHeart={true}
              />
            ))}
          </div>
        )}

        <Pagination current={pagina} total={totalPags} onChange={setPagina} />
      </main>

      <Footer />
    </>
  )
}
