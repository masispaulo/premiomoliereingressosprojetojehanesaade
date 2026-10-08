import { Link } from "react-router-dom";
import { eventos, formatData, formatMoeda } from "../data/eventos";
import { categoriasCompetitivas, momentosGala } from "../data/premio-moliere";

export function HomePage() {
  const gala = eventos[0];
  const sessao = gala.sessoes[0];

  return (
    <>
      <section className="dj-hero">
        <img src="/brand/theatro-hero.jpg" alt="" className="dj-hero__bg" aria-hidden="true" />
        <div className="dj-hero__veil" aria-hidden="true" />
        <div className="dj-shell dj-hero__content">
          <img src="/brand/les-molieres-logo.png" alt="Les Molières" className="dj-hero__crest" />
          <h1 className="dj-hero__title">Dijon &amp; Molière</h1>
          <p className="dj-hero__sub">Prêmio Molière – Projeto Cultural 2026/2027</p>
          <p className="dj-hero__lead">
            Noite de gala no Theatro Municipal do Rio de Janeiro ·{" "}
            {formatData(sessao.data, { day: "numeric", month: "long", year: "numeric" })} · {sessao.horario}
          </p>
          <div className="dj-hero__actions">
            <Link to={`/ingressos/${gala.id}`} className="dj-btn dj-btn--gold dj-btn--lg">
              Escolher meu lugar
            </Link>
            <Link to="/a-gala" className="dj-btn dj-btn--ghost dj-btn--lg">
              Conhecer a noite
            </Link>
          </div>
          <span className="dj-hero__foot">Consórcio Molière — Patrimônio Cultural e Artes Cênicas</span>
        </div>
      </section>

      <section className="dj-section dj-section--paper">
        <div className="dj-shell">
          <div className="dj-rule-title">
            <span>Sobre o Prêmio</span>
          </div>
          <div className="dj-pillars">
            <article className="dj-pillar">
              <WreathIcon />
              <h3>Cultura &amp; Tradição</h3>
              <p>Desde 1963, a maior honraria do teatro nacional. Consagrou Fernanda Montenegro, Antônio Fagundes, Nathalia Timberg e Antunes Filho.</p>
            </article>
            <article className="dj-pillar">
              <HandsIcon />
              <h3>Consórcio Molière</h3>
              <p>União entre DIJON e LES MOLIÈRES para fomentar o teatro, a moda e as artes no Brasil, com chancela do Consulado Geral da França.</p>
            </article>
            <article className="dj-pillar">
              <MedalIcon />
              <h3>Premiação 2027</h3>
              <p>{categoriasCompetitivas.length} categorias competitivas, nova estatueta e homenagem aos Grandes Consagrados no Theatro Municipal.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="dj-section dj-section--black">
        <div className="dj-shell dj-split">
          <figure className="dj-split__media">
            <img src="/brand/theatro-interior.jpg" alt="Interior do Theatro Municipal com plateia e camarotes dourados" />
          </figure>
          <div className="dj-split__copy">
            <span className="dj-eyebrow dj-eyebrow--gold">Bilheteria oficial</span>
            <h2 className="dj-h2">{gala.titulo}</h2>
            <p className="dj-text">{gala.descricao}</p>
            <ul className="dj-price-list">
              <li><span>Plateia</span><strong>a partir de {formatMoeda(gala.precos.plateia)}</strong></li>
              <li><span>Frisas</span><strong>a partir de {formatMoeda(gala.precos.frisa)}</strong></li>
            </ul>
            <Link to={`/ingressos/${gala.id}`} className="dj-btn dj-btn--gold">
              Ver mapa de lugares
            </Link>
          </div>
        </div>
      </section>

      <section className="dj-section dj-section--paper">
        <div className="dj-shell">
          <div className="dj-rule-title">
            <span>A noite de gala</span>
          </div>
          <ol className="dj-moments">
            {momentosGala.map((m, i) => (
              <li key={m.titulo} className="dj-moment">
                <span className="dj-moment__num">{String(i + 1).padStart(2, "0")}</span>
                <h3>{m.titulo}</h3>
                <p>{m.texto}</p>
              </li>
            ))}
          </ol>
          <p className="dj-note">Programação sujeita a confirmação.</p>
        </div>
      </section>

      <section className="dj-section dj-section--black dj-section--tight">
        <div className="dj-shell dj-partners">
          <img src="/brand/dijon-logo.png" alt="Dijon" />
          <span className="dj-partners__x" aria-hidden="true">×</span>
          <img src="/brand/les-molieres-logo.png" alt="Les Molières" />
          <span className="dj-partners__x" aria-hidden="true">×</span>
          <img src="/brand/logo-premio-moliere.png" alt="Consórcio Molière — Projeto Cultural 2026/2027" className="dj-partners__seal" />
        </div>
      </section>
    </>
  );
}

function WreathIcon() {
  return (
    <svg viewBox="0 0 48 48" width="44" height="44" fill="currentColor" aria-hidden="true" className="dj-pillar__icon">
      <g id="wb">
        {[
          [17.4, 40.6, 165, 1], [17.4, 40.6, 241, 1], [13.9, 38.6, 179, 0.98], [13.9, 38.6, 255, 0.98],
          [10.9, 35.9, 192, 0.96], [10.9, 35.9, 268, 0.96], [8.7, 32.5, 206, 0.94], [8.7, 32.5, 282, 0.94],
          [7.4, 28.7, 219, 0.92], [7.4, 28.7, 295, 0.92], [7.0, 24.7, 233, 0.9], [7.0, 24.7, 309, 0.9],
          [7.5, 20.7, 247, 0.88], [7.5, 20.7, 323, 0.88], [9.0, 17.0, 260, 0.86], [9.0, 17.0, 336, 0.86],
          [11.3, 13.7, 274, 0.84], [11.3, 13.7, 350, 0.84], [14.3, 11.0, 325, 0.82],
        ].map(([x, y, r, s], i) => (
          <path key={i} d="M0 0Q4-3 8 0Q4 3 0 0Z" transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} />
        ))}
      </g>
      <use href="#wb" transform="translate(48 0) scale(-1 1)" />
    </svg>
  );
}

function HandsIcon() {
  return (
    <svg viewBox="0 0 48 48" width="44" height="44" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="dj-pillar__icon">
      <path d="M17.5 15 24 8.5l6.5 6.5Z" />
      <path d="M18.5 15v17M29.5 15v17M18.5 15h11M21.5 32v-6.5a2.5 2.5 0 0 1 5 0V32" />
      <g id="hd">
        <path d="M4.5 31V23.5a1.5 1.5 0 0 1 3 0V29" />
        <path d="M7.5 28V20.5a1.5 1.5 0 0 1 3 0V28" />
        <path d="M10.5 28V22.5a1.5 1.5 0 0 1 3 0V30" />
        <path d="M4.5 31c0 3.4 1.6 6 4.8 8.4l4.7 3.6" />
        <path d="M13.5 30c.6 2.8 2.2 4.6 4.5 6 .9.5 1.6-.3 1.2-1.1-.4-.8-1.4-1.4-2.2-1.9" />
      </g>
      <use href="#hd" transform="translate(48 0) scale(-1 1)" />
    </svg>
  );
}

function MedalIcon() {
  return (
    <svg viewBox="0 0 48 48" width="44" height="44" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="dj-pillar__icon">
      <path d="M24.0 6.9A2.9 2.9 0 0 1 28.6 7.9A2.9 2.9 0 0 1 32.3 10.9A2.9 2.9 0 0 1 34.3 15.1A2.9 2.9 0 0 1 34.3 19.9A2.9 2.9 0 0 1 32.3 24.1A2.9 2.9 0 0 1 28.6 27.1A2.9 2.9 0 0 1 24.0 28.1A2.9 2.9 0 0 1 19.4 27.1A2.9 2.9 0 0 1 15.7 24.1A2.9 2.9 0 0 1 13.7 19.9A2.9 2.9 0 0 1 13.7 15.1A2.9 2.9 0 0 1 15.7 10.9A2.9 2.9 0 0 1 19.4 7.9A2.9 2.9 0 0 1 24.0 6.9Z" />
      <circle cx="24" cy="17.5" r="6.6" />
      <g id="rb"><path d="M19.4 27.8 15 40.2l4.2-2.6 3.1 3.9.6-13.7" /></g>
      <use href="#rb" transform="translate(48 0) scale(-1 1)" />
    </svg>
  );
}
