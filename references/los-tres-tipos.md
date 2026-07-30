# Los tres tipos — el mapa completo, para usarlo en cualquier proyecto

> Escrito el 2026-07-30 después de que JC preguntara: *"¿son tres criterios base, contraste,
> antislop, y qué más? ¿o se me escapa algo?"*
>
> **La respuesta corta: no son tres criterios. Son tres TIPOS de criterio**, y confundirlos
> es lo que hace perder tiempo. Contraste y anti-slop ni siquiera son la misma clase de
> cosa: uno da un número y el otro es un juicio. Por eso el mismo proyecto diagnosticó mal
> dos veces y estuvo a punto de hacer el trabajo más caro del sprint por el motivo
> equivocado.

---

## El mapa

| tipo | cómo se resuelve | qué pasa si lo tratás como otro tipo |
|---|---|---|
| **A — se MIDE** | un número y un pasa/falla | lo "arreglás" a ojo y no sabés si mejoró |
| **B — se COMPONE** | juicio con receta | lo medís y no encontrás nada, porque no hay número que delate el ritmo |
| **C — se VERIFICA** | existe o no existe | queda para "después" y después nunca llega |

**La pregunta que enruta:** ¿lo que estoy mirando tiene un número, tiene una forma, o tiene
un estado? Número → A. Forma → B. Estado → C.

---

## Tipo A — LEGIBILIDAD: se mide

Da un número. Si no tenés el número, no opinás.

- **Contraste texto/fondo** ≥ 4.5:1. Texto grande (≥24px, o ≥18.66px con peso ≥700) ≥ 3:1.
  Componentes de interfaz y estados ≥ 3:1 (WCAG 1.4.11).
- **La ESCALERA entre niveles**, no sólo cada nivel contra el fondo. Menos de ~1.25× entre
  escalones consecutivos y dejaron de ser dos niveles. *(Método completo y los dos casos
  reales en `feo-no-es-slop.md`.)*
- **El alfa compuesto contra el fondo REAL.** Un color con alfa no tiene un contraste: tiene
  uno por cada fondo sobre el que se pinta.
- **La tinta se invierte con el TEMA.** Si hay tema claro y oscuro, el texto sobre un relleno
  de marca no puede ser un color fijo. Blanco sobre el naranja claro pasa; sobre el naranja
  del tema oscuro da 3.00 y falla. Un token por tema, no uno por color de fondo.
- **Tamaño mínimo de objetivo: 24×24 px CSS** (WCAG 2.2 SC 2.5.8). Va acá y no en C porque
  se mide, y es **la restricción que más rework evita**: si apretás paddings para ganar
  densidad y después tenés que agrandar los objetivos, rehacés el espaciado entero.

## Tipo B — RITMO: se compone

No hay número que lo delate. Es la fórmula anti-slop y está en `SKILL.md`: romper la
métrica, prueba real sobre ilustración, motivo propietario derivado de UNA idea, honestidad
específica en el copy, movimiento que nunca esconde, restricciones técnicas que protegen el
propósito.

**Señal de que estás en B y no en A:** la queja es *"se ve genérico / plantilla / hecho con
IA"*. Si la queja es *"me cansa la vista"*, estás en A y la fórmula no lo va a encontrar.

## Tipo C — ESTRUCTURA: se verifica

Ni número ni gusto. **Existe o no existe**, y por eso se olvida: nada duele hasta que
alguien lo necesita.

- **El estado no puede depender sólo del color** (WCAG 1.4.1). Si "abierto" y "cerrado" se
  distinguen por verde y rojo, no se distinguen. Forma, texto o ícono, además del color.
- **`:focus-visible` diseñado a propósito.** Si no lo definís, el navegador pinta su anillo
  por defecto encima de tu pantalla nueva. *(Pasó: un aro negro grueso sobre un reproductor
  de audio, en producción, en la misma captura donde se cazaba otro bug.)*
- **`prefers-reduced-motion` respetado** en todo lo que se mueva.
- **UN sistema de tokens, y ningún token con dos valores.** *(Pasó: `--plasma` valía
  `#00e5ff` en dos páginas y `#18e3ff` en otras tres. Mismo nombre, dos colores, deriva
  silenciosa.)*
- **Marcas distintas pueden verse distinto; el MÉTODO no cambia.** Si un dominio alberga
  varias marcas, A y C son idénticos en todas y B es libre por marca. "Cónsonas" no
  significa misma paleta: significa mismo método.
- **Responsive verificado en el aparato real**, no en el emulador.
- **Copy sin posición en pantalla.** "La tarjeta de arriba" se rompe cuando el responsive
  reordena, y el copy no se entera. Vale también para instrucciones externas: un texto de
  App Review que dice *"apretá el botón naranja"* queda mintiendo cuando cambia el diseño.

---

## La meta-regla, que vale más que los tres tipos

> **Cada criterio necesita un medidor, y el medidor necesita su propia prueba.**

No es prudencia teórica. Es la conclusión de que **seis instrumentos mintieron en este mismo
proyecto**, y cinco de los seis produjeron números con cara de dato:

| # | qué hizo el instrumento | cómo se descubrió |
|---|---|---|
| 1 | Midió el contraste con hexes **escritos a mano** que no existían en el CSS, y publicó "1.46:1" de colores inventados. De paso invocó WCAG 1.4.11 donde no aplicaba. | Al ir a aplicar el arreglo |
| 2 | Un medidor nuevo nació tomando **gradientes decorativos como fondos** → todo salía `BAJO`. El mismo pecado que decía combatir. | Revisando por qué fallaba todo |
| 3 | `_rgb()` devolvía canales en **0..1** y se convirtieron a hex como si fueran 0..255 → el fondo compuesto salía negro y el resultado **INVERTIDO**: "16.66 ✅" para algo que da **1.04**. | Porque el número era demasiado bueno para el color que se veía |
| 4 | Un `cd` que **persistió entre comandos** hizo correr el medidor desde el repo equivocado; el vacío se leyó como "0 fondos detectados" y casi se reporta "el instrumento está roto en las 10 páginas". | Al notar que una página había medido bien un minuto antes |
| 5 | El medidor imprimía **`OK` contra CERO fondos** en 6 de 10 páginas — incluida la portada, cuyo CSS vive en `src/` y **nunca se leyó**. | Mirando la línea "Fondos medidos:" vacía |
| 6 | El medidor nuevo, hecho para terminar con todo lo anterior, reportó **1:1 en títulos con `background-clip:text`**: 8 fallos inventados de 46. | Buscando a propósito la clase de falso positivo que ese diseño podía producir |

**Las tres reglas que salen de esa tabla:**

1. **"No pudo medir" tiene que pesar más que "encontré fallos".** Un hallazgo se arregla; un
   hueco de instrumento te da falsa confianza y no se ve. Por eso el script sale con código
   **2** cuando no midió, y con **1** cuando sí midió y encontró fallos.
2. **Revisá la ESCALA y las UNIDADES antes de creerle a un número.** Los errores 3 y 4 no
   fueron descuido: fueron confiar en la salida sin preguntar en qué unidad venía.
3. **Buscá a propósito la clase de falso positivo que TU método puede producir**, y buscala
   con el patrón correcto. El error 6 se encontró así — pero el primer intento lo pasó por
   alto porque buscó `1.x:1` y el número se imprimía `1:1`.

---

## Cómo correrlo en cualquier proyecto

El medidor de Tipo A vive en `scripts/medir-contraste-real.mjs` y viaja con el skill. **No
interpreta CSS**: esconde el texto, saca una captura y lee el color del píxel detrás de cada
frase. Así los gradientes, las fotos, los alfas, los tokens y la herencia dejan de ser casos
especiales — se mide lo que ve el ojo.

```bash
npm i -D puppeteer-core          # usa el Chrome instalado, no descarga nada
npx vite preview --port 4318 &   # o cualquier servidor estático
node <ruta-del-skill>/scripts/medir-contraste-real.mjs / /precios/ /legal/
```

**En Git Bash hay que usar `MSYS_NO_PATHCONV=1`** o `/precios/` se convierte en una ruta de
Windows — **pero entonces la ruta DEL SCRIPT hay que darla al estilo `C:/...`**, porque la
protección aplica a todo el comando. Las dos cosas mordieron el mismo día.

Códigos de salida: `0` sin hallazgos · `1` hay fallos · `2` **no pudo medir** · `3` error.

**Lo que el medidor NO hace, y hay que saberlo:** no juzga Tipo B (ningún número delata el
ritmo), no verifica Tipo C (eso es una lista, no una medición), y declara como
*indeterminado* el texto pintado con `background-clip:text` en vez de inventarle un número.
Un `indeterminado` **no es un aprobado**: es un pendiente de mirar a ojo.
