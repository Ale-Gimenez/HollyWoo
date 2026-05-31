import { useEffect, useState } from 'react'
import { filmeService } from '../services/api'
import Navbar from '../components/shared/Navbar'
import Toast from '../components/shared/Toast'
import ModalSugestaoVer from '../components/filme/ModalSugestaoVer'
import './SugestoesPage.css'

export default function SugestoesPage() {
  const [pendentes, setPendentes] = useState([])
  const [busca,     setBusca]     = useState('')
  const [loading,   setLoading]   = useState(true)
  const [toast,     setToast]     = useState({ msg: '', type: 'success' })
  const [verFilme,  setVerFilme]  = useState(null)

  useEffect(() => {
    filmeService.pendentes()
      .then(setPendentes)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function handleAprovar(id) {
    try {
      await filmeService.aprovar(id)
      setPendentes(prev => prev.filter(f => f.id_filme !== id))
      setToast({ msg: 'Filme aprovado com sucesso!', type: 'success' })
      setVerFilme(null)
    } catch (e) {
      setToast({ msg: e.message, type: 'error' })
    }
  }

  async function handleRejeitar(id) {
    try {
      await filmeService.deletar(id)
      setPendentes(prev => prev.filter(f => f.id_filme !== id))
      setToast({ msg: 'Sugestão rejeitada.', type: 'success' })
      setVerFilme(null)
    } catch (e) {
      setToast({ msg: e.message, type: 'error' })
    }
  }

  const filtrados = pendentes.filter(f =>
    f.titulo.toLowerCase().includes(busca.toLowerCase())
  )

  return (
    <>
      <Navbar />
      <Toast message={toast.msg} type={toast.type} onClose={() => setToast({ msg: '' })} />

      <main className="container sugestoes-page">
        <h1 className="section-title">Sugestões Filmes</h1>

        <div className="sugestoes-search">
          <div className="input-field">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input type="search" placeholder="Está procurando um filme em específico?"
              value={busca} onChange={e => setBusca(e.target.value)} />
          </div>
        </div>

        {loading && <div className="spinner" />}

        {!loading && filtrados.length === 0 && (
          <p className="catalogo-vazio">Nenhuma sugestão pendente.</p>
        )}

        {!loading && filtrados.length > 0 && (
          <ul className="sugestoes-lista">
            {filtrados.map(f => (
              <li key={f.id_filme} className="sugestao-card">
                <div className="sugestao-card__left">
                  <div className="sugestao-card__avatar">
                    {f.poster
                      ? <img src={f.poster} alt={f.titulo} />
                      : <span>🎬</span>
                    }
                  </div>
                  <div>
                    <strong>{f.titulo}</strong>
                    <p className="sugestao-card__sub">
                      {f.ano} · {f.categorias?.map(c => c.nome).join(', ') || '—'}
                    </p>
                  </div>
                </div>
                <div className="sugestao-card__actions">
                  <button className="btn btn--success btn--sm btn--icon"
                    onClick={() => setVerFilme(f)} aria-label="Ver sugestão">👁</button>
                  <button className="btn btn--danger  btn--sm btn--icon"
                    onClick={() => handleRejeitar(f.id_filme)} aria-label="Rejeitar">✕</button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {pendentes.length > 0 && (
          <button className="btn btn--danger sugestoes-limpar"
            onClick={() => {
              pendentes.forEach(f => filmeService.deletar(f.id_filme).catch(() => {}))
              setPendentes([])
              setToast({ msg: 'Todas as sugestões foram removidas', type: 'success' })
            }}>
            🗑 Limpar Sugestões
          </button>
        )}
      </main>

      {verFilme && (
        <ModalSugestaoVer
          filme={verFilme}
          onClose={() => setVerFilme(null)}
          onAprovar={() => handleAprovar(verFilme.id_filme)}
          onRejeitar={() => handleRejeitar(verFilme.id_filme)}
        />
      )}

      <footer className="home-footer-simple">
        <p>Copyright {new Date().getFullYear()} — Todos os direitos reservados</p>
      </footer>
    </>
  )
}
import './HomePages.css'
