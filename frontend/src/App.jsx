import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

import LandingPage     from './pages/LandingPage'
import LoginPage       from './pages/LoginPage'
import CadastroPage    from './pages/CadastroPage'
import HomeUsrPage     from './pages/HomeUsrPage'
import HomeAdmPage     from './pages/HomeAdmPage'
import CatalogoPage    from './pages/CatalogoPage'
import FilmePage       from './pages/FilmePage'
import FavoritosPage   from './pages/FavoritosPage'
import AdicionarPage   from './pages/AdicionarPage'
import SugestoesPage   from './pages/SugestoesPage'

/** Rota que exige login — redireciona para /login se não autenticado */
function PrivateRoute({ children }) {
  const { user, isLoading } = useAuth()
  if (isLoading) return null
  return user ? children : <Navigate to="/login" replace />
}

/** Rota exclusiva de admin */
function AdminRoute({ children }) {
  const { user, isAdmin, isLoading } = useAuth()
  if (isLoading) return null
  if (!user) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/home" replace />
  return children
}

export default function App() {
  const { user, isAdmin } = useAuth()

  return (
    <Routes>
      {/* Públicas */}
      <Route path="/"        element={<LandingPage />} />
      <Route path="/login"   element={<LoginPage />} />
      <Route path="/cadastro" element={<CadastroPage />} />

      {/* Usuário logado */}
      <Route path="/home" element={
        <PrivateRoute>
          {isAdmin ? <HomeAdmPage /> : <HomeUsrPage />}
        </PrivateRoute>
      }/>
      <Route path="/catalogo"      element={<PrivateRoute><CatalogoPage /></PrivateRoute>} />
      <Route path="/filmes/:id"    element={<PrivateRoute><FilmePage /></PrivateRoute>} />
      <Route path="/favoritos"     element={<PrivateRoute><FavoritosPage /></PrivateRoute>} />

      {/* Apenas admin */}
      <Route path="/adicionar"  element={<AdminRoute><AdicionarPage /></AdminRoute>} />
      <Route path="/sugestoes"  element={<AdminRoute><SugestoesPage /></AdminRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
