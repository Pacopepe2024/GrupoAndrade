export interface WPSeoMeta {
  title: string;
  description: string;
  og_title: string;
  og_image: string;
}

export interface WPProduct {
  id: number;
  date: string;
  slug: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  seo_meta?: WPSeoMeta;
  meta?: {
    // JetEngine Fields from skin-export-1.json
    'nombre-fabricante'?: string;
    'nombre-producto'?: string;
    'descripcion--producto'?: string;
    'descripcion-larga-producto'?: string;
    
    // Galerias
    'foto-cad'?: string; // IDs separados por coma
    lisos?: string;
    texturados?: string;
    
    // Technical Specs
    valor_profundidad_marco?: string;
    valor_profundidad_hoja?: string;
    acristalamiento?: string;
    'valor_aislamiento-termico'?: string;
    'valor_aislamiento-acustico'?: string;
    valor_seguridad?: string;
    valor_permeabilidad_aire?: string;
    valor_estanqueidad_agua?: string;
    valor_resistencia_viento?: string;
    'peso-maximo'?: string;
    
    // Documentacion
    'link-descarga'?: string;

    // Acabados (imágenes de finish para el swiper)
    finishes?: Array<{ url: string; fullUrl?: string; name?: string }>;

    // Feature Blocks
    icono_1?: string;
    'texto-icono-1'?: string;
    icono_2?: string;
    'texto-icono-2'?: string;
    icono_3?: string;
    'texto-icono-3'?: string;

    // Galería de inspiración
    inspirate1?: string;
    inspirate2?: string;
    inspirate3?: string;
    inspirate4?: string;

    // Specs adicionales
    valor_camara_living?: string;
    valor_niveles_juntas?: string;
    valor_tipos_de_hojas?: string;
    valor_refuerzo?: string;
    valor_umbral?: string;
    valor_acabado_superficies?: string;
    'max-blanco'?: string;
    'max-color'?: string;

    // Media
    video?: string;
    'enlace-video'?: string;
    'foto-galeria'?: string;
    topalum?: string;

    // Slider highlights
    nombre_slider1?: string;
    contenido_slider_uno?: string;
    imagen_slider_uno?: string;
    nombre_slider2?: string;
    contenido_slider_dos?: string;
    imagen_slider_dos?: string;
    nombre_slider2_tres?: string;
    contenido_slider_tres?: string;
    imagen_slider_tres?: string;
    nombre_slider2_cuatro?: string;
    contenido_slider_cuatro?: string;
    imagen_slider_cuatro?: string;
  };
  images?: string[];
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
    }>;
  };
}
