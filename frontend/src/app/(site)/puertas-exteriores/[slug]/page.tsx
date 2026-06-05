import Image from 'next/image';
import Link from 'next/link';
import { getCPTBySlug } from '@/lib/wordpress/api';

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await getCPTBySlug('puertas-exteriores', slug);

  if (!product) {
    return <div className="p-24 text-center">Producto no encontrado</div>;
  }

  const meta = product.meta || {};
  const mainImage = product._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/placeholder.jpg';

  return (
    <main className="min-h-screen bg-surface">

      {/* 1. Cabecera (Breadcrumb) */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Link href="/puertas-exteriores" className="text-primary text-sm font-bold tracking-wider uppercase hover:text-brand-600 transition-colors flex items-center gap-2">
          &larr; Volver a sistemas para ventanas en PVC
        </Link>
      </div>

      {/* 2. Hero Split (Imagen Izquierda, Contenido Derecha) */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 pb-24">

        {/* Izquierda: Imagen Principal y Miniaturas */}
        <div className="flex gap-4 min-w-0">
          <div className="flex flex-col gap-4 w-24 shrink-0">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square bg-neutral-100 border border-neutral-200 cursor-pointer hover:border-primary transition-colors relative">
                 <Image src={mainImage} alt="Thumb" fill className="object-cover p-2" />
              </div>
            ))}
          </div>
          <div className="flex-1 bg-neutral-100 relative aspect-square min-w-0">
            <Image src={mainImage} alt={product.title.rendered} fill className="object-cover" priority />
          </div>
        </div>

        {/* Derecha: Textos y Rivestimenti */}
        <div className="flex flex-col pt-8">
          <div className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-4">
            PRODUCTOS · SISTEMAS PARA VENTANAS EN PVC
          </div>
          <h1 className="text-5xl font-bold text-neutral-900 mb-8" dangerouslySetInnerHTML={{ __html: product.title.rendered }} />

          <div className="prose prose-neutral prose-lg font-light text-neutral-600 mb-12">
            <p>
              {meta['descripcion-larga-producto'] ||
                'El sistema que une los excelentes rendimientos con la profundidad de 70mm, se convierte en "Twin System" insertando en su interior tres niveles de sellado.'}
            </p>
          </div>

          {/* Acabados (Rivestimenti) */}
          <div className="mb-12">
            <h4 className="text-sm font-bold text-neutral-900 mb-4">Acabados</h4>
            <div className="flex gap-3 items-center bg-neutral-50 p-2 inline-flex border border-neutral-100">
              <button className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-neutral-900">&larr;</button>
              <div className="w-6 h-6 rounded-full bg-[#8A9A9A] border border-neutral-200 cursor-pointer hover:scale-110 transition-transform"></div>
              <div className="w-6 h-6 rounded-full bg-[#E5E4E2] border border-neutral-200 cursor-pointer hover:scale-110 transition-transform"></div>
              <div className="w-6 h-6 rounded-full bg-[#4A4A4A] border border-neutral-200 cursor-pointer hover:scale-110 transition-transform"></div>
              <div className="w-6 h-6 rounded-full bg-[#2C2C2C] border border-neutral-200 cursor-pointer hover:scale-110 transition-transform"></div>
              <div className="w-6 h-6 rounded-full bg-[#D2B48C] border border-neutral-200 cursor-pointer hover:scale-110 transition-transform"></div>
              <button className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-neutral-900">&rarr;</button>
            </div>
          </div>

          {/* Dimensiones */}
          <div className="mb-12">
            <h4 className="text-sm font-bold text-neutral-900 mb-4">Dimensiones</h4>
            <div className="grid grid-cols-3 gap-1 text-center text-sm bg-neutral-200">
              <div className="bg-neutral-50 p-4 flex items-center justify-center">
                Profundidad del marco:<br/>{meta.valor_profundidad_marco || '70 mm'}
              </div>
              <div className="bg-neutral-50 p-4 flex items-center justify-center">
                Profundidad de la hoja:<br/>{meta.valor_profundidad_hoja || '76 mm'}
              </div>
              <div className="bg-neutral-50 p-4 flex items-center justify-center">
                Espesor del vidrio:<br/>{meta.acristalamiento || '16 mm - 54 mm'}
              </div>
            </div>
          </div>

          <button className="w-full bg-neutral-900 text-white font-bold py-5 uppercase tracking-widest hover:bg-primary transition-colors">
            Solicitar Información
          </button>
        </div>
      </section>

      {/* 3. Acordeones Técnicos */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <details className="group mb-2 border border-neutral-200" open>
          <summary className="flex justify-between items-center font-bold cursor-pointer list-none p-6 bg-neutral-600 text-white hover:bg-neutral-700 transition-colors">
            <span>Información técnica</span>
            <span className="transition group-open:rotate-180">
              <svg fill="none" height="24" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="24"><path d="M19 9l-7 7-7-7"></path></svg>
            </span>
          </summary>
          <div className="p-6 bg-neutral-50 border-t border-neutral-200 text-sm">
            <div className="grid grid-cols-2 py-4 border-b border-neutral-200"><span className="text-neutral-500">Aislamiento térmico</span><span className="font-bold">{meta['valor_aislamiento-termico'] || 'Uw = 1,0 W/(m²K)'}</span></div>
            <div className="grid grid-cols-2 py-4 border-b border-neutral-200"><span className="text-neutral-500">Aislamiento acústico</span><span className="font-bold">{meta['valor_aislamiento-acustico'] || 'Rw = 48 dB'}</span></div>
            <div className="grid grid-cols-2 py-4 border-b border-neutral-200"><span className="text-neutral-500">Resistencia a la efracción</span><span className="font-bold">{meta.valor_seguridad || 'hasta RC2'}</span></div>
            <div className="grid grid-cols-2 py-4 border-b border-neutral-200"><span className="text-neutral-500">Permeabilidad al aire</span><span className="font-bold">{meta.valor_permeabilidad_aire || 'Clase 4'}</span></div>
            <div className="grid grid-cols-2 py-4 border-b border-neutral-200"><span className="text-neutral-500">Estanqueidad al agua</span><span className="font-bold">{meta.valor_estanqueidad_agua || 'Clase 9A'}</span></div>
            <div className="grid grid-cols-2 py-4"><span className="text-neutral-500">Resistencia al viento</span><span className="font-bold">{meta.valor_resistencia_viento || 'Clase B5'}</span></div>
          </div>
        </details>

        <details className="group border border-neutral-200">
          <summary className="flex justify-between items-center font-bold cursor-pointer list-none p-6 bg-neutral-50 hover:bg-neutral-100 transition-colors">
            <span>Documentación</span>
            <span className="transition group-open:rotate-180">
              <svg fill="none" height="24" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="24"><path d="M19 9l-7 7-7-7"></path></svg>
            </span>
          </summary>
          <div className="p-6 bg-white border-t border-neutral-200 text-sm flex justify-between items-center">
            <span className="font-bold">Ficha de Producto - {product.title.rendered}</span>
            <a href={meta['link-descarga'] || '#'} className="text-primary hover:underline uppercase text-xs font-bold tracking-widest flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
              Descargar archivo
            </a>
          </div>
        </details>
      </section>

    </main>
  );
}
