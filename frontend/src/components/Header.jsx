import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import PopupInfoUsuario from './PopupInfoUsuario'
import '../styles/Header.css'

function Logo() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="36" height="36" rx="8" fill="#7833e2"/>
      <ellipse cx="12" cy="20" rx="4" ry="4.5" fill="#fff"/>
      <ellipse cx="24" cy="20" rx="4" ry="4.5" fill="#fff"/>
      <circle cx="12" cy="20" r="2" fill="#1a1a1a"/>
      <circle cx="24" cy="20" r="2" fill="#1a1a1a"/>
      <rect x="6" y="10" width="24" height="5" rx="2" fill="#b693ec"/>
      <rect x="4" y="8" width="5" height="3" rx="1" fill="#fff" transform="rotate(-20 4 8)"/>
      <rect x="27" y="8" width="5" height="3" rx="1" fill="#fff" transform="rotate(20 27 8)"/>
    </svg>
  )
}

export default function Header() {
  const { user, isLoggedIn, isAdmin, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [showInfo, setShowInfo] = useState(false)

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/')

  function handleLogout() {
    logout()
    navigate('/')
    setShowInfo(false)
  }

  return (
    <>
      <header className="header">
        <div className="header-inner">
          <Link to={isLoggedIn ? (isAdmin ? '/home' : '/') : '/'} className="header-logo">
            <Logo />
            <span className="header-logo-text">HollyWoo</span>
          </Link>

          <nav className="header-nav">
            <Link
              to={isLoggedIn ? (isAdmin ? '/home' : '/') : '/'}
              className={isActive('/home') || (location.pathname === '/' && !isAdmin) ? 'active' : ''}
            >
              Home
            </Link>
            <Link to="/catalogo" className={isActive('/catalogo') ? 'active' : ''}>
              Catálogo
            </Link>
            {isAdmin && (
              <Link to="/adicionar" className={isActive('/adicionar') ? 'active' : ''}>
                Adicionar Filme
              </Link>
            )}
            {isAdmin && (
              <Link to="/sugestoes" className={isActive('/sugestoes') ? 'active' : ''}>
                Sugestões
              </Link>
            )}
            {isLoggedIn && !isAdmin && (
              <Link to="/favoritos" className={isActive('/favoritos') ? 'active' : ''}>
                Favoritos
              </Link>
            )}
          </nav>

          <div className="header-actions">
            {!isLoggedIn ? (
              <button className="btn-entrar" onClick={() => navigate('/login')}>
                Entrar
              </button>
            ) : (
              <button
                className="avatar-btn"
                onClick={() => setShowInfo(true)}
                title={user.nome}
              >
                <img src={user.avatar} alt={user.nome} />
              </button>
            )}
          </div>
        </div>
      </header>

      {showInfo && (
        <PopupInfoUsuario onClose={() => setShowInfo(false)} onLogout={handleLogout} />
      )}
    </>
  )
}
