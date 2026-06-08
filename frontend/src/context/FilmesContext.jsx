import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
  apiGetFilmes, apiGetFilme, apiCreateFilme,
  apiUpdateFilme, apiDeleteFilme, apiAprovarFilme, apiGetPendentes,
} from '../service/api'

const FilmesContext = createContext(null)

/**
 * Converte um filme do backend para o formato que o frontend usa.
 *
 * Backend (FilmeOut / FilmeListOut):
 *   id_filme, titulo, ano, poster, banner, sinopse, trailer,
 *   flag, classificacao, estilo_visual, era,
 *   pais_origem: { id_pais, nome, img }
 *   categorias:  [{ id_categoria, nome }]
 *   linguagens:  [{ id_linguagem, nome, img }]
 *   produtoras:  [{ id_produtora, nome, img }]
 *   atores:      [{ id_ator, nome, sobrenome, nome_personagem, img }]
 *   diretores:   [{ id_diretor, nome, sobrenome, img }]
 *
 * Frontend espera:
 *   id, titulo, ano, poster, poster_bg, sinopse, trailer,
 *   flag, classificacao, estilo_visual, era,
 *   categorias: ['Animação', 'Aventura', ...]   ← strings
 *   linguagens: ['Inglês', ...]                 ← strings
 *   paises:     ['Estados Unidos', ...]         ← strings
 *   produtora_principal: { nome }
 *   elenco:  [{ nome, personagem, foto }]
 *   diretores: [{ nome, cargo, foto }]
 */
function normalizeFilme(f) {
  return {
    // ─── Identidade ───────────────────────────────────────────────────────
    id:     f.id_filme,
    titulo: f.titulo,
    ano:    f.ano,
    flag:   f.flag,

    // ─── Mídia ────────────────────────────────────────────────────────────
    poster:    f.poster   || '',
    poster_bg: f.banner   || '',
    trailer:   f.trailer  || '',
    sinopse:   f.sinopse  || '',

    // ─── Classificação e estilo ───────────────────────────────────────────
    classificacao: f.classificacao || 'Livre',
    estilo_visual: f.estilo_visual ? [f.estilo_visual] : [],
    era:           f.era || null,
    saga:          f.saga || null,

    // ─── Listas como strings (o frontend filtra/exibe por string) ─────────
    categorias: (f.categorias || []).map(c => c.nome ?? c),
    linguagens: (f.linguagens || []).map(l => l.nome ?? l),
    paises:     (f.paises     || []).map(p => p.nome ?? p),

    // ─── Produtora principal ──────────────────────────────────────────────
    // FilmeOut tem 'produtoras' (lista) e 'pais_origem' (objeto)
    produtora_principal: (() => {
      // Tenta pegar do campo direto ou do primeiro da lista
      if (f.produtora_principal) return { nome: f.produtora_principal.nome }
      if (f.produtoras && f.produtoras.length > 0) return { nome: f.produtoras[0].nome }
      return null
    })(),

    // ─── Elenco (o frontend usa 'elenco', o backend retorna 'atores') ─────
    elenco: (f.atores || []).map(a => ({
      nome:       `${a.nome} ${a.sobrenome || ''}`.trim(),
      personagem: a.nome_personagem || '',
      foto:       a.img || '',
    })),

    // ─── Diretores ────────────────────────────────────────────────────────
    diretores: (f.diretores || []).map(d => ({
      nome:  `${d.nome} ${d.sobrenome || ''}`.trim(),
      cargo: 'Diretor',
      foto:  d.img || '',
    })),

    // ─── IDs para formulários de edição ───────────────────────────────────
    _ids: {
      id_filme:          f.id_filme,
      id_pais_origem:    f.pais_origem?.id_pais ?? null,
      ids_categorias:    (f.categorias  || []).map(c => c.id_categoria),
      ids_paises:        (f.paises      || []).map(p => p.id_pais),
      ids_linguagens:    (f.linguagens  || []).map(l => l.id_linguagem),
      ids_diretores:     (f.diretores   || []).map(d => d.id_diretor),
      ids_atores:        (f.atores      || []).map(a => a.id_ator),
      ids_produtoras:    (f.produtoras  || []).map(p => p.id_produtora),
    },
  }
}

// ─── Destaques da home ────────────────────────────────────────────────────────
// O endpoint /home/destaques retorna [{ id, ordem, filme: FilmeListOut }]
// Precisamos extrair só o filme de cada destaque
function normalizeDestaques(destaques) {
  return (destaques || [])
    .sort((a, b) => a.ordem - b.ordem)
    .map(d => normalizeFilme(d.filme))
}

export function FilmesProvider({ children }) {
  const [filmes, setFilmes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchFilmes = useCallback(async (params = {}) => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiGetFilmes({ limit: 100, ...params })
      console.log('[FilmesContext] raw data[0]:', data[0])
      const normalized = data.map(normalizeFilme)
      console.log('[FilmesContext] normalized[0]:', normalized[0])
      setFilmes(normalized)
    } catch (err) {
      setError(err.message)
      setFilmes([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchFilmes() }, [fetchFilmes])

  async function getFilmeDetalhes(id) {
    const data = await apiGetFilme(id)
    return normalizeFilme(data)
  }

  async function getPendentes() {
    const data = await apiGetPendentes()
    return data.map(normalizeFilme)
  }

  async function addFilme(formData) {
    const created = await apiCreateFilme(formData)
    return normalizeFilme(created)
  }

  async function updateFilme(id, formData) {
    const updated = await apiUpdateFilme(id, formData)
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

  return (
    <FilmesContext.Provider value={{
      filmes, loading, error,
      fetchFilmes,
      getFilmeDetalhes,
      getPendentes,
      addFilme,
      updateFilme,
      deleteFilme,
      aprovarFilme,
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
