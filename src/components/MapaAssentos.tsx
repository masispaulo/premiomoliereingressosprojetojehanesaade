import type { Ref } from "react";
import { assentos, indisponivel, reservadoPrevio } from "../data/assentos";
import { contornoFrisa, FILEIRAS_PLATEIA, layoutsFrisas, yFileira } from "../data/plant-terreo";
import { type Setor, setorLabels } from "../data/eventos";

interface MapaAssentosProps {
  eventoId: string;
  sessaoId: string;
  reservados: string[];
  selecionados: string[];
  aoSelecionar: (id: string) => void;
  svgRef?: Ref<SVGSVGElement>;
  /** Ala escolhida: apenas os lugares deste setor ficam clicáveis; os demais aparecem apagados. */
  filtroSetor?: Setor | null;
}

export function MapaAssentos({ eventoId, sessaoId, reservados, selecionados, aoSelecionar, svgRef, filtroSetor = null }: MapaAssentosProps) {
  return (
    <svg ref={svgRef} className={`mapa-svg${filtroSetor ? ` mapa-svg--filtro-${filtroSetor}` : ""}`} viewBox="0 0 780 745" xmlns="http://www.w3.org/2000/svg" role="group" aria-label={filtroSetor ? `Planta do pavimento térreo — ${setorLabels[filtroSetor]}` : "Planta do pavimento térreo do Theatro Municipal"}>
      <title>Theatro Municipal do Rio — pavimento térreo: plateia, corredores e frisas</title>
      <desc>Palco no alto, plateia dividida em ala par, bloco central e ala ímpar. Frisas nas laterais, separadas pelas saídas. Lugares fora da ala escolhida aparecem apagados; lugares reservados pela produção não recebem clique.</desc>
      <rect x="0" y="0" width="780" height="745" rx="24" fill="#f8f7f2" />
      <g id="setores-da-plateia" stroke="#d6ddd4" strokeWidth="1.5">
        <path d="M175 174 Q210 184 241 186 L240 295 Q204 290 162 274 Z" fill="#f1e2bd" />
        <path d="M255 187 Q390 210 525 187 L527 298 Q390 316 253 298 Z" fill="#f1e2bd" />
        <path d="M539 186 Q570 184 605 174 L618 274 Q576 290 540 295 Z" fill="#f1e2bd" />
        <path d="M159 279 Q201 299 239 301 L238 451 Q200 447 154 428 Z" fill="#d2e5e6" />
        <path d="M257 305 Q390 323 523 305 L523 451 Q390 475 257 451 Z" fill="#d2e5e6" />
        <path d="M541 301 Q579 299 621 279 L626 428 Q580 447 542 451 Z" fill="#d2e5e6" />
        <path d="M155 453 Q202 471 239 473 L247 585 Q211 582 182 560 Z" fill="#d5e5df" />
        <path d="M258 459 Q390 479 522 459 L514 656 Q390 701 266 656 Z" fill="#d5e5df" />
        <path d="M541 473 Q578 471 625 453 L598 560 Q569 582 533 585 Z" fill="#d5e5df" />
      </g>
      <path d="M226 43 Q390 73 554 43 L554 110 Q390 154 226 110 Z" fill="#263c43" />
      <path d="M226 110 Q390 154 554 110" fill="none" stroke="#c69e67" strokeWidth="5" />
      <text x="390" y="108" textAnchor="middle" className="mapa-palco">PALCO</text>
      <text x="390" y="178" textAnchor="middle" className="mapa-zona">PLATEIA TÉRREA</text>
      <text x="108" y="56" textAnchor="middle" className="mapa-lateral">LADO PAR</text>
      <text x="672" y="56" textAnchor="middle" className="mapa-lateral">LADO ÍMPAR</text>
      <text x="104" y="146" textAnchor="middle" className="mapa-lateral">FRISAS</text>
      <text x="676" y="146" textAnchor="middle" className="mapa-lateral">FRISAS</text>
      <path d="M58 157 Q115 144 164 170 L151 384 Q105 377 44 385 Z" fill="#8e455e" opacity=".24" />
      <path d="M616 170 Q665 144 722 157 L736 385 Q675 377 629 384 Z" fill="#8e455e" opacity=".24" />
      <path d="M46 420 Q115 408 152 413 Q156 527 222 668 Q117 656 53 555 Z" fill="#8e455e" opacity=".24" />
      <path d="M628 413 Q665 408 734 420 L727 555 Q663 656 558 668 Q624 527 628 413 Z" fill="#8e455e" opacity=".24" />
      <g id="caixas-frisas">
        {layoutsFrisas().map((box) => (
          <g key={`frisa-box-${box.numero}`}>
            <path d={contornoFrisa(box)} fill={box.faixa === "superior" ? "#e8eaf0" : "#a36678"} stroke="#774458" strokeWidth="1.1" />
            <text x={box.lado === "par" ? box.x + 7 : box.x + box.w - 7} y={box.y + 13} textAnchor={box.lado === "par" ? "start" : "end"} className={`mapa-box-label${box.faixa === "superior" ? "" : " mapa-box-label--lateral"}`}>{String(box.numero).padStart(2, "0")}</text>
          </g>
        ))}
      </g>
      <text x="98" y="402" textAnchor="middle" className="mapa-saida">SAÍDA · RAMPA</text>
      <text x="682" y="402" textAnchor="middle" className="mapa-saida">SAÍDA · ESCADA</text>
      {FILEIRAS_PLATEIA.map((letra, i) => (
        <g key={letra} className="mapa-row-label">
          <text x="249" y={yFileira(i) + 4} textAnchor="middle">{letra}</text>
          <text x="531" y={yFileira(i) + 4} textAnchor="middle">{letra}</text>
        </g>
      ))}
      {assentos.map((assento) => {
        const foraDaAla = filtroSetor !== null && assento.setor !== filtroSetor;
        const previo = reservadoPrevio(assento.id);
        const bloqueado = foraDaAla || indisponivel(eventoId, sessaoId, assento.id, reservados);
        const ativo = selecionados.includes(assento.id);
        const estado = foraDaAla ? ", fora da ala escolhida" : previo ? ", reservado pela produção" : bloqueado ? ", indisponível" : ativo ? ", selecionada" : ", disponível";
        const rotulo = `${setorLabels[assento.setor]}, ${assento.local}, posição ${assento.numero}${estado}. Numeração sujeita à validação da produção.`;
        return (
          <g key={assento.id}
            className={`assento assento--${assento.setor} assento--grupo-${assento.grupo}${bloqueado ? " assento--ocupado" : ""}${previo ? " assento--previo" : ""}${foraDaAla ? " assento--fora" : ""}${ativo ? " assento--selecionado" : ""}`}
            role="button" tabIndex={bloqueado ? -1 : 0} aria-label={rotulo} aria-pressed={ativo} aria-disabled={bloqueado} aria-hidden={foraDaAla || undefined}
            onClick={() => !bloqueado && aoSelecionar(assento.id)}
            onKeyDown={(e) => { if (!bloqueado && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); aoSelecionar(assento.id); } }}
          >
            <title>{rotulo}</title>
            <circle cx={assento.x} cy={assento.y} r={assento.setor === "frisa" ? Number(assento.local.slice(6)) <= 4 ? 6.5 : 7 : assento.bloco === "centro" ? 8.8 : 7.2} />
            <text x={assento.x} y={assento.y + 2.8} textAnchor="middle" aria-hidden="true">{assento.numero}</text>
          </g>
        );
      })}
      <path d="M225 696 Q390 729 555 696" fill="none" stroke="#b4c1bd" strokeWidth="2" />
      <text x="390" y="721" textAnchor="middle" className="mapa-entrada">ENTRADA · PLATEIA TÉRREA</text>
    </svg>
  );
}
