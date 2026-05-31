import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { filmeService, homeService } from '../services/api'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/shared/Navbar'
import Footer from '../components/shared/Footer'
import FilmCard from '../components/shared/FilmCard'
import './HomePages.css'

export default function HomeUsrPage() {
  const { user } = useAuth()
  const navigate  = useNavigate()
  const [filmes, setFilmes] = useState([])

  useEffect(() => {
    filmeService.listar({ limit: 6 }).then(setFilmes).catch(() => {})
  }, [])

  return (
    <>
      <Navbar />
      <main>
        {/* Hero da home logada */}
        <section className="home-hero home-hero--usr">
          <div className="container home-hero__content">
            <div className="home-hero__text">
              <h1>Seja Bem-Vindo, {user?.nome}! 👋</h1>
              <p className="home-hero__sub">Explore o catálogo e favorite seus filmes preferidos.</p>
              <div className="home-hero__actions">
                <button className="btn btn--primary" onClick={() => navigate('/catalogo')}>📋 Catálogo</button>
                <button className="btn btn--ghost"   onClick={() => navigate('/favoritos')}>♥ Favoritos</button>
              </div>
            </div>
          </div>
        </section>

        {/* Últimos filmes */}
        <section className="container home-section">
          <h2 className="section-title">Filmes em Destaque</h2>
          <div className="home-grid">
            {filmes.map(f => (
              <FilmCard key={f.id_filme} filme={f} showHeart={false} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
