# "Feo" no es "slop" — el triage antes de aplicar la fórmula

> Escrito el 2026-07-30, cuatro días después de formular la receta, porque la receta **no
> sirvió** para el primer problema que pareció suyo. Alguien reportó que una interfaz "se
> veía fea". La fórmula habría mandado a buscar un problema de ritmo. El defecto real era
> **contraste de texto**, se arregló con tres valores de color, y correr la fórmula no lo
> habría encontrado nunca.

---

## El triage, en una pregunta

**¿La queja es sobre la FORMA o sobre el ESFUERZO?**

| La queja suena a… | Diagnóstico | Herramienta |
|---|---|---|
| "se ve genérico", "se ve plantilla", "se ve hecho con IA", "esto ya lo vi mil veces" | **Ritmo.** Uniformidad métrica. | La fórmula anti-slop (`SKILL.md`) |
| "me cansa la vista", "no encuentro lo que busco", "se ve plana", "se ve apagada", "no sé dónde mirar" | **Legibilidad o jerarquía.** | **Medir.** Este archivo. |
| "está fea" (a secas) | **No hay diagnóstico todavía.** | Preguntar qué CUESTA, no si gusta |

La trampa de la tercera fila es la peor: *"está fea"* invita a adivinar, y adivinar en
diseño se ve como trabajo. **Antes de tocar un pixel, convertí el adjetivo en un
síntoma.** Preguntas que funcionan: ¿qué te cansa la vista?, ¿qué dato buscás y no
encontrás rápido?, ¿qué acción hacés más veces al día y cuántos clics te lleva?

**Y una señal fuerte de que NO es slop:** si el producto tiene identidad propia
—tipografía elegida, paleta con nombre, un motivo propietario— entonces no es una
plantilla. Lo que tiene es un defecto, y los defectos se miden.

---

## El método: medir la ESCALERA, no cada escalón contra el piso

Casi todo el mundo mide mal esto, y de la misma forma: toma cada color de texto, lo mide
contra el fondo, verifica que pase el umbral, y da el trabajo por hecho.

**Es necesario y no es suficiente.** Un color puede pasar el umbral y arruinar la jerarquía
igual, porque se acercó al nivel de arriba.

Ejemplo real. Una paleta con tres niveles de texto: principal, secundario, terciario. El
terciario fallaba (2.99:1). El valor que lo hacía pasar daba **5.46:1** — pero el
secundario estaba en **5.69**. Arreglar el contraste habría **borrado el tercer nivel**: la
hora y el texto secundario se verían iguales, y la pantalla se vería *más* plana que antes.
El arreglo verdadero fue bajar también el secundario y abrir el hueco: **16.9 / 7.2 / 5.5**,
tres escalones limpios.

Y el error espejo, en el tema oscuro: había un candidato anotado como mejor *"porque da más
aire"* — cierto contra el fondo (5.12:1), pero dejaba **1.11×** de separación contra el
nivel de arriba. Los dos niveles se volvían uno. **Más aire contra el fondo no sirve si te
comés el escalón de arriba.**

**Receta:**

1. Listá los niveles de texto de tu paleta, del más fuerte al más débil.
2. Medí cada uno contra **todos** los fondos sobre los que de verdad se pinta (no sólo el
   principal — ver la trampa 2).
3. Verificá que **cada nivel pase su umbral** *y* que **haya separación visible entre
   niveles consecutivos**. Menos de ~1.25× entre escalones consecutivos y ya no son dos
   niveles.
4. Al corregir, **mové sólo la luminosidad.** Tono y saturación intactos = la identidad no
   se toca. Es la diferencia entre arreglar un defecto y cambiar la marca.

**Umbrales (WCAG 2.1):** texto normal **4.5:1** (SC 1.4.3), texto grande (≥24px, o ≥18.66px
en negrita) **3:1**. Ojo: una etiqueta de 11px en mayúsculas **no** es texto grande.

---

## Trampa 1 — un color con alfa no tiene UN contraste

Si el token es `rgba(...)` y no un hex, **no tiene un contraste: tiene uno por cada fondo
sobre el que se compone.** Medirlo como si fuera un hex suelto da un número inventado.

Hay que hacer la composición (*alpha over*) antes de medir:

```
canal_resultante = alfa × canal_frente + (1 − alfa) × canal_fondo
```

**Esto ya produjo números falsos publicados como dato**, con dos decimales y todo. La
defensa no es tener más cuidado: es **que el script lea los tokens del archivo fuente** en
vez de que alguien los transcriba a mano. Un script que compone el alfa contra cada fondo
es ~40 líneas y es la diferencia entre una medición reproducible y una anécdota.

## Trampa 2 — el peor caso no es el fondo principal

Casi todas las apps pintan texto sobre **más de un** fondo: la superficie de las tarjetas,
una superficie secundaria (paneles hundidos, campos de formulario, burbujas) y el fondo de
la página. En el caso real medido, el peor caso estaba en la **superficie secundaria**, no
en la principal — con hasta **0.5 puntos** de diferencia.

**Una medición que sólo valida contra el fondo principal deja el defecto vivo en la mitad de
la interfaz.**

## Trampa 3 — no invocar WCAG donde no aplica

Es tentador vestir una decisión estética de reclamo de cumplimiento. **No hacerlo.**

**SC 1.4.11** (no-texto, 3:1) cubre *"la información visual necesaria para identificar
componentes de interfaz y estados"* y los objetos gráficos necesarios para entender el
contenido. **Un divisor decorativo entre filas de una lista NO entra** si las filas ya se
distinguen por contenido y espaciado — el *Understanding* lo excluye explícitamente.

En el caso real, exigirles 3:1 a ~24 hairlines habría acercado la pantalla a una grilla de
hoja de cálculo: **un cambio de cara del producto entrando por la puerta de atrás de la
accesibilidad.** Subirlos puede ser una buena decisión — pero se declara como decisión
estética, con su propia discusión, no como cumplimiento.

**Regla:** si no podés citar el criterio y su *Understanding*, no es cumplimiento. Es gusto,
y el gusto se defiende con argumentos, no con siglas.

---

## Lo que NO arregla esto

- **La mitad estructural de la accesibilidad**: teclado, ARIA, orden del DOM, lectores de
  pantalla. Eso vive en el HTML semántico y el JS, no en la paleta. Es una fase propia.
- **Un rediseño.** Esto arregla un defecto medido. Si la queja de verdad es sobre qué
  información se muestra y dónde, ninguna paleta lo va a resolver.
- **Y no confundir el vocabulario:** no existe "certificación" de accesibilidad. WCAG es
  auto-atestación; lo entregable a un cliente que pregunta es un VPAT/ACR o una auditoría
  de un tercero.

---

## La lección de una línea

**"Está feo" no se arregla adivinando, se mide — pero medir mal es peor que no medir,
porque produce números con cara de dato que nadie vuelve a cuestionar.**
