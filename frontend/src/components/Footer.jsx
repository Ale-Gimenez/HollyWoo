import { useAuth } from '../context/AuthContext'
import '../styles/Footer.css'

function Logo() {
  return (
    <img src="/logoprin.png" alt="HollyWoo" width="36" height="36" className="logo-img" />
  )
}

export default function Footer() {
  const { isAdmin } = useAuth()

  if (isAdmin) {
    return (
      <footer className="footer-admin">
        <p>Copyright 2026 – Todos os direitos reservados</p>
      </footer>
    )
  }

  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <div className="logo-wrap">
            <Logo />
            <span className="brand-name">HollyWoo</span>
          </div>
          <span className="slogan">Diversão para os pequenos</span>
        </div>

        <div className="footer-section">
          <h4>Serviços</h4>
          <p>
            <i className="fi fi-sr-phone-call icon-inline"></i>
            800-123-0604
          </p>
          <p>
            <i className="fi fi-sr-envelope icon-inline"></i>
            hollywoo@gmail.com
          </p>
        </div>

        <div className="footer-section">
          <h4>Agradecimentos</h4>
          <p>A todos os usuários amantes de filmes, não seriamos os mesmos sem vocês :)</p>
        </div>
      </div>

      <hr className="footer-divider" />

      <div className="footer-bottom">
        <div className="footer-social">
          <a href="#" aria-label="Facebook">
            <i className="fi fi-brands-facebook"></i>
          </a>
          <a href="#" aria-label="Instagram">
            <i className="fi fi-brands-instagram"></i>
          </a>
          <a href="#" aria-label="WhatsApp">
            <i className="fi fi-brands-whatsapp"></i>
          </a>
          <a href="#" aria-label="Discord">
            <i className="fi fi-brands-discord"></i>
          </a>
        </div>
        <p className="footer-copyright">Copyright 2026 – Todos os direitos reservados</p>
      </div>
    </footer>
  )
}
