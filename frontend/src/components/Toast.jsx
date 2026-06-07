import { useEffect } from 'react'
import '../styles/Shared.css'

export default function Toast({ message, type = 'info', onClose, duration = 3000 }) {
  useEffect(() => {
    const t = setTimeout(onClose, duration)
    return () => clearTimeout(t)
  }, [onClose, duration])

  return (
    <div className={`toast toast-${type}`} role="alert">
      <span>{type === 'success' ? '✓' : type === 'error' ? '⊙' : 'ℹ'}</span>
      <span>{message}</span>
      <button
        onClick={onClose}
        style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: '1rem' }}
        aria-label="Fechar"
      >
        ✕
      </button>
    </div>
  )
}
