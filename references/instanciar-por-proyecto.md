# Instanciar la fórmula en un proyecto

La fórmula es universal. **Cinco cosas cambian por proyecto** y hay que resolverlas antes
de escribir la primera línea de HTML/JSX. Si el proyecto no las tiene escritas,
**preguntárselas a JC — no inventarlas.**

---

## Las cinco variables

### 1. La UNA idea (la más importante)

De qué se deriva todo lo visual. No es un tema ni un adjetivo: es un objeto concreto del
que se pueden sacar 3–5 motivos que rimen entre sí.

- **Alijerik / Eficore:** el latte art → vapor, corazón, grano de café, vertido.
- Regla: si no se pueden dibujar en line art y no rima uno con otro, no es la idea.

**Sin esta variable resuelta no se generan motivos.** Poner íconos de librería "mientras
tanto" es exactamente el fallo que la fórmula existe para evitar.

### 2. Paleta y tipografía

Los motivos usan **colores de la paleta existente**, nunca colores nuevos.

- **Alijerik / Eficore:** paleta cappuccino, Bricolage Grotesque para títulos, íconos
  Phosphor duotone solo para listas funcionales.
  Especificación: `eficore/docs/design/REFERENCIAS.md`.

### 3. El propósito que hay que proteger

Qué se rompería si el diseño se pone caro. De aquí salen las restricciones técnicas duras
del movimiento 6.

- **Páginas AEO de Alijerik:** existen para ser citadas por asistentes de IA →
  cero JavaScript, todo el contenido en el DOM, cero recursos externos.
- **App con sesión:** velocidad percibida, accesibilidad, funcionar en el celular del
  usuario → otras restricciones, pero escritas igual.

### 4. Los nombres de las clases de layout

La trampa del shorthand `padding` depende de cómo se llame la clase de ancho y qué
modificadores comparten elemento con ella.

- **Alijerik:** `.wrap` (ancho + padding lateral) y `.sec` (padding vertical) van en el
  **mismo elemento** → `.sec` usa longhand obligatoriamente.
- En Tailwind el equivalente es no poner `p-*` sobre el mismo elemento del contenedor.

### 5. Qué queda FUERA del alcance

Las páginas que ya tienen un artefacto único (secuencia de hero en canvas, animación
propia) no se rehacen con la receta. Ahí aplica solo debajo del hero.

- **Alijerik:** `/` y `/eficore/` tienen secuencia de hero → la fórmula va solo a las
  secciones de contenido de abajo.

---

## Dónde vive cada instanciación

| Proyecto | Documento |
|---|---|
| Alijerik (sitio público) | `alijerik/docs/LENGUAJE-VISUAL.md` + regla #1 de `alijerik/CLAUDE.md` |
| Eficore (identidad de producto) | `eficore/docs/design/REFERENCIAS.md` |
| Proyecto nuevo | crear `docs/LENGUAJE-VISUAL.md` con estas cinco variables resueltas |

**Al arrancar en un repo nuevo:** buscar primero si ya existe uno de estos documentos y
leerlo completo. Si no existe, resolver las cinco variables con JC y escribirlo — el
documento es parte del entregable, no un extra.

---

## Plantilla para un proyecto nuevo

```markdown
# Lenguaje visual — <proyecto>

> Instancia la fórmula anti-slop (skill `formula-antislop`). Leer la skill primero.

## 1. La UNA idea
<objeto concreto> → motivos: <a>, <b>, <c>

## 2. Paleta y tipografía
Colores: <tokens>. Títulos: <fuente>. Íconos de librería: solo <dónde>.

## 3. El propósito que hay que proteger
<qué existe para lograr> → restricciones duras: <lista>

## 4. Clases de layout
Ancho: `<clase>`. Vertical: `<clase>`. ¿Comparten elemento? <sí/no> → <longhand obligatorio>

## 5. Fuera de alcance
<páginas o vistas con artefacto propio que NO se rehacen>
```
