import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { type Ala, estrelasTexto, regrasPraticas } from "../data/alas";
import { linksInstitucionais } from "../data/premio-moliere";

interface AlaModalProps {
  ala: Ala | null;
  eventoId: string;
  aoFechar: () => void;
}

/** Janela de cada ala: experiência, dados do Theatro, regras práticas e CTA para o mapa filtrado. */
export function AlaModal({ ala, eventoId, aoFechar }: AlaModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (ala && !dialog.open) dialog.showModal();
    if (!ala && dialog.open) dialog.close();
  }, [ala]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const onClose = () => aoFechar();
    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, [aoFechar]);

  if (!ala) return <dialog ref={ref} className="ala-modal" />;

  const destinoMapa = `/ingressos/${eventoId}?setor=${ala.id}`;

  return (
    <dialog ref={ref} className="ala-modal" aria-labelledby="ala-modal-titulo" onClick={(e) => { if (e.target === e.currentTarget) aoFechar(); }}>
      <article className="ala-modal__card">
        <button type="button" className="ala-modal__close" aria-label="Fechar" onClick={aoFechar}>×</button>

        <header className="ala-modal__head">
          <img src="/brand/les-molieres-logo.png" alt="" className="ala-modal__crest" />
          <span className="dj-eyebrow dj-eyebrow--gold">{ala.pavimento}</span>
          <h2 id="ala-modal-titulo">{ala.nome}</h2>
          <p className="ala-modal__exp">Experiência: <em>{ala.experiencia}</em></p>
          <div className="ala-modal__facts">
            <span><b>{ala.capacidade}</b> lugares</span>
            <span>{ala.capacidadeNota}</span>
            <span className={`ala-badge ala-badge--${ala.modo}`}>{ala.modoLabel}</span>
          </div>
        </header>

        <div className="ala-modal__body">
          {ala.resumo.map((p) => <p key={p} className="ala-modal__p">{p}</p>)}

          {ala.dadosReais && (
            <section className="ala-modal__section">
              <h3>Na sala do Theatro Municipal</h3>
              <dl className="ala-dl">{ala.dadosReais.map((d) => <div key={d.titulo}><dt>{d.titulo}</dt><dd>{d.texto}</dd></div>)}</dl>
            </section>
          )}

          {ala.porqueEscolher && (
            <section className="ala-modal__section">
              <h3>Por que escolher {ala.nomeCurto === "Frisas" ? "a Frisa" : ala.nomeCurto}?</h3>
              <dl className="ala-dl">{ala.porqueEscolher.map((d) => <div key={d.titulo}><dt>{d.titulo}</dt><dd>{d.texto}</dd></div>)}</dl>
            </section>
          )}

          {ala.disposicao && (
            <section className="ala-modal__section">
              <h3>Disposição dos assentos &amp; visibilidade</h3>
              <dl className="ala-dl">{ala.disposicao.map((d) => <div key={d.titulo}><dt>{d.titulo}</dt><dd>{d.texto}</dd></div>)}</dl>
            </section>
          )}

          {ala.publico && (
            <section className="ala-modal__section">
              <h3>{ala.publico.titulo}</h3>
              <ul className="ala-tags">{ala.publico.itens.map((i) => <li key={i}>{i}</li>)}</ul>
            </section>
          )}

          <section className="ala-modal__rating">
            <div><span>Qualidade da experiência</span><strong aria-label={`${ala.estrelas} de 5`}>{estrelasTexto(ala.estrelas)}</strong></div>
            <div><span>Perfil</span><strong>{ala.perfil}</strong></div>
            <div><span>Experiência</span><strong>{ala.experienciaTag}</strong></div>
          </section>

          <div className="ala-modal__cta">
            <button type="button" className="dj-btn dj-btn--gold dj-btn--lg" onClick={() => { aoFechar(); navigate(destinoMapa); }}>
              {ala.cta} <span aria-hidden="true">→</span>
            </button>
            {ala.transporteGratuito && (
              <a className="dj-btn dj-btn--dark" href={`mailto:${linksInstitucionais.email}?subject=${encodeURIComponent("Transporte gratuito · Gala Prêmio Molière · " + ala.nome)}`}>
                Agendar transporte gratuito
              </a>
            )}
          </div>

          <section className="ala-modal__section ala-modal__rules">
            <h3>⚠️ Regras práticas e cuidados básicos</h3>
            <dl className="ala-dl">{regrasPraticas.map((r) => <div key={r.titulo}><dt>{r.titulo}</dt><dd>{r.texto}</dd></div>)}</dl>
            {ala.transporteGratuito && <p className="ala-modal__p ala-modal__p--small">Convidados deste setor podem agendar transporte gratuito para o evento com a equipe de logística.</p>}
          </section>

          {ala.rodape && <p className="ala-modal__foot">{ala.rodape}</p>}
        </div>
      </article>
    </dialog>
  );
}
