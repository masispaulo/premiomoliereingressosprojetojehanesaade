import { Link } from "react-router-dom";
import { momentosGala } from "../data/premio-moliere";
import { eventos, formatData } from "../data/eventos";

export function GalaPage() {
  const gala = eventos[0];
  return (
    <article className="dj-page">
      <header className="dj-page__head dj-page__head--photo">
        <img src="/brand/theatro-fachada.jpg" alt="" className="dj-page__photo" aria-hidden="true" />
        <div className="dj-hero__veil" aria-hidden="true" />
        <div className="dj-shell dj-page__head-inner dj-page__head-inner--center">
          <span className="dj-eyebrow dj-eyebrow--gold">A noite · Theatro Municipal</span>
          <h1 className="dj-h1">Cerimônia no coração do Rio</h1>
          <p className="dj-lead dj-lead--light">
            Tapete vermelho na Praça Floriano, plateia do Municipal como testemunha e o brinde Molière unindo palco e
            público. Uma noite redesenhada para unir a dramaturgia brasileira à alta cultura francesa.
          </p>
        </div>
      </header>

      <section className="dj-section dj-section--paper">
        <div className="dj-shell dj-page__body">
          <div className="dj-block">
            <h2 className="dj-h2 dj-h2--dark">Programação</h2>
            <ol className="dj-moments dj-moments--list">
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

          <div className="dj-block dj-block--card">
            <h2 className="dj-h2 dj-h2--dark">Sessões</h2>
            <ul className="dj-sessions">
              {gala.sessoes.map((s) => (
                <li key={s.id}>
                  <strong>{formatData(s.data, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</strong>
                  <span>{s.horario} · Theatro Municipal do Rio de Janeiro · Praça Floriano, Centro</span>
                </li>
              ))}
            </ul>
            <p className="dj-text dj-text--muted">
              Bilheteria desta plataforma referente ao <strong>pavimento térreo</strong> — plateia e frisas.
            </p>
            <Link to={`/ingressos/${gala.id}`} className="dj-btn dj-btn--gold">Escolher meu lugar</Link>
          </div>
        </div>
      </section>
    </article>
  );
}
