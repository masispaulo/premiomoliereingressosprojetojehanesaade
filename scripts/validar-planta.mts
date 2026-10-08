import {
  ANOTACOES_FOTO, FILEIRAS_PLATEIA, gruposDaFileira,
  layoutsFrisas, numerosDaFileira, posicaoPlateia, validarCapacidade,
} from "../src/data/plant-terreo.ts";

const erros: string[] = [];
if (FILEIRAS_PLATEIA.length !== 16 || FILEIRAS_PLATEIA.includes("K" as never)) erros.push("Fileiras A–Q, sem K");
if (layoutsFrisas().length !== 24) erros.push("Frisas 1–24");
for (const box of layoutsFrisas()) {
  if ((box.numero % 2 ? "impar" : "par") !== box.lado) erros.push(`Paridade da frisa ${box.numero}`);
}
for (const [i, f] of FILEIRAS_PLATEIA.entries()) {
  const nums = numerosDaFileira(f);
  if (new Set(nums).size !== nums.length) erros.push(`Números repetidos na fileira ${f}`);
  for (let j = 0; j < nums.length; j++) {
    const { x, y } = posicaoPlateia(i, j, nums.length);
    if (x < 0 || x > 780 || y < 0 || y > 745) erros.push(`Fora do viewBox: ${f}-${nums[j]}`);
  }
  const g = gruposDaFileira(f);
  if (g["ala-par"].length && g.centro.length) {
    const last = posicaoPlateia(i, g["ala-par"].length - 1, nums.length).x;
    const first = posicaoPlateia(i, g["ala-par"].length, nums.length).x;
    if (first - last < 18) erros.push(`Corredor esquerdo estreito em ${f}`);
  }
  console.log(`${f}: ${nums.length} posições reconstruídas`);
}
const e = gruposDaFileira("E");
if (e.centro.join(" ") !== "12 14 16 18 20 22 21 19 17 15 13 11") erros.push("Transcrição do centro E");
if (numerosDaFileira("Q").join(" ") !== "2 4 6 8 7 5 3 1") erros.push("Transcrição Q");
const cap = validarCapacidade();
if (!cap.ok) erros.push("IDs duplicados ou frisas ausentes");
console.log(`\nModelo parcial: ${cap.plateia} pontos de plateia + ${cap.frisas} pontos esquemáticos de frisas.`);
console.log(`Foto borrada: plateia impressa parece ${ANOTACOES_FOTO.plateiaImpressa}, manuscrito parece ${ANOTACOES_FOTO.plateiaCorrigidaAproximada}; frisas ${ANOTACOES_FOTO.frisasImpressas}. Não igualar estas contagens por invenção.`);
if (erros.length) { console.error(erros); process.exit(1); }
console.log("✓ Estrutura interna consistente; fidelidade lugar a lugar ainda não certificada.");
