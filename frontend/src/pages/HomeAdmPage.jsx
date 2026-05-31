import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { filmeService } from '../services/api'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/shared/Navbar'
import FilmCard from '../components/shared/FilmCard'
import './HomePages.css'

export default function HomeAdmPage() {
  const { user } = useAuth()
  const navigate  = useNavigate()
  const [filmes, setFilmes] = useState([])

  useEffect(() => {
    filmeService.listar({ limit: 6 }).then(setFilmes).catch(() => {})
  }, [])

  return (
    <>
      <Navbar />
      <main className="container">
        {/* Boas-vindas */}
        <section className="adm-hero">
          <div className="adm-hero__text">
            <h1>Seja Bem-Vindo<br />Administrador :)</h1>
            <div className="adm-hero__actions">
              <button className="btn btn--primary" onClick={() => navigate('/adicionar')}>+ Adicionar Filme</button>
              <button className="btn btn--ghost"   onClick={() => navigate('/sugestoes')}>🚀 Sugestões</button>
            </div>
          </div>

          {/* Mascote + speech bubble */}
          <div className="adm-hero__mascot-wrap">
            <div className="adm-hero__bubble">
              <span className="adm-hero__emoji">😊</span>
              <blockquote>
                "Sem você nada disto seria possível, agradecemos todo o tempo dedicado a oferecer
                entretenimento às crianças por meio da inserção de filmes."
                <footer>Att. HollyWoozinho</footer>
              </blockquote>
            </div>
            <div className="adm-hero__mascot" aria-hidden="true">🎬</div>
          </div>
        </section>

        {/* Últimos filmes */}
        <section className="home-section">
          <h2 className="section-title">Últimos Filmes Adicionados</h2>
          <div className="home-grid">
            {filmes.map(f => (
              <FilmCard key={f.id_filme} filme={f} showHeart={false} />
            ))}
          </div>
        </section>
      </main>

      <footer className="home-footer-simple">
        <p>Copyright {new Date().getFullYear()} — Todos os direitos reservados</p>
      </footer>
    </>
  )
}
