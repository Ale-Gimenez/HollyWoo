import { useNavigate } from 'react-router-dom'
import { useFilmes } from '../context/FilmesContext'
import FilmCard from '../components/FilmCard'
import '../styles/Pages.css'
import '../styles/Shared.css'

export default function HomeAdminPage() {
  const { filmes } = useFilmes()
  const navigate = useNavigate()
  const recentes = filmes.slice(0, 6)

  return (
    <main className="home-admin">
      <div className="home-admin-inner">
        
        <section className="home-admin-banner">
          <div className="home-admin-welcome">
            <h1>Seja Bem-Vindo<br />Administrador :)</h1>
            <div className="home-admin-welcome-btns">
              <button className="btn btn-primary" onClick={() => navigate('/adicionar')}>
                + Adicionar Filme
              </button>
              <button className="btn btn-suggest" onClick={() => navigate('/sugestoes')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="svg-inline"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>
                 Sugestões
              </button>
            </div>
          </div>

          <div className="home-admin-mascot">
            <div className="home-admin-bubble">
              <p className="home-admin-bubble-emoji">😊</p>
              <p>"Sem você nada disto seria possível, agradecemos todo o tempo dedicado a oferecer entretenimento às crianças por meio da inserção de filmes."</p>
              <p className="home-admin-bubble-att">Att. HollyWoozinho</p>
            </div>
            <img src="/logoprin.png" alt="HollyWoo" className="home-admin-mascot-img" />
          </div>
        </section>

        
        <section aria-labelledby="ultimos-title">
          <h2 id="ultimos-title" className="section-title">Últimos Filmes Adicionados</h2>
          <div className="home-admin-films-grid">
            {recentes.map(f => <FilmCard key={f.id} filme={f} showInfo={false} />)}
          </div>
        </section>
      </div>
    </main>
  )
}
