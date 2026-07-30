/**
 * medir-contraste-real.mjs — Tipo A de la fórmula: LEGIBILIDAD, medida en píxeles reales.
 *
 * POR QUÉ EXISTE. Hubo cuatro medidores antes y los cuatro mintieron, cada uno por
 * parsear el TEXTO del CSS en vez de mirar la página renderizada:
 *   1. no leían CSS externo  -> nunca vieron una portada hecha con Vite (`/src/main.js`)
 *   2. no resolvían tokens   -> `background:var(--bg)` = "cero fondos detectados"
 *   3. no componían alfas    -> un `rgba(...,.12)` sobre tema claro salía como si fuera negro
 *   4. medían PRODUCTO CRUZADO -> cada texto contra cada fondo, no contra el suyo
 * Y el pecado que los une: imprimían `OK` cuando no habían medido nada.
 *
 * CÓMO MIDE ESTE. No interpreta CSS. Esconde todo el texto, saca una captura, y lee el
 * COLOR DEL PÍXEL detrás de cada frase. Así los gradientes, las fotos, los alfas, los
 * tokens y la herencia dejan de ser casos especiales: se mide lo que ve el ojo.
 *
 * Tres decisiones que importan:
 *   · La caja se toma con `Range`, no con el elemento — la caja del elemento incluye su
 *     propio padding y da falsos negativos (un pie con padding-left:20px reporta left:0).
 *   · Sobre un gradiente se reporta el PEOR punto muestreado, no el promedio. Un gradiente
 *     no tiene un contraste: tiene uno por punto, y el que manda es el peor.
 *   · Si no pudo medir, SALE CON ERROR. Nunca imprime OK vacío.
 *
 * Uso (desde la raíz del proyecto, con el sitio servido):
 *   npx vite preview --port 4318 &
 *   MSYS_NO_PATHCONV=1 node "C:/ruta/medir-contraste-real.mjs" / /tarjetas/ /privacidad/
 *
 * ⚠️ En Git Bash: `MSYS_NO_PATHCONV=1` es obligatorio para que `/tarjetas/` no se convierta
 * en una ruta de Windows — pero entonces la ruta DEL SCRIPT hay que darla al estilo Windows
 * (`C:/...`), porque la protección aplica a todo el comando. Las dos cosas mordieron ya.
 *
 * Variables: BASE (default http://localhost:4318) · ANCHO (default 1280) · CHROME (ruta)
 * Códigos de salida: 0 = sin hallazgos · 1 = hay fallos · 2 = NO PUDO MEDIR · 3 = error
 */

import { createRequire } from "node:module";
import { existsSync } from "node:fs";
import path from "node:path";

// puppeteer-core se resuelve desde el PROYECTO destino, no desde donde vive el script.
// Eso es lo que lo hace portable: el script viaja, las dependencias se quedan en el repo.
function cargarPuppeteer() {
  const req = createRequire(path.join(process.cwd(), "package.json"));
  try {
    return req("puppeteer-core");
  } catch {
    console.error(
      "✖ No encuentro `puppeteer-core` en este proyecto.\n" +
        "  Instalalo con:  npm i -D puppeteer-core\n" +
        "  (usa el Chrome que ya tenés instalado, no descarga un navegador)",
    );
    process.exit(3);
  }
}

const CHROMES = [
  process.env.CHROME,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "/usr/bin/google-chrome",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
].filter(Boolean);

const BASE = process.env.BASE || "http://localhost:4318";
const ANCHO = Number(process.env.ANCHO || 1280);

// Umbrales WCAG 2.2. "Texto grande" (>=24px, o >=18.66px con peso >=700) baja a 3:1.
// Es una excepción ESTRECHA: un 3.2:1 en letra de 14px no pasa, aunque los medidores
// viejos lo etiquetaran "solo texto GRANDE" y quedara ambiguo.
const AA_NORMAL = 4.5;
const AA_GRANDE = 3.0;
const esGrande = (px, peso) => px >= 24 || (px >= 18.66 && Number(peso) >= 700);

// ── Paso 1, dentro del navegador: censar las frases y sus cajas reales ────────
function censar() {
  const visible = (el) => {
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden") return false;
    if (parseFloat(cs.opacity) === 0) return false;
    return true;
  };

  const items = [];
  const caminador = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const vistos = new Set();

  for (let n = caminador.nextNode(); n; n = caminador.nextNode()) {
    const texto = n.nodeValue.replace(/\s+/g, " ").trim();
    if (!texto) continue;
    const el = n.parentElement;
    if (!el || !visible(el)) continue;
    if (["SCRIPT", "STYLE", "NOSCRIPT", "TITLE"].includes(el.tagName)) continue;

    // La caja del TEXTO, no la del elemento: el padding propio del elemento
    // desplaza el borde y produce falsos negativos.
    const r = document.createRange();
    r.selectNodeContents(n);
    const caja = r.getBoundingClientRect();
    r.detach?.();
    if (caja.width < 2 || caja.height < 2) continue;

    const cs = getComputedStyle(el);
    const sel =
      el.tagName.toLowerCase() +
      (el.id ? `#${el.id}` : "") +
      (el.className && typeof el.className === "string"
        ? "." + el.className.trim().split(/\s+/).slice(0, 2).join(".")
        : "");

    // TRAMPA REAL, cazada el 2026-07-30 con `h1.grad` de /tarjetas/: un título pintado
    // con `background-clip:text` tiene `color` TRANSPARENTE — la tinta la pone el
    // gradiente recortado, no la propiedad `color`. Medirlo como texto normal da 1:1
    // (el fondo contra sí mismo) y produce un fallo inventado. No se puede medir con
    // este método: se declara y se mira a ojo. Se busca en el elemento Y en sus
    // ancestros porque el recorte suele vivir en un contenedor.
    let clip = null;
    for (let a = el; a && a !== document.documentElement.parentNode; a = a.parentElement) {
      const acs = getComputedStyle(a);
      const bc = acs.webkitBackgroundClip || acs.backgroundClip;
      if (bc === "text") { clip = true; break; }
    }
    const tintaTransparente = /rgba?\([^)]*,\s*0\s*\)$/.test(cs.color);

    // Deduplicar por (tinta, tamaño, peso, selector): distintas frases con el mismo
    // tratamiento son el mismo hallazgo, y repetirlas ahoga el informe.
    const clave = `${cs.color}|${cs.fontSize}|${cs.fontWeight}|${sel}`;
    if (vistos.has(clave)) continue;
    vistos.add(clave);

    items.push({
      sel,
      tinta: cs.color,
      tintaPintadaPorGradiente: !!(clip && tintaTransparente),
      px: parseFloat(cs.fontSize),
      peso: cs.fontWeight,
      muestra: texto.slice(0, 45),
      x: caja.left + window.scrollX,
      y: caja.top + window.scrollY,
      w: caja.width,
      h: caja.height,
    });
  }
  return items;
}

// ── Paso 3, dentro del navegador: leer los píxeles de la captura ──────────────
// Recibe la captura en base64 y las cajas. Dibuja la imagen en un canvas y muestrea.
// Todo pasa dentro del navegador: así no hace falta un decodificador de PNG en node.
async function muestrear(datosPng, items) {
  const img = new Image();
  await new Promise((ok, err) => {
    img.onload = ok;
    img.onerror = () => err(new Error("no pude cargar la captura"));
    img.src = "data:image/png;base64," + datosPng;
  });

  const cv = document.createElement("canvas");
  cv.width = img.naturalWidth;
  cv.height = img.naturalHeight;
  const ctx = cv.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(img, 0, 0);

  const salida = [];
  for (const it of items) {
    // Rejilla de muestreo dentro de la caja del texto, con un margen para no tocar
    // el borde exacto (donde suele haber antialias del contenedor).
    const px0 = Math.max(0, Math.round(it.x + 1));
    const py0 = Math.max(0, Math.round(it.y + 1));
    const pw = Math.max(1, Math.min(Math.round(it.w - 2), cv.width - px0));
    const ph = Math.max(1, Math.min(Math.round(it.h - 2), cv.height - py0));
    if (pw < 1 || ph < 1 || px0 >= cv.width || py0 >= cv.height) {
      salida.push({ ...it, fueraDeCaptura: true });
      continue;
    }

    const datos = ctx.getImageData(px0, py0, pw, ph).data;
    const pasoX = Math.max(1, Math.floor(pw / 12));
    const pasoY = Math.max(1, Math.floor(ph / 6));

    const puntos = [];
    for (let yy = 0; yy < ph; yy += pasoY) {
      for (let xx = 0; xx < pw; xx += pasoX) {
        const i = (yy * pw + xx) * 4;
        puntos.push([datos[i], datos[i + 1], datos[i + 2]]);
      }
    }
    if (!puntos.length) {
      salida.push({ ...it, fueraDeCaptura: true });
      continue;
    }
    salida.push({ ...it, puntos });
  }
  return salida;
}

// ── Contraste, en node ───────────────────────────────────────────────────────
const canal = (v) => {
  const c = v / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
};
const lum = ([r, g, b]) => 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b);
const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
const parseRgb = (s) => {
  const m = String(s).match(/rgba?\(([^)]+)\)/);
  if (!m) return null;
  const p = m[1].split(",").map((x) => parseFloat(x.trim()));
  return { rgb: [p[0], p[1], p[2]], a: p.length > 3 ? p[3] : 1 };
};
const sobre = (f, fa, b) => f.map((c, i) => fa * c + (1 - fa) * b[i]);
const hex = (c) =>
  "#" + c.map((x) => Math.round(x).toString(16).padStart(2, "0")).join("");

// ── Orquestación ─────────────────────────────────────────────────────────────
const rutas = process.argv.slice(2).filter((a) => !a.startsWith("--"));
if (!rutas.length) {
  console.error(
    "Uso: node medir-contraste-real.mjs <ruta> [ruta...]\n" +
      "  Las rutas son del sitio SERVIDO (ej: / /tarjetas/), no del disco.\n" +
      `  BASE actual: ${BASE}  (cambiala con BASE=http://...)`,
  );
  process.exit(3);
}

const puppeteer = cargarPuppeteer();
const chrome = CHROMES.find((p) => existsSync(p));
if (!chrome) {
  console.error("✖ No encuentro Chrome. Pasá la ruta con CHROME=/ruta/al/chrome");
  process.exit(3);
}

const navegador = await puppeteer.launch({ executablePath: chrome, headless: "new" });
let totalFallos = 0;
const sinMedir = [];
const porPagina = [];

for (const ruta of rutas) {
  const url = new URL(ruta, BASE).href;
  const pagina = await navegador.newPage();
  await pagina.setViewport({ width: ANCHO, height: 900, deviceScaleFactor: 1 });

  let hallazgos = null;
  let error = null;
  try {
    const resp = await pagina.goto(url, { waitUntil: "networkidle0", timeout: 30000 });
    if (!resp || !resp.ok()) throw new Error(`HTTP ${resp ? resp.status() : "sin respuesta"}`);

    // Las animaciones de entrada (reveal en opacity) dejarían texto invisible al medir.
    await pagina.evaluate(() => {
      const s = document.createElement("style");
      s.id = "__medidor_sin_animacion";
      s.textContent =
        "*,*::before,*::after{animation:none!important;transition:none!important}";
      document.head.appendChild(s);
      window.scrollTo(0, document.body.scrollHeight);
    });
    await new Promise((r) => setTimeout(r, 600));
    await pagina.evaluate(() => window.scrollTo(0, 0));
    await new Promise((r) => setTimeout(r, 300));

    const items = await pagina.evaluate(censar);
    if (!items.length) throw new Error("cero frases visibles");

    // Esconder SOLO la tinta: los fondos, gradientes e imágenes quedan intactos.
    await pagina.evaluate(() => {
      const s = document.createElement("style");
      s.id = "__medidor_sin_tinta";
      s.textContent =
        "*,*::before,*::after{color:transparent!important;text-shadow:none!important;" +
        "-webkit-text-fill-color:transparent!important;text-decoration-color:transparent!important}";
      document.head.appendChild(s);
    });

    const png = await pagina.screenshot({ fullPage: true, encoding: "base64" });
    const conPuntos = await pagina.evaluate(muestrear, png, items);

    hallazgos = conPuntos.map((it) => {
      if (it.fueraDeCaptura) return { ...it, indeterminado: "fuera de la captura" };
      if (it.tintaPintadaPorGradiente)
        return {
          ...it,
          puntos: undefined,
          indeterminado: "tinta pintada con background-clip:text — mirar a ojo",
        };
      const t = parseRgb(it.tinta);
      if (!t) return { ...it, indeterminado: "color de texto no reconocido" };

      // El peor punto manda: sobre un gradiente el contraste cambia punto a punto.
      let peor = null;
      for (const p of it.puntos) {
        const tinta = t.a < 1 ? sobre(t.rgb, t.a, p) : t.rgb;
        const r = ratio(tinta, p);
        if (!peor || r < peor.r) peor = { r, fondo: p, tinta };
      }
      const variaMucho =
        new Set(it.puntos.map((p) => hex(p))).size > 1 ? true : false;
      return {
        ...it,
        puntos: undefined,
        ratio: Math.round(peor.r * 100) / 100,
        fondoHex: hex(peor.fondo),
        tintaHex: hex(peor.tinta),
        degradado: variaMucho,
      };
    });
  } catch (e) {
    error = e.message;
  }
  await pagina.close();

  if (error) {
    sinMedir.push(`${ruta} (${error})`);
    porPagina.push({ ruta, url, error });
    continue;
  }

  const medidos = hallazgos.filter((h) => !h.indeterminado);
  const indets = hallazgos.filter((h) => h.indeterminado);
  const fallos = medidos.filter(
    (h) => h.ratio < (esGrande(h.px, h.peso) ? AA_GRANDE : AA_NORMAL),
  );
  totalFallos += fallos.length;
  porPagina.push({ ruta, url, medidos, indets, fallos });
}

await navegador.close();

// ── Informe ──────────────────────────────────────────────────────────────────
for (const p of porPagina) {
  console.log("\n" + "═".repeat(78));
  console.log(`${p.ruta}   →   ${p.url}`);
  console.log("═".repeat(78));
  if (p.error) {
    console.log(`  ⛔ NO PUDO MEDIR: ${p.error}`);
    console.log("     Esto NO es 'sin hallazgos'. Revisá que la ruta sirva contenido.");
    continue;
  }
  console.log(
    `  ${p.medidos.length} tratamientos de texto medidos · ${p.fallos.length} fallan` +
      (p.indets.length ? ` · ${p.indets.length} indeterminados` : ""),
  );
  if (p.fallos.length) {
    console.log("\n  FALLAN AA (peor punto muestreado):");
    console.log("  " + "-".repeat(74));
    for (const f of p.fallos.sort((a, b) => a.ratio - b.ratio)) {
      const umbral = esGrande(f.px, f.peso) ? AA_GRANDE : AA_NORMAL;
      console.log(
        `  ${String(f.ratio).padStart(5)}:1  (min ${umbral})  ${f.tintaHex} sobre ${f.fondoHex}  ` +
          `${Math.round(f.px)}px/${f.peso}${f.degradado ? "  ~degradado" : ""}`,
      );
      console.log(`         ${f.sel}  «${f.muestra}»`);
    }
  }
  for (const i of p.indets.slice(0, 5))
    console.log(`  · indeterminado (${i.indeterminado}): ${i.sel} «${i.muestra}»`);
  if (!p.fallos.length && !p.indets.length) console.log("  ✅ sin hallazgos");
}

console.log("\n" + "═".repeat(78));
console.log(
  `RESUMEN: ${rutas.length} rutas · ${totalFallos} fallos · ${sinMedir.length} sin medir`,
);
if (sinMedir.length) {
  console.log("\n⛔ SIN MEDIR (esto NO es 'aprobado'):");
  sinMedir.forEach((s) => console.log(`   · ${s}`));
}
console.log(
  "\nNota: pasar el umbral no alcanza. Hay que mirar la ESCALERA — un color puede\n" +
    "cumplir contra el fondo y arruinar la jerarquía igual si se acerca al nivel de arriba.",
);
console.log("═".repeat(78));

// "No pudo medir" pesa MÁS que "encontré fallos": un hallazgo se arregla, un hueco de
// instrumento te da falsa confianza y no se ve.
if (sinMedir.length) process.exit(2);
process.exit(totalFallos > 0 ? 1 : 0);
