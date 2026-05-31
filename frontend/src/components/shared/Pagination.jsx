export default function Pagination({ current, total, onChange }) {
  if (total <= 1) return null
  const pages = Array.from({ length: total }, (_, i) => i + 1)
  return (
    <nav className="pagination" aria-label="Paginação">
      <button className="pagination__btn pagination__btn--arrow"
        onClick={() => onChange(Math.max(1, current - 1))}
        disabled={current === 1} aria-label="Página anterior">‹</button>
      {pages.map(p => (
        <button key={p}
          className={`pagination__btn${p === current ? ' pagination__btn--active' : ''}`}
          onClick={() => onChange(p)} aria-label={`Página ${p}`} aria-current={p === current}>{p}</button>
      ))}
      <button className="pagination__btn pagination__btn--arrow"
        onClick={() => onChange(Math.min(total, current + 1))}
        disabled={current === total} aria-label="Próxima página">›</button>
    </nav>
  )
}
