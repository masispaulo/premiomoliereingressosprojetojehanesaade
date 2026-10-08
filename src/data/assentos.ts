import type { Setor } from "./eventos";
import { assentosReservadosPrevios, setorTotalmenteReservado } from "./reservas-previas";
import {
  type BlocoPlateia,
  FILEIRAS_PLATEIA,
  grupoPlateia,
  layoutsFrisas,
  lugaresNaFrisa,
  numerosDaFileira,
  posicaoFrisa,
  posicaoPlateia,
  validarCapacidade,
} from "./plant-terreo";

export type Assento = {
  id: string;
  setor: Setor;
  local: string;
  numero: string;
  x: number;
  y: number;
  grupo: number;
  bloco?: BlocoPlateia;
};

function buildAssentos(): Assento[] {
  const lista: Assento[] = [];

  FILEIRAS_PLATEIA.forEach((fileira, fileiraIndex) => {
    const numeros = numerosDaFileira(fileira);
    numeros.forEach((numero, seatIndex) => {
      const { x, y, bloco } = posicaoPlateia(fileiraIndex, seatIndex, numeros.length);
      lista.push({
        id: `P-${fileira}-${String(numero).padStart(2, "0")}`,
        setor: "plateia",
        local: `Fileira ${fileira}`,
        numero: String(numero),
        x,
        y,
        grupo: grupoPlateia(fileira),
        bloco,
      });
    });
  });

  layoutsFrisas().forEach((layout) => {
    const total = lugaresNaFrisa(layout.numero);
    for (let lugar = 1; lugar <= total; lugar++) {
      const { x, y } = posicaoFrisa(layout, lugar - 1, total);
      lista.push({
        id: `F-${String(layout.numero).padStart(2, "0")}-${String(lugar).padStart(2, "0")}`,
        setor: "frisa",
        local: `Frisa ${layout.numero}`,
        numero: String(lugar),
        x,
        y,
        grupo: 3,
      });
    }
  });

  return lista;
}

const cap = validarCapacidade();
if (!cap.ok) {
  console.warn("[moliere] Há lugares duplicados ou frisas faltando na planta do pavimento térreo.");
}

export const assentos: Assento[] = buildAssentos();

export const assentosPorId = new Map(assentos.map((assento) => [assento.id, assento]));

/** Reservado de antemão pela produção (camarotes alocados, convites especiais) — fora do clique em qualquer ala. */
export function reservadoPrevio(assentoId: string): boolean {
  const assento = assentosPorId.get(assentoId);
  if (!assento) return false;
  return assentosReservadosPrevios.has(assentoId) || setorTotalmenteReservado(assento.setor);
}

export function indisponivel(_eventoId: string, _sessaoId: string, assentoId: string, reservados: string[]): boolean {
  return reservadoPrevio(assentoId) || reservados.includes(assentoId);
}
