import { camarotes } from "./alas";
import type { Setor } from "./eventos";

/**
 * BLOQUEIO PRÉVIO — lugares já alocados pela produção antes da abertura da bilheteria.
 * Tudo que estiver aqui aparece como "reservado" no mapa e fica fora do clique de compra,
 * em qualquer categoria. Fonte: alocação de camarotes e convites da direção do projeto.
 */

export type BlocoReservado = {
  setor: Setor;
  /** Identificador do espaço (ex.: "Camarote 2", "Balcão Superior · fileiras A–C"). */
  local: string;
  lugares: number;
  motivo: "autoridades" | "patrocinador" | "apoio" | "convite-especial" | "producao";
  /** Ids de assentos específicos do mapa, quando o pavimento já estiver desenhado. */
  assentos?: string[];
};

const motivoCamarote: Record<(typeof camarotes)[number]["grupo"], BlocoReservado["motivo"]> = {
  institucional: "autoridades",
  patrocinador: "patrocinador",
  apoio: "apoio",
};

export const blocosReservados: BlocoReservado[] = [
  // Camarotes: setor inteiro alocado (cativos + patrocinadores + apoio).
  ...camarotes.map<BlocoReservado>((c) => ({
    setor: "camarote",
    local: `Camarote ${c.grupo === "institucional" ? "institucional" : ""} ${c.numero}`.replace("  ", " "),
    lugares: c.lugares,
    motivo: motivoCamarote[c.grupo],
  })),
  // Balcão Superior: validação de convites especiais (classe artística, estudantil, docentes).
  { setor: "balcao-superior", local: "Balcão Superior · convites especiais", lugares: 500, motivo: "convite-especial" },
];

/** Ids de assentos do mapa travados de antemão (quando o pavimento está desenhado). */
export const assentosReservadosPrevios = new Set(blocosReservados.flatMap((b) => b.assentos ?? []));

/** Setores em que TODOS os lugares já estão alocados → nenhum clique de compra. */
export function setorTotalmenteReservado(setor: Setor): boolean {
  return setor === "camarote" || setor === "balcao-superior";
}

export function lugaresReservadosNoSetor(setor: Setor): number {
  return blocosReservados.filter((b) => b.setor === setor).reduce((soma, b) => soma + b.lugares, 0);
}
