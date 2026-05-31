import { useEffect, useState } from 'react'
import { dadosService } from '../../services/api'
import FilmeForm from './FilmeForm'
import './FilmeForm.css'

export default function ModalSugerirEdicao({ filme, onClose, onSent }) {
  const [dados, setDados] = useState(null)

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

  /* Usuário não pode editar diretamente — cria um novo registro pendente */
  async function handleSubmit(body) {
    /* Na versão atual do backend, uma sugestão de edição é um novo filme pendente.
       Em versões futuras, pode virar um endpoint específico de sugestão. */
    onSent()
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Sugerir edição"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: '740px' }}>
        <button className="modal__close" onClick={onClose} aria-label="Fechar">✕</button>
        <h2 className="modal__title">Editar Filme: {filme.titulo}</h2>
        {dados
          ? <FilmeForm dados={dados} initialValues={filme} loading={false}
              onSubmit={handleSubmit} onCancel={onClose} submitLabel="📩 Solicitar Edição" />
          : <div className="spinner" />
        }
      </div>
    </div>
  )
}
