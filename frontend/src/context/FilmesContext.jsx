import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
  apiGetFilmes, apiGetFilme, apiCreateFilme,
  apiUpdateFilme, apiDeleteFilme, apiAprovarFilme, apiGetPendentes,
} from '../service/api'

const FilmesContext = createContext(null)

/**
 * Normaliza um filme do backend para o formato esperado pelo frontend.
 * O backend retorna campos como id_filme, categorias como objetos {id_categoria, nome}, etc.
 */
function normalizeFilme(f) {
  return {
    id: f.id_filme,
    titulo: f.titulo,
    ano: f.ano,
    duracao: f.duracao || null,
    orcamento: f.orcamento ?? null,
    poster: f.poster || '',
    poster_bg: f.banner || '',
    sinopse: f.sinopse || '',
    categorias: (f.categorias || []).map(c => c.nome || c),
    classificacao: f.classificacao || 'Livre',
    estilo_visual: f.estilo_visual ? [f.estilo_visual] : [],
    produtora_principal: f.produtora_principal
      ? { nome: f.produtora_principal.nome }
      : null,
    paises: (f.paises || []).map(p => p.nome || p),
    linguagens: (f.linguagens || []).map(l => l.nome || l),
    diretores: (f.diretores || []).map(d => ({
      nome: `${d.nome} ${d.sobrenome || ''}`.trim(),
      foto: d.img || '',
      cargo: 'Diretor',
    })),
    elenco: (f.elenco || []).map(a => ({
      nome: `${a.nome} ${a.sobrenome || ''}`.trim(),
      personagem: a.nome_personagem || '',
      foto: a.img || '',
    })),
    trailer: f.trailer || '',
    saga: f.saga || null,
    classico: f.era === 'classico',
    flag: f.flag,
    era: f.era,
    // IDs para formulários
    _ids: {
      id_filme: f.id_filme,
      ids_categorias: (f.categorias || []).map(c => c.id_categoria),
      ids_paises: (f.paises || []).map(p => p.id_pais),
      ids_linguagens: (f.linguagens || []).map(l => l.id_linguagem),
      ids_diretores: (f.diretores || []).map(d => d.id_diretor),
      ids_atores: (f.elenco || []).map(a => a.id_ator),
      ids_produtoras: (f.produtoras || []).map(p => p.id_produtora),
    },
  }
}

export function FilmesProvider({ children }) {
  const [filmes, setFilmes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchFilmes = useCallback(async (params = {}) => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiGetFilmes({ aprovados: true, limit: 100, ...params })
      setFilmes(data.map(normalizeFilme))
    } catch (err) {
      setError(err.message)
      setFilmes([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchFilmes() }, [fetchFilmes])

  async function addFilme(formData) {
    const created = await apiCreateFilme(formData)
    // Filme criado fica pendente (flag=false), não aparece no catálogo ainda
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
    // Adiciona ao catálogo após aprovação
    setFilmes(prev => {
      const exists = prev.find(f => String(f.id) === String(id))
      return exists
        ? prev.map(f => String(f.id) === String(id) ? norm : f)
        : [...prev, norm]
    })
    return norm
  }

  async function getPendentes() {
    const data = await apiGetPendentes()
    return data.map(normalizeFilme)
  }

  async function getFilmeDetalhes(id) {
    const data = await apiGetFilme(id)
    return normalizeFilme(data)
  }

  return (
    <FilmesContext.Provider value={{
      filmes, loading, error,
      fetchFilmes,
      addFilme, updateFilme, deleteFilme,
      aprovarFilme, getPendentes, getFilmeDetalhes,
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
