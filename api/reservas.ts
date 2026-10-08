import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  HOLD_TTL_SEG,
  chaveHoldAssento,
  chaveHolds,
  chaveVendidos,
  getRedis,
} from "./_lib/redis.js";

type Body =
  | { action: "hold"; eventoId: string; sessaoId: string; clientId: string; assentos: string[] }
  | { action: "commit"; eventoId: string; sessaoId: string; clientId: string; assentos: string[] }
  | { action: "release"; eventoId: string; sessaoId: string; clientId: string; assentos: string[] };

function idsValidos(assentos: unknown): assentos is string[] {
  return Array.isArray(assentos) && assentos.every((id) => typeof id === "string" && id.length > 0 && id.length < 80);
}

async function listarOcupados(redis: NonNullable<ReturnType<typeof getRedis>>, eventoId: string, sessaoId: string) {
  const vendidos = (await redis.smembers(chaveVendidos(eventoId, sessaoId))) as string[];
  const holds = (await redis.smembers(chaveHolds(eventoId, sessaoId))) as string[];
  return { vendidos: vendidos ?? [], holds: holds ?? [], ocupados: [...new Set([...(vendidos ?? []), ...(holds ?? [])])] };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");

  const redis = getRedis();
  if (!redis) {
    return res.status(503).json({ error: "Bilheteria temporariamente indisponível (Redis não configurado na Vercel)." });
  }

  if (req.method === "GET") {
    const eventoId = String(req.query.eventoId ?? "");
    const sessaoId = String(req.query.sessaoId ?? "");
    if (!eventoId || !sessaoId) return res.status(400).json({ error: "eventoId e sessaoId são obrigatórios." });
    const dados = await listarOcupados(redis, eventoId, sessaoId);
    return res.status(200).json(dados);
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Método não permitido." });
  }

  const body = req.body as Body;
  if (!body?.action || !body.eventoId || !body.sessaoId || !body.clientId || !idsValidos(body.assentos)) {
    return res.status(400).json({ error: "Corpo inválido." });
  }

  const { eventoId, sessaoId, clientId, assentos } = body;
  const vendidosKey = chaveVendidos(eventoId, sessaoId);
  const holdsKey = chaveHolds(eventoId, sessaoId);

  if (body.action === "release") {
    for (const assentoId of assentos) {
      const holdKey = chaveHoldAssento(eventoId, sessaoId, assentoId);
      const dono = await redis.get<string>(holdKey);
      if (dono === clientId) {
        await redis.del(holdKey);
        await redis.srem(holdsKey, assentoId);
      }
    }
    const dados = await listarOcupados(redis, eventoId, sessaoId);
    return res.status(200).json({ ok: true, ...dados });
  }

  if (body.action === "hold") {
    for (const assentoId of assentos) {
      if (await redis.sismember(vendidosKey, assentoId)) {
        return res.status(409).json({ error: "Um ou mais lugares já foram vendidos.", assentoId });
      }
      const holdKey = chaveHoldAssento(eventoId, sessaoId, assentoId);
      const dono = await redis.get<string>(holdKey);
      if (dono && dono !== clientId) {
        return res.status(409).json({ error: "Um ou mais lugares estão sendo escolhidos por outra pessoa.", assentoId });
      }
    }
    for (const assentoId of assentos) {
      const holdKey = chaveHoldAssento(eventoId, sessaoId, assentoId);
      await redis.set(holdKey, clientId, { ex: HOLD_TTL_SEG });
      await redis.sadd(holdsKey, assentoId);
    }
    const dados = await listarOcupados(redis, eventoId, sessaoId);
    return res.status(200).json({ ok: true, ...dados });
  }

  if (body.action === "commit") {
    for (const assentoId of assentos) {
      if (await redis.sismember(vendidosKey, assentoId)) {
        return res.status(409).json({ error: "Lugar já vendido.", assentoId });
      }
      const holdKey = chaveHoldAssento(eventoId, sessaoId, assentoId);
      const dono = await redis.get<string>(holdKey);
      if (dono && dono !== clientId) {
        return res.status(409).json({ error: "Lugar reservado por outra sessão.", assentoId });
      }
    }
    const confirmados: string[] = [];
    for (const assentoId of assentos) {
      const added = await redis.sadd(vendidosKey, assentoId);
      if (added === 0) {
        if (confirmados.length) await redis.srem(vendidosKey, ...confirmados);
        return res.status(409).json({ error: "Conflito ao confirmar — tente outros lugares.", assentoId });
      }
      confirmados.push(assentoId);
      const holdKey = chaveHoldAssento(eventoId, sessaoId, assentoId);
      await redis.del(holdKey);
      await redis.srem(holdsKey, assentoId);
    }
    const dados = await listarOcupados(redis, eventoId, sessaoId);
    return res.status(200).json({ ok: true, ...dados });
  }

  return res.status(400).json({ error: "Ação desconhecida." });
}
