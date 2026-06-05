import Link from 'next/link';
import { getCPT, getCPTBySlug } from '@/lib/wordpress/api';
import { ProductHero } from '@/components/products/ProductHero';
import { ProductHighlights } from '@/components/products/ProductHighlights';
import { FinishesGallery } from '@/components/products/FinishesGallery';
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
    meta.valor_tipos_de_hojas    && { label: 'Tipos de hojas', valor: meta.valor_tipos_de_hojas },
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

  const highlights = [
    { title: meta.nombre_slider1, content: meta.contenido_slider_uno, image: isValidImageUrl(meta.imagen_slider_uno) ? meta.imagen_slider_uno : undefined },
    { title: meta.nombre_slider2, content: meta.contenido_slider_dos, image: isValidImageUrl(meta.imagen_slider_dos) ? meta.imagen_slider_dos : undefined },
    { title: meta.nombre_slider2_tres, content: meta.contenido_slider_tres, image: isValidImageUrl(meta.imagen_slider_tres) ? meta.imagen_slider_tres : undefined },
    { title: meta.nombre_slider2_cuatro, content: meta.contenido_slider_cuatro, image: isValidImageUrl(meta.imagen_slider_cuatro) ? meta.imagen_slider_cuatro : undefined },
  ];

  const inspirationImages = [
    meta.inspirate1,
    meta.inspirate2,
    meta.inspirate3,
    meta.inspirate4,
  ].filter((url): url is string => isValidImageUrl(url));

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
        finishes={[
          ...((meta.finishes || []).filter((f: any) => f && f.url && typeof f.url === 'string' && f.url.length > 0)),
          ...(await parseGallery(meta.lisos)).map(url => ({ url })),
          ...(await parseGallery(meta.texturados)).map(url => ({ url })),
          ...(await parseGallery(meta.topalum)).map(url => ({ url }))
        ]}
        linkDescarga={meta['link-descarga']}
        fabricante={meta['nombre-fabricante']}
      />

      <ProductHighlights blocks={highlights} />

      <FinishesGallery
        lisos={await parseGallery(meta.lisos)}
        texturados={await parseGallery(meta.texturados)}
        topalum={await parseGallery(meta.topalum)}
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
