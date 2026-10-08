import { Link } from "react-router-dom";
import { AlasGrid } from "../components/AlasGrid";
import { eventos, formatData, rotuloPrecoIngresso } from "../data/eventos";

export function IngressosPage() {
  return (
    <article className="dj-page">
      <header className="dj-page__head dj-section--black">
        <div className="dj-shell dj-page__head-inner dj-page__head-inner--center">
          <img src="/brand/les-molieres-logo.png" alt="Les Molières" className="dj-page__crest" />
          <span className="dj-eyebrow dj-eyebrow--gold">Ingressos · Prêmio Molière 2027</span>
          <h1 className="dj-h1">Escolha sua noite de gala</h1>
          <p className="dj-lead dj-lead--light">
            Conheça cada ala do Theatro Municipal, abra a janela do setor e escolha seus lugares apenas naquela categoria.
          </p>
        </div>
      </header>

      <section className="dj-section dj-section--paper">
        <div className="dj-shell">
          <div className="dj-rule-title"><span>Prêmio Molière · as alas do Theatro</span></div>
          <AlasGrid eventoId={eventos[0].id} />
          <p className="dj-note">
            Clique em uma ala para ver a experiência, a posição na sala, as regras práticas e seguir para o mapa de lugares
            somente daquele setor. Lugares já alocados a convidados aparecem como reservados.
          </p>
        </div>
      </section>

      <section className="dj-section dj-section--paper dj-section--tight">
        <div className="dj-shell">
          <div className="dj-rule-title"><span>Sessões da gala</span></div>
          <div className="dj-events">
            {eventos.map((evento) => (
              <article className="dj-event" key={evento.id}>
                <div className="dj-event__date">
                  <strong>{formatData(evento.sessoes[0].data, { day: "2-digit" })}</strong>
                  <span>{formatData(evento.sessoes[0].data, { month: "short" }).replace(".", "").toUpperCase()}</span>
                  <small>{formatData(evento.sessoes[0].data, { year: "numeric" })}</small>
                </div>
                <div className="dj-event__body">
                  <span className="dj-eyebrow">{evento.categoria} · {evento.sessoes.length} sessões</span>
                  <h2>{evento.titulo}</h2>
                  <p>{evento.subtitulo}</p>
                  <div className="dj-event__meta">
                    <span>Plateia · {rotuloPrecoIngresso()}</span>
                    <span>Frisas · {rotuloPrecoIngresso()}</span>
                    <span>Balcão Nobre · {rotuloPrecoIngresso()}</span>
                    <span>{evento.sessoes.map((s) => formatData(s.data, { day: "2-digit", month: "short" }).replace(".", "")).join(" · ")}</span>
                  </div>
                </div>
                <Link to={`/ingressos/${evento.id}`} className="dj-event__action">
                  <span>Escolher lugares</span>
                  <b aria-hidden="true">→</b>
                </Link>
              </article>
            ))}
          </div>
          <p className="dj-note">
            Bilheteria vinculada ao Projeto Cultural Molière · Maison Dijon. Em estruturação — informações sujeitas a
            alteração até validação final com a produção e o Theatro Municipal.
          </p>
        </div>
      </section>
    </article>
  );
}
