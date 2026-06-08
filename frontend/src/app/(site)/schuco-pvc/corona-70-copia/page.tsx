import { getCPTBySlug } from '@/lib/wordpress/api';
import { AnatomyViewerClient } from './AnatomyViewerClient';
import Link from 'next/link';

export const revalidate = 3600;

export default async function Corona70CopiaPage() {
  const product = await getCPTBySlug('schuco-pvc', 'corona-70');

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
  parsedGallery = parsedGallery.filter(url => url && typeof url === 'string' && url.length > 5);

  const images: string[] = parsedGallery.length > 0
    ? parsedGallery
    : [product._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/placeholder.jpg'].filter(Boolean) as string[];

  // La base image de la anatomía 3D suele ser la segunda de la galería (el CAD) si existe
  const anatomyBaseImage = images[0] || '/images/perfil-pvc.webp';

  let anatomyHotspots: any[] = [];
  let anatomyBlocks: any[] = [];
  let lifestyleHotspots: any[] = [];
  let lifestyleBlocks: any[] = [];

  // --- LIFESTYLE (EMOCIONAL) ---
  const lifestyleImageRaw = meta.imagen_lifestyle;
  let lifestyleImage = '';
  if (lifestyleImageRaw) {
    if (typeof lifestyleImageRaw === 'string' && lifestyleImageRaw.startsWith('http')) {
      lifestyleImage = lifestyleImageRaw;
    } else if (typeof lifestyleImageRaw === 'number' || /^\d+$/.test(lifestyleImageRaw)) {
      lifestyleImage = typeof lifestyleImageRaw === 'string' ? lifestyleImageRaw : '';
    } else {
      lifestyleImage = lifestyleImageRaw;
    }
  }

  // JetEngine a veces devuelve el repeater como un objeto { "item-1": {...}, "item-2": {...} } en la REST API
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

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">

      <AnatomyViewerClient 
        hotspots={anatomyHotspots} 
        blocks={anatomyBlocks} 
        baseImage={anatomyBaseImage}
        productName={product.title.rendered}
        lifestyleImage={lifestyleImage}
        lifestyleHotspots={lifestyleHotspots}
        lifestyleBlocks={lifestyleBlocks}
        ctaPhrase={meta.frase_impacto_final}
        ctaButtonText={meta.texto_boton_final}
        ctaLink={meta.enlace_boton_final}
      />
    </div>
  );
}
