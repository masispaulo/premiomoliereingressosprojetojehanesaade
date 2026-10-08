import { copyFileSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, isAbsolute, resolve } from "node:path";
import {
  ANOTACOES_FOTO, FILEIRAS_PLATEIA, contornoFrisa, grupoPlateia,
  layoutsFrisas, lugaresNaFrisa, numerosDaFileira, posicaoFrisa,
  posicaoPlateia, validarCapacidade, yFileira,
} from "../src/data/plant-terreo.ts";

const destino = process.argv[2] ?? resolve(process.cwd(), "outputs", "planta-palco-rio.svg");
if (!isAbsolute(destino)) throw new Error("Informe um caminho absoluto para o SVG de saída.");
const cap = validarCapacidade();
if (!cap.ok) throw new Error("IDs duplicados ou frisas faltantes na planta.");
const cores = ["#b37b3d", "#315e6a", "#447b79", "#a55e71"];
const p = [];
const text = (x, y, value, cls, extra = "") => `<text x="${x}" y="${y}" class="${cls}" ${extra}>${value}</text>`;
const seat = (x, y, n, sector, id, fill, r) => `<g id="${id}" class="lugar ${sector}" data-fidelidade="reconstrucao-parcial"><circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="#fff" stroke-width="1.1"/>${text(x, y + 2.8, String(n), "seat-number", 'text-anchor="middle"')}</g>`;

p.push(`<svg xmlns="http://www.w3.org/2000/svg" width="1020" height="1040" viewBox="0 0 1020 1040" role="img" aria-labelledby="titulo descricao">
<title id="titulo">Pavimento térreo — reconstrução parcial da foto</title>
<desc id="descricao">Desenho editável com palco, plateia em três blocos e 24 frisas. Números individuais em parte inferidos; não é inventário oficial nem planta em escala.</desc>
<style><![CDATA[
.header{font:700 11px Arial,sans-serif;letter-spacing:3px;fill:#a57a55}.title{font:normal 51px Georgia,serif;fill:#263b40}.sub{font:14px Arial,sans-serif;fill:#68807d}.stage{font:700 22px Georgia,serif;letter-spacing:5px;fill:#f8f1df}.zone{font:700 12px Arial,sans-serif;letter-spacing:2px;fill:#617a79}.small{font:700 10px Arial,sans-serif;fill:#9d6972}.box{font:700 10px Arial,sans-serif;fill:#fff}.box-top{font:700 10px Arial,sans-serif;fill:#67566a}.seat-number{font:700 7px Arial,sans-serif;fill:#fff;pointer-events:none}.legend{font:700 11px Arial,sans-serif;fill:#263b40}.note{font:12px Arial,sans-serif;fill:#778b86}
]]></style>
<rect width="1020" height="1040" fill="#f6f4ee"/><path d="M55 28 H965" stroke="#263b40" stroke-width="2"/>
${text(55, 62, "PALCO RIO  /  ESTUDO DA PLANTA", "header")}
${text(55, 115, "Pavimento térreo", "title")}
${text(965, 113, "SVG EDITÁVEL · NÃO OFICIAL", "header", 'text-anchor="end"')}
${text(55, 142, "Reconstrução parcial da foto enviada: corredores e setores visíveis; parte dos números foi estimada.", "sub")}
<g id="mapa" transform="translate(120 168)">
<rect x="0" y="0" width="780" height="745" rx="20" fill="#f8f7f2" stroke="#e0e5dd"/>
<g id="setores-da-plateia" stroke="#d6ddd4" stroke-width="1.5">
<path d="M175 174 Q210 184 241 186 L240 295 Q204 290 162 274 Z" fill="#f1e2bd"/>
<path d="M255 187 Q390 210 525 187 L527 298 Q390 316 253 298 Z" fill="#f1e2bd"/>
<path d="M539 186 Q570 184 605 174 L618 274 Q576 290 540 295 Z" fill="#f1e2bd"/>
<path d="M159 279 Q201 299 239 301 L238 451 Q200 447 154 428 Z" fill="#d2e5e6"/>
<path d="M257 305 Q390 323 523 305 L523 451 Q390 475 257 451 Z" fill="#d2e5e6"/>
<path d="M541 301 Q579 299 621 279 L626 428 Q580 447 542 451 Z" fill="#d2e5e6"/>
<path d="M155 453 Q202 471 239 473 L247 585 Q211 582 182 560 Z" fill="#d5e5df"/>
<path d="M258 459 Q390 479 522 459 L514 656 Q390 701 266 656 Z" fill="#d5e5df"/>
<path d="M541 473 Q578 471 625 453 L598 560 Q569 582 533 585 Z" fill="#d5e5df"/>
</g>
<g id="palco"><path d="M226 43 Q390 73 554 43 L554 110 Q390 154 226 110 Z" fill="#263c43"/><path d="M226 110 Q390 154 554 110" fill="none" stroke="#c69e67" stroke-width="5"/>${text(390, 108, "PALCO", "stage", 'text-anchor="middle"')}</g>
${text(390, 178, "PLATEIA TÉRREA", "zone", 'text-anchor="middle"')}
${text(108, 56, "LADO PAR", "zone", 'text-anchor="middle"')}${text(672, 56, "LADO ÍMPAR", "zone", 'text-anchor="middle"')}
${text(104, 146, "FRISAS", "zone", 'text-anchor="middle"')}${text(676, 146, "FRISAS", "zone", 'text-anchor="middle"')}
<path d="M58 157 Q115 144 164 170 L151 384 Q105 377 44 385 Z" fill="#8e455e" opacity=".24"/>
<path d="M616 170 Q665 144 722 157 L736 385 Q675 377 629 384 Z" fill="#8e455e" opacity=".24"/>
<path d="M46 420 Q115 408 152 413 Q156 527 222 668 Q117 656 53 555 Z" fill="#8e455e" opacity=".24"/>
<path d="M628 413 Q665 408 734 420 L727 555 Q663 656 558 668 Q624 527 628 413 Z" fill="#8e455e" opacity=".24"/>
<g id="caixas-frisas">`);
for (const box of layoutsFrisas()) {
  const tx = box.lado === "par" ? box.x + 7 : box.x + box.w - 7;
  p.push(`<g id="frisa-caixa-${box.numero}"><path d="${contornoFrisa(box)}" fill="${box.faixa === "superior" ? "#e8eaf0" : "#a36678"}" stroke="#774458" stroke-width="1.1"/>${text(tx, box.y + 13, String(box.numero).padStart(2, "0"), box.faixa === "superior" ? "box-top" : "box", `text-anchor="${box.lado === "par" ? "start" : "end"}"`)}</g>`);
}
p.push(`</g>${text(98, 402, "SAÍDA · RAMPA", "zone", 'text-anchor="middle"')}${text(682, 402, "SAÍDA · ESCADA", "zone", 'text-anchor="middle"')}<g id="fileiras-plateia">`);
FILEIRAS_PLATEIA.forEach((fileira, fi) => {
  p.push(text(249, yFileira(fi) + 4, fileira, "small", 'text-anchor="middle"'), text(531, yFileira(fi) + 4, fileira, "small", 'text-anchor="middle"'));
  const nums = numerosDaFileira(fileira);
  nums.forEach((numero, si) => {
    const { x, y, bloco } = posicaoPlateia(fi, si, nums.length);
    p.push(seat(x, y, numero, "plateia", `plateia-${fileira}-${String(numero).padStart(2, "0")}`, cores[grupoPlateia(fileira)], bloco === "centro" ? 8.8 : 7.2));
  });
});
p.push('</g><g id="lugares-frisas">');
for (const box of layoutsFrisas()) {
  for (let lugar = 1; lugar <= lugaresNaFrisa(box.numero); lugar++) {
    const { x, y } = posicaoFrisa(box, lugar - 1);
    p.push(seat(x, y, lugar, "frisa", `frisa-${String(box.numero).padStart(2, "0")}-${lugar}`, cores[3], box.faixa === "superior" ? 6.5 : 7));
  }
}
p.push(`</g><path d="M225 696 Q390 729 555 696" fill="none" stroke="#b4c1bd" stroke-width="2"/>${text(390, 721, "ENTRADA · PLATEIA TÉRREA", "zone", 'text-anchor="middle"')}</g>
<g id="legenda" transform="translate(55 958)"><circle cx="0" cy="0" r="8" fill="${cores[0]}"/>${text(15, 4, "A–D · FRENTE", "legend")}<circle cx="208" cy="0" r="8" fill="${cores[1]}"/>${text(223, 4, "E–I · CENTRO", "legend")}<circle cx="416" cy="0" r="8" fill="${cores[2]}"/>${text(431, 4, "J–Q · FUNDO", "legend")}<circle cx="624" cy="0" r="8" fill="${cores[3]}"/>${text(639, 4, "FRISAS 1–24", "legend")}</g>
${text(55, 998, `Foto: plateia impressa parece ${ANOTACOES_FOTO.plateiaImpressa}, correção manuscrita parece ${ANOTACOES_FOTO.plateiaCorrigidaAproximada}; frisas ${ANOTACOES_FOTO.frisasImpressas} no total.`, "note")}
${text(55, 1019, `Este desenho tem ${cap.plateia} pontos de plateia e ${cap.frisas} posições demonstrativas de frisas; NÃO é inventário oficial ou base para vendas.`, "note")}
</svg>`);
mkdirSync(dirname(destino), { recursive: true });
writeFileSync(destino, p.join("\n"), "utf8");
if (!process.argv[2]) copyFileSync(destino, resolve(process.cwd(), "public", "planta-palco-rio.svg"));
console.log(destino, cap);
