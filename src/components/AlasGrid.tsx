import { useState } from "react";
import { type Ala, alas, estrelasTexto } from "../data/alas";
import { AlaModal } from "./AlaModal";

interface AlasGridProps {
  eventoId: string;
}

/** Os cinco setores do briefing (Balcão Nobre · Plateia · Camarotes · Frisas · Balcão Superior). Cada um abre sua janela. */
export function AlasGrid({ eventoId }: AlasGridProps) {
  const [aberta, setAberta] = useState<Ala | null>(null);

  return (
    <>
      <ul className="alas" aria-label="Setores do Theatro Municipal">
        {alas.map((ala, index) => (
          <li key={ala.id}>
            <button type="button" className={`ala-card ala-card--${ala.modo}`} onClick={() => setAberta(ala)} aria-haspopup="dialog">
              <span className="ala-card__index">0{index + 1}</span>
              <span className="ala-card__name">{ala.nome}</span>
              <span className="ala-card__floor">{ala.pavimento}</span>
              <span className="ala-card__meta"><b>{ala.capacidade}</b> lugares · {estrelasTexto(ala.estrelas)}</span>
              <span className="ala-card__exp">{ala.experiencia}</span>
              <span className={`ala-badge ala-badge--${ala.modo}`}>{ala.modoLabel}</span>
              <span className="ala-card__go">Abrir <i aria-hidden="true">→</i></span>
            </button>
          </li>
        ))}
      </ul>
      <AlaModal ala={aberta} eventoId={eventoId} aoFechar={() => setAberta(null)} />
    </>
  );
}
