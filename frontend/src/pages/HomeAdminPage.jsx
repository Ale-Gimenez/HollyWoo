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
        {/* Banner */}
        <section className="home-admin-banner">
          <div className="home-admin-welcome">
            <h1>Seja Bem-Vindo<br />Administrador :)</h1>
            <div className="home-admin-welcome-btns">
              <button className="btn btn-primary" onClick={() => navigate('/adicionar')}>
                + Adicionar Filme
              </button>
              <button className="btn btn-suggest" onClick={() => navigate('/sugestoes')}>
                <i className="fi fi-sr-bell" style={{marginRight:6,verticalAlign:'middle'}}></i> Sugestões
              </button>
            </div>
          </div>

          <div className="home-admin-mascot">
            <div className="home-admin-bubble">
              <p className="home-admin-bubble-emoji">😊</p>
              <p>"Sem você nada disto seria possível, agradecemos todo o tempo dedicado a oferecer entretenimento às crianças por meio da inserção de filmes."</p>
              <p className="home-admin-bubble-att">Att. HollyWoozinho</p>
            </div>
            <img src="/logoprin.png" alt="HollyWoo" style={{ width: 120, height: 130, objectFit: 'contain' }} />
          </div>
        </section>

        {/* Recent films */}
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
