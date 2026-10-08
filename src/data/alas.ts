import type { Setor } from "./eventos";

/**
 * Inteligência dos lugares — Theatro Municipal do Rio de Janeiro × Prêmio Molière.
 *
 * Dados físicos (pavimento, capacidade) conferidos em fontes públicas do Theatro:
 *   plateia 456 poltronas · 22 frisas (6 lugares cada = 132) · 12 camarotes + 4 camarotes
 *   cativos de autoridades (36 lugares) · Balcão Nobre 344 · Balcão Superior (Simples) 500 ·
 *   Galeria 724 · total ≈ 2.244–2.252 lugares.
 * Textos de experiência fornecidos pela direção do projeto (Jehane Saade · Maison Dijon).
 */

/**
 * venda            → cadeiras clicáveis na bilheteria.
 * convite-vip      → setor inteiro já alocado (camarotes cativos/patrocinadores/apoio): fora do clique de compra.
 * convite-especial → setor já alocado para convites especiais (classe artística, estudantes, docentes): fora do clique.
 */
export type ModoAcesso = "venda" | "convite-vip" | "convite-especial";

export type ItemTexto = { titulo: string; texto: string };

export type Camarote = {
  numero: number;
  nome: string;
  lugares: number;
  grupo: "institucional" | "patrocinador" | "apoio";
  cativo?: boolean;
};

export type Ala = {
  id: Setor;
  nome: string;
  nomeCurto: string;
  pavimento: string;
  capacidade: number;
  capacidadeNota: string;
  modo: ModoAcesso;
  modoLabel: string;
  experiencia: string;
  estrelas: number;
  perfil: string;
  experienciaTag: string;
  resumo: string[];
  dadosReais?: ItemTexto[];
  porqueEscolher?: ItemTexto[];
  disposicao?: ItemTexto[];
  publico?: { titulo: string; itens: string[] };
  camarotes?: Camarote[];
  rodape?: string;
  cta: string;
  mapeada: boolean;
  transporteGratuito?: boolean;
};

export const regrasPraticas: ItemTexto[] = [
  {
    titulo: "Dress code restrito",
    texto:
      "O Municipal do Rio é um dos poucos teatros que ainda barram a entrada por vestimenta. É proibido entrar de bermuda, shorts, chinelos, sandálias rasteiras abertas ou camiseta regata. Vá de calça comprida e sapato/tênis fechado (estilo esporte fino ou passeio) para não perder a viagem.",
  },
  {
    titulo: "Chegue cedo",
    texto:
      "A abertura das portas acontece 30 minutos antes do espetáculo. Depois que as luzes se apagam e a apresentação começa, ninguém mais entra (e não há estorno do ingresso).",
  },
  {
    titulo: "Entorno (segurança)",
    texto:
      "O teatro fica na movimentada Praça Floriano (Cinelândia). Durante o dia e em horários de espetáculo, a movimentação é intensa, mas evite ostentar celulares ou joias nas calçadas do entorno, especialmente ao sair de apresentações noturnas. Prefira embarcar no táxi ou aplicativo logo na porta.",
  },
];

/**
 * ALOCAÇÃO INTERNA DOS CAMAROTES (produção). Não é exibida ao comprador: serve para
 * manter todo o setor de camarotes bloqueado na bilheteria (104 lugares já reservados).
 */
export const camarotes: Camarote[] = [
  { numero: 1, nome: "Presidente da República", lugares: 10, grupo: "institucional", cativo: true },
  { numero: 2, nome: "Governador do Estado", lugares: 10, grupo: "institucional", cativo: true },
  { numero: 3, nome: "Tribunal de Justiça", lugares: 8, grupo: "institucional", cativo: true },
  { numero: 4, nome: "Assembleia Legislativa", lugares: 8, grupo: "institucional", cativo: true },
  { numero: 1, nome: "Roberto Halfin | Francisco Britto", lugares: 6, grupo: "patrocinador" },
  { numero: 2, nome: "Camarote Dijon", lugares: 6, grupo: "patrocinador" },
  { numero: 3, nome: "Patrocinador 1 · Ouro", lugares: 6, grupo: "patrocinador" },
  { numero: 4, nome: "Patrocinador Master 2 · Prata", lugares: 6, grupo: "patrocinador" },
  { numero: 5, nome: "Patrocinador 3 · Bronze", lugares: 6, grupo: "patrocinador" },
  { numero: 6, nome: "Apoio", lugares: 6, grupo: "patrocinador" },
  { numero: 7, nome: "Investidor 1", lugares: 6, grupo: "patrocinador" },
  { numero: 8, nome: "Apoio de Mídia (Media Partners)", lugares: 6, grupo: "patrocinador" },
  { numero: 9, nome: "Convidados Especiais | Artistas", lugares: 5, grupo: "apoio" },
  { numero: 10, nome: "Convidados Artistas Premiados", lugares: 5, grupo: "apoio" },
  { numero: 11, nome: "Artistas", lugares: 5, grupo: "apoio" },
  { numero: 12, nome: "Influenciadores", lugares: 5, grupo: "apoio" },
];

export const lugaresCamarotesReservados = camarotes.reduce((soma, c) => soma + c.lugares, 0);

/** Ordem igual à do briefing: Balcão Nobre · Plateia · Camarotes · Frisas · Balcão Superior. */
export const alas: Ala[] = [
  {
    id: "balcao-nobre",
    nome: "Balcão Nobre",
    nomeCurto: "Balcão Nobre",
    pavimento: "2º pavimento · posição frontal e elevada",
    capacidade: 344,
    capacidadeNota: "344 poltronas voltadas ao palco",
    modo: "venda",
    modoLabel: "Ingressos à venda",
    experiencia: "perspectiva privilegiada",
    estrelas: 4.5,
    perfil: "premium",
    experienciaTag: "panorâmica e elegante",
    resumo: [
      "O Balcão Nobre ocupa uma posição elevada e frontal em relação ao palco.",
      "A altura proporciona uma visão interessante do conjunto do espetáculo: a coreografia e a iluminação se revelam por inteiro, e o olhar dos artistas se dirige exatamente a este ângulo.",
      "Ideal para convidados premium, sobretudo quando a estratégia é receber um número maior de convidados sem perder o caráter especial.",
    ],
    dadosReais: [
      { titulo: "Localização", texto: "Segundo pavimento da sala em ferradura, no eixo central, ao lado dos camarotes e no mesmo nível da cabine de luz e som." },
      { titulo: "Capacidade", texto: "344 poltronas em madeira e veludo, com visão completa e sem obstruções do palco." },
    ],
    publico: {
      titulo: "O que se vê melhor daqui",
      itens: ["cenografia", "coreografia", "iluminação", "composição visual", "movimentação no palco"],
    },
    cta: "Garanta seus ingressos para o Balcão Nobre",
    mapeada: false,
  },
  {
    id: "plateia",
    nome: "Plateia",
    nomeCurto: "Plateia",
    pavimento: "Pavimento térreo · frente do palco",
    capacidade: 456,
    capacidadeNota: "456 poltronas em madeira e veludo",
    modo: "venda",
    modoLabel: "Ingressos à venda",
    experiencia: "principal e premium",
    estrelas: 5,
    perfil: "principal / premium",
    experienciaTag: "frontal e imersiva",
    resumo: [
      "A plateia é o coração da sala: fileiras A a Q em três blocos, divididas por corredores, com o fosso da orquestra logo à frente.",
      "É o setor onde o público vive o espetáculo de perto — figurinos, expressões e detalhes do palco — sob o grande lustre de bronze e cristal e o teto pintado por Eliseu Visconti.",
      "Para a Gala Prêmio Molière, concentra a classe artística, os indicados e os convidados da Maison Dijon.",
    ],
    dadosReais: [
      { titulo: "Localização", texto: "Nível térreo, diretamente em frente ao palco e ao fosso da orquestra; lado par à esquerda, lado ímpar à direita." },
      { titulo: "Capacidade", texto: "456 poltronas, numeração pares/ímpares por fileira." },
    ],
    cta: "Garanta seus ingressos para a Plateia",
    mapeada: true,
  },
  {
    id: "camarote",
    nome: "Camarotes",
    nomeCurto: "Camarotes",
    pavimento: "Laterais superiores da sala · 1º e 2º níveis",
    capacidade: 104,
    capacidadeNota: "104 lugares em 16 camarotes — todos já reservados",
    modo: "convite-vip",
    modoLabel: "Convites VIP · lugares alocados ficam fora da compra",
    experiencia: "privacidade e hospitalidade",
    estrelas: 5,
    perfil: "VIP / institucional",
    experienciaTag: "privacidade, relacionamento e prestígio",
    resumo: [
      "Os camarotes ficam nas laterais superiores da sala e proporcionam uma experiência diferenciada por seu caráter mais reservado.",
      "O camarote funciona como uma extensão da experiência da marca: hospitalidade VIP sob a assinatura Dijon.",
      "Disponível apenas para validação de convites VIP. Os camarotes já alocados aparecem como reservados no mapa de lugares.",
    ],
    dadosReais: [
      { titulo: "Camarotes de autoridades", texto: "Desde a inauguração, o Theatro mantém 4 camarotes cativos — Presidente da República, Governador do Estado, Tribunal de Justiça e Assembleia Legislativa — que não podem ser postos à venda em nenhuma hipótese (36 lugares)." },
      { titulo: "Camarotes de proscênio", texto: "Os dois grandes camarotes ao lado da boca de cena (friso de Eliseu Visconti) são o do Governador, à esquerda, e o do Presidente da República, à direita." },
    ],
    publico: {
      titulo: "Camarote Dijon · hospitalidade VIP",
      itens: ["investidores", "patrocinadores", "parceiros", "autoridades", "convidados internacionais", "personalidades do meio artístico e empresarial"],
    },
    rodape: "Política atual de assentos do Theatro Municipal do Rio de Janeiro vigente.",
    cta: "Garanta seus ingressos para os Camarotes",
    mapeada: false,
  },
  {
    id: "frisa",
    nome: "Frisas",
    nomeCurto: "Frisas",
    pavimento: "Pavimento térreo · laterais, junto ao palco",
    capacidade: 132,
    capacidadeNota: "22 frisas × 6 cadeiras = 132 lugares",
    modo: "venda",
    modoLabel: "Ingressos à venda",
    experiencia: "histórica e exclusiva",
    estrelas: 5,
    perfil: "exclusivo / histórico",
    experienciaTag: "intimista",
    resumo: [
      "As frisas ficam nas laterais da sala, próximas ao palco. São 22 frisas, cada uma com 6 cadeiras — 132 lugares no setor.",
      "Diferente de um semicírculo tradicional, os 6 assentos de cada frisa costumam ser organizados em 3 fileiras com 2 cadeiras cada.",
      "Posicionadas no piso térreo, ligeiramente elevadas em relação à plateia, proporcionam a proximidade ideal com o palco e o fosso da orquestra. Arquitetonicamente, são alguns dos lugares mais característicos do teatro tradicional europeu, permitindo uma experiência mais reservada e visualmente sofisticada.",
    ],
    porqueEscolher: [
      { titulo: "Cabines privativas", texto: "Espaços reservados localizados nas laterais do andar térreo (nível da plateia), ideais para casais, famílias ou pequenos grupos." },
      { titulo: "Antessala exclusiva", texto: "Cada frisa conta com uma pequena antessala independente e divisórias que garantem total privacidade antes e durante a apresentação." },
      { titulo: "Proximidade máxima", texto: "Sinta a energia do espetáculo bem de perto, com uma visão privilegiada dos detalhes dos figurinos, das expressões dos artistas e do fosso da orquestra." },
    ],
    disposicao: [
      { titulo: "Capacidade", texto: "Cada frisa acomoda até 6 pessoas." },
      { titulo: "Configuração", texto: "As cadeiras móveis são organizadas em 3 fileiras de 2 assentos." },
      { titulo: "Dica de visibilidade", texto: "Por estarem nas laterais da sala, as frisas oferecem uma visão diagonal e parcial do palco. Os assentos da primeira fileira possuem visão desimpedida, enquanto as fileiras traseiras podem ter pontos de obstrução dependendo da montagem do cenário." },
    ],
    cta: "Garanta seus ingressos para a Frisa",
    mapeada: true,
  },
  {
    id: "balcao-superior",
    nome: "Balcão Superior",
    nomeCurto: "Balcão Superior",
    pavimento: "3º pavimento · acima do Balcão Nobre",
    capacidade: 500,
    capacidadeNota: "500 lugares (Balcão Simples)",
    modo: "convite-especial",
    modoLabel: "Convites especiais · lugares alocados ficam fora da compra",
    experiencia: "visão elevada da sala",
    estrelas: 4,
    perfil: "público ampliado",
    experienciaTag: "cultural e panorâmica",
    resumo: [
      "Fica acima do Balcão Nobre. É uma alternativa para ampliar a capacidade de convidados mantendo todos dentro da experiência arquitetônica do Theatro Municipal.",
      "Validação de convites especiais para a classe artística, estudantil, docentes, diretores e professores. Os lugares já alocados aparecem como reservados no mapa.",
    ],
    dadosReais: [
      { titulo: "Localização", texto: "Terceiro pavimento, frontal ao palco. As fileiras centrais e dianteiras têm a melhor visão; o pé-direito é mais baixo ao fundo." },
      { titulo: "Capacidade", texto: "500 lugares, também chamado de Balcão Simples." },
    ],
    publico: {
      titulo: "Mais indicado para",
      itens: ["convidados", "público geral", "grupos culturais", "estudantes", "participantes de projetos educacionais"],
    },
    cta: "Garanta seus ingressos para o Balcão Superior",
    mapeada: false,
    transporteGratuito: true,
  },
];

export const alasPorId = new Map(alas.map((ala) => [ala.id, ala]));

export function getAla(id: string | null | undefined): Ala | undefined {
  return id ? alasPorId.get(id as Setor) : undefined;
}

/** Estrelas de qualidade da experiência (meia estrela quando houver fração). */
export function estrelasTexto(nivel: number): string {
  return "★".repeat(Math.floor(nivel)) + (nivel % 1 ? "½" : "");
}
