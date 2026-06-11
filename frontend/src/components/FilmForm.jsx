import { useState, useRef, useEffect } from 'react'
import { useFilmes } from '../context/FilmesContext'
import '../styles/FilmForm.css'
import '../styles/Shared.css'

const CLASSIFICACOES = ['L', '+6', '+10', '+12', '+14', '+16', '+18']
const ESTILOS = ['Vida Real', '3D', '2D', 'Stop Motion', 'Anime']

function MultiSelect({ id, label, options, value = [], onChange, placeholder = 'Escolha opções', displayKey = null, valueKey = null }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function getLabel(opt) {
    return displayKey ? opt[displayKey] : opt
  }
  function getValue(opt) {
    return valueKey ? opt[valueKey] : opt
  }

  function toggle(opt) {
    const v = getValue(opt)
    if (value.includes(v)) {
      onChange(value.filter(x => x !== v))
    } else {
      onChange([...value, v])
    }
  }

  const filteredOptions = options.filter(opt => {
    const label = getLabel(opt)
    return !search || label.toLowerCase().includes(search.toLowerCase())
  })

  const selectedLabels = options
    .filter(opt => value.includes(getValue(opt)))
    .map(opt => getLabel(opt))

  const display = selectedLabels.length === 0 ? placeholder : selectedLabels.join(', ')

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
        <span className={`multiselect-display${selectedLabels.length === 0 ? ' placeholder' : ''}`}>
          {display}
        </span>
        <span className="multiselect-arrow">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="multiselect-dropdown-wrapper">
          {options.length > 6 && (
            <div className="multiselect-search-wrap">
              <input
                className="multiselect-search"
                type="text"
                placeholder="Buscar..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                onClick={e => e.stopPropagation()}
                autoFocus
              />
            </div>
          )}
          <ul className="multiselect-dropdown" role="listbox" aria-multiselectable="true">
            {filteredOptions.length === 0 ? (
              <li className="multiselect-option" className="multiselect-no-result">Nenhum resultado</li>
            ) : filteredOptions.map(opt => {
              const v = getValue(opt)
              const checked = value.includes(v)
              return (
                <li
                  key={v}
                  role="option"
                  aria-selected={checked}
                  className={`multiselect-option${checked ? ' selected' : ''}`}
                  onClick={() => toggle(opt)}
                >
                  <span className="multiselect-checkbox">{checked ? '✓' : ''}</span>
                  {getLabel(opt)}
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}

export default function FilmForm({ initial = {}, onSubmit, onCancel, submitLabel = 'Adicionar' }) {
  const { dadosAuxiliares } = useFilmes()
  const { categorias, paises, linguagens, produtoras, sagas, atores, diretores } = dadosAuxiliares

  const nomesCategorias  = categorias.map(c => c.nome)
  const nomesPaises      = paises.map(p => p.nome)
  const nomesLinguagens  = linguagens.map(l => l.nome)
  const nomesProdutoras  = produtoras.map(p => p.nome)
  const nomesSagas       = sagas.map(s => s.nome)

  const opcoesAtores = atores.map(a => ({
    id: a.id_ator,
    label: `${a.nome} ${a.sobrenome || ''}`.trim()
  }))
  const opcoesDiretores = diretores.map(d => ({
    id: d.id_diretor,
    label: `${d.nome} ${d.sobrenome || ''}`.trim()
  }))

  const initialCategorias = initial._ids?.ids_categorias?.length
    ? categorias.filter(c => initial._ids.ids_categorias.includes(c.id_categoria)).map(c => c.nome)
    : (Array.isArray(initial.categorias) ? initial.categorias : [])

  const initialPaises = initial._ids?.ids_paises?.length
    ? paises.filter(p => initial._ids.ids_paises.includes(p.id_pais)).map(p => p.nome)
    : (Array.isArray(initial.paises) ? initial.paises : [])

  const initialLinguagens = initial._ids?.ids_linguagens?.length
    ? linguagens.filter(l => initial._ids.ids_linguagens.includes(l.id_linguagem)).map(l => l.nome)
    : (Array.isArray(initial.linguagens) ? initial.linguagens : [])

  const initialSagas = initial._ids?.ids_sagas?.length
    ? sagas.filter(s => initial._ids.ids_sagas.includes(s.id_saga)).map(s => s.nome)
    : (initial.sagas || []).map(s => s.nome || s)

  const initialAtoresIds = initial._ids?.ids_atores?.length
    ? initial._ids.ids_atores
    : (initial.elenco || []).map(a => {
        const nome = typeof a === 'string' ? a : a.nome
        const found = atores.find(x => `${x.nome} ${x.sobrenome || ''}`.trim() === nome)
        return found?.id_ator
      }).filter(Boolean)

  const initialDiretoresIds = initial._ids?.ids_diretores?.length
    ? initial._ids.ids_diretores
    : (initial.diretores || []).map(d => {
        const nome = typeof d === 'string' ? d : d.nome
        const found = diretores.find(x => `${x.nome} ${x.sobrenome || ''}`.trim() === nome)
        return found?.id_diretor
      }).filter(Boolean)

  const initialProdutora = (() => {
    if (initial._ids?.ids_produtoras?.length) {
      const p = produtoras.find(p => initial._ids.ids_produtoras.includes(p.id_produtora))
      return p?.nome || ''
    }
    return initial.produtora_principal?.nome || initial.produtora_principal || ''
  })()

  const [form, setForm] = useState({
    titulo:       initial.titulo || '',
    ano:          initial.ano || '',
    duracao:      initial.duracao || '',
    orcamento:    initial.orcamento || '',
    poster:       initial.poster || '',
    poster_bg:    initial.poster_bg || '',
    sinopse:      initial.sinopse || '',
    categorias:   initialCategorias,
    classificacao: initial.classificacao || '',
    estilo_visual: (() => {
      if (Array.isArray(initial.estilo_visual)) return initial.estilo_visual[0] || ''
      return initial.estilo_visual || ''
    })(),
    produtora_principal: initialProdutora,
    paises:       initialPaises,
    linguagens:   initialLinguagens,
    sagas_nomes:  initialSagas,
    ids_atores:   initialAtoresIds,
    ids_diretores: initialDiretoresIds,
    trailer:      initial.trailer || '',
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

    const diretoresSelecionados = diretores
      .filter(d => form.ids_diretores.includes(d.id_diretor))
      .map(d => ({ nome: `${d.nome} ${d.sobrenome || ''}`.trim(), foto: d.img || '', cargo: 'Diretor' }))

    const elencoSelecionado = atores
      .filter(a => form.ids_atores.includes(a.id_ator))
      .map(a => ({ nome: `${a.nome} ${a.sobrenome || ''}`.trim(), personagem: a.nome_personagem || '', foto: a.img || '' }))

    const ids_sagas = sagas
      .filter(s => form.sagas_nomes.includes(s.nome))
      .map(s => s.id_saga)

    onSubmit({
      titulo:       form.titulo,
      ano:          Number(form.ano),
      duracao:      form.duracao || '01:30:00',
      orcamento:    Number(form.orcamento) || 0,
      poster:       form.poster || `https://ui-avatars.com/api/?name=${encodeURIComponent(form.titulo)}&background=2a2a2a&color=fff&size=300`,
      poster_bg:    form.poster_bg || '',
      sinopse:      form.sinopse,
      categorias:   form.categorias.filter(Boolean),
      classificacao: form.classificacao,
      estilo_visual: form.estilo_visual || null,
      produtora_principal: { nome: form.produtora_principal },
      paises:       form.paises.filter(Boolean),
      linguagens:   form.linguagens.filter(Boolean),
      diretores:    diretoresSelecionados,
      elenco:       elencoSelecionado,
      trailer:      form.trailer || '',
      ids_sagas,
      ids_atores:   form.ids_atores,
      ids_diretores: form.ids_diretores,
      classico:     Number(form.ano) < 2015,
    })
  }

  return (
    <form className="film-form" onSubmit={handleSubmit}>
      
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
            options={nomesPaises}
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
          <MultiSelect
            id="f-diretor"
            label="Diretores"
            options={opcoesDiretores}
            value={form.ids_diretores}
            onChange={val => set('ids_diretores', val)}
            placeholder="Selecione diretores"
            displayKey="label"
            valueKey="id"
          />
        </div>
      </div>

      
      <div className="film-form-row-4">
        <div className="form-group">
          <MultiSelect
            id="f-genero"
            label="Gênero"
            options={nomesCategorias}
            value={form.categorias}
            onChange={val => set('categorias', val)}
            placeholder="Selecione gêneros"
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="f-produtora">Produtora</label>
          <select id="f-produtora" className="form-select" value={form.produtora_principal} onChange={e => set('produtora_principal', e.target.value)}>
            <option value="">Selecione</option>
            {nomesProdutoras.map(p => <option key={p} value={p}>{p}</option>)}
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

      
      <div className="film-form-row-3">
        <div className="form-group">
          <MultiSelect
            id="f-saga"
            label="Saga"
            options={nomesSagas}
            value={form.sagas_nomes}
            onChange={val => set('sagas_nomes', val)}
            placeholder="Selecione uma saga"
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="f-estilo">Estilo Visual</label>
          <select id="f-estilo" className="form-select" value={form.estilo_visual} onChange={e => set('estilo_visual', e.target.value)}>
            <option value="">Selecione</option>
            {ESTILOS.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>
        <div className="form-group">
          <MultiSelect
            id="f-linguagens"
            label="Linguagens"
            options={nomesLinguagens}
            value={form.linguagens}
            onChange={val => set('linguagens', val)}
            placeholder="Selecione idiomas"
          />
        </div>
      </div>

      
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
          <MultiSelect
            id="f-atores"
            label="Atores"
            options={opcoesAtores}
            value={form.ids_atores}
            onChange={val => set('ids_atores', val)}
            placeholder="Selecione atores"
            displayKey="label"
            valueKey="id"
          />
        </div>
      </div>

      
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
