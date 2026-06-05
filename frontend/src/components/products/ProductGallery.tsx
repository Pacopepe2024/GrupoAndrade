'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
  images: string[];
  title: string;
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const mainImage = images[activeIndex];

  // Si no hay imágenes, devolvemos un placeholder básico
  if (!images || images.length === 0) {
    return (
      <div className="lg:col-span-7 flex-grow bg-[#F3F4F6] relative aspect-square w-full flex items-center justify-center text-neutral-400">
        Sin imagen
      </div>
    );
  }

  return (
    <div className="lg:col-span-7 flex gap-4 min-w-0 items-start">
      {/* Miniaturas */}
      <div className="flex flex-col gap-4 w-20 lg:w-24 shrink-0">
        {images.map((img, i) => (
          <div 
            key={i} 
            onClick={() => setActiveIndex(i)}
            className={`aspect-square bg-neutral-100 border cursor-pointer hover:border-primary transition-colors relative ${
              activeIndex === i ? 'border-primary' : 'border-transparent'
            }`}
          >
             <Image 
               src={img} 
               alt={`${title} - miniatura ${i + 1}`} 
               fill 
               className="object-cover p-2" 
             />
          </div>
        ))}
      </div>
      
      {/* Imagen Principal con Animación */}
      <div className="flex-grow bg-[#F3F4F6] relative aspect-square w-full overflow-hidden">
        <Image 
          key={mainImage} // Force re-render for animation
          src={mainImage} 
          alt={title} 
          fill 
          className="object-contain p-8 animate-in fade-in zoom-in-95 duration-500 ease-out" 
          priority 
        />
      </div>
    </div>
  );
}
