---
name: formula-antislop
description: Receta de composición para que una interfaz NO parezca hecha con IA. "Se ve IA" es un problema de RITMO, no de componentes — cambiar la librería de íconos no arregla nada. Úsala ANTES de escribir la primera línea de HTML/JSX de cualquier página, landing, sección o vista nueva, y también para auditar algo que "se ve genérico", "se ve plantilla", "se ve AI slop" o "se ve hecho con IA". Cubre romper la métrica, prueba real sobre ilustración, motivo propietario derivado de una sola idea, honestidad específica en el copy, movimiento que nunca esconde contenido, y las trampas de CSS/JS que ya costaron tiempo (padding shorthand, overflow-x, 100vw, reveal en opacity 0). INCLUYE UN PASO 0 DE TRIAGE que puede mandarte a otra herramienta: si la queja es "está feo", "me cansa la vista", "se ve plana/apagada" o "no encuentro nada", eso NO es ritmo — es legibilidad o jerarquía, y se MIDE (ver references/feo-no-es-slop.md, con el método de la escalera de contraste y las trampas del alfa, del fondo secundario y de invocar WCAG donde no aplica). Trigger words: página nueva, landing, hero, sección, rediseño, se ve IA, se ve genérico, anti-slop, lenguaje visual, ritmo visual, está feo, se ve fea, colores feos, se ve plana, me cansa la vista, contraste, jerarquía visual, legibilidad.
---

# Fórmula anti-slop — lenguaje visual

> Formulada por JC el 2026-07-26 construyendo `/eficore/alternativa-panamena/`.
> **Regla dura: aplica a CUALQUIER construcción visual, en cualquier proyecto.**
> Origen y caso completo: `references/origen-alijerik.md`.

---

## La idea central

**"Se ve hecho con IA" es un problema de ritmo, no de componentes.**

Lo que delata al contenido generado es que **todas las secciones tienen la misma forma**:
etiqueta, título, párrafo, rejilla de cartas. Repetir. Esa uniformidad métrica es la firma.

**Corolario que hay que decir en voz alta: cambiar de librería de íconos no arregla nada.**
El diagnóstico intuitivo ("los íconos se ven de librería") apunta al síntoma. Un diseñador
humano rompe el compás; una plantilla no.

**Cómo diagnosticar antes de tocar nada:** contar cuántas secciones abren igual, cuántas
comparten padding y cuántas comparten ancho. Si el número es "casi todas", ahí está el
problema — no en los íconos, no en la paleta, no en el copy.

---

## Protocolo — el orden importa

0. **Triage: ¿esto es slop, o es otra cosa?** Si la queja es *"se ve genérico / plantilla /
   hecho con IA"*, seguí. Si es *"me cansa la vista" / "no encuentro nada" / "se ve plana"*
   —o un *"está feo"* a secas sin síntoma—, **pará: eso no es ritmo, es legibilidad o
   jerarquía, y se MIDE.** Correr esta fórmula ahí no lo va a encontrar. Leer
   `references/feo-no-es-slop.md`. *(Esto está acá porque ya pasó: la fórmula no encontró
   un defecto de contraste que se arregló con tres valores de color.)*
1. **Instanciar el proyecto.** Antes de escribir HTML, resolver las cinco variables de
   `references/instanciar-por-proyecto.md`. La más importante es **la UNA idea** de la que
   se deriva todo lo visual. Si el proyecto no la tiene, **preguntarla — no inventarla.**
2. **Construir con los seis movimientos** de abajo.
3. **Correr el checklist** antes de dar nada por terminado. Verificar mirando, no asumiendo.

---

## Los seis movimientos

### 1. Romper la métrica

No decorar las secciones — **variar su forma**. En una página de ~9 secciones,
**al menos tres deben tener una silueta distinta** de las demás:

| Movimiento | Implementación |
|---|---|
| Una sección a sangre completa entre secciones contenidas | Hija directa del contenedor raíz, sin la clase de ancho. **Nunca `100vw`** (ver trampas) |
| Un bloque asimétrico de dos columnas | `grid-template-columns: 1.15fr .85fr`, y una variante invertida |
| Una sección sin rejilla | Solo texto y un aviso destacado |
| Una tarjeta desplazada del flujo | `max-width` menor al del cuerpo |

Variar también **el padding vertical** y **el ancho máximo** entre secciones. Si todas
respiran igual, siguen siendo la misma sección con distinto texto.

### 2. Prueba real por encima de ilustración

**Capturas reales del producto, con datos sintéticos.** Es el mayor golpe anti-IA
disponible y es gratis: **ninguna IA puede fabricar tu interfaz real.**

- Datos sintéticos siempre. Tenant de demo, números marcados "(ficticio)", contactos
  simulados. **Verificar cada captura abriéndola antes de publicar.**
- Pie de foto que lo declare: *"Captura real de la plataforma. Datos de demostración."*
  La transparencia suma credibilidad.
- Elegir capturas que **prueben un argumento del texto**, no que decoren.
- **Jamás datos reales de clientes o pacientes.** Ni nombres, ni teléfonos, ni conversaciones.

Si el producto todavía no tiene interfaz que capturar, el sustituto es un artefacto real
del proyecto (un diagrama propio, una tabla de datos verdaderos), **nunca una ilustración
de stock**.

### 3. Un lenguaje propietario, no una librería

**Las librerías de ilustración te catalogan, no te diferencian.** unDraw, Storyset,
Humaaans y los packs de íconos 3D son la firma visual de "plantilla de startup"; un
comprador que vio cien landings las reconoce al instante. **Nunca proponerlas.**

Lo que sí funciona: **derivar todo de una sola idea** — la variable del proyecto.
En Alijerik/Eficore es el latte art (vapor, corazón, grano, vertido). Todo rima porque
todo sale de la taza.

Reglas de los motivos, si el proyecto usa este recurso:
- Line art, trazo de 0.7–1.3px, **nunca relleno**
- Opacidad **.05 a .07**. Si se nota, está mal
- `z-index: -1`, siempre detrás del contenido
- Posicionados para **sangrar fuera del contenedor** y recortarse
- Colores de la paleta del proyecto, no colores nuevos
- Un set cerrado de 3–5 motivos, todos hijos de la misma idea

Los íconos de librería (Phosphor y similares) se quedan **solo para listas funcionales**,
que es una convención de producto, no decoración.

### 4. Honestidad específica en el copy

El texto generado es vago y uniformemente positivo. El antídoto textual es el mismo que
el visual — romper el patrón:

- **Declarar los límites.** Una sección de "hasta dónde llega esto".
- **Números concretos y verificables.** "$200 a $1,000", "multa de B/.8,000".
  Lo específico no se puede inventar; lo vago sí.
- **Pero nunca apuñalarse.** Decir lo que no haces es credibilidad; mandar al comprador
  con la competencia es un autogol. Se elimina cualquier frase que recomiende al rival.
- Un límite se declara como **alcance deliberado**, no como carencia:
  "Convive con tu sistema clínico" en vez de "no se integra con sistemas HIS".
- **Nunca describir por posición en pantalla** ("la tarjeta de arriba", "la imagen de la
  izquierda") — el responsive reordena y el copy no.

### 5. Movimiento que nunca esconde

Reveals al scroll en **CSS puro** cuando se pueda, con `animation-timeline: view()`.
Cero JavaScript, cero librerías de animación.

```css
@media (prefers-reduced-motion: no-preference){
  @supports (animation-timeline: view()){
    .reveal{
      animation:reveal-in linear both;
      animation-timeline:view();
      animation-range:entry 4% cover 26%;
    }
    @keyframes reveal-in{
      from{opacity:.3;transform:translateY(26px)}  /* .3, NUNCA 0 */
      to{opacity:1;transform:none}
    }
  }
}
```

**Piso de opacidad en `.3`. Nunca `0`.** Un navegador headless que renderiza sin scrollear
ve la página vacía, y cualquier herramienta que capture saca imágenes en blanco.
La variante con GSAP y las trampas al *medir* están en `references/trampas.md` — leerlas.

Soporte de `animation-timeline`: Chrome, Edge, Safari 26+. **Firefox no por defecto** —
ahí la página se ve completa y estática. Es mejora progresiva, no falla.

### 6. Restricciones técnicas que protegen el propósito

Toda página existe para algo. **El diseño no puede costar eso.** Definir qué defiende la
página y convertirlo en restricción dura antes de construir.

Ejemplo real (páginas AEO de Alijerik, que existen para ser citadas por asistentes de IA):
- **Cero JavaScript.** ~44 KB de HTML.
- **Todo el contenido en el DOM**, legible sin JS.
- **Cero recursos externos** salvo la tipografía.
- Imágenes con `width`/`height` explícitos, `loading="lazy"`, `alt` descriptivo.
- Tablas dentro de su propio `overflow-x:auto`; el cuerpo nunca scrollea de lado.

En una app con sesión el propósito es otro (velocidad percibida, accesibilidad, offline) y
las restricciones cambian. **Lo que no cambia es que existan y se escriban.**

---

## Trampas — leer `references/trampas.md`

Cuatro trampas que ya costaron tiempo en producción y **ninguna es visible en escritorio**:

1. El shorthand `padding` que borra el margen lateral — silenciosa, estuvo en producción.
2. `overflow-x` en `body` no recorta nada; va en el contenedor raíz y con `clip`.
3. Sangrado completo con `100vw` desborda siempre.
4. El reveal que arranca en `opacity: 0` deja la página invisible para quien renderiza.

Y dos trampas al **medir**, que producen bugs fantasma:
`getBoundingClientRect()` devuelve la caja (incluye padding) → hay que medir con `Range`.
`getComputedStyle(el).opacity` ignora la opacidad de los ancestros → hay que componerla.

---

## Checklist antes de dar una página por terminada

**Universal:**
- [ ] ¿Al menos 3 secciones con silueta distinta de las demás?
- [ ] ¿Varía el padding vertical y el ancho máximo entre secciones?
- [ ] ¿Al menos una prueba real (captura con datos sintéticos), verificada mirándola?
- [ ] ¿Esa prueba sostiene un argumento del texto, o solo decora?
- [ ] ¿Cero librerías de ilustración?
- [ ] ¿Los motivos salen de UNA sola idea del proyecto, a opacidad .05–.07, detrás del contenido?
- [ ] ¿`overflow-x:clip` en el contenedor raíz (no en `body`)?
- [ ] ¿Ningún shorthand `padding` en clases que compartan elemento con la clase de ancho?
- [ ] ¿Medido el borde IZQUIERDO REAL del texto a 390px? (≥ 20px, con `Range`, no con la caja)
- [ ] ¿Todo reveal arranca en `.3` y no en `0`? (incluido el estado inicial en CSS)
- [ ] ¿Sección de límites redactada como alcance y sin recomendar a la competencia?
- [ ] ¿Al menos un dato numérico verificable por sección argumentativa?
- [ ] ¿Ningún copy que describa por posición en pantalla?
- [ ] ¿Verificado a 1440px **y** 390px sin desbordamiento horizontal?
- [ ] ¿`prefers-reduced-motion` renderiza la página completa?

**Condicional (si el propósito es AEO / ser citado por IA):**
- [ ] ¿Cero JavaScript y todo el contenido en el DOM sin JS?
- [ ] ¿`<h1>` único, `meta description` de 150–160, FAQ literal, JSON-LD?
- [ ] ¿La página está enlazada desde algún lado? (una huérfana no se indexa)

---

## Alcance de aplicación — la excepción que importa

**NO aplica** cuando el problema es legibilidad, contraste o jerarquía — eso se mide y no se
compone. Ver el paso 0 del protocolo y `references/feo-no-es-slop.md`.

**Sí aplica** a páginas de contenido y vistas nuevas.

**Cuidado con las páginas que ya tienen una secuencia de hero propia** (animación en canvas,
un artefacto único). Esas ya tienen algo más distintivo que esta fórmula. Ahí la receta se
aplica **solo a las secciones de contenido debajo del hero**.

> **Sustituir algo único por una receta repetible es un retroceso.** La fórmula es el piso,
> no el techo.
