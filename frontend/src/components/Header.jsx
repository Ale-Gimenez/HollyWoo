import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import PopupInfoUsuario from './PopupInfoUsuario'
import '../styles/Header.css'

function Logo() {
  return (
    <img src="/logoprin.png" alt="HollyWoo" width="36" height="36" style={{ objectFit: 'contain' }} />
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
              <i className="fi fi-sr-home" style={{ marginRight: 6, verticalAlign: 'middle' }}></i>
              Home
            </Link>
            <Link to="/catalogo" className={isActive('/catalogo') ? 'active' : ''}>
              <i className="fi fi-sr-film" style={{ marginRight: 6, verticalAlign: 'middle' }}></i>
              Catálogo
            </Link>
            {isAdmin && (
              <Link to="/adicionar" className={isActive('/adicionar') ? 'active' : ''}>
                <i className="fi fi-sr-square-plus" style={{ marginRight: 6, verticalAlign: 'middle' }}></i>
                Adicionar Filme
              </Link>
            )}
            {isAdmin && (
              <Link to="/sugestoes" className={isActive('/sugestoes') ? 'active' : ''}>
                <i className="fi fi-sr-bell" style={{ marginRight: 6, verticalAlign: 'middle' }}></i>
                Sugestões
              </Link>
            )}
            {isLoggedIn && !isAdmin && (
              <Link to="/favoritos" className={isActive('/favoritos') ? 'active' : ''}>
                <i className="fi fi-sr-heart" style={{ marginRight: 6, verticalAlign: 'middle' }}></i>
                Favoritos
              </Link>
            )}
          </nav>

          <div className="header-actions">
            {!isLoggedIn ? (
              <button className="btn-entrar" onClick={() => navigate('/login')}>
                <i className="fi fi-sr-sign-in-alt" style={{ marginRight: 6, verticalAlign: 'middle' }}></i>
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
