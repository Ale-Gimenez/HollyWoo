/**
 * components/shared/Toast.jsx
 * Exibe mensagem de sucesso ou erro no topo-direito.
 * Props: message, type ('success'|'error'), onClose
 */
export default function Toast({ message, type = 'error', onClose }) {
  if (!message) return null
  return (
    <div className={`toast toast--${type}`} role="alert" aria-live="assertive">
      <span>{type === 'error' ? '⚠️' : '✅'}</span>
      <span>{message}</span>
      <button className="toast__close" onClick={onClose} aria-label="Fechar">✕</button>
    </div>
  )
}
