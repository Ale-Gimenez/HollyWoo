import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import PopupInfoUsuario from './PopupInfoUsuario'
import '../styles/Header.css'

function Logo() {
  return (
    <img src="/logoprin.png" alt="HollyWoo" width="36" height="36" className="logo-img" />
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
              <i className="fi fi-sr-home icon-inline"></i>
              Home
            </Link>
            <Link to="/catalogo" className={isActive('/catalogo') ? 'active' : ''}>
              <i className="fi fi-sr-film icon-inline"></i>
              Catálogo
            </Link>
            {isAdmin && (
              <Link to="/adicionar" className={isActive('/adicionar') ? 'active' : ''}>
                <i className="fi fi-sr-square-plus icon-inline"></i>
                Adicionar Filme
              </Link>
            )}
            {isAdmin && (
              <Link to="/sugestoes" className={isActive('/sugestoes') ? 'active' : ''}>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="svg-inline"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>
                Sugestões
              </Link>
            )}
            {isLoggedIn && !isAdmin && (
              <Link to="/favoritos" className={isActive('/favoritos') ? 'active' : ''}>
                <i className="fi fi-sr-heart icon-inline"></i>
                Favoritos
              </Link>
            )}
          </nav>

          <div className="header-actions">
            {!isLoggedIn ? (
              <button className="btn-entrar" onClick={() => navigate('/login')}>
                <i className="fi fi-sr-sign-in-alt icon-inline"></i>
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