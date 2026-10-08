/** Alas da sala do Theatro Municipal contempladas na gala. */
export type Setor = "plateia" | "frisa" | "camarote" | "balcao-nobre" | "balcao-superior";

export type Sessao = { id: string; data: string; horario: string };

export type Evento = {
  id: string;
  titulo: string;
  categoria: string;
  subtitulo: string;
  descricao: string;
  sessoes: Sessao[];
  precos: Record<Setor, number>;
  destaque: string;
};

/** Bilheteria da noite de gala — Theatro Municipal do Rio (pavimento térreo). */
export const eventos: Evento[] = [
  {
    id: "gala-moliere-2027",
    titulo: "Gala Prêmio Molière 2027",
    categoria: "CERIMÔNIA DE PREMIAÇÃO",
    subtitulo: "Theatro Municipal do Rio de Janeiro · chancela Consulado Geral da França",
    descricao:
      "A maior honraria do teatro nacional volta à cena em uma noite de gala: revelação das 11 categorias competitivas, homenagem aos Grandes Consagrados, tapete vermelho e brinde Molière — plateia e palco em uníssono.",
    sessoes: [
      { id: "gala-principal", data: "2027-06-14", horario: "20:00" },
      { id: "gala-pre-estreia", data: "2027-06-13", horario: "19:30" },
    ],
    // Camarotes e Balcão Superior não são vendidos: acesso por validação de convite (valor 0).
    precos: { plateia: 680, frisa: 920, camarote: 0, "balcao-nobre": 480, "balcao-superior": 0 },
    destaque: "2027",
  },
];

export function getEventoById(id: string): Evento | undefined {
  return eventos.find((evento) => evento.id === id);
}

export const setorLabels: Record<Setor, string> = {
  plateia: "Plateia",
  frisa: "Frisa",
  camarote: "Camarote",
  "balcao-nobre": "Balcão Nobre",
  "balcao-superior": "Balcão Superior",
};

export function formatMoeda(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function formatData(iso: string, options?: Intl.DateTimeFormatOptions): string {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("pt-BR", options ?? {
    day: "numeric", month: "long", year: "numeric",
  });
}
