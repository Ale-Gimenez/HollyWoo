import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { filmeService, dadosService } from '../services/api'
import Navbar from '../components/shared/Navbar'
import Toast from '../components/shared/Toast'
import FilmeForm from '../components/filme/FilmeForm'
import './AdicionarPage.css'

export default function AdicionarPage() {
  const navigate = useNavigate()
  const [dados,   setDados]   = useState(null)
  const [loading, setLoading] = useState(false)
  const [toast,   setToast]   = useState({ msg: '', type: 'error' })

  useEffect(() => {
    Promise.all([
      dadosService.categorias(),
      dadosService.linguagens(),
      dadosService.produtoras(),
      dadosService.atores(),
      dadosService.diretores(),
      dadosService.paises(),
      dadosService.sagas(),
    ]).then(([categorias, linguagens, produtoras, atores, diretores, paises, sagas]) => {
      setDados({ categorias, linguagens, produtoras, atores, diretores, paises, sagas })
    }).catch(() => {})
  }, [])

  async function handleSubmit(body) {
    setLoading(true)
    try {
      const f = await filmeService.criar(body)
      navigate(`/filmes/${f.id_filme}`)
    } catch (e) {
      setToast({ msg: e.message, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <Toast message={toast.msg} type={toast.type} onClose={() => setToast({ msg: '' })} />

      <main className="container adicionar-page">
        <section className="form-card" aria-label="Adicionar filme">
          <h1 className="form-card__title">Adicionar Filmes</h1>
          {dados
            ? <FilmeForm dados={dados} loading={loading} onSubmit={handleSubmit} onCancel={() => navigate(-1)} submitLabel="✔ Adicionar" />
            : <div className="spinner" />
          }
        </section>
      </main>

      <footer className="home-footer-simple">
        <p>Copyright {new Date().getFullYear()} — Todos os direitos reservados</p>
      </footer>
    </>
  )
}
import './HomePages.css'
