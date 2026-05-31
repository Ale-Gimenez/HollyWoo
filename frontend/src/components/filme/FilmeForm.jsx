/**
 * components/filme/FilmeForm.jsx
 * Formulário reutilizável para adicionar e editar filmes.
 * Recebe `dados` (listas de aux), `initialValues` (para edição),
 * `onSubmit(body)`, `onCancel`, `submitLabel`, `loading`.
 */
import { useState } from 'react'
import './FilmeForm.css'

const CLASSIFICACOES = ['L','6','10','12','14','16','18']
const ESTILOS        = ['2D','3D','Stop Motion','Anime']

const EMPTY = {
  titulo: '', ano: '', duracao: '', orcamento: '',
  sinopse: '', poster: '', banner: '', trailer: '',
  classificacao: '', estilo_visual: '',
  id_produtora_principal: '', id_pais_origem: '',
  ids_categorias: [], ids_atores: [], ids_diretores: [],
  ids_linguagens: [], ids_sagas: [], ids_produtoras: [], ids_paises: [],
}

function toIds(list, key) {
  return (list ?? []).map(x => x[key])
}

export default function FilmeForm({ dados, initialValues, onSubmit, onCancel, submitLabel = '✔ Salvar', loading = false }) {
  const init = initialValues
    ? {
        titulo:                 initialValues.titulo ?? '',
        ano:                    initialValues.ano ?? '',
        duracao:                initialValues.duracao ? String(initialValues.duracao).slice(0, 5) : '',
        orcamento:              initialValues.orcamento ?? '',
        sinopse:                initialValues.sinopse ?? '',
        poster:                 initialValues.poster ?? '',
        banner:                 initialValues.banner ?? '',
        trailer:                initialValues.trailer ?? '',
        classificacao:          initialValues.classificacao ?? '',
        estilo_visual:          initialValues.estilo_visual ?? '',
        id_produtora_principal: initialValues.id_produtora_principal ?? '',
        id_pais_origem:         initialValues.id_pais_origem ?? '',
        ids_categorias:         toIds(initialValues.categorias, 'id_categoria'),
        ids_atores:             toIds(initialValues.atores,     'id_ator'),
        ids_diretores:          toIds(initialValues.diretores,  'id_diretor'),
        ids_linguagens:         toIds(initialValues.linguagens, 'id_linguagem'),
        ids_sagas:              toIds(initialValues.sagas,      'id_saga'),
        ids_produtoras:         toIds(initialValues.produtoras, 'id_produtora'),
        ids_paises:             toIds(initialValues.paises,     'id_pais'),
      }
    : EMPTY

  const [form, setForm] = useState(init)

  function set(field) {
    return (e) => setForm(f => ({ ...f, [field]: e.target.value }))
  }

  function toggleMulti(field, val) {
    setForm(f => ({
      ...f,
      [field]: f[field].includes(val) ? f[field].filter(x => x !== val) : [...f[field], val],
    }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const body = {
      ...form,
      ano:       form.ano       ? Number(form.ano)       : null,
      orcamento: form.orcamento ? Number(form.orcamento) : null,
      id_produtora_principal: form.id_produtora_principal ? Number(form.id_produtora_principal) : null,
      id_pais_origem:         form.id_pais_origem         ? Number(form.id_pais_origem)         : null,
    }
    onSubmit(body)
  }

  const { categorias, linguagens, produtoras, atores, diretores, paises, sagas } = dados

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Row 1: Título, Ano, Diretor */}
      <div className="filme-form-grid filme-form-grid--3" style={{ marginBottom: '20px' }}>
        <div className="input-group filme-form-grid--full">
          <label htmlFor="ff-titulo">Título</label>
          <div className="input-field">
            <input id="ff-titulo" type="text" placeholder="Ex: A Fantástica Fábrica de Chocolate"
              value={form.titulo} onChange={set('titulo')} required />
          </div>
        </div>
      </div>

      <div className="filme-form-grid filme-form-grid--3" style={{ marginBottom: '20px' }}>
        <div className="input-group">
          <label htmlFor="ff-ano">Ano</label>
          <div className="input-field">
            <input id="ff-ano" type="number" placeholder="Ex: 2015"
              value={form.ano} onChange={set('ano')} min="1900" max="2100" />
          </div>
        </div>
        <div className="input-group">
          <label htmlFor="ff-duracao">Duração (HH:MM)</label>
          <div className="input-field">
            <input id="ff-duracao" type="text" placeholder="Ex: 02:10"
              value={form.duracao} onChange={set('duracao')} />
          </div>
        </div>
        <div className="input-group">
          <label htmlFor="ff-orcamento">Orçamento</label>
          <div className="input-field">
            <input id="ff-orcamento" type="number" placeholder="Ex: 30000000"
              value={form.orcamento} onChange={set('orcamento')} />
          </div>
        </div>
      </div>

      {/* Row 2: Gênero, Produtora, País */}
      <div className="filme-form-grid filme-form-grid--3" style={{ marginBottom: '20px' }}>
        <div className="input-group">
          <label htmlFor="ff-produtora">Produtora Principal</label>
          <div className="input-field">
            <select id="ff-produtora" value={form.id_produtora_principal} onChange={set('id_produtora_principal')}>
              <option value="">Escolha uma opção</option>
              {produtoras.map(p => <option key={p.id_produtora} value={p.id_produtora}>{p.nome}</option>)}
            </select>
          </div>
        </div>
        <div className="input-group">
          <label htmlFor="ff-pais">País de Origem</label>
          <div className="input-field">
            <select id="ff-pais" value={form.id_pais_origem} onChange={set('id_pais_origem')}>
              <option value="">Escolha uma opção</option>
              {paises.map(p => <option key={p.id_pais} value={p.id_pais}>{p.nome}</option>)}
            </select>
          </div>
        </div>
        <div className="input-group">
          <label htmlFor="ff-classif">Classificação Indicativa</label>
          <div className="input-field">
            <select id="ff-classif" value={form.classificacao} onChange={set('classificacao')}>
              <option value="">Escolha uma opção</option>
              {CLASSIFICACOES.map(c => <option key={c} value={c}>{c === 'L' ? 'Livre' : `+${c}`}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Row 3: Estilo Visual, Saga, Linguagens */}
      <div className="filme-form-grid filme-form-grid--3" style={{ marginBottom: '20px' }}>
        <div className="input-group">
          <label htmlFor="ff-estilo">Estilo Visual</label>
          <div className="input-field">
            <select id="ff-estilo" value={form.estilo_visual} onChange={set('estilo_visual')}>
              <option value="">Escolha uma opção</option>
              {ESTILOS.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
        </div>
        <div className="input-group">
          <label>Saga</label>
          <div className="input-field">
            <select value={form.ids_sagas[0] ?? ''} onChange={e => setForm(f => ({ ...f, ids_sagas: e.target.value ? [Number(e.target.value)] : [] }))}>
              <option value="">Nenhuma saga</option>
              {sagas.map(s => <option key={s.id_saga} value={s.id_saga}>{s.nome}</option>)}
            </select>
          </div>
        </div>
        <div className="input-group">
          <label htmlFor="ff-poster">URL do Poster</label>
          <div className="input-field">
            <input id="ff-poster" type="url" placeholder="https://..."
              value={form.poster} onChange={set('poster')} />
          </div>
        </div>
      </div>

      {/* Multi-select: Atores */}
      <MultiSelect
        label="Atores"
        items={atores}
        idKey="id_ator"
        labelFn={a => `${a.nome} ${a.sobrenome}`}
        selected={form.ids_atores}
        onToggle={val => toggleMulti('ids_atores', val)}
      />

      {/* Multi-select: Linguagens */}
      <MultiSelect
        label="Linguagens"
        items={linguagens}
        idKey="id_linguagem"
        labelFn={l => l.nome}
        selected={form.ids_linguagens}
        onToggle={val => toggleMulti('ids_linguagens', val)}
      />

      {/* Multi-select: Categorias */}
      <MultiSelect
        label="Gêneros / Categorias"
        items={categorias}
        idKey="id_categoria"
        labelFn={c => c.nome}
        selected={form.ids_categorias}
        onToggle={val => toggleMulti('ids_categorias', val)}
      />

      {/* Sinopse */}
      <div className="input-group" style={{ marginTop: '20px' }}>
        <label htmlFor="ff-sinopse">Sinopse</label>
        <div className="input-field input-field--textarea">
          <textarea id="ff-sinopse" placeholder="Ex: É sobre um cara que vende chocolates INCRÍVEIS e MUITO bons...."
            value={form.sinopse} onChange={set('sinopse')} />
        </div>
      </div>

      {/* Ações */}
      <div className="filme-form-actions">
        <button type="submit" className="btn btn--primary" disabled={loading}>
          {loading ? 'Salvando...' : submitLabel}
        </button>
        <button type="button" className="btn btn--accent" onClick={onCancel}>✕ Cancelar</button>
      </div>
    </form>
  )
}

/* ── MultiSelect inline ── */
function MultiSelect({ label, items, idKey, labelFn, selected, onToggle }) {
  const [open, setOpen] = useState(false)
  const selectedLabels  = items.filter(x => selected.includes(x[idKey])).map(labelFn)

  return (
    <div className="input-group multi-select" style={{ marginTop: '20px' }}>
      <label>{label}</label>
      <button type="button" className="input-field multi-select__btn" onClick={() => setOpen(o => !o)}
        aria-expanded={open}>
        <span style={{ flex: 1, textAlign: 'left', color: selectedLabels.length ? 'var(--color-text)' : 'var(--color-text-muted)' }}>
          {selectedLabels.length > 0 ? selectedLabels.join(', ') : `↓ Escolha várias opções`}
        </span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points={open ? '18 15 12 9 6 15' : '6 9 12 15 18 9'} />
        </svg>
      </button>
      {open && (
        <div className="multi-select__dropdown">
          {items.map(item => {
            const id  = item[idKey]
            const act = selected.includes(id)
            return (
              <button key={id} type="button"
                className={`multi-select__option${act ? ' multi-select__option--active' : ''}`}
                onClick={() => onToggle(id)}>
                <span className="multi-select__check">{act ? '✓' : ''}</span>
                {labelFn(item)}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
