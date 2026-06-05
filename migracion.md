# Arquitectura Headless: WordPress + JetEngine → Next.js
## Plan de Migración — Grupo Andrade

## Contexto

Sitio actual de carpintería de aluminio (puertas, ventanas, cerramientos) construido con WordPress + JetEngine + Elementor. El objetivo es eliminar Elementor completamente y reconstruir el frontend con Next.js para obtener Core Web Vitals en verde y SEO técnico de primer nivel, manteniendo WordPress + JetEngine + Rank Math como backend/CMS.

**Restricciones conocidas:**
- CPTs con relaciones mixtas (algunas JetEngine, algunas independientes)
- Galería de imágenes + PDF por producto
- Hosting actual: Hostalia → migración futura a VPS propio
- JetEngine se mantiene (licencia pro activa, sin motivo para migrar a ACF)
- Elementor y JetPopup se eliminan completamente
- Blog eliminado (no se usa)

**Diseño:**
- Rediseño completo (no replicar Elementor actual)
- Tono: cálido y cercano, orientado al cliente final / particular
- Logo corporativo fijo, paleta de colores a revisar
- Referencias: schueco.com/es, strugal.com/es/particulares

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

## Estructura de Páginas y Rutas

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
├── /sistemas/                        → Overview de todos los sistemas
│   ├── /schueco-pvc/                 → Landing + todos sus productos
│   ├── /techal/
│   ├── /okma/
│   ├── /dicores/
│   └── /mosquilux/
├── /oficinas/
├── /contacto/                        → SSG puro
└── /api/revalidate/                  → Webhook ISR (privado)
```

### Anatomía de cada tipo de página

**Home (`/`)**
```
Hero full-width — claim + CTA "Ver productos"
Beneficios — 4 bloques con icono: Seguridad | Aislamiento | Ahorro | Diseño
Categorías — 3 cards grandes: Puertas ext. | Divisorias | Canales
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
Grid de todos sus productos (filtrado por relación JetEngine)
CTA consultar disponibilidad
```

---

## Sistema de Diseño

### Análisis de referencias

**Schüco** (`schueco.com/es`):
- Paleta: blanco/gris claro dominante, negro para texto, sin colores llamativos
- Estilo: premium, corporativo, muy limpio, imagen-first
- A tomar: estructura de grid de productos, uso de imágenes de aplicación real

**Strugal** (`strugal.com/es/particulares`):
- Paleta: blanco/gris neutro + naranja/dorado como acento
- Estilo: accesible, orientado a beneficios (LUZ, SEGURIDAD, CONFORT, AHORRO)
- A tomar: bloque de beneficios con iconos, galería de proyectos reales, CTAs claros

**Grupo Andrade actual** (`grupoandrade.es`):
- A mejorar: acentos fríos (morado/turquesa) → reemplazar por paleta cálida

### Paleta — Warm Neutral

```typescript
// tailwind.config.ts
colors: {
  brand: {
    50:  '#FDF8F3',   // fondo cálido, casi blanco
    100: '#F5EDE0',   // fondo secciones alternas
    200: '#E8D5BB',   // bordes suaves
    500: '#C17F3A',   // acento principal (ámbar cálido)
    600: '#A66B2E',   // hover states
    900: '#2C1A0E',   // texto oscuro cálido
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

### Tipografía

```typescript
fontFamily: {
  display: ['"Bricolage Grotesque"', 'sans-serif'],  // encabezados — personalidad, calidez
  sans:    ['"Plus Jakarta Sans"',   'sans-serif'],  // cuerpo — limpio, legible
}
```

### Inventario de componentes

| Componente | Prioridad | Inspiración |
|---|---|---|
| Header + Nav sticky | P0 | Schüco (limpio, sin ruido) |
| Hero con imagen + CTA | P0 | Strugal (imagen real de proyecto) |
| ProductCard | P0 | Schüco (imagen-first, info mínima) |
| BenefitBlock (iconos) | P0 | Strugal (LUZ, SEGURIDAD...) |
| ProductGallery + Lightbox | P0 | — |
| Footer | P0 | — |
| BrandLanding | P1 | Schüco (landing por sistema) |
| ReviewCard | P1 | Grupo Andrade actual |
| OficinaCard + Mapa | P1 | — |
| Modal / CTA popup | P2 | Ligero, reemplaza JetPopup |

---

## Arquitectura de Datos

### Endpoints REST de WordPress

JetEngine expone los CPTs con `show_in_rest: true`:

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

### Mu-plugins requeridos en WordPress

**`wp-content/mu-plugins/expose-meta.php`** — Exponer meta fields de JetEngine y Rank Math:

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

**`wp-content/mu-plugins/cors-api.php`** — CORS para llamadas desde Vercel:

```php
add_filter('rest_pre_serve_request', function($value) {
  header('Access-Control-Allow-Origin: https://grupoandrade.es');
  header('Access-Control-Allow-Methods: GET, OPTIONS');
  return $value;
});
```

### Capa de abstracción en Next.js

`src/lib/wordpress/api.ts`:

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
| `/puertas-divisorias/[slug]` | ISR + generateStaticParams | 86400s |
| `/canales/[slug]` | ISR + generateStaticParams | 86400s |
| `/sistemas/*` | ISR | 3600s |
| `/oficinas` | ISR | 86400s |
| `/contacto` | SSG puro | never |

**Tag-based revalidation** — invalidación inmediata al guardar en WP:

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

Hook en WordPress: `save_post` → POST a `/api/revalidate?secret=XXX`

---

## Estrategia SEO

### generateMetadata por ruta

```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const product = await getCPTBySlug('puertas-exteriores', params.slug)
  return {
    title: product.seo_meta.title || product.title.rendered,
    description: product.seo_meta.description,
    alternates: { canonical: `https://grupoandrade.es/puertas-exteriores/${params.slug}` },
    openGraph: { images: [{ url: product.seo_meta.og_image }] },
  }
}
```

### JSON-LD Structured Data

`src/components/seo/ProductSchema.tsx`:

```tsx
export function ProductSchema({ product }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title.rendered,
    image: product.meta.galeria?.map(i => i.url) ?? [],
    brand: { '@type': 'Brand', name: product.meta.marca_nombre },
    url: `https://grupoandrade.es/puertas-exteriores/${product.slug}`,
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}
```

Schemas adicionales en `app/layout.tsx`: `LocalBusiness` + `BreadcrumbList` por ruta.

### Sitemap

`src/app/sitemap.ts` (nativo Next.js 15) — genera `/sitemap.xml` consultando todos los CPTs en build.

---

## Estrategia de Imágenes y PDFs

### next.config.ts

```typescript
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'cms.grupoandrade.es', pathname: '/wp-content/uploads/**' }],
    formats: ['image/avif', 'image/webp'],
  },
}
```

### Galería
- Imagen LCP: `priority={true}`
- Resto: lazy load implícito de next/image
- Lightbox: `yet-another-react-lightbox` (~3KB) con dynamic import — carga solo al click

### PDFs
- Enlace directo a `cms.grupoandrade.es/wp-content/uploads/...`
- No pasan por Next.js (evita consumo de funciones serverless en Vercel free)
- En VPS futuro: Nginx con `Cache-Control: public, max-age=31536000, immutable`

---

## Estructura de Carpetas Next.js

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
│   ├── puertas-divisorias/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── canales/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
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
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── products/
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── ProductGallery.tsx            # Lightbox con dynamic import
│   │   └── ProductPdfButton.tsx
│   ├── home/
│   │   ├── HeroBanner.tsx
│   │   ├── BenefitBlock.tsx
│   │   ├── CategoryCards.tsx
│   │   ├── SystemsStrip.tsx
│   │   └── ReviewsCarousel.tsx
│   ├── brands/
│   │   └── BrandLanding.tsx              # Reutilizable para los 5 sistemas
│   ├── seo/
│   │   ├── ProductSchema.tsx
│   │   ├── LocalBusinessSchema.tsx
│   │   └── BreadcrumbSchema.tsx
│   └── ui/
│       ├── Button.tsx
│       └── Modal.tsx                     # Reemplaza JetPopup
└── lib/
    └── wordpress/
        ├── api.ts                        # getCPT, getCPTBySlug
        └── types.ts                      # Tipos TypeScript de cada CPT
```

---

## Configuración de Dominio

```
grupoandrade.es       → Vercel (Next.js frontend)
cms.grupoandrade.es   → WordPress en Hostalia
```

`wp-config.php`:
```php
define('WP_HOME', 'https://cms.grupoandrade.es');
define('WP_SITEURL', 'https://cms.grupoandrade.es');
```

---

## Fases de Migración

### Fase D — Diseño (previa a todo el código)

#### Requisitos Previos (Assets Necesarios)
Antes de iniciar la maquetación y desarrollo, es necesario recopilar o definir:
1. **Logotipo e Identidad Visual**: Logotipo principal en alta resolución (SVG preferiblemente o PNG transparente), posibles variantes (monocromo, para fondos oscuros) y Favicon (isotipo).
2. **Paleta de Colores y Tipografías**: Confirmar que el logo actual encaja con la nueva paleta *Warm Neutral* (acento en ámbar cálido `#C17F3A` y tonos arena/crema) y dar el OK a las tipografías propuestas (*Bricolage Grotesque* y *Plus Jakarta Sans*).
3. **Fotografías e Imágenes Estructurales**:
   - *Hero Home*: Imagen panorámica, cálida y de alta calidad para la cabecera principal.
   - *Landings de Sistemas*: Imágenes *flagship* (muy representativas) para la cabecera de cada sistema (Schüco, Techal, Okma, Dicores, Mosquilux).
   - *Galería de Proyectos (Home)*: Selección de las 6 mejores fotografías de instalaciones reales.
   - *Logos de Partners/Sistemas*: Logotipos en formato vectorial o con fondo transparente para el bloque deslizante de marcas en la home.
4. **Iconografía**: Confirmar si se usará una librería estándar elegante (ej. *Lucide Icons*) o si existe un set corporativo propio para ilustrar los beneficios (Seguridad, Aislamiento, Ahorro, Diseño).

#### Pasos de la Fase D
1. Confirmar paleta definitiva sobre el logo corporativo
2. Definir tokens en `tailwind.config.ts` (colores, tipografía, espaciados)
3. Maquetar componentes P0: Header, Hero, ProductCard, BenefitBlock, Footer
4. Validar look & feel antes de conectar datos reales

### Fase 0 — Preparación WordPress (sin tocar producción)

1. Crear subdominio `cms.grupoandrade.es` apuntando al WP actual
2. Actualizar `WP_HOME` y `WP_SITEURL` en wp-config.php
3. Verificar que todos los CPTs aparecen en `/wp-json/wp/v2/`
4. Instalar `expose-meta.php` y `cors-api.php`
5. Crear proyecto Next.js, configurar `.env.local`, testear `getCPT()`

### Fase 1 — Landings de sistema (riesgo bajo)

- `/sistemas/schueco-pvc`, `/sistemas/techal`, `/sistemas/okma`, `/sistemas/dicores`, `/sistemas/mosquilux`
- Componente `BrandLanding.tsx` reutilizable
- Validar en dominio temporal `.vercel.app`

### Fase 2 — Páginas de soporte (riesgo bajo)

- `/oficinas`, `/contacto` (formulario con Resend o Formspree, sin depender de WP)
- Home completo: Hero + Beneficios + Categorías + Sistemas + Reviews

### Fase 3 — Listados de producto (riesgo medio)

- `/puertas-exteriores`, `/puertas-divisorias`, `/canales`
- `ProductGrid` con datos reales
- Filtros por sistema via URL search params (sin JS extra)

### Fase 4 — Fichas individuales (riesgo medio-alto)

- Todos los `[slug]` pages
- Galería + Lightbox + PDF + JSON-LD + Breadcrumb
- Validar relaciones JetEngine (producto → sistema)
- `generateStaticParams` para pre-generar todas las fichas

### Fase 5 — Cutover DNS

1. Reducir TTL a 300s el día anterior
2. Añadir dominio custom `grupoandrade.es` en Vercel
3. Cambiar A record de `grupoandrade.es` a Vercel IP
4. Verificar 200 en rutas críticas
5. Comprobar Search Console + sitemap indexado

### Fase 6 — Limpieza post-cutover

- Desactivar Elementor y JetPopup en WordPress
- Configurar webhook `save_post` → `/api/revalidate`
- Monitorear Sentry + Search Console durante 7 días
- Ajustar revalidate según tráfico real

---

## Preparación para VPS (desde día 1)

- `output: 'standalone'` en `next.config.ts` (no afecta a Vercel, habilita Docker)
- Variables siempre via `process.env.*`, nunca hardcodeadas
- `ecosystem.config.js` con PM2 en el repo desde el inicio
- Sentry configurado desde el inicio: `npx @sentry/wizard -i nextjs`
- En VPS futuro: Cloudflare delante de `cms.grupoandrade.es` → cachea imágenes y PDFs desde el edge

---

## Verificación Final

1. **Rendimiento**: Lighthouse en `/puertas-exteriores/[slug]` → LCP < 2.5s, CLS = 0, TBT < 200ms
2. **SEO**: Verificar `<title>`, `<meta description>` y `application/ld+json` en source de cada tipo de página
3. **ISR**: Actualizar producto en WP → página refleja cambio en < 60s (webhook activo)
4. **Imágenes**: `Content-Type: image/avif` o `image/webp` en Network tab del navegador
5. **PDFs**: Descarga directa desde `cms.grupoandrade.es` sin pasar por Next.js
6. **URLs**: Sin 404 en ninguna ruta del sitio anterior (redirects configurados si hay cambios de slug)
