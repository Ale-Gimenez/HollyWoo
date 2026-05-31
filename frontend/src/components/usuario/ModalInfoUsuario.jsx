/**
 * components/usuario/ModalInfoUsuario.jsx
 * Pop-up branco com informações do usuário logado.
 * Exibido tanto para usr como para adm.
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { usuarioService } from '../../services/api'
import './ModalInfoUsuario.css'

export default function ModalInfoUsuario({ onClose }) {
  const { user, setUser, logout } = useAuth()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [form,    setForm]    = useState({ nome: user?.nome ?? '', apelido: user?.apelido ?? '' })
  const [loading, setLoading] = useState(false)

  async function handleLogout() {
    await logout()
    onClose()
    navigate('/')
  }

  async function handleSave() {
    setLoading(true)
    try {
      const updated = await usuarioService.updateMe(form)
      setUser(updated)
      setEditing(false)
    } catch { /* silencia — pode adicionar toast */ }
    finally { setLoading(false) }
  }

  const displayDate = (d) => d ? new Date(d).toLocaleDateString('pt-BR') : '—'

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Informações do usuário"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal modal-info">
        <button className="modal__close" onClick={onClose} aria-label="Fechar">✕</button>

        <h2 className="modal__title">Informações de Usuário</h2>

        <div className="modal-info__body">
          {/* Avatar */}
          <div className="modal-info__avatar">
            {user?.imagem
              ? <img src={user.imagem} alt={user.nome} />
              : <span>{user?.nome?.[0]?.toUpperCase()}</span>
            }
          </div>

          {/* Dados */}
          <dl className="modal-info__data">
            <div>
              <dt>Nome</dt>
              {editing
                ? <input value={form.nome} onChange={e => setForm(f => ({...f, nome: e.target.value}))} />
                : <dd>{user?.nome} {user?.sobrenome}</dd>
              }
            </div>
            <div>
              <dt>Nome de Usuário</dt>
              {editing
                ? <input value={form.apelido} onChange={e => setForm(f => ({...f, apelido: e.target.value}))} />
                : <dd>{user?.apelido ?? '—'}</dd>
              }
            </div>
            <div><dt>E-mail</dt>       <dd>{user?.email}</dd></div>
            <div><dt>Data de Ingresso</dt><dd>{displayDate(user?.data_criacao)}</dd></div>
          </dl>
        </div>

        {/* Rodapé */}
        <div className="modal-info__footer">
          {editing ? (
            <>
              <button className="btn btn--primary btn--sm" onClick={handleSave} disabled={loading}>
                {loading ? 'Salvando...' : '✔ Salvar'}
              </button>
              <button className="btn btn--ghost btn--sm" onClick={() => setEditing(false)}>Cancelar</button>
            </>
          ) : (
            <>
              <button className="btn btn--primary btn--sm" onClick={() => setEditing(true)}>✏️ Editar</button>
              <button className="btn btn--danger  btn--sm" onClick={handleLogout}>↩ Logout</button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
