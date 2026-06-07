import { useState } from 'react'
import '../styles/FilmForm.css'
import '../styles/Shared.css'

const GENEROS = ['Ação','Animação','Aventura','Comédia','Drama','Fantasia','Ficção Científica','Musical','Romance','Suspense','Terror']
const PRODUTORAS = ['Disney','Pixar','DreamWorks Animation','Studio Ghibli','Illumination','Blue Sky Studios','Sony Pictures Animation','Netflix Animation','Warner Animation','Universal Pictures Animation']
const LINGUAGENS_OPTS = ['Inglês','Português','Espanhol','Japonês','Francês','Italiano','Coreano','Mandarim','Alemão','Russo','Árabe']
const PAISES_OPTS = ['Estados Unidos','Japão','Reino Unido','França','Alemanha','Itália','Espanha','Brasil','Coreia do Sul','China','Austrália']
const CLASSIFICACOES = ['Livre','+6','+10','+12','+14','+16','+18']
const ESTILOS = ['Vida Real','3D','2D','Stop Motion','Anime']

export default function FilmForm({ initial = {}, onSubmit, onCancel, submitLabel = 'Adicionar' }) {
  const [form, setForm] = useState({
    titulo: initial.titulo || '',
    ano: initial.ano || '',
    duracao: initial.duracao || '',
    orcamento: initial.orcamento || '',
    poster: initial.poster || '',
    poster_bg: initial.poster_bg || '',
    sinopse: initial.sinopse || '',
    categorias: initial.categorias ? [initial.categorias[0] || ''] : [''],
    classificacao: initial.classificacao || '',
    estilo_visual: initial.estilo_visual ? [initial.estilo_visual[0] || ''] : [''],
    produtora_principal: initial.produtora_principal?.nome || initial.produtora_principal || '',
    paises: initial.paises ? [initial.paises[0] || ''] : [''],
    linguagens: initial.linguagens ? [initial.linguagens[0] || ''] : [''],
    diretores_raw: (initial.diretores || []).map(d => typeof d === 'string' ? d : d.nome).join(', '),
    atores_raw: (initial.elenco || []).map(a => typeof a === 'string' ? a : a.nome).join(', '),
    trailer: initial.trailer || '',
    saga_raw: initial.saga?.titulo_saga || '',
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
      saga: null,
      classico: Number(form.ano) < 2015,
    })
  }

  return (
    <form className="film-form" onSubmit={handleSubmit}>
      {/* Upload zones */}
      <div className="film-form-upload-row">
        <div>
          <p className="film-form-upload-label">Poster</p>
          <label className="film-form-upload-zone" htmlFor="input-poster">
            {form.poster ? (
              <>
                <img src={form.poster} alt="Poster" className="film-form-upload-preview" onError={e => { e.target.style.display = 'none' }} />
                <span className="film-form-upload-edit-btn" role="button" aria-label="Editar poster">✏</span>
              </>
            ) : (
              <span className="film-form-upload-icon">⬆</span>
            )}
            <input
              id="input-poster"
              type="url"
              placeholder="URL do poster"
              value={form.poster}
              onChange={e => set('poster', e.target.value)}
              style={{ position: 'absolute', opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }}
            />
          </label>
        </div>
        <div>
          <p className="film-form-upload-label">Banner</p>
          <label className="film-form-upload-zone" htmlFor="input-banner">
            {form.poster_bg ? (
              <>
                <img src={form.poster_bg} alt="Banner" className="film-form-upload-preview" onError={e => { e.target.style.display = 'none' }} />
                <span className="film-form-upload-edit-btn" role="button" aria-label="Editar banner">✏</span>
              </>
            ) : (
              <span className="film-form-upload-icon">⬆</span>
            )}
            <input
              id="input-banner"
              type="url"
              placeholder="URL do banner"
              value={form.poster_bg}
              onChange={e => set('poster_bg', e.target.value)}
              style={{ position: 'absolute', opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }}
            />
          </label>
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
          <label className="form-label" htmlFor="f-pais">País</label>
          <input id="f-pais" className="form-input" placeholder="Ex: Estados Unidos" value={form.paises[0] || ''} onChange={e => set('paises', [e.target.value])} />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="f-duracao">Duração</label>
          <input id="f-duracao" className="form-input" placeholder="Ex: 1h 20min" value={form.duracao} onChange={e => set('duracao', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="f-diretor">Diretor</label>
          <input id="f-diretor" className="form-input" placeholder="Ex: Jonny Deep" value={form.diretores_raw} onChange={e => set('diretores_raw', e.target.value)} />
        </div>
      </div>

      {/* Row 2: Gênero, Produtora, Ano, Trailer */}
      <div className="film-form-row-4">
        <div className="form-group">
          <label className="form-label" htmlFor="f-genero">Gênero</label>
          <select id="f-genero" className="form-select" value={form.categorias[0] || ''} onChange={e => set('categorias', [e.target.value])}>
            <option value="">Fantasia</option>
            {GENEROS.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="f-produtora">Produtora</label>
          <select id="f-produtora" className="form-select" value={form.produtora_principal} onChange={e => set('produtora_principal', e.target.value)}>
            <option value="">Disney</option>
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
          <input id="f-trailer" className="form-input" placeholder="Ex: http://imagens.com.br" value={form.trailer} onChange={e => set('trailer', e.target.value)} />
        </div>
      </div>

      {/* Row 3: Saga, Estilo Visual, Linguagens */}
      <div className="film-form-row-3">
        <div className="form-group">
          <label className="form-label" htmlFor="f-saga">Saga</label>
          <select id="f-saga" className="form-select">
            <option value="">Escolha várias opções</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="f-estilo">Estilo Visual</label>
          <select id="f-estilo" className="form-select" value={form.estilo_visual[0] || ''} onChange={e => set('estilo_visual', [e.target.value])}>
            <option value="">Vida Real</option>
            {ESTILOS.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="f-linguagens">Linguagens</label>
          <select id="f-linguagens" className="form-select" value={form.linguagens[0] || ''} onChange={e => set('linguagens', [e.target.value])}>
            <option value="">Escolha várias opções</option>
            {LINGUAGENS_OPTS.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
      </div>

      {/* Row 4: Orçamento, Classificação, Atores */}
      <div className="film-form-row-3">
        <div className="form-group">
          <label className="form-label" htmlFor="f-orcamento">Orçamento</label>
          <input id="f-orcamento" className="form-input" placeholder="Ex: $ 30.0000" type="number" value={form.orcamento} onChange={e => set('orcamento', e.target.value)} />
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
          <select id="f-atores" className="form-select">
            <option value="">Escolha várias opções</option>
          </select>
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
