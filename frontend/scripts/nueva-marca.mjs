import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const brandName = process.argv[2];

if (!brandName) {
  console.error('❌ Por favor, proporciona el nombre de la marca. Ejemplo: npm run nueva-marca techal');
  process.exit(1);
}

const formatBrandName = (name) => {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
};

const slug = formatBrandName(brandName);
const targetDir = path.join(__dirname, '..', 'src', 'app', '(site)', slug, '[slug]');

if (fs.existsSync(targetDir)) {
  console.error(`❌ La marca ${slug} ya existe en ${targetDir}`);
  process.exit(1);
}

fs.mkdirSync(targetDir, { recursive: true });

const pageTemplate = `import Link from 'next/link';
import { getCPT, getCPTBySlug } from '@/lib/wordpress/api';
import { ProductHero } from '@/components/products/ProductHero';

export async function generateStaticParams() {
  // Asegúrate de que el CPT existe en WordPress y en api.ts
  const products = await getCPT('${slug}');
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: productSlug } = await params;
  const product = await getCPTBySlug('${slug}', productSlug);
  return {
    title: \`\${product?.title?.rendered || 'Producto'} | Ventanas de \${product?.meta?.marca_nombre || '${brandName}'}\`,
    description: product?.meta?.['descripcion-larga-producto']?.substring(0, 155),
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: productSlug } = await params;
  const product = await getCPTBySlug('${slug}', productSlug);

  if (!product) {
    return <div className="p-24 text-center text-neutral-400">Producto no encontrado</div>;
  }

  const meta = product.meta || {};

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="px-6 lg:px-10 py-12">
        <Link
          href="/${slug}"
          className="inline-flex items-center gap-2 text-[#6BA43A] text-xs font-bold uppercase tracking-widest hover:underline"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Volver a sistemas de ${brandName}
        </Link>
      </div>

      <ProductHero
        title={product.title.rendered}
        descripcion={meta['descripcion-larga-producto'] || ''}
        images={[]} // Llenar dinámicamente
        dimensiones={[]} // Llenar dinámicamente
        prestaciones={[]} // Llenar dinámicamente
        finishes={[]} // Llenar dinámicamente
        linkDescarga={meta['link-descarga']}
        fabricante={'${brandName}'}
      />

      {/* JSON-LD AEO / SEO IA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.title.rendered,
            brand: { '@type': 'Brand', name: '${brandName}' },
            description: meta['descripcion-larga-producto'],
          }),
        }}
      />
    </div>
  );
}
`;

fs.writeFileSync(path.join(targetDir, 'page.tsx'), pageTemplate, 'utf8');

console.log(`✅ ¡Marca '${brandName}' creada con éxito!`);
console.log(`📂 Ruta: src/app/(site)/${slug}/[slug]/page.tsx`);
console.log('🚀 El componente ya incluye generateStaticParams, generateMetadata y JSON-LD (SEO Modo Dios).');
