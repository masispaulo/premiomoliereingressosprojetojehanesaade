import { Redis } from "@upstash/redis";

export function getRedis(): Redis | null {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export function chaveVendidos(eventoId: string, sessaoId: string): string {
  return `moliere:vendidos:${eventoId}:${sessaoId}`;
}

export function chaveHolds(eventoId: string, sessaoId: string): string {
  return `moliere:holds:${eventoId}:${sessaoId}`;
}

export function chaveHoldAssento(eventoId: string, sessaoId: string, assentoId: string): string {
  return `moliere:hold:${eventoId}:${sessaoId}:${assentoId}`;
}

export const HOLD_TTL_SEG = 600;
