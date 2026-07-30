# Fórmula anti-slop

**Una receta de composición para que una interfaz no parezca hecha con IA.**

> *English summary: a portable [Claude Code](https://claude.com/claude-code) skill with a
> method for making web interfaces not read as AI-generated. Its core claim: "looks
> AI-made" is a **rhythm** problem, not a component problem — swapping your icon library
> fixes nothing. The content is in Spanish. See [Traducción](#traducción).*

---

## La idea central

Lo que delata al contenido generado es que **todas las secciones tienen la misma forma**:
etiqueta, título, párrafo, rejilla de cartas. Repetir. Esa uniformidad métrica es la firma.

El corolario, que casi nadie dice en voz alta: **cambiar de librería de íconos no arregla
nada.** El diagnóstico intuitivo —"los íconos se ven de librería"— apunta al síntoma. Un
diseñador humano rompe el compás; una plantilla no.

Y trae un método de diagnóstico que se puede correr antes de tocar una línea de código:
contar cuántas secciones abren igual, cuántas comparten padding y cuántas comparten ancho.
Si la respuesta es "casi todas", ahí está el problema — no en los íconos, no en la paleta.

## Qué hay adentro

| Archivo | Qué contiene |
|---|---|
| `SKILL.md` | El protocolo, los seis movimientos y el checklist de cierre. |
| `references/los-tres-tipos.md` | **El mapa completo, y por dónde empezar.** Esta receta es **uno de tres tipos** de criterio, no el mapa entero: **A se mide** (contraste, la escalera entre niveles, el alfa compuesto, la tinta que se invierte con el tema), **B se compone** (el ritmo — esta fórmula), **C se verifica** (existe o no existe: foco diseñado, estado que no dependa sólo del color, un solo sistema de tokens). Trae además la **meta-regla**: cada criterio necesita un medidor y **el medidor necesita su propia prueba** — con la tabla de los **seis** instrumentos que mintieron en el proyecto donde nació esto, incluido el que se construyó para terminar con los otros cinco. |
| `scripts/medir-contraste-real.mjs` | El medidor del Tipo A, portable a cualquier proyecto. **No interpreta CSS:** esconde el texto, saca una captura y lee el **color del píxel** detrás de cada frase, así que CSS externo, tokens, alfas y gradientes dejan de ser casos especiales. Y **sale con error cuando no pudo medir**, en vez de imprimir `OK` — que es exactamente lo que hacía el medidor anterior en 6 de 10 páginas. |
| `references/instanciar-por-proyecto.md` | Las cinco variables que hay que resolver **antes** de escribir HTML. La primera —*la UNA idea* de la que se deriva todo lo visual— es la que hace la diferencia. |
| `references/trampas.md` | Cuatro trampas de CSS y dos de medición que ya costaron tiempo en producción. **Ninguna se ve en escritorio.** |
| `references/feo-no-es-slop.md` | **El triage.** "Se ve genérico" y "se ve feo" son diagnósticos distintos. Trae el método para medir jerarquía de texto —medir la **escalera**, no cada escalón contra el piso— y tres trampas de medición, incluida la de invocar WCAG donde no aplica. |
| `references/origen-alijerik.md` | El caso real donde salió la fórmula, con la instanciación completa de un proyecto. |

## Instalación

Es un skill de Claude Code. Se instala copiándolo a la carpeta de skills:

```bash
git clone https://github.com/andrewleleypa/formula-antislop.git
cp -r formula-antislop ~/.claude/skills/formula-antislop
```

Después se invoca con `/formula-antislop`, o el agente lo activa solo cuando detecta
construcción visual — si le agregás una regla de routing a tu `~/.claude/CLAUDE.md`:

```markdown
- CUALQUIER construcción visual → activa `formula-antislop` PRIMERO:
  página, landing, sección, componente, rediseño, o algo que "se ve IA".
```

## Alcance honesto — dónde NO usarla

Esta sección existe porque la fórmula misma exige declarar los límites (movimiento 4). Sería
raro no aplicárselo al propio README.

- **Está escrita para páginas de contenido**: landings, secciones, vistas nuevas. En una
  **app con sesión** (un inbox, un panel) cuatro de los seis movimientos no traducen
  directo: no hay nueve secciones cuyas siluetas variar, ni capturas que usar como prueba,
  ni reveals al scroll que valgan la pena. Lo que sí traduce es el diagnóstico de ritmo —
  en una app la uniformidad se ve como *todo con el mismo padding y el mismo peso*.
- **No es un instrumento de medición.** "Se ve genérico" y "se ve feo" son diagnósticos
  distintos y piden herramientas distintas. Si el problema es contraste, jerarquía o
  legibilidad, **eso se mide** y esta fórmula no lo va a encontrar. Por eso el protocolo
  arranca en un **paso 0 de triage** que puede mandarte a otra herramienta:
  `references/feo-no-es-slop.md`. (Aprendido a golpes: ver la nota al final.)
- **Es el piso, no el techo.** Si una página ya tiene algo único —una secuencia de hero
  propia, un artefacto que nadie más tiene— sustituirlo por una receta repetible es un
  retroceso. Ahí la fórmula se aplica sólo a las secciones de contenido.

## Traducción

El contenido está en español. Traducirlo al inglés es un trabajo aparte (~500 líneas) y no
está hecho. Si te sirve traducido, un PR es bienvenido.

## Origen y crédito

Formulada por **[Jean Carlos Ducruet](https://alijerik.com)** el 26 de julio de 2026,
construyendo una página real —no en abstracto—. El caso completo, incluida la instanciación
que se usó, está en `references/origen-alijerik.md`.

**Una nota que vale más que la receta:** cuatro días después de escribirla, la fórmula
**no** sirvió para el problema que parecía suyo. Alguien reportó que una interfaz "se veía
fea"; la fórmula habría hecho buscar un problema de ritmo, y el defecto real era de
**contraste de texto** — medible, y arreglado con tres valores de color. Correr la fórmula
no lo habría encontrado nunca.

Saber **cuándo una herramienta no aplica** es parte de la herramienta.

## Licencia

[CC BY 4.0](LICENSE). Usala, adaptala, vendé lo que construyas con ella. Lo único que pide
la licencia es atribución.

**Por qué CC y no MIT:** esto es prosa que se cita y se adapta, no una librería que se
importa. CC BY obliga a atribuir cuando alguien **comparte o adapta públicamente** el
material — un artículo que reproduce el método, un skill derivado. MIT sólo obliga a
conservar el aviso al **distribuir software**, que no es cómo se propaga una metodología.

**Si en el futuro este repo trae código** (por ejemplo un medidor de contraste genérico):
Creative Commons recomienda explícitamente no usar sus licencias para software, así que ese
código iría bajo **MIT** y quedaría declarado acá. Hoy el repo es sólo Markdown.
