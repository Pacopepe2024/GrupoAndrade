import { getCPT } from '@/lib/wordpress/api';
import { ProductCard } from '@/components/products/ProductCard';

export default async function PuertasExterioresPage() {
  // Llama a la API de WordPress (o usa Mock data temporalmente si el FTP no está subido)
  const products = await getCPT('puertas-exteriores');

  return (
    <main className="min-h-screen bg-surface">
      {/* Hero Section Premium */}
      <section className="relative px-6 py-24 md:py-32 bg-neutral-50 border-b border-neutral-100">
        <div className="max-w-7xl mx-auto flex flex-col items-start">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-primary/10 text-primary text-sm font-semibold">
            <span className="w-2 h-2 rounded-full bg-primary"></span>
            Prototipo Headless
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-brand-900 mb-6">
            Puertas Exteriores
          </h1>
          <p className="text-lg md:text-xl text-neutral-600 max-w-2xl">
            Descubre nuestra gama premium de puertas. Máxima seguridad y aislamiento térmico con los mejores sistemas del mercado.
          </p>
        </div>
        
        {/* Adorno visual sutil */}
        <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-brand-100 to-transparent pointer-events-none" />
      </section>

      {/* Grid de Productos */}
      <section className="px-6 py-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              basePath="/puertas-exteriores" 
            />
          ))}
        </div>
        
        {products.length === 0 && (
          <div className="text-center py-24 text-neutral-500">
            No se encontraron productos o no se pudo conectar con WordPress.
          </div>
        )}
      </section>
    </main>
  );
}
