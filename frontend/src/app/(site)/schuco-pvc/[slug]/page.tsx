import Link from 'next/link';
import { getCPT, getCPTBySlug } from '@/lib/wordpress/api';
import { ProductHero } from '@/components/products/ProductHero';
import { InspirationGallery } from '@/components/products/InspirationGallery';
import { ProductVideo } from '@/components/products/ProductVideo';

export async function generateStaticParams() {
  const products = await getCPT('schuco-pvc');
  return products.map((p: any) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getCPTBySlug('schuco-pvc', slug);
  return {
    title: `${product?.title?.rendered || 'Producto'} | Ventanas de PVC Schüco`,
    description: product?.meta?.['descripcion-larga-producto']?.substring(0, 155),
  };
}

async function parseGallery(data?: string | string[]): Promise<string[]> {
  if (!data) return [];
  let items: string[] = [];
  if (Array.isArray(data)) {
    items = data;
  } else if (typeof data === 'string') {
    items = data.split(',').map(s => s.trim());
  }
  
  const validItems = items.filter(Boolean);
  const resolvedUrls = await Promise.all(validItems.map(async (item) => {
    if (item.startsWith('http') || item.startsWith('/')) {
      return item;
    }
    // Es un ID numérico de WordPress
    if (/^\d+$/.test(item)) {
      try {
        const res = await fetch(`https://grupoandrade.es/wp-json/wp/v2/media/${item}`);
        if (res.ok) {
          const media = await res.json();
          return media?.source_url || '';
        }
      } catch (e) {
        console.error('Error resolviendo media ID:', item);
      }
    }
    return '';
  }));

  return resolvedUrls.filter(url => url && url.length > 0);
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getCPTBySlug('schuco-pvc', slug);

  if (!product) {
    return <div className="p-24 text-center text-neutral-400">Producto no encontrado</div>;
  }

  const meta = product.meta || {};

  const rawGallery = meta['foto-galeria'] || meta['foto-cad'];
  let parsedGallery: string[] = [];
  if (rawGallery) {
    if (Array.isArray(rawGallery)) {
      parsedGallery = rawGallery;
    } else if (typeof rawGallery === 'string') {
      parsedGallery = rawGallery.split(',').map(s => s.trim()).filter(Boolean);
    }
  }

  // Filtrar urls vacías por si JetEngine devuelve un array con strings vacíos
  parsedGallery = parsedGallery.filter(url => url && typeof url === 'string' && url.length > 5);

  const images: string[] = parsedGallery.length > 0
    ? parsedGallery
    : [product._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/placeholder.jpg'].filter(Boolean) as string[];

  const dimensiones = [
    meta.valor_profundidad_marco && { 
      label: 'Prof. marco', 
      valor: meta.valor_profundidad_marco,
      x: meta.cota_marco_x,
      y: meta.cota_marco_y,
      rotacion: meta.cota_marco_rotacion,
      ancho: meta.cota_marco_ancho
    },
    meta.valor_profundidad_hoja  && { 
      label: 'Prof. hoja',  
      valor: meta.valor_profundidad_hoja,
      x: meta.cota_hoja_x,
      y: meta.cota_hoja_y,
      rotacion: meta.cota_hoja_rotacion,
      ancho: meta.cota_hoja_ancho
    },

    meta.acristalamiento         && { 
      label: 'Espesor vidrio', 
      valor: meta.acristalamiento,
      x: meta.cota_vidrio_x,
      y: meta.cota_vidrio_y,
      rotacion: meta.cota_vidrio_rotacion,
      ancho: meta.cota_vidrio_ancho
    },
    meta.valor_total_seccion     && { 
      label: 'Total sección', 
      valor: meta.valor_total_seccion,
      x: meta.cota_total_seccion_x,
      y: meta.cota_total_seccion_y,
      rotacion: meta.cota_total_seccion_rotacion,
      ancho: meta.cota_total_seccion_ancho
    },
    meta['max-blanco']           && { label: 'Máx. Blanco', valor: meta['max-blanco'] },
    meta['max-color']            && { label: 'Máx. Color',  valor: meta['max-color'] },
  ].filter(Boolean) as { label: string; valor: string; x?: string; y?: string; rotacion?: string; ancho?: string }[];

  const prestaciones = [
    { label: 'Aislamiento térmico',   valor: meta['valor_aislamiento-termico'] },
    { label: 'Aislamiento acústico',  valor: meta['valor_aislamiento-acustico'] },
    { label: 'Cámaras aislamiento',   valor: meta.valor_camara_living },
    { label: 'Niveles de juntas',     valor: meta.valor_niveles_juntas },
    { label: 'Tipos de refuerzos',    valor: meta.valor_refuerzo },
    { label: 'Resistencia al viento', valor: meta.valor_resistencia_viento },
    { label: 'Permeabilidad al aire', valor: meta.valor_permeabilidad_aire },
    { label: 'Estanqueidad al agua',  valor: meta.valor_estanqueidad_agua },
    { label: 'Seguridad',             valor: meta.valor_seguridad },
    { label: 'Peso máximo por hoja',  valor: meta['peso-maximo'] },
    { label: 'Umbral inferior',       valor: meta.valor_umbral },
    { label: 'Acabados disponibles',  valor: meta.valor_acabado_superficies },
  ].filter(p => p.valor) as { label: string; valor: string }[];

  const isValidImageUrl = (url?: string) => Boolean(url) && typeof url === 'string' && (url.startsWith('http') || url.startsWith('/'));

  const inspirationImages = [
    meta.inspirate1,
    meta.inspirate2,
    meta.inspirate3,
    meta.inspirate4,
  ].filter((url): url is string => isValidImageUrl(url));

  // --- ANATOMÍA 3D (TÉCNICA) ---
  let anatomyHotspots: any[] = [];
  let anatomyBlocks: any[] = [];

  // JetEngine a veces devuelve el repeater como un objeto { "item-1": {...}, "item-2": {...} } en la REST API
  const puntosRaw = meta.puntos_anatomia_3d;
  const puntosArray = puntosRaw ? (Array.isArray(puntosRaw) ? puntosRaw : Object.values(puntosRaw)) : [];

  // Comprobar si existe el repeater field de JetEngine (Opción B)
  if (puntosArray && puntosArray.length > 0) {
    anatomyHotspots = puntosArray.map((p: any, index: number) => ({
      id: index,
      x: Number(p.coordenada_x) || 50,
      y: Number(p.coordenada_y) || 50,
      spotlightSize: Number(p.tamano_foco) || 200,
    }));

    anatomyBlocks = puntosArray.map((p: any) => ({
      title: p.titulo_bloque || 'Punto técnico',
      text: p.texto_descriptivo || '',
      kpis: [
        { label: p.kpi_1_label, value: p.kpi_1_valor },
        { label: p.kpi_2_label, value: p.kpi_2_valor },
      ].filter(k => k.label && k.value && k.value !== 'N/A')
    }));
  } else {
    // Fallback de compatibilidad: Los 5 puntos fijos originales (Opción A)
    anatomyHotspots = [
      { id: 0, x: Number(meta.hotspot_acristalamiento_x) || 54, y: Number(meta.hotspot_acristalamiento_y) || 18, spotlightSize: 246 },
      { id: 1, x: Number(meta.hotspot_juntas_x) || 58, y: Number(meta.hotspot_juntas_y) || 38, spotlightSize: 214 },
      { id: 2, x: Number(meta.hotspot_camara_x) || 48, y: Number(meta.hotspot_camara_y) || 58, spotlightSize: 294 },
      { id: 3, x: Number(meta.hotspot_refuerzo_x) || 38, y: Number(meta.hotspot_refuerzo_y) || 71, spotlightSize: 248 },
      { id: 4, x: Number(meta.hotspot_drenaje_x) || 65, y: Number(meta.hotspot_drenaje_y) || 64, spotlightSize: 228 },
    ];

    anatomyBlocks = [
      {
        title: 'Acristalamiento eficiente',
        text: 'El vidrio se presenta como una pieza de precisión: menos pérdida energética, más confort interior y una lectura visual mucho más limpia.',
        kpis: [
          { label: 'Espesor', value: meta.acristalamiento || 'N/A' },
          { label: 'Térmico', value: meta['valor_aislamiento-termico'] || 'N/A' },
        ].filter(k => k.value !== 'N/A')
      },
      {
        title: 'Juntas de estanqueidad',
        text: 'El foco se desplaza a las juntas para explicar el sellado perimetral sin romper la imagen ni crear una animación agresiva.',
        kpis: [
          { label: 'Niveles', value: meta.valor_niveles_juntas || 'N/A' },
          { label: 'Aire', value: meta.valor_permeabilidad_aire || 'N/A' },
        ].filter(k => k.value !== 'N/A')
      },
      {
        title: 'Perfil multicámara',
        text: 'Las cámaras interiores se iluminan de forma selectiva para mostrar la ingeniería oculta del perfil de PVC y su función aislante.',
        kpis: [
          { label: 'Cámaras', value: meta.valor_camara_living || 'N/A' },
          { label: 'Prof. marco', value: meta.valor_profundidad_marco || 'N/A' },
        ].filter(k => k.value !== 'N/A')
      },
      {
        title: 'Refuerzo estructural',
        text: 'Una transición suave resalta la zona estructural y transmite solidez, estabilidad y producto de alto rendimiento.',
        kpis: [
          { label: 'Refuerzo', value: meta.valor_refuerzo || 'N/A' },
          { label: 'Seguridad', value: meta.valor_seguridad || 'N/A' },
        ].filter(k => k.value !== 'N/A')
      },
      {
        title: 'Drenaje oculto',
        text: 'El detalle técnico se explica con un foco preciso y una estética limpia, sin recargar la composición ni distraer del producto.',
        kpis: [
          { label: 'Agua', value: meta.valor_estanqueidad_agua || 'N/A' },
          { label: 'Viento', value: meta.valor_resistencia_viento || 'N/A' },
        ].filter(k => k.value !== 'N/A')
      }
    ];
  }

  const anatomyBaseImage = images[0] || '/images/perfil-pvc.webp';

  // --- LIFESTYLE (EMOCIONAL) ---
  const lifestyleImageRaw = meta.imagen_lifestyle;
  // If JetEngine returns an ID (number) we would need to resolve it, but if it's a URL (string) we can use it.
  // We'll parse it like inspiration images if needed, or assume it's a URL string if returned by REST API.
  let lifestyleImage = '';
  if (lifestyleImageRaw) {
    if (typeof lifestyleImageRaw === 'string' && lifestyleImageRaw.startsWith('http')) {
      lifestyleImage = lifestyleImageRaw;
    } else if (typeof lifestyleImageRaw === 'number' || /^\d+$/.test(lifestyleImageRaw)) {
      // Need to resolve ID, but for now we'll rely on it being resolved previously or try to fetch it if needed.
      // Assuming JetEngine is configured to return URL.
      lifestyleImage = typeof lifestyleImageRaw === 'string' ? lifestyleImageRaw : '';
    } else {
      lifestyleImage = lifestyleImageRaw;
    }
  }

  let lifestyleHotspots: any[] = [];
  let lifestyleBlocks: any[] = [];

  const puntosLifeRaw = meta.puntos_lifestyle || meta.puntos_lifestyle_;
  const puntosLifeArray = puntosLifeRaw ? (Array.isArray(puntosLifeRaw) ? puntosLifeRaw : Object.values(puntosLifeRaw)) : [];

  if (puntosLifeArray && puntosLifeArray.length > 0) {
    lifestyleHotspots = puntosLifeArray.map((p: any, index: number) => ({
      id: index,
      x: Number(p.coordenada_x) || 50,
      y: Number(p.coordenada_y) || 50,
      spotlightSize: Number(p.tamano_foco) || 150,
    }));

    lifestyleBlocks = puntosLifeArray.map((p: any) => ({
      title: p.titulo_bloque || 'Punto de confort',
      text: p.texto_descriptivo || '',
      kpis: [
        { label: p.kpi_1_label || p.kpi_label, value: p.kpi_1_valor || p.kpi_valor },
        { label: p.kpi_2_label, value: p.kpi_2_valor },
      ].filter(k => k.label && k.value && k.value !== 'N/A')
    }));
  }

  return (
    <div className="min-h-screen bg-white">

      {/* Breadcrumb */}
      <div className="px-6 lg:px-10 py-12">
        <Link
          href="/schuco-pvc"
          className="inline-flex items-center gap-2 text-[#6BA43A] text-xs font-bold uppercase tracking-widest hover:underline"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Volver a sistemas de ventanas en PVC
        </Link>
      </div>

      <ProductHero
        title={product.title.rendered}
        descripcion={meta['descripcion-larga-producto'] || ''}
        images={images}
        dimensiones={dimensiones}
        prestaciones={prestaciones}
        finishes={{
          lisos: (await parseGallery(meta.lisos)).map(url => ({ url })),
          texturados: (await parseGallery(meta.texturados)).map(url => ({ url })),
          topalum: (await parseGallery(meta.topalum)).map(url => ({ url })),
          estandar: ((meta.finishes || []).filter((f: any) => f && f.url && typeof f.url === 'string' && f.url.length > 0)),
        }}
        linkDescarga={meta['link-descarga']}
        fabricante={meta['nombre-fabricante']}
        anatomyHotspots={anatomyHotspots}
        anatomyBlocks={anatomyBlocks}
        anatomyBaseImage={anatomyBaseImage}
        lifestyleImage={lifestyleImage}
        lifestyleHotspots={lifestyleHotspots}
        lifestyleBlocks={lifestyleBlocks}
        ctaPhrase={meta.frase_impacto_final}
        ctaButtonText={meta.texto_boton_final}
        ctaLink={meta.enlace_boton_final}
      />

      <InspirationGallery images={inspirationImages} />

      {/* JSON-LD AEO / SEO IA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.title.rendered,
            brand: { '@type': 'Brand', name: 'Schüco' },
            description: meta['descripcion-larga-producto'],
          }),
        }}
      />
    </div>
  );
}
