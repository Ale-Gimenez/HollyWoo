/**
 * Serviço de API — conecta o frontend ao backend FastAPI via proxy Vite.
 * Todas as chamadas usam o prefixo /api que o Vite redireciona para http://localhost:8000
 */

const BASE = '/api'

// ─── Utilitários ──────────────────────────────────────────────────────────────

function getToken() {
  return localStorage.getItem('access_token')
}

function authHeaders() {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
      ...(options.headers || {}),
    },
    ...options,
  })

  if (!res.ok) {
    let detail = `Erro ${res.status}`
    try {
      const err = await res.json()
      detail = err.detail || detail
    } catch (_) {}
    throw new Error(detail)
  }

  // 204 No Content
  if (res.status === 204) return null
  return res.json()
}

// ─── Auth ──────────────────────────────────────────────────────────────────────

export async function apiLogin(email, senha) {
  const data = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, senha }),
  })
  localStorage.setItem('access_token', data.access_token)
  localStorage.setItem('refresh_token', data.refresh_token)
  return data
}

export async function apiCadastrar(form) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      nome: form.nome,
      sobrenome: form.sobrenome || '',
      apelido: form.username || '',
      email: form.email,
      senha: form.senha,
      data_nascimento: form.dataNascimento || null,
    }),
  })
}

export async function apiLogout() {
  const refresh_token = localStorage.getItem('refresh_token')
  if (refresh_token) {
    try {
      await request('/auth/logout', {
        method: 'POST',
        body: JSON.stringify({ refresh_token }),
      })
    } catch (_) {}
  }
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
}

export async function apiRefreshToken() {
  const refresh_token = localStorage.getItem('refresh_token')
  if (!refresh_token) throw new Error('Sem refresh token')
  const res = await fetch(`${BASE}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token }),
  })
  if (!res.ok) {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    throw new Error('Refresh token inválido ou expirado')
  }
  const data = await res.json()
  localStorage.setItem('access_token', data.access_token)
  localStorage.setItem('refresh_token', data.refresh_token)
  return data
}

// ─── Usuário ──────────────────────────────────────────────────────────────────

export async function apiGetMe() {
  return request('/usuarios/me')
}

export async function apiUpdateMe(data) {
  return request('/usuarios/me', {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export async function apiListUsers() {
  return request('/usuarios')
}

export async function apiDeleteUser(userId) {
  return request(`/usuarios/${userId}`, { method: 'DELETE' })
}

export async function apiUpdateRole(userId, role) {
  return request(`/usuarios/${userId}/role`, {
    method: 'PATCH',
    body: JSON.stringify({ role }),
  })
}

// ─── Filmes ───────────────────────────────────────────────────────────────────

export async function apiGetFilmes(params = {}) {
  const qs = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') qs.append(k, v)
  })
  const query = qs.toString() ? `?${qs}` : ''
  return request(`/filmes${query}`)
}

export async function apiGetFilme(id) {
  return request(`/filmes/${id}`)
}

export async function apiCreateFilme(data) {
  return request('/filmes', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function apiUpdateFilme(id, data) {
  return request(`/filmes/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

export async function apiDeleteFilme(id) {
  return request(`/filmes/${id}`, { method: 'DELETE' })
}

export async function apiAprovarFilme(id) {
  return request(`/filmes/${id}/aprovar`, { method: 'PUT' })
}

export async function apiGetPendentes() {
  return request('/filmes/pendentes')
}

// ─── Dados auxiliares ─────────────────────────────────────────────────────────

export async function apiGetCategorias() {
  return request('/dados/categorias')
}

export async function apiGetPaises() {
  return request('/dados/paises')
}

export async function apiGetLinguagens() {
  return request('/dados/linguagens')
}

export async function apiGetProdutoras() {
  return request('/dados/produtoras')
}

export async function apiGetAtores() {
  return request('/dados/atores')
}

export async function apiGetDiretores() {
  return request('/dados/diretores')
}

export async function apiGetSagas() {
  return request('/dados/sagas')
}

// ─── Destaques da Home ────────────────────────────────────────────────────────

export async function apiGetDestaques() {
  return request('/home/destaques')
}

export async function apiSalvarDestaques(idsFilmes) {
  return request('/home/destaques', {
    method: 'PUT',
    body: JSON.stringify({ ids_filmes: idsFilmes }),
  })
}

// ─── Sugestões de edição ──────────────────────────────────────────────────────

export async function apiCriarSugestao(filmeId, data) {
  return request(`/sugestoes/${filmeId}`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function apiGetSugestoes() {
  return request('/sugestoes')
}

export async function apiGetSugestoesFilme(filmeId) {
  return request(`/sugestoes/${filmeId}`)
}

export async function apiAprovarSugestao(sugId) {
  return request(`/sugestoes/${sugId}/aprovar`, { method: 'PUT' })
}

export async function apiRecusarSugestao(sugId) {
  return request(`/sugestoes/${sugId}`, { method: 'DELETE' })
}
