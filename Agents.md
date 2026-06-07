# Arquitectura Headless: WordPress + JetEngine → Next.js

## Contexto

Sitio actual de carpintería de aluminio (puertas, ventanas, cerramientos) construido con WordPress + JetEngine + Elementor. El objetivo es eliminar Elementor completamente y reconstruir el frontend con Next.js para obtener Core Web Vitals en verde y SEO técnico de primer nivel, manteniendo WordPress + JetEngine + Rank Math como backend/CMS.

### Filosofía Headless Multi-Backend
El sistema está diseñado bajo una filosofía **Headless** que permite desacoplar totalmente el frontend del backend. Esta arquitectura nos permite que nuestra única web en Next.js actúe como un "recolector" capaz de recibir y unificar datos de **múltiples instalaciones de WordPress simultáneamente**. 

En concreto, el frontend de Next.js consumirá datos de:
1. CMS **Grupo Andrade** (origen principal)
2. CMS **Andrade Sistemas** (origen secundario)

Esto garantiza que un único desarrollo frontend sirva para integrar y mostrar los catálogos y sistemas de ambas entidades sin tener que duplicar esfuerzos de desarrollo visual.

**Restricciones conocidas:**
- CPTs con relaciones mixtas (algunas JetEngine, algunas independientes)
- Galería de imágenes + PDF por producto
- Hosting actual: Hostalia → migración futura a VPS propio
- JetEngine se mantiene (licencia pro activa, sin motivo para migrar a ACF)
- Elementor y JetPopup se eliminan completamente

**Diseño:**
- Rediseño completo (no replicar Elementor actual)
- Tono: cálido y cercano, orientado al cliente final
- Logo corporativo fijo, paleta de colores a revisar
- Referencias visuales aportadas por el cliente (pendiente de compartir URLs)
- JetPopup: a eliminar (reemplazar con modal React nativo)
- Presupuesto inicial: Vercel free tier

---

## Stack Tecnológico

| Capa | Tecnología | Razón |
|---|---|---|
| Frontend | **Next.js 15 App Router + TypeScript** | ISR nativa, Server Components, generateMetadata, zero-JS por defecto |
| Estilos | **Tailwind CSS v4** | Zero CLS, sin runtime CSS, reemplaza Elementor completamente |
| API datos | **WordPress REST API** (no GraphQL) | JetEngine expone CPTs nativamente sin plugin extra |
| SEO | **Rank Math** en WP + **generateMetadata** en Next.js | Control total de metadata sin parsear HTML frágil |
| Imágenes | **next/image** + Cloudflare CDN (fase VPS) | WebP/AVIF automático, LCP óptimo |
| Deploy | **Vercel free** → Docker + Nginx en VPS | `output: standalone` preparado desde día 1 |
| Monitoreo | **Sentry** free tier | Logs persistentes independientes del hosting |

---

## Arquitectura de Datos

### Endpoints REST de WordPress

JetEngine expone los CPTs automáticamente con `show_in_rest: true`:

```
GET /wp-json/wp/v2/puertas-exteriores
GET /wp-json/wp/v2/divisorias
GET /wp-json/wp/v2/canales
GET /wp-json/wp/v2/techal
GET /wp-json/wp/v2/okma
GET /wp-json/wp/v2/dicores
GET /wp-json/wp/v2/mosquilux
GET /wp-json/wp/v2/schueco-pvc
GET /wp-json/wp/v2/banners
GET /wp-json/wp/v2/google-reviews
GET /wp-json/wp/v2/oficinas
```

### Mu-plugin requerido en WordPress

Exponer meta fields de JetEngine y Rank Math via REST (archivo: `wp-content/mu-plugins/expose-meta.php`):

```php
add_action('rest_api_init', function() {
  $cpts = ['puertas-exteriores', 'divisorias', 'canales', 'techal', 'okma', 'dicores', 'mosquilux', 'schueco-pvc'];
  foreach ($cpts as $cpt) {
    register_rest_field($cpt, 'seo_meta', [
      'get_callback' => fn($post) => [
        'title'       => get_post_meta($post['id'], 'rank_math_title', true),
        'description' => get_post_meta($post['id'], 'rank_math_description', true),
        'og_title'    => get_post_meta($post['id'], 'rank_math_og_title', true),
        'og_image'    => get_post_meta($post['id'], 'rank_math_og_image_url', true),
      ],
    ]);
  }
});
```

CORS para permitir llamadas desde Vercel (archivo: `wp-content/mu-plugins/cors-api.php`):

```php
add_filter('rest_pre_serve_request', function($value) {
  header('Access-Control-Allow-Origin: https://tudominio.com');
  header('Access-Control-Allow-Methods: GET, OPTIONS');
  return $value;
});
```

### Capa de abstracción en Next.js

Archivo crítico: `src/lib/wordpress/api.ts`

```typescript
const WP_BASE = process.env.NEXT_PUBLIC_WP_API_URL

export async function getCPT<T>(cpt: string, params = {}): Promise<T[]> {
  const url = new URL(`${WP_BASE}/${cpt}`)
  url.searchParams.set('per_page', '100')
  url.searchParams.set('_embed', '1')
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v as string))
  const res = await fetch(url.toString(), { next: { revalidate: 3600, tags: [cpt] } })
  return res.json()
}

export async function getCPTBySlug<T>(cpt: string, slug: string): Promise<T> {
  const items = await getCPT<T>(cpt, { slug })
  return (items as any)[0]
}
```

---

## Estrategia de Rendering

| Ruta | Estrategia | Revalidate |
|---|---|---|
| `/` | ISR | 3600s |
| `/puertas-exteriores` | ISR | 3600s |
| `/puertas-exteriores/[slug]` | ISR + generateStaticParams | 86400s |
| `/divisorias/[slug]` | ISR + generateStaticParams | 86400s |
| `/canales/[slug]` | ISR + generateStaticParams | 86400s |
| `/techal`, `/okma`, `/dicores`, `/mosquilux`, `/schueco-pvc` | ISR | 3600s |
| `/oficinas` | ISR | 86400s |
| `/contacto` | SSG puro | never |

**Tag-based revalidation** (invalidación inmediata al guardar en WP):

```typescript
// src/app/api/revalidate/route.ts
export async function POST(req: Request) {
  const secret = new URL(req.url).searchParams.get('secret')
  if (secret !== process.env.REVALIDATE_SECRET) return Response.json({}, { status: 401 })
  const { post_type } = await req.json()
  revalidateTag(post_type)
  return Response.json({ revalidated: true })
}
```

En WordPress, hook `save_post` → POST al endpoint `/api/revalidate?secret=XXX`.

---

## Estrategia de Imágenes y PDFs

### next.config.ts

```typescript
const nextConfig = {
  output: 'standalone', // crítico para VPS futuro
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'cms.tudominio.com', pathname: '/wp-content/uploads/**' }],
    formats: ['image/avif', 'image/webp'],
  },
}
```

### Componente de galería

- Imagen LCP: `priority={true}`, `sizes` ajustado al layout
- Resto de galería: lazy load implícito de next/image
- Lightbox: `yet-another-react-lightbox` (~3KB gzip) con **dynamic import** — se carga solo al hacer click

### PDFs

- Enlace directo a `cms.tudominio.com/wp-content/uploads/...`
- **No pasar PDFs por Next.js** (evita consumo de funciones serverless en Vercel free)
- En VPS futuro: Nginx sirve los PDFs con `Cache-Control: public, max-age=31536000, immutable`

---

## Estrategia SEO

### generateMetadata por ruta

```typescript
// src/app/puertas-exteriores/[slug]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const product = await getCPTBySlug('puertas-exteriores', params.slug)
  return {
    title: product.seo_meta.title || product.title.rendered,
    description: product.seo_meta.description,
    alternates: { canonical: `https://tudominio.com/puertas-exteriores/${params.slug}` },
    openGraph: { images: [{ url: product.seo_meta.og_image }] },
  }
}
```

### JSON-LD Structured Data

Archivo: `src/components/seo/ProductSchema.tsx`

```tsx
export function ProductSchema({ product }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title.rendered,
    image: product.meta.galeria?.map(i => i.url) ?? [],
    brand: { '@type': 'Brand', name: product.meta.marca_nombre },
    url: `https://tudominio.com/.../${product.slug}`,
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}
```

Schemas adicionales en `app/layout.tsx`: `LocalBusiness` con datos de empresa, `BreadcrumbList` por ruta.

### Sitemap

Usar `src/app/sitemap.ts` (nativo de Next.js 15) para generar sitemap dinámico consultando todos los CPTs. Genera `/sitemap.xml` automáticamente.

---

## Estructura de Carpetas

```
src/
├── app/
│   ├── layout.tsx                        # Root: fuentes, LocalBusiness schema
│   ├── page.tsx                          # Home ISR
│   ├── sitemap.ts                        # Sitemap dinámico
│   ├── robots.ts
│   ├── puertas-exteriores/
│   │   ├── page.tsx                      # Listado
│   │   └── [slug]/page.tsx               # Ficha + generateStaticParams + generateMetadata
│   ├── divisorias/[slug]/page.tsx
│   ├── canales/[slug]/page.tsx
│   ├── sistemas/
│   │   ├── page.tsx                      # Overview todos los sistemas
│   │   ├── schueco-pvc/page.tsx
│   │   ├── techal/page.tsx
│   │   ├── okma/page.tsx
│   │   ├── dicores/page.tsx
│   │   └── mosquilux/page.tsx
│   ├── oficinas/page.tsx
│   ├── contacto/page.tsx
│   └── api/revalidate/route.ts
├── components/
│   ├── layout/Header.tsx Footer.tsx
│   ├── products/
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── ProductGallery.tsx            # Lightbox con dynamic import
│   │   └── ProductPdfButton.tsx
│   ├── brands/BrandLanding.tsx           # Reutilizable para todas las marcas
│   ├── seo/ProductSchema.tsx LocalBusinessSchema.tsx BreadcrumbSchema.tsx
│   └── ui/Button.tsx Modal.tsx           # Modal reemplaza JetPopup
└── lib/
    └── wordpress/
        ├── api.ts                        # getCPT, getCPTBySlug
        └── types.ts                      # Tipos TypeScript de cada CPT
```

---

## Estructura de Páginas y Rutas

### Contexto
- Productos **pertenecen a un sistema/marca** (JetEngine relation)
- Público principal: **consumidor final / particular**
- Blog eliminado (no se usa)

### Navegación principal

```
[ Logo ]   Productos ▾   Sistemas ▾   Oficinas   Contacto   [ Solicitar presupuesto ]

Productos:              Sistemas:
  Puertas exteriores     Schüco PVC   Okma
  Puertas divisorias     Techal       Dicores
  Canales                             Mosquilux
```

### Árbol de rutas

```
/                                     → Home
├── /puertas-exteriores/              → Listado (filtrable por sistema)
│   └── /[slug]/                      → Ficha de producto
├── /puertas-divisorias/              → Listado (filtrable por sistema)
│   └── /[slug]/                      → Ficha de producto
├── /canales/                         → Listado (filtrable por sistema)
│   └── /[slug]/                      → Ficha de producto
├── /sistemas/                        → Overview de sistemas
│   ├── /schueco-pvc/                 → Landing + todos sus productos
│   ├── /techal/
│   ├── /okma/
│   ├── /dicores/
│   └── /mosquilux/
├── /oficinas/
├── /contacto/
└── /api/revalidate/                  → Webhook ISR (privado)
```

### Anatomía de cada tipo de página

**Home (`/`)**
```
Hero full-width — claim + CTA "Ver productos"
Beneficios — 4 bloques con icono: Seguridad | Aislamiento | Ahorro | Diseño
Categorías — 3 cards: Puertas ext. | Divisorias | Canales
Sistemas — strip de logos: Schüco | Techal | Okma | Dicores | Mosquilux
Proyectos — galería 6 fotos de instalaciones reales
Reviews — carousel Google Reviews
CTA contacto
Footer
```

**Listado (`/puertas-exteriores/`)**
```
Hero sección — título + descripción de categoría
Filtro por sistema — pills/tabs (Todos | Schüco | Techal | Okma...)
Grid de productos — imagen, nombre, badge sistema, botón "Ver detalle"
CTA — "¿No encuentras lo que buscas? Contáctanos"
```

**Ficha de producto (`/puertas-exteriores/[slug]/`)**
```
Breadcrumb — Inicio > Puertas exteriores > Nombre producto
Hero — imagen principal + título, badge sistema, descripción corta, CTA
Galería — grid clicable → lightbox
Beneficios específicos — iconos (térmica, acústica, seguridad...)
Especificaciones — acordeón expandible
PDF — botón descarga directa (enlace a WP, no pasa por Next.js)
Productos relacionados — 3 cards del mismo sistema
CTA — "Solicitar presupuesto sobre este producto"
```

**Landing sistema (`/sistemas/schueco-pvc/`)**
```
Hero marca — logo + imagen flagship + claim
Descripción del sistema
Grid de todos sus productos (filtrado desde el CPT por relación JetEngine)
CTA consultar disponibilidad
```

---

## Configuración de Dominio

```
tudominio.com             → Vercel (Next.js - Frontend Unificado)
cms.grupoandrade.es       → WordPress Grupo Andrade (Backend 1)
cms.andradesistemas.com   → WordPress Andrade Sistemas (Backend 2)
```

En `wp-config.php`:
```php
define('WP_HOME', 'https://cms.tudominio.com');
define('WP_SITEURL', 'https://cms.tudominio.com');
```

---

## Fases de Migración

### Fase Diseño — Auditoría visual y sistema de diseño (PREVIA a todo)

#### Análisis de referencias

**Schüco** (`schueco.com/es`):
- Paleta: blanco/gris claro dominante, negro para texto, sin colores llamativos
- Estilo: premium, corporativo, muy limpio, imagen-first
- Layout: grid modular 2-3 columnas, cards con imagen real de proyecto
- Fortaleza: transmite calidad y confianza sin ornamentación
- A tomar: estructura de grid de productos, uso de imágenes de aplicación real

**Strugal** (`strugal.com/es/particulares`):
- Paleta: blanco/gris neutro + naranja/dorado como acento
- Estilo: accesible, orientado a beneficios (LUZ, SEGURIDAD, CONFORT, AHORRO)
- Layout: hero central + bloques iconográficos de beneficios + galería de proyectos 3 col
- Fortaleza: comunica valor al cliente final, no solo características técnicas
- A tomar: bloque de beneficios con iconos, galería de proyectos reales, CTAs claros

**Grupo Andrade actual** (`grupoandrade.es`):
- Paleta: blanco + acentos morados/turquesa (a revisar — no encajan con tono cálido)
- Layout: hero full-width, cards de producto, scroll horizontal por categorías
- Estructura: menús desplegables multi-nivel, reviews de clientes prominentes
- A mejorar: los acentos fríos (morado/turquesa) se reemplazarán por una paleta cálida

---

#### Sistema de diseño propuesto

**Paleta — Warm Neutral**

```typescript
// tailwind.config.ts
colors: {
  brand: {
    50:  '#FDF8F3',   // fondo cálido, casi blanco
    100: '#F5EDE0',   // fondo secciones alternas
    200: '#E8D5BB',   // bordes suaves
    500: '#C17F3A',   // acento principal (ámbar cálido)
    600: '#A66B2E',   // hover states
    900: '#2C1A0E',   // texto oscuro cálido (no negro puro)
  },
  neutral: {
    50:  '#FAFAF9',
    100: '#F5F5F4',
    200: '#E7E5E4',
    500: '#78716C',
    700: '#44403C',
    900: '#1C1917',
  }
}
```

El morado/turquesa actual se elimina. El ámbar cálido (`#C17F3A`) como acento único da calidez sin perder profesionalismo. Fondos en crema/arena en lugar de blanco puro.

**Tipografía**

```typescript
fontFamily: {
  display: ['"Bricolage Grotesque"', 'sans-serif'],  // encabezados — personalidad, calidez
  sans:    ['"Plus Jakarta Sans"',   'sans-serif'],  // cuerpo — limpio, legible
}
```

Ambas disponibles en Google Fonts. Bricolage Grotesque tiene carácter propio sin ser excéntrica. Plus Jakarta Sans es neutra y muy legible en cuerpo pequeño.

**Estructura de página tipo (ficha de producto)**

```
[ Header sticky — logo + nav principal ]
[ Breadcrumb — Inicio > Puertas exteriores > Nombre ]
[ Hero producto — imagen grande izquierda + título, descripción corta, CTA derecha ]
[ Galería — grid 2x3 + lightbox al click ]
[ Beneficios — 4 iconos (Seguridad, Aislamiento, Durabilidad, Diseño) ]
[ Especificaciones técnicas — acordeón ]
[ PDF descargable — botón prominente ]
[ Productos relacionados — 3 cards ]
[ CTA final — "Solicitar presupuesto" ]
[ Footer ]
```

**Inventario de componentes**

| Componente | Prioridad | Inspiración |
|---|---|---|
| Header + Nav sticky | P0 | Schüco (limpio, sin ruido) |
| Hero con imagen + CTA | P0 | Strugal (imagen real de proyecto) |
| ProductCard | P0 | Schüco (imagen-first, info mínima) |
| BenefitBlock (iconos) | P0 | Strugal (LUZ, SEGURIDAD...) |
| ProductGallery + Lightbox | P0 | — |
| BrandLanding | P1 | Schüco (landing por sistema) |
| ReviewCard | P1 | Grupo Andrade actual |
| OficinaCard + Mapa | P1 | — |
| Modal / CTA popup | P2 | Ligero, reemplaza JetPopup |
| Footer | P0 | — |

**Entregable de esta fase**: `tailwind.config.ts` con tokens completos + componentes maquetados en orden P0 primero.

---

### Fase 0 — Preparación (sin tocar producción)
1. Mover WP a subdominio `cms.tudominio.com`
2. Verificar que todos los CPTs aparecen en la REST API
3. Instalar mu-plugins (expose-meta.php + cors-api.php)
4. Crear proyecto Next.js, configurar `.env.local`, testear `getCPT()`

### Fase 1 — Páginas de marca (riesgo bajo)
- `/techal`, `/okma`, `/dicores`, `/mosquilux`, `/schueco-pvc`
- Validar con dominio temporal `.vercel.app`

### Fase 2 — Páginas de soporte (riesgo bajo)
- `/oficinas`, `/contacto` (formulario con Resend o Formspree, sin depender de WP)
- Home con Banners + Google Reviews

### Fase 3 — Listados de producto (riesgo medio)
- `/puertas-exteriores`, `/divisorias`, `/canales`
- ProductGrid con datos reales + filtros via URL search params

### Fase 4 — Fichas individuales (riesgo medio-alto)
- Todos los `[slug]` pages
- Galería + PDF + JSON-LD + Breadcrumb
- Validar relaciones JetEngine

### Fase 5 — Cutover DNS
1. Reducir TTL a 300s el día antes
2. Añadir dominio custom en Vercel
3. Cambiar A record de `tudominio.com` a Vercel
4. Verificar 200 en rutas críticas + Search Console

### Fase 6 — Limpieza post-cutover
- Desactivar Elementor y JetPopup en WP
- Monitorear Sentry + Search Console durante 1 semana
- Configurar webhook `save_post` → `/api/revalidate`

---

## Preparación para VPS (desde día 1)

- `output: 'standalone'` en `next.config.ts` — no rompe Vercel, habilita Docker
- Variables de entorno sin hardcoding: siempre `process.env.*`
- `ecosystem.config.js` con PM2 en el repo
- Sentry configurado desde el inicio (`npx @sentry/wizard -i nextjs`)
- En VPS futuro: Cloudflare delante de `cms.tudominio.com` cachea imágenes y PDFs del edge

---

## Verificación

1. **Rendimiento**: Lighthouse en `/puertas-exteriores/[slug]` → LCP < 2.5s, CLS = 0, TBT < 200ms
2. **SEO**: `curl -s https://tudominio.com/puertas-exteriores/slug | grep -E "<title>|<meta name="description"|application/ld\+json"`
3. **ISR**: Actualizar un producto en WP y verificar que la página refleja el cambio en < 60s (con webhook)
4. **Imágenes**: Verificar que `Content-Type: image/avif` o `image/webp` en Network tab
5. **PDFs**: Click en botón de descarga → archivo descargado directamente desde `cms.tudominio.com`
6. **Redirects SEO**: `curl -I https://tudominio.com/url-antigua` → 301 a URL nueva

---

## REGLA ESTRICTA: SEO Modo Dios en nuevas marcas (Scaffolding)
**OBLIGATORIO para el Agente AI:** Cada vez que el usuario solicite crear una nueva marca o categoría (ej. Techal, Cortizo, etc.), el agente **DEBE INYECTAR AUTOMÁTICAMENTE** el componente de SEO "Modo Dios".
- **Nunca** generar un archivo `page.tsx` para un producto dinámico (`[slug]/page.tsx`) sin incluir `generateMetadata`, el inyector de datos estructurados `JSON-LD` (Product Schema), y la función `generateStaticParams`.
- Se puede utilizar el comando `npm run nueva-marca [nombre-marca]` para generar automáticamente la arquitectura con todo el SEO configurado.

## REGLA ESTRICTA: Disociación de Materiales en SEO Local (Cannibalization Prevention)
**OBLIGATORIO para el Agente AI:** Para evitar la canibalización de palabras clave y diluir la autoridad semántica, se prohíbe estrictamente mezclar términos de materiales competidores (PVC vs. Aluminio) en la misma Landing Page.
- Cuando se generen o modifiquen páginas bajo la ruta `/ventanas-pvc/...` o marcas de PVC exclusivas (ej. Schüco PVC), el copy, los H1/H2 y las meta descripciones **NUNCA deben mencionar la palabra "Aluminio"**.
- Cuando se generen o modifiquen páginas bajo la ruta `/ventanas-aluminio/...` o marcas de aluminio exclusivas (ej. Techal, Cortizo), el copy, los H1/H2 y las meta descripciones **NUNCA deben mencionar la palabra "PVC"**.
- Las páginas de localidades deben generarse como sub-rutas específicas por material (ej. `/ventanas-pvc/[provincia]/[localidad]`) en lugar de rutas genéricas `/instaladores/...` que mezclen ambos.

## REGLA ESTRICTA: Diseño UI/UX "Modo Dios" para Landing Pages
**OBLIGATORIO para el Agente AI:** Cuando se construya o refactorice cualquier Landing Page (especialmente las SEO locales o de marca), el diseño DEBE transmitir ultra-modernidad, tecnología y lujo. 
1. **Animaciones Fluidas:** Es obligatorio el uso de `framer-motion` para entradas cinemáticas (fade-ups, revelados de texto, micro-interacciones).
2. **Interactividad 3D:** Los productos o elementos destacados deben incluir efectos de "Tilt 3D Holográfico" (rotación basada en el puntero del ratón usando CSS y Framer Motion), sin recurrir a modelos WebGL pesados que afecten el LCP.
3. **Estructura Bento Grid:** La información contextual (mapas, descripciones de clima/zona, especificaciones) debe encapsularse en diseños de rejilla tipo "Bento Box" con bordes redondeados y fondos con `backdrop-blur` (Glassmorphism).
4. **Rendimiento:** Estos efectos visuales nunca deben comprometer los Core Web Vitals.

## REGLA ESTRICTA: Copywriting de Arquitectura Emocional (El Instrumento y el Maestro)
**OBLIGATORIO para el Agente AI:** Todos los textos generados para la web deben abandonar el tono técnico/frío y adoptar una filosofía de "Lujo Editorial" y bienestar habitacional.
1. **El Producto es Invisible:** No se venden ventanas, PVC o milímetros de sección. Se vende luz natural, aislamiento absoluto, confort térmico, salud y estatus arquitectónico (Nivel Apple / Minotti).
2. **El Instrumento y el Maestro:** El copy NUNCA debe limitarse a alabar solo a Schüco. 
   - **Schüco** representa la ingeniería alemana y el diseño.
   - **Grupo Andrade** representa la solvencia, la garantía y el "expertise" artesanal que hace que el sistema funcione.
3. **Posicionamiento:** Posicionar siempre a Grupo Andrade como el "Partner de Schüco" o "Especialista Seleccionado" de confianza. **REGLA CRÍTICA:** NUNCA escribir "Premium Partner". Se debe usar exclusivamente "Partner de Schüco" (sin "Premium"). El cliente compra la excelencia de Schüco a través de la tranquilidad y seguridad que ofrece Grupo Andrade.

## REGLA ESTRICTA: No Inventar Secciones No Solicitadas
**OBLIGATORIO para el Agente AI:** El Agente tiene estrictamente prohibido inventar, agregar o rellenar secciones de contenido (ej. "Detalle 1", "Detalle 2", "Detalle 3", tarjetas de relleno, etc.) si el usuario no las ha solicitado explícitamente. Cíñete siempre al diseño, estructura y datos reales proporcionados o requeridos por el usuario. No se inventan secciones de relleno bajo ningún concepto.
