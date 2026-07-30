# Trampas — las que ya costaron tiempo

> Todas estas se detectaron en producción. **Ninguna se ve en escritorio.**
> Origen: `alijerik/docs/LENGUAJE-VISUAL.md` (2026-07-26 → 2026-07-27).

---

## 1. El shorthand `padding` que borra el margen lateral — SILENCIOSO

La peor de todas, porque **no rompe nada visible en escritorio** y estuvo en producción
sin que nadie la notara.

```css
.wrap{max-width:1080px;margin:0 auto;padding:0 28px}
.sec{padding:64px 0}          /* ← MAL: anula el 28px lateral de .wrap */
```

Las secciones llevan **las dos clases en el mismo elemento** (`class="wrap sec"`). Misma
especificidad, así que gana la que se declara después. El shorthand `padding:64px 0`
reescribe los cuatro lados: el lateral pasa a `0`.

En escritorio no se ve, porque `max-width:1080px` deja aire de sobra a los lados.
**En móvil el texto queda pegado al borde de la pantalla.**

```css
.sec{padding-top:64px;padding-bottom:64px}   /* ← BIEN: longhand */
```

**Regla general:** ningún shorthand `padding` en una clase que comparta elemento con la
clase que define el ancho y el margen lateral. Aplica igual a modificadores (`.cta-fin`,
`.sec--aire`) y al equivalente en Tailwind (`py-16` está bien, `p-16` sobre el mismo
elemento del contenedor no).

### Cómo medirlo bien — o salen bugs fantasma

`getBoundingClientRect()` de un elemento devuelve la **caja**, que incluye su propio
padding. Un pie de foto con `padding-left:20px` reporta `left: 0` aunque su texto empiece
en 20. Para el borde real del texto hay que medir un `Range` sobre el contenido:

```js
const r = document.createRange();
r.selectNodeContents(el);
r.getBoundingClientRect();   // ← este sí es el borde del texto
```

Sin esto salen falsos positivos y se persiguen bugs que no existen.

---

## 2. `overflow-x` en `body` NO recorta nada

Se **propaga al viewport**. Los motivos que sangran fuera del contenedor ensancharon la
página a 1460px en escritorio y 540px en móvil.

```css
main{overflow-x:clip}   /* en el contenedor raíz, no en body */
```

`clip` y no `hidden`: `hidden` fuerza `overflow-y:auto` y mete una barra de scroll interna.
`clip` tampoco rompe `position:sticky` del encabezado.

---

## 3. Sangrado completo sin `100vw`

`width:100vw` incluye el ancho de la barra de scroll → **desborda siempre**.

Si la sección es **hija directa del contenedor raíz**, ya ocupa el ancho completo sola.
No hace falta ningún truco.

---

## 4. El reveal que arrancaba en `opacity: 0`

Un navegador headless que renderice sin scrollear resuelve `animation-timeline` y ve la
página **vacía** — sin títulos, sin tabla, sin cartas. Se detectó porque las capturas de
verificación salieron en blanco.

Los rastreadores leen el DOM y no se ven afectados para indexación, pero cualquier
herramienta que renderice y capture sí. **Piso de opacidad en `.3`.**

### La variante GSAP de la misma trampa (2026-07-27)

`gsap.from(el, {opacity: 0, scrollTrigger})` tiene `immediateRender` activo — aplica el
`opacity: 0` **al cargar** y solo lo revierte cuando el trigger dispara. Un comentario en
el código juraba "el contenido es visible por defecto"; la portada tenía **38 elementos
con texto invisibles**.

```js
// MAL
gsap.from(el, {opacity: 0, y: 26, scrollTrigger: {...}})

// BIEN — estado inicial explícito, piso .3, nunca invisible
gsap.fromTo(el, {opacity: .3, y: 26}, {opacity: 1, y: 0, scrollTrigger: {...}})
```

Y el **estado inicial en CSS** (`[data-reveal]`) también arranca en `.3` — el rescate
`.no-anim` solo cubre `prefers-reduced-motion`, no un JS que falló en cargar.

### La trampa al MEDIR opacidad

`getComputedStyle(el).opacity` devuelve `"1"` aunque un ancestro tenga `opacity: 0` — la
opacidad **no se hereda como valor, se compone al pintar**. Para auditar hay que
multiplicar la del elemento por la de todos sus ancestros:

```js
function opacidadReal(el){
  let o = 1;
  for (let n = el; n && n !== document.documentElement; n = n.parentElement){
    o *= parseFloat(getComputedStyle(n).opacity || 1);
  }
  return o;
}
```

Implementación de referencia: `alijerik/scripts/verificar-rutas.mjs`.

---

## Cómo verificar, en orden

1. Construir y servir de verdad (`npm run build` + preview), no confiar en el dev server.
2. **Mirar** la página a 1440px y a 390px. No describirla — abrirla.
3. Medir el borde izquierdo real del texto a 390px con `Range` (≥ 20px).
4. Renderizar headless sin scrollear y confirmar que la captura NO sale en blanco.
5. Activar `prefers-reduced-motion` y confirmar que la página se ve completa.
6. Confirmar que no hay scroll horizontal en ninguno de los dos anchos.
