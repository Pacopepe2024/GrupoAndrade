import Image from 'next/image';
import Link from 'next/link';
import { WPProduct } from '@/lib/wordpress/types';

interface ProductCardProps {
  product: WPProduct;
  basePath?: string;
}

export function ProductCard({ product, basePath = '/puertas-exteriores' }: ProductCardProps) {
  const imageUrl = product._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/placeholder.jpg';
  const imageAlt = product._embedded?.['wp:featuredmedia']?.[0]?.alt_text || product.title.rendered;
  const brandName = product.meta?.marca_nombre || 'Grupo Andrade';

  return (
    <Link 
      href={`${basePath}/${product.slug}`}
      className="group relative flex flex-col overflow-hidden bg-surface transition-all duration-300 hover:shadow-xl"
    >
      {/* Imagen Principal - Estilo arquitectónico (bordes rectos) */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Badge de Sistema / Marca - Estilo industrial */}
        <div className="absolute top-4 left-4 bg-white px-4 py-1 text-xs font-bold tracking-wider uppercase text-text-main shadow-sm">
          {brandName}
        </div>
      </div>

      {/* Contenido (Textos y CTA) */}
      <div className="flex flex-1 flex-col justify-between p-6 border-x border-b border-neutral-100">
        <div>
          <h3 className="mb-3 text-2xl font-bold leading-tight text-text-main transition-colors group-hover:text-primary" dangerouslySetInnerHTML={{ __html: product.title.rendered }} />
          {product.meta?.beneficios && (
            <p className="line-clamp-2 text-sm text-neutral-500 font-light">
              {product.meta.beneficios}
            </p>
          )}
        </div>
        
        {/* Call to action estilo Schüco (líneas limpias) */}
        <div className="mt-8 flex items-center text-sm font-bold uppercase tracking-wider text-text-main transition-colors group-hover:text-primary">
          <span>Descubrir más</span>
          <svg className="ml-3 h-4 w-4 transition-transform duration-300 group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
