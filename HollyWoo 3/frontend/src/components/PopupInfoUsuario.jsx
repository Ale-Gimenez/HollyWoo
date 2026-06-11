import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import '../styles/Pages.css'
import '../styles/Shared.css'

export default function PopupInfoUsuario({ onClose, onLogout }) {
  const { user, updateUser, favoritos } = useAuth()
  const [editando, setEditando] = useState(false)
  const [form, setForm] = useState({ nome: user.nome, email: user.email })

  function handleSave() {
    updateUser(form)
    setEditando(false)
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box popup-info-usuario">
        <div className="popup-info-header">
          <h2 className="popup-info-title">Informações de Usuário</h2>
          <button className="popup-info-close" onClick={onClose} aria-label="Fechar">✕</button>
        </div>

        <div className="popup-info-body">
          <img
            src={user.avatar}
            alt={user.nome}
            className="popup-info-avatar"
            onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.nome)}&background=7833e2&color=fff&size=90` }}
          />

          <div className="popup-info-fields">
            {editando ? (
              <>
                <div className="form-group">
                  <label className="form-label" htmlFor="edit-nome">Nome</label>
                  <input
                    id="edit-nome"
                    className="popup-edit-input"
                    value={form.nome}
                    onChange={e => setForm(p => ({ ...p, nome: e.target.value }))}
                    placeholder="Nome"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="edit-email">E-mail</label>
                  <input
                    id="edit-email"
                    className="popup-edit-input"
                    value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    placeholder="E-mail"
                  />
                </div>
                <button className="btn btn-primary btn-sm" style={{ marginTop: '4px' }} onClick={handleSave}>
                  Salvar
                </button>
              </>
            ) : (
              <>
                <div className="popup-info-field">
                  <span className="popup-info-field-label">Nome:</span>
                  <span className="popup-info-field-value">{user.nome}</span>
                </div>
                <div className="popup-info-field">
                  <span className="popup-info-field-label">Nome de Usuário:</span>
                  <span className="popup-info-field-value">{user.username}</span>
                </div>
                <div className="popup-info-field">
                  <span className="popup-info-field-label">E-mail:</span>
                  <span className="popup-info-field-value">{user.email}</span>
                </div>
                <div className="popup-info-field">
                  <span className="popup-info-field-label">Data de Ingresso:</span>
                  <span className="popup-info-field-value">{user.dataIngresso}</span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="popup-info-stats">
          <span className="popup-info-stat">🎬 {favoritos.length} Filmes Favoritos</span>
          {user.dataNascimento && (
            <span className="popup-info-stat">📅 {user.dataNascimento}</span>
          )}
        </div>

        <div className="popup-info-actions">
          {!editando && (
            <button className="btn btn-edit btn-sm" onClick={() => setEditando(true)}>
              ✏️ Editar
            </button>
          )}
          <button className="btn btn-cancel btn-sm" onClick={onLogout}>
            → Logout
          </button>
        </div>
      </div>
    </div>
  )
}
