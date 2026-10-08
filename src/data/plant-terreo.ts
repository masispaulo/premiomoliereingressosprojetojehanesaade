/*
 * Transcrição PARCIAL da fotografia de 720 × 953 px do pavimento térreo.
 * Não é inventário oficial. Há números ilegíveis, cadeiras especiais e uma
 * correção manuscrita na capacidade: não completar fileiras até uma meta.
 * Os máximos abaixo incluem leituras e inferências por sequência par/ímpar.
 */
export const FILEIRAS_PLATEIA = [
  "A", "B", "C", "D", "E", "F", "G", "H",
  "I", "J", "L", "M", "N", "O", "P", "Q",
] as const;
export type FileiraPlateia = (typeof FILEIRAS_PLATEIA)[number];

// alaPar e alaImpar são quantidades de pontos separados por corredores.
// E e Q são os trechos mais legíveis; os demais precisam de conferência.
const FILEIRAS: Record<FileiraPlateia, { maior: number; alaPar: number; alaImpar: number }> = {
  A: { maior: 19, alaPar: 4, alaImpar: 4 },
  B: { maior: 19, alaPar: 4, alaImpar: 4 },
  C: { maior: 21, alaPar: 4, alaImpar: 4 },
  D: { maior: 21, alaPar: 4, alaImpar: 4 },
  E: { maior: 22, alaPar: 5, alaImpar: 5 },
  F: { maior: 23, alaPar: 6, alaImpar: 6 },
  G: { maior: 23, alaPar: 6, alaImpar: 6 },
  H: { maior: 23, alaPar: 6, alaImpar: 6 },
  I: { maior: 23, alaPar: 6, alaImpar: 6 },
  J: { maior: 22, alaPar: 6, alaImpar: 6 },
  L: { maior: 21, alaPar: 6, alaImpar: 6 },
  M: { maior: 20, alaPar: 5, alaImpar: 5 },
  N: { maior: 17, alaPar: 4, alaImpar: 4 },
  O: { maior: 14, alaPar: 2, alaImpar: 2 },
  P: { maior: 9, alaPar: 0, alaImpar: 0 },
  Q: { maior: 8, alaPar: 0, alaImpar: 0 },
};

export type BlocoPlateia = "ala-par" | "centro" | "ala-impar";
export type GruposDaFileira = Record<BlocoPlateia, number[]>;

export function gruposDaFileira(fileira: FileiraPlateia): GruposDaFileira {
  const { maior, alaPar, alaImpar } = FILEIRAS[fileira];
  const pares = Array.from({ length: Math.floor(maior / 2) }, (_, i) => (i + 1) * 2);
  const impares = Array.from({ length: Math.ceil(maior / 2) }, (_, i) => maior % 2 === 1 ? maior - 2 * i : maior - 1 - 2 * i);
  return {
    "ala-par": pares.slice(0, alaPar),
    centro: [...pares.slice(alaPar), ...impares.slice(0, impares.length - alaImpar)],
    "ala-impar": alaImpar ? impares.slice(-alaImpar) : [],
  };
}

export function numerosDaFileira(fileira: FileiraPlateia): number[] {
  const g = gruposDaFileira(fileira);
  return [...g["ala-par"], ...g.centro, ...g["ala-impar"]];
}

export function grupoPlateia(fileira: FileiraPlateia): 0 | 1 | 2 {
  const i = FILEIRAS_PLATEIA.indexOf(fileira);
  return i < 4 ? 0 : i < 9 ? 1 : 2;
}

// Âncoras de fileiras seguem a fotografia, incluindo o vão maior entre I e J.
const Y_FILEIRAS = [203, 231, 259, 287, 325, 353, 381, 409, 437, 479, 507, 535, 563, 591, 619, 647];
export function yFileira(index: number): number {
  return Y_FILEIRAS[index];
}

function distribuir(index: number, total: number, inicio: number, fim: number): number {
  if (total <= 1) return (inicio + fim) / 2;
  return inicio + (fim - inicio) * index / (total - 1);
}

export function posicaoPlateia(fileiraIndex: number, seatIndex: number, _totalNaFileira?: number): { x: number; y: number; bloco: BlocoPlateia } {
  const f = FILEIRAS_PLATEIA[fileiraIndex];
  const g = gruposDaFileira(f);
  const esquerda = g["ala-par"].length;
  const centro = g.centro.length;
  let bloco: BlocoPlateia;
  let posicao: number;
  let total: number;
  if (seatIndex < esquerda) {
    bloco = "ala-par"; posicao = seatIndex; total = esquerda;
  } else if (seatIndex < esquerda + centro) {
    bloco = "centro"; posicao = seatIndex - esquerda; total = centro;
  } else {
    bloco = "ala-impar"; posicao = seatIndex - esquerda - centro; total = g["ala-impar"].length;
  }
  const i = fileiraIndex;
  const estreitamento = Math.max(0, i - 10);
  const metadeCentro = i < 9 ? 124 + i : 132 - estreitamento * 8;
  const inicioAla = i < 9 ? 186 - i * 2.1 : 168 + estreitamento * 12;
  const fimAla = i < 9 ? 230 - i * 0.3 : 232 + estreitamento * 3;
  const x = bloco === "centro"
    ? distribuir(posicao, total, 390 - metadeCentro, 390 + metadeCentro)
    : bloco === "ala-par"
      ? distribuir(posicao, total, inicioAla, fimAla)
      : distribuir(posicao, total, 780 - fimAla, 780 - inicioAla);
  const y = yFileira(i) + (bloco === "centro" ? 3 * Math.sin(Math.PI * posicao / Math.max(1, total - 1)) : -3);
  return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10, bloco };
}

export type FrisaLayout = {
  numero: number;
  x: number; y: number; w: number; h: number;
  lado: "par" | "impar";
  faixa: "superior" | "lateral-alta" | "lateral-baixa";
};
export const FRISAS = Array.from({ length: 24 }, (_, i) => i + 1);

// A foto informa 108 lugares nas frisas em conjunto, mas não permite apurar
// a lotação individual das 24 caixas. Quatro pontos por caixa são um DESENHO,
// não uma divisão confirmada dos 108 ingressos.
export function lugaresNaFrisa(_numeroFrisa: number): number { return 4; }

export function layoutsFrisas(): FrisaLayout[] {
  const caixas: FrisaLayout[] = [];
  for (let n = 1; n <= 4; n++) {
    const lado = n % 2 ? "impar" : "par";
    const ordem = Math.floor((n - 1) / 2);
    caixas.push({ numero: n, lado, faixa: "superior", x: lado === "par" ? 70 : 615, y: 76 + ordem * 41, w: 95, h: 37 });
  }
  for (let nivel = 0; nivel < 10; nivel++) {
    const inferior = nivel >= 5;
    const idx = inferior ? nivel - 5 : nivel;
    const y = inferior ? 419 + idx * 47 : 158 + idx * 43;
    const xPar = inferior ? 56 + idx * 17 : 67 - idx * 5;
    const xImpar = inferior ? 632 - idx * 17 : 625 + idx * 5;
    const faixa = inferior ? "lateral-baixa" : "lateral-alta";
    caixas.push({ numero: 5 + nivel * 2, lado: "impar", faixa, x: xImpar, y, w: 90, h: 45 });
    caixas.push({ numero: 6 + nivel * 2, lado: "par", faixa, x: xPar, y, w: 90, h: 45 });
  }
  return caixas.sort((a, b) => a.numero - b.numero);
}

export function contornoFrisa(box: FrisaLayout): string {
  const { x, y, w, h } = box;
  return `M ${x + 5} ${y + 1} Q ${x + w / 2} ${y - 3} ${x + w - 3} ${y + 2} L ${x + w - 7} ${y + h - 2} Q ${x + w / 2} ${y + h + 3} ${x + 2} ${y + h - 2} Z`;
}

export function posicaoFrisa(layout: FrisaLayout, lugarIndex: number, _total?: number): { x: number; y: number } {
  const x = layout.x + layout.w * (lugarIndex % 2 ? 0.54 : 0.31);
  const y = layout.y + layout.h * (lugarIndex < 2 ? 0.36 : 0.76);
  return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
}

// Os dois números da plateia são leituras incertas da foto borrada, não dados operacionais.
export const ANOTACOES_FOTO = {
  plateiaImpressa: 300,
  plateiaCorrigidaAproximada: 295,
  frisasImpressas: 108,
  resolucaoFonte: "720 × 953 px",
} as const;

export function validarCapacidade(): { plateia: number; frisas: number; ok: boolean } {
  const numeros = FILEIRAS_PLATEIA.flatMap((f) => numerosDaFileira(f).map((n) => `${f}-${n}`));
  const plateia = numeros.length;
  const frisas = FRISAS.reduce((s, f) => s + lugaresNaFrisa(f), 0);
  return { plateia, frisas, ok: new Set(numeros).size === plateia && layoutsFrisas().length === 24 };
}
