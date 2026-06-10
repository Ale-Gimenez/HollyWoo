import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
  apiGetFilmes, apiGetFilme, apiCreateFilme,
  apiUpdateFilme, apiDeleteFilme, apiAprovarFilme, apiGetPendentes,
  apiGetSagas, apiGetCategorias, apiGetPaises, apiGetLinguagens,
  apiGetProdutoras, apiGetAtores, apiGetDiretores,
  apiCriarSugestao, apiGetSugestoes, apiGetSugestoesFilme,
  apiAprovarSugestao, apiRecusarSugestao,
} from '../service/api'

const FilmesContext = createContext(null)

/**
 * Converte um filme do backend para o formato que o frontend usa.
 */
function normalizeFilme(f) {
  return {
    id:     f.id_filme,
    titulo: f.titulo,
    ano:    f.ano,
    flag:   f.flag,

    poster:    f.poster   || '',
    poster_bg: f.banner   || '',
    trailer:   f.trailer  || '',
    sinopse:   f.sinopse  || '',

    classificacao: f.classificacao || 'Livre',
    estilo_visual: f.estilo_visual ? [f.estilo_visual] : [],
    era:           f.era || null,

    duracao:   f.duracao  || null,
    orcamento: f.orcamento != null ? Number(f.orcamento) : null,

    categorias: (f.categorias || []).map(c => c.nome ?? c),
    linguagens: (f.linguagens || []).map(l => ({ nome: l.nome ?? l, img: l.img || null })),
    paises:     (f.paises     || []).map(p => ({ nome: p.nome ?? p, img: p.img || null })),
    temas:      (f.temas      || []).map(t => t.nome ?? t),
    sagas:      (f.sagas      || []).map(s => ({ id: s.id_saga, nome: s.nome, descricao: s.descricao })),

    produtora_principal: (() => {
      if (f.produtora_principal) return { nome: f.produtora_principal.nome, img: f.produtora_principal.img || null }
      if (f.produtoras && f.produtoras.length > 0) return { nome: f.produtoras[0].nome, img: f.produtoras[0].img || null }
      return null
    })(),

    elenco: (f.atores || []).map(a => ({
      nome:       `${a.nome} ${a.sobrenome || ''}`.trim(),
      personagem: a.nome_personagem || '',
      foto:       a.img || '',
    })),

    diretores: (f.diretores || []).map(d => ({
      nome:  `${d.nome} ${d.sobrenome || ''}`.trim(),
      cargo: 'Diretor',
      foto:  d.img || '',
    })),

    // IDs preservados para o formulário de edição
    _ids: {
      id_filme:          f.id_filme,
      id_pais_origem:    f.pais_origem?.id_pais ?? null,
      ids_categorias:    (f.categorias  || []).map(c => c.id_categoria),
      ids_paises:        (f.paises      || []).map(p => p.id_pais),
      ids_linguagens:    (f.linguagens  || []).map(l => l.id_linguagem),
      ids_diretores:     (f.diretores   || []).map(d => d.id_diretor),
      ids_atores:        (f.atores      || []).map(a => a.id_ator),
      ids_produtoras:    (f.produtoras  || []).map(p => p.id_produtora),
      ids_sagas:         (f.sagas       || []).map(s => s.id_saga),
    },
  }
}

function normalizeDestaques(destaques) {
  return (destaques || [])
    .sort((a, b) => a.ordem - b.ordem)
    .map(d => normalizeFilme(d.filme))
}

/**
 * Converte o payload do FilmForm (formato frontend) para o formato que o backend espera.
 * Agora atores e diretores já chegam como IDs diretos do MultiSelect.
 */
function toBackendPayload(formData, dadosAuxiliares) {
  const { categorias, paises, linguagens, produtoras, atores, diretores } = dadosAuxiliares

  function resolveIds(nomes, lista, idKey) {
    if (!nomes || !Array.isArray(nomes)) return []
    return lista.filter(item => nomes.includes(item.nome)).map(item => item[idKey])
  }

  const nomeProdutora = typeof formData.produtora_principal === 'string'
    ? formData.produtora_principal
    : formData.produtora_principal?.nome
  const produtoraObj = produtoras.find(p => p.nome === nomeProdutora)

  // estilo_visual: frontend pode enviar array (MultiSelect) ou string — banco espera string
  const estiloVisual = Array.isArray(formData.estilo_visual)
    ? (formData.estilo_visual[0] || null)
    : (formData.estilo_visual || null)

  // Atores e diretores: se já vieram como IDs (novo fluxo), usa direto;
  // senão faz fallback para resolução por nome (compatibilidade)
  let idsAtores = []
  if (formData.ids_atores && formData.ids_atores.length > 0) {
    idsAtores = formData.ids_atores
  } else {
    const nomesAtores = (formData.elenco || []).map(a => typeof a === 'string' ? a : a.nome)
    idsAtores = atores
      .filter(a => nomesAtores.includes(`${a.nome} ${a.sobrenome || ''}`.trim()) || nomesAtores.includes(a.nome))
      .map(a => a.id_ator)
  }

  let idsDiretores = []
  if (formData.ids_diretores && formData.ids_diretores.length > 0) {
    idsDiretores = formData.ids_diretores
  } else {
    const nomesDiretores = (formData.diretores || []).map(d => typeof d === 'string' ? d : d.nome)
    idsDiretores = diretores
      .filter(d => nomesDiretores.includes(`${d.nome} ${d.sobrenome || ''}`.trim()) || nomesDiretores.includes(d.nome))
      .map(d => d.id_diretor)
  }

  return {
    titulo:         formData.titulo,
    ano:            formData.ano ? Number(formData.ano) : null,
    duracao:        formData.duracao || null,
    sinopse:        formData.sinopse || null,
    poster:         formData.poster  || null,
    banner:         formData.poster_bg || null,
    trailer:        formData.trailer || null,
    orcamento:      formData.orcamento ? Number(formData.orcamento) : null,
    classificacao:  formData.classificacao || null,
    estilo_visual:  estiloVisual,
    id_produtora_principal: produtoraObj?.id_produtora ?? null,
    ids_categorias: resolveIds(formData.categorias, categorias, 'id_categoria'),
    ids_paises:     resolveIds(formData.paises,     paises,     'id_pais'),
    ids_linguagens: resolveIds(formData.linguagens, linguagens, 'id_linguagem'),
    ids_produtoras: produtoraObj ? [produtoraObj.id_produtora] : [],
    ids_atores:     idsAtores,
    ids_diretores:  idsDiretores,
    ids_sagas:      formData.ids_sagas || [],
  }
}

export function FilmesProvider({ children }) {
  const [filmes, setFilmes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Listas auxiliares do backend
  const [dadosAuxiliares, setDadosAuxiliares] = useState({
    categorias: [], paises: [], linguagens: [],
    produtoras: [], atores: [], diretores: [], sagas: [],
  })

  const fetchFilmes = useCallback(async (params = {}) => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiGetFilmes({ limit: 100, ...params })
      setFilmes(data.map(normalizeFilme))
    } catch (err) {
      setError(err.message)
      setFilmes([])
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchDadosAuxiliares = useCallback(async () => {
    try {
      const [categorias, paises, linguagens, produtoras, atores, diretores, sagas] =
        await Promise.all([
          apiGetCategorias(), apiGetPaises(), apiGetLinguagens(),
          apiGetProdutoras(), apiGetAtores(), apiGetDiretores(), apiGetSagas(),
        ])
      setDadosAuxiliares({ categorias, paises, linguagens, produtoras, atores, diretores, sagas })
    } catch (err) {
      console.error('[FilmesContext] erro ao buscar dados auxiliares:', err)
    }
  }, [])

  useEffect(() => { fetchFilmes() }, [fetchFilmes])
  useEffect(() => { fetchDadosAuxiliares() }, [fetchDadosAuxiliares])

  async function getFilmeDetalhes(id) {
    const data = await apiGetFilme(id)
    return normalizeFilme(data)
  }

  async function getPendentes() {
    const data = await apiGetPendentes()
    return data.map(normalizeFilme)
  }

  async function addFilme(formData) {
    const payload = toBackendPayload(formData, dadosAuxiliares)
    const created = await apiCreateFilme(payload)
    const norm = normalizeFilme(created)
    return norm
  }

  async function updateFilme(id, formData) {
    const payload = toBackendPayload(formData, dadosAuxiliares)
    const updated = await apiUpdateFilme(id, payload)
    const norm = normalizeFilme(updated)
    setFilmes(prev => prev.map(f => String(f.id) === String(id) ? norm : f))
    return norm
  }

  async function deleteFilme(id) {
    await apiDeleteFilme(id)
    setFilmes(prev => prev.filter(f => String(f.id) !== String(id)))
  }

  async function aprovarFilme(id) {
    const updated = await apiAprovarFilme(id)
    const norm = normalizeFilme(updated)
    setFilmes(prev => {
      const exists = prev.find(f => String(f.id) === String(id))
      return exists
        ? prev.map(f => String(f.id) === String(id) ? norm : f)
        : [...prev, norm]
    })
    return norm
  }

  async function criarSugestao(filmeId, formData) {
    const payload = toBackendPayload(formData, dadosAuxiliares)
    return apiCriarSugestao(filmeId, {
      titulo:         payload.titulo        || null,
      ano:            payload.ano           || null,
      sinopse:        payload.sinopse       || null,
      classificacao:  payload.classificacao || null,
      poster:         payload.poster        || null,
      banner:         payload.banner        || null,
      trailer:        payload.trailer       || null,
      duracao:        payload.duracao       || null,
      orcamento:      payload.orcamento     || null,
      estilo_visual:  payload.estilo_visual || null,
      ids_categorias: payload.ids_categorias || [],
      ids_paises:     payload.ids_paises     || [],
      ids_linguagens: payload.ids_linguagens || [],
      ids_sagas:      payload.ids_sagas      || [],
    })
  }

  async function getSugestoes() {
    return apiGetSugestoes()
  }

  async function getSugestoesFilme(filmeId) {
    return apiGetSugestoesFilme(filmeId)
  }

  async function aprovarSugestao(sugId) {
    return apiAprovarSugestao(sugId)
  }

  async function recusarSugestao(sugId) {
    return apiRecusarSugestao(sugId)
  }

  return (
    <FilmesContext.Provider value={{
      filmes, loading, error,
      dadosAuxiliares,
      fetchFilmes,
      getFilmeDetalhes,
      getPendentes,
      addFilme,
      updateFilme,
      deleteFilme,
      aprovarFilme,
      criarSugestao,
      getSugestoes,
      getSugestoesFilme,
      aprovarSugestao,
      recusarSugestao,
      normalizeDestaques,
    }}>
      {children}
    </FilmesContext.Provider>
  )
}

export function useFilmes() {
  const ctx = useContext(FilmesContext)
  if (!ctx) throw new Error('useFilmes must be inside FilmesProvider')
  return ctx
}
