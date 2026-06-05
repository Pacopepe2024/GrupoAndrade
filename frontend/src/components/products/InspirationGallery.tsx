'use client';

import Image from 'next/image';

interface InspirationGalleryProps {
  images: string[];
}

export function InspirationGallery({ images }: InspirationGalleryProps) {
  const validImages = images.filter(Boolean);

  if (validImages.length === 0) return null;

  return (
    <section className="py-16 lg:py-24 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-display font-bold text-slate-800 mb-4">Inspírate</h2>
          <p className="text-neutral-500 max-w-2xl mx-auto">
            Descubre cómo nuestras ventanas se integran en diferentes estilos arquitectónicos y espacios.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {validImages.map((imgUrl, idx) => (
            <div 
              key={idx} 
              className={`relative overflow-hidden rounded-xl bg-neutral-200 group ${
                idx === 0 || idx === 3 ? 'aspect-[4/3]' : 'aspect-square md:aspect-[4/3]'
              }`}
            >
              <Image
                src={imgUrl}
                alt={`Inspiración ${idx + 1}`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
