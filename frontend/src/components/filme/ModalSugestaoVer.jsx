import './ModalSugestaoVer.css'
export default function ModalSugestaoVer({ filme, onClose, onAprovar, onRejeitar }) {
  const campos = [
    ['Título',      filme.titulo],
    ['Ano',         filme.ano],
    ['Classificação', filme.classificacao],
    ['Estilo Visual', filme.estilo_visual],
    ['Orçamento',   filme.orcamento ? `$ ${Number(filme.orcamento).toLocaleString('pt-BR')}` : '—'],
    ['Categorias',  filme.categorias?.map(c => c.nome).join(', ') || '—'],
    ['Linguagens',  filme.linguagens?.map(l => l.nome).join(', ') || '—'],
    ['Sagas',       filme.sagas?.map(s => s.nome).join(', ') || '—'],
  ]

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Ver sugestão"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: '560px' }}>
        <button className="modal__close" onClick={onClose} aria-label="Fechar">✕</button>
        <h2 className="modal__title">Sugestão: {filme.titulo}</h2>

        <dl className="sugestao-ver__lista">
          {campos.map(([label, val]) => (
            <div key={label} className="sugestao-ver__item">
              <dt>{label}</dt>
              <dd>{val || '—'}</dd>
            </div>
          ))}
          {filme.sinopse && (
            <div className="sugestao-ver__item sugestao-ver__item--full">
              <dt>Sinopse</dt>
              <dd>{filme.sinopse}</dd>
            </div>
          )}
        </dl>

        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <button className="btn btn--success" onClick={onAprovar}>✔ Aceitar Sugestão</button>
          <button className="btn btn--danger"  onClick={onRejeitar}>✕ Não Aceitar Sugestão</button>
        </div>
      </div>
    </div>
  )
}
