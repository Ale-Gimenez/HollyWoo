import { useState } from 'react'
import { filmeService } from '../../services/api'

export default function ModalDeletarFilme({ filme, onClose, onDeleted }) {
  const [loading, setLoading] = useState(false)

  async function handleDeletar() {
    setLoading(true)
    try {
      await filmeService.deletar(filme.id_filme)
      onDeleted()
    } catch { /* silencia */ }
    finally { setLoading(false) }
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Deletar filme"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: '480px', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '12px' }} aria-hidden="true">🗑️</div>
        <h2 className="modal__title" style={{ textAlign: 'center' }}>Deletar Filme</h2>

        <p style={{ color: 'var(--color-text-muted)', marginBottom: '8px' }}>
          Você está prestes a deletar permanentemente:
        </p>
        <p style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '20px' }}>
          "{filme.titulo}"
        </p>

        <div style={{
          background: 'rgba(239,68,68,0.12)', border: '1px solid var(--color-danger)',
          borderRadius: 'var(--radius-md)', padding: '12px 16px', marginBottom: '24px',
          display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: '#fca5a5'
        }}>
          <span>⚠️</span>
          <span>Esta ação não pode ser desfeita. O filme será removido permanentemente do catálogo.</span>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button className="btn btn--danger" onClick={handleDeletar} disabled={loading}>
            🗑 {loading ? 'Deletando...' : 'Deletar'}
          </button>
          <button className="btn btn--ghost" onClick={onClose}>✕ Cancelar</button>
        </div>
      </div>
    </div>
  )
}
