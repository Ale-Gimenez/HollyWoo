import { useEffect, useState } from 'react'
import { filmeService, dadosService } from '../../services/api'
import FilmeForm from './FilmeForm'
import './FilmeForm.css'

export default function ModalEditarFilme({ filme, onClose, onSaved }) {
  const [dados,   setDados]   = useState(null)
  const [loading, setLoading] = useState(false)

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
      const updated = await filmeService.editar(filme.id_filme, body)
      onSaved(updated)
    } catch { /* erro tratado pelo pai */ }
    finally { setLoading(false) }
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Editar filme"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: '740px' }}>
        <button className="modal__close" onClick={onClose} aria-label="Fechar">✕</button>
        <h2 className="modal__title">Editar Filme: {filme.titulo}</h2>
        {dados
          ? <FilmeForm dados={dados} initialValues={filme} loading={loading}
              onSubmit={handleSubmit} onCancel={onClose} submitLabel="💾 Salvar Câmbios" />
          : <div className="spinner" />
        }
      </div>
    </div>
  )
}
