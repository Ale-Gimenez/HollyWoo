export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <h2><strong>Holly</strong><span>Woo</span></h2>
            <p>Diversão para os Pequenos</p>
          </div>

          <div className="footer__col">
            <h3>Serviços</h3>
            <ul>
              <li>📞 800-123-0604</li>
              <li>✉️ hollywoo@gmail.com</li>
            </ul>
          </div>

          <div className="footer__col">
            <h3>Agradecimentos</h3>
            <ul>
              <li style={{ maxWidth: '200px', whiteSpace: 'normal' }}>
                A todos os usuários amantes de filmes, não seríamos os mesmos sem vocês :)
              </li>
            </ul>
          </div>
        </div>

        <hr className="footer__divider" />

        <div className="footer__bottom">
          <p>Copyright {new Date().getFullYear()} — Todos os direitos reservados</p>
          <nav className="footer__socials" aria-label="Redes sociais">
            <a href="#" aria-label="Facebook">f</a>
            <a href="#" aria-label="Instagram">ig</a>
            <a href="#" aria-label="WhatsApp">w</a>
            <a href="#" aria-label="Discord">d</a>
          </nav>
        </div>
      </div>
    </footer>
  )
}
