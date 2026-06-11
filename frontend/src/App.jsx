import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { FilmesProvider } from './context/FilmesContext'
import Header from './components/Header'
import Footer from './components/Footer'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import CadastroPage from './pages/CadastroPage'
import CatalogoPage from './pages/CatalogoPage'
import DetalhesPage from './pages/DetalhesPage'
import FavoritosPage from './pages/FavoritosPage'
import HomeAdminPage from './pages/HomeAdminPage'
import AdicionarFilmePage from './pages/AdicionarFilmePage'
import SugestoesPage from './pages/SugestoesPage'
import SolicitarAdicaoPage from './pages/SolicitarAdicaoPage'
import DiagnosticoPage from './pages/DiagnosticoPage'
import './index.css'

function PrivateRoute({ children, adminOnly = false }) {
  const { isLoggedIn, isAdmin, loadingAuth } = useAuth()
  if (loadingAuth) return null
  if (!isLoggedIn) return <Navigate to="/login" replace />
  if (adminOnly && !isAdmin) return <Navigate to="/" replace />
  return children
}

function AppRoutes() {
  const { isAdmin, isLoggedIn, loadingAuth } = useAuth()

  if (loadingAuth) {
    return (
      <div className="loading-center">
        <div className="spinner" />
      </div>
    )
  }

  return (
    <div className="page-wrapper">
      <Header />
      <main className="main-content">
        <Routes>
          
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cadastro" element={<CadastroPage />} />
          <Route path="/catalogo" element={<CatalogoPage />} />
          <Route path="/detalhes/:id" element={<DetalhesPage />} />

          
          <Route
            path="/"
            element={
              isLoggedIn && isAdmin
                ? <Navigate to="/home" replace />
                : <LandingPage />
            }
          />

          
          <Route path="/home" element={
            <PrivateRoute adminOnly>
              <HomeAdminPage />
            </PrivateRoute>
          } />
          <Route path="/adicionar" element={
            <PrivateRoute adminOnly>
              <AdicionarFilmePage />
            </PrivateRoute>
          } />
          <Route path="/sugestoes" element={
            <PrivateRoute adminOnly>
              <SugestoesPage />
            </PrivateRoute>
          } />

          
          <Route path="/favoritos" element={
            <PrivateRoute>
              <FavoritosPage />
            </PrivateRoute>
          } />
          <Route path="/solicitar-adicao" element={
            <PrivateRoute>
              <SolicitarAdicaoPage />
            </PrivateRoute>
          } />

          
          <Route path="/diagnostico" element={<DiagnosticoPage />} />

          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <FilmesProvider>
          <AppRoutes />
        </FilmesProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
