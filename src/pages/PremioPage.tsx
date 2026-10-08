import { Link } from "react-router-dom";
import { categoriasCompetitivas, marcosHistoricos } from "../data/premio-moliere";

export function PremioPage() {
  return (
    <article className="dj-page">
      <header className="dj-page__head dj-section--black">
        <div className="dj-shell dj-page__head-inner">
          <img src="/brand/estatueta-busto.png" alt="Estatueta do Prêmio Molière" className="dj-page__bust" />
          <div>
            <span className="dj-eyebrow dj-eyebrow--gold">Legado · Prêmio</span>
            <h1 className="dj-h1">Prêmio Molière</h1>
            <p className="dj-lead dj-lead--light">
              Criado em 1963 sob o patrocínio da Air France, premiou três décadas de arte cênica até 1994. Em 2027
              retorna ao Theatro Municipal com direitos recuperados junto à Fundação Molière (Paris) e realização da
              Maison Dijon.
            </p>
          </div>
        </div>
      </header>

      <section className="dj-section dj-section--paper">
        <div className="dj-shell dj-page__body">
          <div className="dj-block">
            <h2 className="dj-h2 dj-h2--dark">Marcos</h2>
            <ul className="dj-timeline">
              {marcosHistoricos.map((m) => (
                <li key={m.ano}>
                  <strong>{m.ano}</strong>
                  <span>{m.texto}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="dj-block">
            <h2 className="dj-h2 dj-h2--dark">11 categorias competitivas</h2>
            <p className="dj-text dj-text--muted">Nomes revelados somente na noite — o suspense institucional da premiação.</p>
            <ol className="dj-categories">
              {categoriasCompetitivas.map((nome, i) => (
                <li key={nome}>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  {nome}
                </li>
              ))}
            </ol>
          </div>

          <div className="dj-block">
            <h2 className="dj-h2 dj-h2--dark">Os Grandes Consagrados</h2>
            <p className="dj-text">
              Homenagem central a quem construiu o teatro brasileiro: Fernanda Montenegro, Antônio Fagundes, Laura
              Cardoso, Lima Duarte, Juca de Oliveira, Nathalia Timberg, Renato Borghi, Zé Celso e Antunes Filho{" "}
              <em>(in memoriam)</em>. Participação sujeita a confirmação.
            </p>
          </div>

          <div className="dj-block">
            <h2 className="dj-h2 dj-h2--dark">A nova estatueta</h2>
            <p className="dj-text">
              O molde original desapareceu. Para o relançamento, uma nova estatueta foi criada por artista plástico
              brasileiro, em diálogo com a tradição francesa e a memória do prêmio.
            </p>
          </div>

          <div className="dj-cta-row">
            <Link to="/a-gala" className="dj-btn dj-btn--dark">A noite de gala</Link>
            <Link to="/ingressos" className="dj-btn dj-btn--gold">Ingressos</Link>
          </div>
        </div>
      </section>
    </article>
  );
}
