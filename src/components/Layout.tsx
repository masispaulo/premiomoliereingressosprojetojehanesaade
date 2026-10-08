import { Link, NavLink, Outlet } from "react-router-dom";
import { linksInstitucionais } from "../data/premio-moliere";

export function Layout() {
  return (
    <div className="site">
      <header className="dj-header">
        <div className="dj-shell dj-header__inner">
          <Link to="/" className="dj-brand" aria-label="Dijon & Molière — início">
            <img src="/brand/dijon-logo.png" alt="Dijon" className="dj-brand__dijon" />
            <span className="dj-brand__amp" aria-hidden="true">&amp;</span>
            <img src="/brand/les-molieres-logo.png" alt="Les Molières" className="dj-brand__molieres" />
          </Link>
          <nav className="dj-nav" aria-label="Navegação principal">
            <NavLink to="/" end>Início</NavLink>
            <NavLink to="/o-premio">O Prêmio</NavLink>
            <NavLink to="/a-gala">A Gala</NavLink>
            <NavLink to="/ingressos">Ingressos</NavLink>
          </nav>
          <div className="dj-header__aside">
            <a className="dj-header__ext" href={linksInstitucionais.premio} target="_blank" rel="noreferrer">
              lesmolieres.com.br
            </a>
            <Link className="dj-btn dj-btn--gold" to="/ingressos">
              Garantir lugar
            </Link>
          </div>
        </div>
      </header>

      <main className="dj-main">
        <Outlet />
      </main>

      <footer className="dj-footer">
        <div className="dj-shell dj-footer__top">
          <div className="dj-footer__brand">
            <img src="/brand/dijon-signature.png" alt="Dijon por Jehane Saade" className="dj-footer__signature" />
            <p className="dj-footer__tag">Realização Geral · Maison Dijon</p>
          </div>
          <blockquote className="dj-footer__quote">
            “O teatro é o espelho da sociedade. A Maison Dijon é a moldura.”
          </blockquote>
          <div className="dj-footer__cols">
            <div>
              <span className="dj-eyebrow">Institucional</span>
              <a href={linksInstitucionais.premio} target="_blank" rel="noreferrer">Prêmio Molière</a>
              <a href={`${linksInstitucionais.dijon}/moliere`} target="_blank" rel="noreferrer">Dijon &amp; Molière</a>
              <a href={linksInstitucionais.dijon} target="_blank" rel="noreferrer">Portal Dijon</a>
            </div>
            <div>
              <span className="dj-eyebrow">Contato</span>
              <a href={`mailto:${linksInstitucionais.email}`}>{linksInstitucionais.email}</a>
              <span className="dj-footer__muted">Jehane Saade · Direção Geral</span>
              <span className="dj-footer__muted">Celso Finkler · Marketing</span>
            </div>
          </div>
        </div>
        <div className="dj-shell dj-footer__bottom">
          <img src="/brand/logo-premio-moliere.png" alt="Prêmio Molière — Projeto Cultural 2026/2027 — Consórcio Molière" className="dj-footer__seal" />
          <div className="dj-footer__legal">
            <span>Theatro Municipal do Rio de Janeiro · Praça Floriano, Centro · Cerimônia prevista para 2027</span>
            <span>Bilheteria em estruturação — valores, datas e mapa sujeitos à validação final da produção.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
