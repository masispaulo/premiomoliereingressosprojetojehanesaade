import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { AlaModal } from "../components/AlaModal";
import { MapaAssentos } from "../components/MapaAssentos";
import { type Ala, alas, getAla } from "../data/alas";
import { assentosPorId, indisponivel, lerReservados, salvarReservados } from "../data/assentos";
import { Evento, Setor, formatData, formatMoeda, getEventoById, setorLabels } from "../data/eventos";
import { linksInstitucionais } from "../data/premio-moliere";
import { blocosReservados, lugaresReservadosNoSetor, setorTotalmenteReservado } from "../data/reservas-previas";

type Etapa = "configurar" | "lugares" | "revisao" | "concluido";
const ordemSetores: Setor[] = ["plateia", "frisa"];

export function EventoDetalhePage() {
  const { id } = useParams<{ id: string }>();
  const [params] = useSearchParams();
  const evento = id ? getEventoById(id) : undefined;
  if (!evento) return <section className="empty-state"><h1>Sessão não encontrada</h1><p>Confira os ingressos da gala e escolha outra sessão.</p><Link className="button button--dark" to="/ingressos">Ver ingressos</Link></section>;
  const alaInicial = getAla(params.get("setor"));
  return <EventoCompra key={`${evento.id}:${alaInicial?.id ?? "todas"}`} evento={evento} alaInicial={alaInicial} />;
}

function EventoCompra({ evento, alaInicial }: { evento: Evento; alaInicial?: Ala }) {
  const [sessaoId, setSessaoId] = useState(evento.sessoes[0].id);
  const [quantidade, setQuantidade] = useState(2);
  const [ala, setAla] = useState<Ala | null>(alaInicial ?? null);
  const [janelaAla, setJanelaAla] = useState<Ala | null>(null);
  const [etapa, setEtapa] = useState<Etapa>(alaInicial ? "lugares" : "configurar");
  const [selecionados, setSelecionados] = useState<string[]>([]);
  const [reservados, setReservados] = useState<string[]>(() => lerReservados(evento.id, evento.sessoes[0].id));
  const [aviso, setAviso] = useState("");
  const svgRef = useRef<SVGSVGElement>(null);
  const sessao = evento.sessoes.find((item) => item.id === sessaoId)!;

  useEffect(() => {
    setReservados(lerReservados(evento.id, sessaoId));
    setSelecionados([]);
    setAviso("");
  }, [evento.id, sessaoId]);

  useEffect(() => {
    function atualizarDisponibilidade(event: StorageEvent) {
      if (event.key !== `palco-rio:demo:${evento.id}:${sessaoId}`) return;
      const ocupados = lerReservados(evento.id, sessaoId);
      setReservados(ocupados);
      setSelecionados((atual) => {
        const validos = atual.filter((id) => !indisponivel(evento.id, sessaoId, id, ocupados));
        if (validos.length !== atual.length) {
          setAviso("A disponibilidade mudou em outra aba. Revise seus lugares antes de continuar.");
          setEtapa("lugares");
        }
        return validos;
      });
    }
    window.addEventListener("storage", atualizarDisponibilidade);
    return () => window.removeEventListener("storage", atualizarDisponibilidade);
  }, [evento.id, sessaoId]);

  const itens = useMemo(() => selecionados.map((id) => assentosPorId.get(id)!).filter(Boolean), [selecionados]);
  const total = itens.reduce((soma, item) => soma + evento.precos[item.setor], 0);
  const setoresResumo: Setor[] = ala ? [ala.id] : ordemSetores;
  const contagens = setoresResumo.map((setor) => ({ setor, quantidade: itens.filter((item) => item.setor === setor).length }));

  function trocarAla(nova: Ala | null) {
    setAla(nova);
    setSelecionados([]);
    setAviso("");
    if (etapa === "revisao") setEtapa("lugares");
  }

  function selecionar(id: string) {
    setAviso("");
    if (selecionados.includes(id)) {
      setSelecionados(selecionados.filter((item) => item !== id));
    } else if (selecionados.length < quantidade) {
      setSelecionados([...selecionados, id]);
    } else {
      setAviso(`Você escolheu ${quantidade} ingresso${quantidade > 1 ? "s" : ""}. Remova um lugar para selecionar outro.`);
    }
  }

  function conferirDisponibilidade(): boolean {
    const atuais = lerReservados(evento.id, sessaoId);
    setReservados(atuais);
    const validos = selecionados.filter((id) => !indisponivel(evento.id, sessaoId, id, atuais));
    if (validos.length !== selecionados.length) {
      setSelecionados(validos);
      setEtapa("lugares");
      setAviso("Um ou mais lugares deixaram de estar disponíveis. Selecione outros no mapa.");
      return false;
    }
    return true;
  }

  function finalizar() {
    if (selecionados.length !== quantidade || !conferirDisponibilidade()) return;
    try {
      const atuais = lerReservados(evento.id, sessaoId);
      if (selecionados.some((id) => indisponivel(evento.id, sessaoId, id, atuais))) {
        conferirDisponibilidade();
        return;
      }
      salvarReservados(evento.id, sessaoId, [...new Set([...atuais, ...selecionados])]);
      setReservados([...new Set([...atuais, ...selecionados])]);
      setAviso("");
      setEtapa("concluido");
    } catch {
      setAviso("Não foi possível salvar a simulação neste navegador. Tente novamente com o armazenamento local habilitado.");
    }
  }

  function baixarPlanta() {
    if (!svgRef.current) return;
    const copia = svgRef.current.cloneNode(true) as SVGSVGElement;
    const estilo = document.createElementNS("http://www.w3.org/2000/svg", "style");
    estilo.textContent = `.mapa-palco{fill:#f6eddc;font:600 22px Georgia;letter-spacing:5px}.mapa-zona,.mapa-lateral,.mapa-entrada{fill:#617a79;font:600 12px Arial;letter-spacing:2px}.mapa-saida{fill:#617a79;font:600 10px Arial;letter-spacing:1px}.mapa-box-label,.mapa-row-label{fill:#9d6972;font:600 11px Arial}.mapa-box-label--lateral{fill:#fff}.assento circle{fill:#315e6a;stroke:#fff;stroke-width:1.5}.assento--grupo-0 circle{fill:#b37b3d}.assento--grupo-2 circle{fill:#447b79}.assento--frisa circle,.assento--camarote circle{fill:#a55e71}.assento--ocupado circle{fill:#c6c9c5}.assento--selecionado circle{fill:#203e37;stroke:#eec075;stroke-width:3}.assento text{fill:#fff;font:700 8px Arial;pointer-events:none}.assento--ocupado text{fill:#79817e}`;
    copia.insertBefore(estilo, copia.firstChild);
    const arquivo = new Blob([new XMLSerializer().serializeToString(copia)], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(arquivo);
    const link = document.createElement("a");
    link.href = url;
    link.download = `planta-ilustrativa-${evento.id}-${sessaoId}.svg`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  if (etapa === "concluido") {
    return <section className="receipt">
      <span className="eyebrow">DEMONSTRAÇÃO CONCLUÍDA</span>
      <h1>Seus lugares foram marcados no exemplo.</h1>
      <p>Isso não é uma compra nem uma reserva oficial. Nenhum pagamento foi processado.</p>
      <div className="receipt__details"><strong>{evento.titulo}</strong><span>{formatData(sessao.data)} às {sessao.horario}</span><span>{itens.map((item) => `${item.local} · ${item.numero}`).join(" / ")}</span><b>Total ilustrativo: {formatMoeda(total)}</b></div>
      <Link to="/ingressos" className="button button--dark">Voltar aos ingressos <span aria-hidden="true">↗</span></Link>
    </section>;
  }

  return <div className="compra-page">
    <div className="breadcrumb"><Link to="/ingressos">Ingressos</Link><span>/</span><span>{evento.titulo}</span></div>
    <div className="compra-heading">
      <div><span className="eyebrow">{evento.categoria} · PRÊMIO MOLIÈRE · MAISON DIJON</span><h1>{evento.titulo}</h1><p>{evento.subtitulo}</p></div>
      <div className="compra-heading__stamp">ESCOLHA<br />O SEU<br /><em>LUGAR</em></div>
    </div>
    <div className="steps" aria-label="Etapas da escolha">
      {["Sessão e quantidade", "Escolha de lugares", "Revisão"].map((label, index) => {
        const ativa = ["configurar", "lugares", "revisao"].indexOf(etapa) >= index;
        return <div key={label} className={`steps__item${ativa ? " steps__item--active" : ""}`}><span>0{index + 1}</span>{label}</div>;
      })}
    </div>

    <nav className="ala-bar" aria-label="Alas do Theatro Municipal">
      <span className="ala-bar__label">Ala</span>
      <div className="ala-bar__chips" role="tablist">
        <button type="button" role="tab" aria-selected={ala === null} className={`ala-chip${ala === null ? " ala-chip--active" : ""}`} onClick={() => trocarAla(null)}>Todas (térreo)</button>
        {alas.map((item) => <button type="button" role="tab" key={item.id} aria-selected={ala?.id === item.id} className={`ala-chip${ala?.id === item.id ? " ala-chip--active" : ""}${setorTotalmenteReservado(item.id) ? " ala-chip--reservada" : ""}`} onClick={() => trocarAla(item)}>{item.nome}</button>)}
      </div>
      {ala && <button type="button" className="text-link" onClick={() => setJanelaAla(ala)}>Sobre esta ala ↗</button>}
    </nav>
    <AlaModal ala={janelaAla} eventoId={evento.id} aoFechar={() => setJanelaAla(null)} />

    {etapa === "configurar" ? <div className="config-grid">
      <section className="panel config-panel">
        <span className="eyebrow">PRIMEIRO PASSO</span><h2>Quando vamos nos encontrar?</h2><p className="muted">Escolha a sessão e quantos lugares você deseja. Depois você os encontrará na planta.</p>
        <h3>Escolha a sessão</h3>
        <div className="session-options">{evento.sessoes.map((item) => <button type="button" key={item.id} className={`session-option${sessaoId === item.id ? " session-option--active" : ""}`} aria-pressed={sessaoId === item.id} onClick={() => setSessaoId(item.id)}><span>{formatData(item.data, { weekday: "short" }).replace(".", "").toUpperCase()}</span><strong>{formatData(item.data, { day: "2-digit", month: "short" }).replace(".", "")}</strong><small>{item.horario}</small></button>)}</div>
        <h3>Quantidade de ingressos</h3>
        <div className="quantity-control"><button type="button" aria-label="Diminuir quantidade" disabled={quantidade <= 1} onClick={() => setQuantidade((n) => n - 1)}>−</button><strong aria-live="polite">{quantidade}</strong><button type="button" aria-label="Aumentar quantidade" disabled={quantidade >= 6} onClick={() => setQuantidade((n) => n + 1)}>+</button><span>Até 6 ingressos por seleção</span></div>
        <button className="button button--dark button--wide" onClick={() => { setEtapa("lugares"); setAviso(""); }}>Escolher lugares <span aria-hidden="true">→</span></button>
      </section>
      <aside className="intro-aside"><div className="intro-aside__art"><span>DIJON<br />&amp; <em>MOLIÈRE</em></span><div className="intro-aside__arc" /></div><div className="intro-aside__caption"><span>THEATRO MUNICIPAL · RIO DE JANEIRO</span><p>O teatro é o espelho da sociedade. A Maison Dijon é a moldura.</p></div></aside>
    </div> : <div className="selection-layout">
      {ala && !ala.mapeada ? <SetorSemPlanta ala={ala} evento={evento} sessaoId={sessaoId} quantidade={quantidade} /> : <section className="map-panel panel">
        <div className="map-panel__head"><div><span className="eyebrow">THEATRO MUNICIPAL · PAVIMENTO TÉRREO{ala ? ` · ${ala.nome.toUpperCase()}` : ""}</span><h2>{etapa === "revisao" ? "Confira sua escolha" : ala ? `Lugares — ${ala.nome}` : "Escolha seus lugares"}</h2><p>{ala ? `${ala.capacidadeNota}. Somente os lugares deste setor estão ativos; os demais aparecem apagados.` : "Plateia (fileiras A–Q) e frisas para a noite de gala. Lado par à esquerda, ímpar à direita."}</p></div><div className="zoom-controls" aria-label="Controles de visualização"><span>MAPA INTERATIVO</span><button type="button" className="text-link" onClick={baixarPlanta}>Baixar SVG ↗</button></div></div>
        <div className="legend"><span><i className="legend__dot legend__dot--free" /> Disponível</span><span><i className="legend__dot legend__dot--selected" /> Selecionado</span><span><i className="legend__dot legend__dot--occupied" /> Indisponível</span><span><i className="legend__dot legend__dot--previo" /> Reservado pela produção</span>{ala && <span><i className="legend__dot legend__dot--fora" /> Fora da ala</span>}</div>
        <div className="map-scroll"><MapaAssentos svgRef={svgRef} eventoId={evento.id} sessaoId={sessaoId} reservados={reservados} selecionados={selecionados} filtroSetor={ala?.id ?? null} aoSelecionar={etapa === "revisao" ? () => { setEtapa("lugares"); setAviso("Volte ao mapa para alterar seus lugares."); } : selecionar} /></div>
        <div className="map-panel__foot"><span>Deslize lateralmente para ampliar a visualização no celular.</span><span>Planta esquemática · sem escala · sujeita à validação da produção</span></div>
      </section>}
      <aside className="summary panel" aria-label="Resumo da escolha">
        <span className="eyebrow">SUA NOITE DE GALA</span><h2>Resumo da escolha</h2>
        <div className="summary__event"><strong>{evento.titulo}</strong><span>{formatData(sessao.data, { weekday: "long", day: "numeric", month: "long" })} · {sessao.horario}</span><span>Theatro Municipal do Rio de Janeiro</span></div>
        <div className="summary__quantity"><span>Ingressos</span><button className="text-link" type="button" onClick={() => { setEtapa("configurar"); setSelecionados([]); setAviso(""); }}>Alterar</button><strong>{quantidade}</strong></div>
        <div className="summary__seats"><div className="summary__line"><span>Lugares selecionados</span><strong>{selecionados.length}/{quantidade}</strong></div>
          {itens.length ? <ul>{itens.map((item) => <li key={item.id}><span><b>{setorLabels[item.setor]}</b><small>{item.local} · Lugar {item.numero}</small></span><span>{formatMoeda(evento.precos[item.setor])}</span>{etapa === "lugares" && <button type="button" aria-label={`Remover ${item.local}, lugar ${item.numero}`} onClick={() => selecionar(item.id)}>×</button>}</li>)}</ul> : <p>Seus lugares aparecerão aqui.</p>}
        </div>
        {ala && <div className="summary__line summary__ala"><span>Ala escolhida</span><strong>{ala.nome}</strong></div>}
        <div className="summary__prices"><span>Valores por setor</span>{setoresResumo.map((setor) => <div key={setor}><span>{setorLabels[setor]}{contagens.find((item) => item.setor === setor)!.quantidade > 0 ? ` · ${contagens.find((item) => item.setor === setor)!.quantidade}×` : ""}</span><span>{setorTotalmenteReservado(setor) ? "mediante convite" : `desde ${formatMoeda(evento.precos[setor])}`}</span></div>)}</div>
        <div className="summary__total"><span>Total ilustrativo</span><strong>{formatMoeda(total)}</strong></div>
        {aviso && <p className="notice" role="alert">{aviso}</p>}
        {etapa === "lugares" ? <button className="button button--dark button--wide" disabled={selecionados.length !== quantidade} onClick={() => { if (conferirDisponibilidade()) { setEtapa("revisao"); setAviso(""); } }}>Revisar escolha <span aria-hidden="true">→</span></button> : <><button className="button button--dark button--wide" onClick={finalizar}>Confirmar lugares <span aria-hidden="true">→</span></button><button type="button" className="text-link summary__back" onClick={() => { setEtapa("lugares"); setAviso(""); }}>Voltar e alterar lugares</button></>}
        <p className="summary__disclaimer">Bilheteria em estruturação — Projeto Cultural Molière · Maison Dijon. Disponibilidade e valores sujeitos à validação final; pagamento será integrado na próxima fase.</p>
      </aside>
    </div>}
  </div>;
}

/**
 * Alas dos pavimentos superiores (camarotes, balcões) — a planta desses andares ainda não foi
 * desenhada. Mostra a situação real do setor: o que já está reservado pela produção fica travado;
 * no Balcão Nobre a pessoa solicita os lugares à bilheteria.
 */
function SetorSemPlanta({ ala, evento, sessaoId, quantidade }: { ala: Ala; evento: Evento; sessaoId: string; quantidade: number }) {
  const sessao = evento.sessoes.find((s) => s.id === sessaoId)!;
  const blocos = blocosReservados.filter((b) => b.setor === ala.id);
  const reservadosNoSetor = lugaresReservadosNoSetor(ala.id);
  const tudoReservado = setorTotalmenteReservado(ala.id);
  const assunto = encodeURIComponent(`Pedido de lugares · ${ala.nome} · ${evento.titulo} · ${formatData(sessao.data)} ${sessao.horario} · ${quantidade} ingresso${quantidade > 1 ? "s" : ""}`);

  return <section className="map-panel panel setor-panel">
    <div className="map-panel__head"><div><span className="eyebrow">THEATRO MUNICIPAL · {ala.pavimento.toUpperCase()}</span><h2>{ala.nome}</h2><p>{ala.capacidadeNota}.</p></div></div>

    <div className="setor-panel__stats">
      <div><strong>{ala.capacidade}</strong><span>lugares no setor</span></div>
      <div><strong>{reservadosNoSetor}</strong><span>reservados pela produção</span></div>
      <div><strong>{Math.max(ala.capacidade - reservadosNoSetor, 0)}</strong><span>abertos à bilheteria</span></div>
    </div>

    {ala.id === "camarote" && <ul className="camarotes-grid" aria-label="Camarotes">
      {blocos.map((b, i) => <li key={`${b.local}-${i}`} className={`camarote camarote--${b.motivo}`} aria-disabled="true">
        <span className="camarote__num">{String(i + 1).padStart(2, "0")}</span>
        <span className="camarote__lugares">{b.lugares} lugares</span>
        <span className="camarote__status">Reservado</span>
      </li>)}
    </ul>}

    {tudoReservado ? <p className="notice" role="status">Todos os lugares deste setor já estão alocados pela produção ({ala.id === "camarote" ? "autoridades, patrocinadores e apoio" : "convites especiais para classe artística, estudantil e docentes"}). Nenhum lugar aberto ao clique de compra. Para validar um convite, fale com a equipe: <a href={`mailto:${linksInstitucionais.email}`}>{linksInstitucionais.email}</a>.</p>
    : <div className="setor-panel__pedido">
        <p>A planta numerada do {ala.pavimento.split(" · ")[0]} está sendo preparada pela produção. Enquanto isso, solicite seus {quantidade} lugar{quantidade > 1 ? "es" : ""} no {ala.nome} para {formatData(sessao.data, { weekday: "long", day: "numeric", month: "long" })} às {sessao.horario} — a bilheteria confirma a fileira e o número.</p>
        <a className="button button--dark" href={`mailto:${linksInstitucionais.email}?subject=${assunto}`}>Solicitar lugares no {ala.nome} <span aria-hidden="true">→</span></a>
        <small>Valor de referência: {formatMoeda(evento.precos[ala.id])} por lugar.</small>
      </div>}

    <div className="map-panel__foot"><span>Dados do setor conforme o Theatro Municipal do Rio de Janeiro.</span><span>Alocação sujeita à validação da produção</span></div>
  </section>;
}
