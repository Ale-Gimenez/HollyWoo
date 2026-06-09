import { useState, useRef, useEffect } from 'react'
import { useFilmes } from '../context/FilmesContext'
import '../styles/FilmForm.css'
import '../styles/Shared.css'

const GENEROS = ['Ação','Animação','Aventura','Comédia','Drama','Fantasia','Ficção Científica','Musical','Romance','Suspense','Terror']
const PRODUTORAS = ['Disney','Pixar','DreamWorks Animation','Studio Ghibli','Illumination','Blue Sky Studios','Sony Pictures Animation','Netflix Animation','Warner Animation','Universal Pictures Animation']
const LINGUAGENS_OPTS = ['Inglês','Português','Espanhol','Japonês','Francês','Italiano','Coreano','Mandarim','Alemão','Russo','Árabe']
const PAISES_OPTS = ['Estados Unidos','Japão','Reino Unido','França','Alemanha','Itália','Espanha','Brasil','Coreia do Sul','China','Austrália']
const CLASSIFICACOES = ['Livre','+6','+10','+12','+14','+16','+18']
const ESTILOS = ['Vida Real','3D','2D','Stop Motion','Anime']

/* ─── Multi-select dropdown com checkboxes ─────────────────────────────── */
function MultiSelect({ id, label, options, value = [], onChange, placeholder = 'Escolha opções' }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function toggle(opt) {
    if (value.includes(opt)) {
      onChange(value.filter(v => v !== opt))
    } else {
      onChange([...value, opt])
    }
  }

  const display = value.length === 0
    ? placeholder
    : value.join(', ')

  return (
    <div className="multiselect-wrapper" ref={ref}>
      {label && <label className="form-label" htmlFor={id}>{label}</label>}
      <button
        type="button"
        id={id}
        className="multiselect-trigger"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={`multiselect-display${value.length === 0 ? ' placeholder' : ''}`}>
          {display}
        </span>
        <span className="multiselect-arrow">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <ul className="multiselect-dropdown" role="listbox" aria-multiselectable="true">
          {options.map(opt => {
            const checked = value.includes(opt)
            return (
              <li
                key={opt}
                role="option"
                aria-selected={checked}
                className={`multiselect-option${checked ? ' selected' : ''}`}
                onClick={() => toggle(opt)}
              >
                <span className="multiselect-checkbox">{checked ? '✓' : ''}</span>
                {opt}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default function FilmForm({ initial = {}, onSubmit, onCancel, submitLabel = 'Adicionar' }) {
  const { sagas } = useFilmes()
  const [form, setForm] = useState({
    titulo: initial.titulo || '',
    ano: initial.ano || '',
    duracao: initial.duracao || '',
    orcamento: initial.orcamento || '',
    poster: initial.poster || '',
    poster_bg: initial.poster_bg || '',
    sinopse: initial.sinopse || '',
    categorias: Array.isArray(initial.categorias) && initial.categorias.length > 0 ? initial.categorias : [],
    classificacao: initial.classificacao || '',
    estilo_visual: Array.isArray(initial.estilo_visual) && initial.estilo_visual.length > 0 ? initial.estilo_visual : [],
    produtora_principal: initial.produtora_principal?.nome || initial.produtora_principal || '',
    paises: Array.isArray(initial.paises) && initial.paises.length > 0 ? initial.paises : [],
    linguagens: Array.isArray(initial.linguagens) && initial.linguagens.length > 0 ? initial.linguagens : [],
    diretores_raw: (initial.diretores || []).map(d => typeof d === 'string' ? d : d.nome).join(', '),
    atores_raw: (initial.elenco || []).map(a => typeof a === 'string' ? a : a.nome).join(', '),
    trailer: initial.trailer || '',
    ids_sagas: (initial.sagas || []).map(s => s.id),
  })

  const [errors, setErrors] = useState({})

  function set(field, val) {
    setForm(prev => ({ ...prev, [field]: val }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }))
  }

  function validate() {
    const e = {}
    if (!form.titulo.trim()) e.titulo = 'Título obrigatório'
    if (!form.ano || isNaN(form.ano)) e.ano = 'Ano inválido'
    if (!form.sinopse.trim()) e.sinopse = 'Sinopse obrigatória'
    return e
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    const diretores = form.diretores_raw
      .split(',').map(s => s.trim()).filter(Boolean)
      .map(nome => ({ nome, foto: `https://ui-avatars.com/api/?name=${encodeURIComponent(nome)}&background=7833e2&color=fff`, cargo: 'Diretor' }))

    const elenco = form.atores_raw
      .split(',').map(s => s.trim()).filter(Boolean)
      .map(nome => ({ nome, personagem: '', foto: `https://ui-avatars.com/api/?name=${encodeURIComponent(nome)}&background=333&color=fff` }))

    onSubmit({
      titulo: form.titulo,
      ano: Number(form.ano),
      duracao: form.duracao || '01:30:00',
      orcamento: Number(form.orcamento) || 0,
      poster: form.poster || `https://ui-avatars.com/api/?name=${encodeURIComponent(form.titulo)}&background=2a2a2a&color=fff&size=300`,
      poster_bg: form.poster_bg || '',
      sinopse: form.sinopse,
      categorias: form.categorias.filter(Boolean),
      classificacao: form.classificacao,
      estilo_visual: form.estilo_visual.filter(Boolean),
      produtora_principal: { nome: form.produtora_principal },
      paises: form.paises.filter(Boolean),
      linguagens: form.linguagens.filter(Boolean),
      diretores,
      elenco,
      trailer: form.trailer || '',
      ids_sagas: form.ids_sagas,
      classico: Number(form.ano) < 2015,
    })
  }

  return (
    <form className="film-form" onSubmit={handleSubmit}>
      {/* Upload zones */}
      <div className="film-form-upload-row">
        <div className="film-form-upload-col">
          <p className="film-form-upload-label">Poster</p>
          <div className="film-form-upload-zone">
            {form.poster ? (
              <>
                <img
                  src={form.poster}
                  alt="Poster"
                  className="film-form-upload-preview"
                  onError={e => { e.target.style.display = 'none' }}
                />
                <span className="film-form-upload-edit-btn" aria-label="Editar poster">✏</span>
              </>
            ) : (
              <span className="film-form-upload-icon">⬆</span>
            )}
          </div>
          <input
            type="url"
            className="form-input film-form-url-input"
            placeholder="Cole a URL do poster aqui"
            value={form.poster}
            onChange={e => set('poster', e.target.value)}
          />
        </div>
        <div className="film-form-upload-col">
          <p className="film-form-upload-label">Banner</p>
          <div className="film-form-upload-zone">
            {form.poster_bg ? (
              <>
                <img
                  src={form.poster_bg}
                  alt="Banner"
                  className="film-form-upload-preview"
                  onError={e => { e.target.style.display = 'none' }}
                />
                <span className="film-form-upload-edit-btn" aria-label="Editar banner">✏</span>
              </>
            ) : (
              <span className="film-form-upload-icon">⬆</span>
            )}
          </div>
          <input
            type="url"
            className="form-input film-form-url-input"
            placeholder="Cole a URL do banner aqui"
            value={form.poster_bg}
            onChange={e => set('poster_bg', e.target.value)}
          />
        </div>
      </div>

      {/* Row 1: Título, País, Duração, Diretor */}
      <div className="film-form-row-4">
        <div className="form-group">
          <label className="form-label" htmlFor="f-titulo">Título</label>
          <input id="f-titulo" className="form-input" placeholder="Ex: Wonka" value={form.titulo} onChange={e => set('titulo', e.target.value)} />
          {errors.titulo && <span className="form-error">{errors.titulo}</span>}
        </div>
        <div className="form-group">
          <MultiSelect
            id="f-paises"
            label="País"
            options={PAISES_OPTS}
            value={form.paises}
            onChange={val => set('paises', val)}
            placeholder="Selecione países"
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="f-duracao">Duração</label>
          <input id="f-duracao" className="form-input" placeholder="Ex: 01:30:00" value={form.duracao} onChange={e => set('duracao', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="f-diretor">Diretor</label>
          <input id="f-diretor" className="form-input" placeholder="Ex: Jonny Deep, Outro" value={form.diretores_raw} onChange={e => set('diretores_raw', e.target.value)} />
        </div>
      </div>

      {/* Row 2: Gênero, Produtora, Ano, Trailer */}
      <div className="film-form-row-4">
        <div className="form-group">
          <MultiSelect
            id="f-genero"
            label="Gênero"
            options={GENEROS}
            value={form.categorias}
            onChange={val => set('categorias', val)}
            placeholder="Selecione gêneros"
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="f-produtora">Produtora</label>
          <select id="f-produtora" className="form-select" value={form.produtora_principal} onChange={e => set('produtora_principal', e.target.value)}>
            <option value="">Selecione</option>
            {PRODUTORAS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="f-ano">Ano</label>
          <input id="f-ano" className="form-input" placeholder="Ex: 2015" type="number" min="1900" max="2099" value={form.ano} onChange={e => set('ano', e.target.value)} />
          {errors.ano && <span className="form-error">{errors.ano}</span>}
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="f-trailer">Trailer</label>
          <input id="f-trailer" className="form-input" placeholder="Ex: https://youtube.com/..." value={form.trailer} onChange={e => set('trailer', e.target.value)} />
        </div>
      </div>

      {/* Row 3: Saga, Estilo Visual, Linguagens */}
      <div className="film-form-row-3">
        <div className="form-group">
          <MultiSelect
            id="f-saga"
            label="Saga"
            options={sagas.map(s => s.nome)}
            value={sagas.filter(s => form.ids_sagas.includes(s.id_saga)).map(s => s.nome)}
            onChange={val => set('ids_sagas', sagas.filter(s => val.includes(s.nome)).map(s => s.id_saga))}
            placeholder="Selecione uma saga"
          />
        </div>
        <div className="form-group">
          <MultiSelect
            id="f-estilo"
            label="Estilo Visual"
            options={ESTILOS}
            value={form.estilo_visual}
            onChange={val => set('estilo_visual', val)}
            placeholder="Selecione estilos"
          />
        </div>
        <div className="form-group">
          <MultiSelect
            id="f-linguagens"
            label="Linguagens"
            options={LINGUAGENS_OPTS}
            value={form.linguagens}
            onChange={val => set('linguagens', val)}
            placeholder="Selecione idiomas"
          />
        </div>
      </div>

      {/* Row 4: Orçamento, Classificação, Atores */}
      <div className="film-form-row-3">
        <div className="form-group">
          <label className="form-label" htmlFor="f-orcamento">Orçamento</label>
          <input id="f-orcamento" className="form-input" placeholder="Ex: 30000000" type="number" value={form.orcamento} onChange={e => set('orcamento', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="f-classif">Classificação Indicativa</label>
          <select id="f-classif" className="form-select" value={form.classificacao} onChange={e => set('classificacao', e.target.value)}>
            <option value="">Escolha uma opção</option>
            {CLASSIFICACOES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="f-atores">Atores</label>
          <input id="f-atores" className="form-input" placeholder="Ex: Shakira, Ginnifer Goodwin" value={form.atores_raw} onChange={e => set('atores_raw', e.target.value)} />
        </div>
      </div>

      {/* Sinopse */}
      <div className="form-group">
        <label className="form-label" htmlFor="f-sinopse">Sinopse</label>
        <textarea
          id="f-sinopse"
          className="form-textarea"
          placeholder="Ex: É sobre um cara que vende chocolates INCRÍVEIS e MUITO bons...."
          value={form.sinopse}
          onChange={e => set('sinopse', e.target.value)}
          rows={4}
        />
        {errors.sinopse && <span className="form-error">{errors.sinopse}</span>}
      </div>

      <div className="film-form-actions">
        <button type="submit" className="btn btn-primary">
          ✓ {submitLabel}
        </button>
        <button type="button" className="btn btn-cancel" onClick={onCancel}>
          ✕ Cancelar
        </button>
      </div>
    </form>
  )
}
