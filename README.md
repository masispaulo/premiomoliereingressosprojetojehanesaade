# Prêmio Molière — bilheteria (Maison Dijon)

Plataforma de **ingressos demonstrativos** para a Gala Prêmio Molière 2027 no Theatro Municipal do Rio de Janeiro. Conteúdo alinhado a [lesmolieres.com.br](https://www.lesmolieres.com.br) e identidade [Dijon Brasil](https://dijonbrasil.com).

Destinada a substituir o link **Ingressos** do site institucional (hoje placeholder).

## Rodar

```powershell
cd premio-moliere-ingressos
npm install
npm run dev
```

## Rotas

| Rota | Conteúdo |
|------|----------|
| `/` | Início · retorno 2027 · CTA ingressos |
| `/o-premio` | História, 11 categorias, consagrados |
| `/a-gala` | Cerimônia no Municipal |
| `/ingressos` | Sessões da gala |
| `/ingressos/gala-moliere-2027` | Escolha de lugares (plateia/frisas) |

## Mapa de assentos

Fluxo reutilizado do protótipo do Municipal; **planta a refinar** conforme referência oficial / Manus.

## Deploy

```powershell
npx vercel --prod
```

`vercel.json` inclui rewrite SPA para React Router.
