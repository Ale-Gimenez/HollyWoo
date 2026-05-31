/**
 * components/shared/Navbar.jsx
 * Barra de navegação responsiva. Exibe menus diferentes para
 * visitante, usuário logado e administrador.
 */

import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import ModalInfoUsuario from '../usuario/ModalInfoUsuario'
import './Navbar.css'

export default function Navbar() {
  const { user, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [showInfo, setShowInfo] = useState(false)

  /* links dependem do papel */
  const links = user
    ? isAdmin
      ? [
          { to: '/home',       label: 'Home' },
          { to: '/catalogo',   label: 'Catálogo' },
          { to: '/adicionar',  label: 'Adicionar Filme' },
          { to: '/sugestoes',  label: 'Sugestões' },
        ]
      : [
          { to: '/home',       label: 'Home' },
          { to: '/catalogo',   label: 'Catálogo' },
          { to: '/favoritos',  label: 'Favoritos' },
        ]
    : [
        { to: '/',         label: 'Home' },
        { to: '/catalogo', label: 'Catálogo' },
        { to: '/favoritos',label: 'Favoritos' },
      ]

  function handleInterception(e, to) {
    if (!user) {
      e.preventDefault()
      navigate('/login')
    }
  }

  return (
    <>
      <header className="navbar">
        <div className="container navbar__inner">
          {/* Logo */}
          <NavLink to={user ? '/home' : '/'} className="navbar__logo">
            <span className="navbar__logo-icon" aria-hidden="true">🎬</span>
            <span>
              <strong>Holly</strong>Woo
            </span>
          </NavLink>

          {/* Nav links */}
          <nav className="navbar__nav" aria-label="Menu principal">
            <ul>
              {links.map(({ to, label }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    className={({ isActive }) =>
                      'navbar__link' + (isActive ? ' navbar__link--active' : '')
                    }
                    onClick={(e) => handleInterception(e, to)}
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Lado direito */}
          <div className="navbar__right">
            {user ? (
              <button
                className="navbar__avatar"
                onClick={() => setShowInfo(true)}
                aria-label="Informações do usuário"
                title={user.nome}
              >
                {user.imagem
                  ? <img src={user.imagem} alt={user.nome} />
                  : <span>{user.nome?.[0]?.toUpperCase()}</span>
                }
              </button>
            ) : (
              <NavLink to="/login" className="btn btn--ghost btn--sm">Entrar</NavLink>
            )}
          </div>
        </div>
      </header>

      {showInfo && (
        <ModalInfoUsuario onClose={() => setShowInfo(false)} />
      )}
    </>
  )
}
