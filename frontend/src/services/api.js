/**
 * services/api.js
 * Camada de comunicação com a Filminis API (FastAPI).
 * Toda requisição autenticada injeta o Bearer token automaticamente.
 */

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

/* ── helpers ─────────────────────────────────────────────────────────────── */

function getToken() {
  return localStorage.getItem('access_token')
}

function authHeaders() {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
      ...(options.headers ?? {}),
    },
  })

  if (!res.ok) {
    let msg = `Erro ${res.status}`
    try {
      const data = await res.json()
      msg = data.detail ?? msg
    } catch { /* ignora parse error */ }
    const err = new Error(msg)
    err.status = res.status
    throw err
  }

  // 204 No Content
  if (res.status === 204) return null
  return res.json()
}

/* ── Auth ────────────────────────────────────────────────────────────────── */

export const authService = {
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login:    (body) => request('/auth/login',    { method: 'POST', body: JSON.stringify(body) }),
  refresh:  (refreshToken) =>
    request('/auth/refresh', { method: 'POST', body: JSON.stringify({ refresh_token: refreshToken }) }),
  logout: (refreshToken) =>
    request('/auth/logout', { method: 'POST', body: JSON.stringify({ refresh_token: refreshToken }) }),
}

/* ── Usuários ─────────────────────────────────────────────────────────────── */

export const usuarioService = {
  me:         ()     => request('/usuarios/me'),
  updateMe:   (body) => request('/usuarios/me', { method: 'PATCH', body: JSON.stringify(body) }),
  listar:     ()     => request('/usuarios'),
  alterarRole:(id, role) =>
    request(`/usuarios/${id}/role`, { method: 'PATCH', body: JSON.stringify({ role }) }),
  deletar:    (id)   => request(`/usuarios/${id}`, { method: 'DELETE' }),
}

/* ── Filmes ───────────────────────────────────────────────────────────────── */

export const filmeService = {
  listar: (params = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v != null))
    ).toString()
    return request(`/filmes${qs ? '?' + qs : ''}`)
  },
  pendentes:  ()     => request('/filmes/pendentes'),
  detalhe:    (id)   => request(`/filmes/${id}`),
  criar:      (body) => request('/filmes',       { method: 'POST',   body: JSON.stringify(body) }),
  editar:     (id, body) => request(`/filmes/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  aprovar:    (id)   => request(`/filmes/${id}/aprovar`, { method: 'PUT' }),
  deletar:    (id)   => request(`/filmes/${id}`, { method: 'DELETE' }),
}

/* ── Favoritos ────────────────────────────────────────────────────────────── */

export const favoritoService = {
  listar:    ()    => request('/favoritos'),
  adicionar: (id)  => request(`/favoritos/${id}`,           { method: 'POST' }),
  remover:   (id)  => request(`/favoritos/${id}`,           { method: 'DELETE' }),
  verificar: (id)  => request(`/favoritos/verificar/${id}`),
}

/* ── Dados auxiliares ─────────────────────────────────────────────────────── */

export const dadosService = {
  paises:    () => request('/dados/paises'),
  categorias:() => request('/dados/categorias'),
  linguagens:() => request('/dados/linguagens'),
  produtoras:() => request('/dados/produtoras'),
  atores:    () => request('/dados/atores'),
  diretores: () => request('/dados/diretores'),
  sagas:     () => request('/dados/sagas'),
  criarSaga: (body) => request('/dados/sagas', { method: 'POST',  body: JSON.stringify(body) }),
  editarSaga:(id, body) => request(`/dados/sagas/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deletarSaga:(id) => request(`/dados/sagas/${id}`, { method: 'DELETE' }),
}

/* ── Home / Destaques ─────────────────────────────────────────────────────── */

export const homeService = {
  destaques:    ()           => request('/home/destaques'),
  setDestaques: (ids_filmes) =>
    request('/home/destaques', { method: 'PUT', body: JSON.stringify({ ids_filmes }) }),
}
