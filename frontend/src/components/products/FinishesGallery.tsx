'use client';

import { useState } from 'react';
import Image from 'next/image';

interface FinishesGalleryProps {
  lisos?: string | string[];
  texturados?: string | string[];
  topalum?: string | string[];
}

type TabType = 'lisos' | 'texturados' | 'topalum';

function parseGallery(data?: string | string[]): string[] {
  if (!data) return [];
  
  let items: string[] = [];
  if (Array.isArray(data)) {
    items = data;
  } else if (typeof data === 'string') {
    items = data.split(',').map(s => s.trim());
  }

  // Filtrar para asegurarnos de que lo que enviamos a <Image> es una URL real
  // y no un ID antiguo que haya quedado "fantasma" en la base de datos
  return items.filter(s => Boolean(s) && (s.startsWith('http') || s.startsWith('/')));
}

export function FinishesGallery({ lisos, texturados, topalum }: FinishesGalleryProps) {
  const tabs = [
    { id: 'lisos', label: 'Lisos', data: parseGallery(lisos) },
    { id: 'texturados', label: 'Texturados', data: parseGallery(texturados) },
    { id: 'topalum', label: 'Schüco TopAlu', data: parseGallery(topalum) },
  ].filter(t => t.data && t.data.length > 0) as { id: TabType; label: string; data: string[] }[];

  const [activeTab, setActiveTab] = useState<TabType>(tabs[0]?.id);

  if (tabs.length === 0) return null;

  const activeData = tabs.find(t => t.id === activeTab)?.data || [];

  return (
    <section className="py-16 bg-white border-t border-neutral-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-display font-bold text-slate-800 mb-4">Acabados y colores</h2>
          <p className="text-neutral-500 max-w-2xl mx-auto">
            Amplia variedad de acabados superficiales de alta calidad para integrar perfectamente sus ventanas en la arquitectura de su hogar.
          </p>
        </div>

        {/* Tabs Navigation */}
        <div className="flex justify-center gap-4 mb-10">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Grid de imágenes */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {activeData.map((imgUrl, idx) => (
            <div key={idx} className="flex flex-col items-center gap-3">
              <div className="relative aspect-square w-full rounded-full overflow-hidden shadow-sm border border-neutral-200 bg-neutral-50">
                <Image
                  src={imgUrl}
                  alt={`Acabado ${activeTab} ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 15vw"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
