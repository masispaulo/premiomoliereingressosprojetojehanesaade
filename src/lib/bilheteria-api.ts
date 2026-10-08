const CLIENT_KEY = "moliere:clientId";

export function clientIdBilheteria(): string {
  try {
    let id = sessionStorage.getItem(CLIENT_KEY);
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem(CLIENT_KEY, id);
    }
    return id;
  } catch {
    return "anon";
  }
}

export type OcupacaoSessao = { vendidos: string[]; holds: string[]; ocupados: string[] };

export async function buscarOcupacao(eventoId: string, sessaoId: string): Promise<OcupacaoSessao | null> {
  const url = `/api/reservas?eventoId=${encodeURIComponent(eventoId)}&sessaoId=${encodeURIComponent(sessaoId)}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json() as Promise<OcupacaoSessao>;
}

async function postReserva(body: Record<string, unknown>): Promise<{ ok: true; ocupados: string[] } | { ok: false; status: number; error: string }> {
  try {
    const res = await fetch("/api/reservas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = (await res.json().catch(() => ({}))) as { error?: string; ocupados?: string[] };
    if (!res.ok) return { ok: false, status: res.status, error: data.error ?? "Não foi possível reservar." };
    return { ok: true, ocupados: data.ocupados ?? [] };
  } catch {
    return { ok: false, status: 0, error: "Falha de conexão com a bilheteria. Verifique a internet e tente de novo." };
  }
}

export function segurarLugares(eventoId: string, sessaoId: string, assentos: string[]) {
  return postReserva({ action: "hold", eventoId, sessaoId, clientId: clientIdBilheteria(), assentos });
}

export function confirmarLugares(eventoId: string, sessaoId: string, assentos: string[]) {
  return postReserva({ action: "commit", eventoId, sessaoId, clientId: clientIdBilheteria(), assentos });
}

export function liberarLugares(eventoId: string, sessaoId: string, assentos: string[]) {
  return postReserva({ action: "release", eventoId, sessaoId, clientId: clientIdBilheteria(), assentos });
}
