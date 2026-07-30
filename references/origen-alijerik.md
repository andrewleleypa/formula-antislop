# Origen — el caso donde salió la fórmula

> 2026-07-26, construyendo `/eficore/alternativa-panamena/` en el repo `alijerik`.
> El documento vivo del proyecto es `alijerik/docs/LENGUAJE-VISUAL.md`, fijado como
> **regla #1** en `alijerik/CLAUDE.md`. Este archivo es la instantánea de por qué existe.

---

## Qué pasó

JC rechazó la página. Su diagnóstico fue **"los íconos son de librería"**.

**Esa lectura era incorrecta.** El copy estaba bien y los íconos estaban bien. Lo que
delataba la página era que **las seis secciones tenían la misma forma** — etiqueta,
título, párrafo, rejilla, repetir — el mismo padding y el mismo ancho.

Se rompió la métrica sin tocar una sola línea de diseño: ni un ícono nuevo, ni un color
nuevo, ni una palabra distinta. Solo la silueta de tres secciones.

Su reacción: **"esto es lo que yo estaba buscando."**

De ahí la regla: **el ritmo es la causa, los componentes son el síntoma.**

---

## Por qué esto es el criterio de rechazo #1 de JC

JC rechaza de plano cualquier cosa que "se vea hecha con IA" — por encima de velocidad y
por encima de features. Una página que se ve plantilla no se arregla después: se
descarta. Por eso la fórmula corre **antes** de escribir, no en la revisión.

---

## La instanciación de Alijerik / Eficore

| Variable | Valor |
|---|---|
| La UNA idea | **Latte art** → vapor, corazón, grano de café, vertido |
| Paleta | Cappuccino (`--terracota-luz` para el vapor, `--leche` para el corazón) |
| Tipografía | Bricolage Grotesque para títulos |
| Íconos | Phosphor duotone, **solo** para listas funcionales |
| Propósito a proteger | AEO: ser citado por asistentes de IA → **cero JavaScript**, todo el contenido en el DOM, cero recursos externos salvo la tipografía |
| Clases de layout | `.wrap` (ancho + padding lateral) y `.sec` (padding vertical) **en el mismo elemento** → `.sec` con longhand obligatorio |
| Fuera de alcance | `/` y `/eficore/` tienen secuencia de hero en canvas — la fórmula va solo debajo del hero |

Especificación de identidad del producto: `eficore/docs/design/REFERENCIAS.md`.

---

## Las páginas construidas con esto

- `/eficore/alternativa-panamena/` — la primera, donde salió la fórmula
- `/eficore/ley-81/`
- Las que sigan: `fuga-de-ventas`, `supervision`

Las dos primeras llevaron la trampa del shorthand `padding` en producción desde que se
publicaron, hasta el 2026-07-27. Nadie la vio porque en escritorio no se nota.

---

## Reglas que JC ya aceptó explícitamente

- **Nunca proponer librerías de ilustración** (unDraw, Storyset, Humaaans, packs 3D).
  Catalogan como plantilla.
- **Capturas reales con datos sintéticos** por encima de cualquier ilustración, y
  verificarlas mirándolas antes de publicar.
- **Excepción de alcance:** en páginas con animación propia de hero, la fórmula va solo
  debajo del hero. Sustituir algo único por una receta repetible es retroceso.
- **Correr el checklist completo** antes de dar una página por terminada.
