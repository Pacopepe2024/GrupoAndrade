// Tipos TypeScript generados desde skin-export-1.json (JetEngine CPT schuco-pvc)

export interface WPImage {
  id: number
  url: string
  alt?: string
  width?: number
  height?: number
}

export interface WPGalleryItem {
  id: number
  url: string
  alt?: string
}

export interface SeoMeta {
  title: string
  description: string
  og_title: string
  og_image: string
}

// Tripleta de prestación técnica (icono + etiqueta + valor)
export interface Prestacion {
  icono: WPImage | null
  texto: string
  valor: string
}

export interface SchuecoPvcMeta {
  // ── Fotos ──────────────────────────────────────────────────
  'foto-encabezado': WPImage | null
  'foto-listing':    WPImage | null
  'foto-cad':        WPGalleryItem[]

  // ── Diseño ─────────────────────────────────────────────────
  'nombre-fabricante':        string
  'nombre-producto':          string
  'descripcion--producto':    string          // descripción corta del header
  'color-fondo-producto':     string          // hex color
  'descripcion-larga-producto': string        // HTML (wysiwyg)
  'descripcion-corta-listing':  string        // HTML (wysiwyg)

  // ── Videos ─────────────────────────────────────────────────
  'enlace-video': string
  'video':        WPImage | null

  // ── Slider sección 2 (x4) ──────────────────────────────────
  'nombre_slider1':         string
  'contenido_slider_uno':   string
  'imagen_slider_uno':      WPImage | null
  'nombre_slider2':         string
  'contenido_slider_dos':   string
  'imagen_slider_dos':      WPImage | null
  'nombre_slider2_tres':    string
  'contenido_slider_tres':  string
  'imagen_slider_tres':     WPImage | null
  'nombre_slider2_cuatro':  string
  'contenido_slider_cuatro': string
  'imagen_slider_cuatro':   WPImage | null

  // ── Prestaciones técnicas ───────────────────────────────────
  profundidad_marco:    Prestacion
  profundidad_hoja:     Prestacion
  tipos_hojas:          Prestacion
  camaras:              Prestacion
  niveles_juntas:       Prestacion
  refuerzos:            Prestacion
  acristalamiento:      Prestacion
  aislamiento_termico:  Prestacion
  aislamiento_acustico: Prestacion
  seguridad:            Prestacion
  permeabilidad_aire:   Prestacion
  estanqueidad_agua:    Prestacion
  resistencia_viento:   Prestacion
  peso_maximo_hoja:     Prestacion
  acabado_superficies:  Prestacion
  // medidas máximas
  'texto_altura_blanco': string
  'max-blanco':          string
  'texto_altura_color':  string
  'max-color':           string
  // umbral
  umbral:       string
  valor_umbral: string

  // ── Acabados ────────────────────────────────────────────────
  lisos:     WPGalleryItem[]
  texturados: WPGalleryItem[]
  topalum:   WPGalleryItem[]

  // ── Inspírate ───────────────────────────────────────────────
  inspirate1: WPImage | null
  inspirate2: WPImage | null
  inspirate3: WPImage | null
  inspirate4: WPImage | null

  // ── Enlaces popup ───────────────────────────────────────────
  enlace_aislamiento_termico:         string
  enlace_aislamiento_termico_perfil:  string
  enlace_aislamiento_acustico:        string
  enlace_permeabilidad:               string
  enlace_estanqueidad:                string
  enlace_seguridad:                   string
  enlace_resistencia:                 string

  // ── Catálogo ────────────────────────────────────────────────
  'link-descarga':         string
  'link-descarga_flibox':  string
  shortcode:               string

  // ── Datos listing ───────────────────────────────────────────
  aplicacion:     string
  guia_inferior:  string
  orden:          number
  'link-listing': string

  // ── Iconos beneficio (x6) ───────────────────────────────────
  'icono-1': WPImage | null;  'texto-icono-1': string
  'icono-2': WPImage | null;  'texto-icono-2': string
  'icono-3': WPImage | null;  'texto-icono-3': string
  'icono-4': WPImage | null;  'texto-icono-4': string
  'icono-5': WPImage | null;  'texto-icono-5': string
  'icono-6': WPImage | null;  'texto-icono-6': string
}

// Respuesta completa del endpoint REST para schuco-pvc
export interface SchuecoPvcPost {
  id:       number
  slug:     string
  title:    { rendered: string }
  content:  { rendered: string }
  meta:     SchuecoPvcMeta
  seo_meta: SeoMeta
  _embedded?: {
    'wp:featuredmedia'?: Array<{ source_url: string; alt_text: string }>
  }
}
