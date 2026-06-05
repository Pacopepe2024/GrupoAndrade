import { WPProduct } from './types';

// Conectamos a tu WordPress real
const WP_BASE = process.env.NEXT_PUBLIC_WP_API_URL || 'https://grupoandrade.es/wp-json/wp/v2';

export async function getCPT<T = WPProduct>(cpt: string, params: Record<string, string> = {}): Promise<T[]> {
  try {
    const url = new URL(`${WP_BASE}/${cpt}`);
    url.searchParams.set('per_page', '100');
    url.searchParams.set('_embed', '1');
    
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    
    const res = await fetch(url.toString(), { 
      // Desactivamos la caché temporalmente para que veas los cambios al instante
      cache: 'no-store'
    });

    if (!res.ok) {
      console.warn(`[WP API] Fallo al obtener ${cpt} (${res.status}). Devolviendo mock para desarrollo.`);
      return getMockData(cpt) as unknown as T[];
    }

    return res.json();
  } catch (error) {
    console.warn(`[WP API] Error de conexión con ${WP_BASE}. Devolviendo mock para desarrollo.`);
    return getMockData(cpt) as unknown as T[];
  }
}

export async function getCPTBySlug<T = WPProduct>(cpt: string, slug: string): Promise<T | null> {
  const items = await getCPT<T>(cpt, { slug });
  return items.length > 0 ? items[0] : null;
}

// Datos de prueba (Mock) mientras configuramos el REST API de JetEngine
function getMockData(_cpt: string): WPProduct[] {
  return [
    {
      id: 1,
      date: new Date().toISOString(),
      slug: 'schuco-focusing', // Slug original que tenías en Next
      title: { rendered: 'Schüco Focus Ing (MODO PRUEBA)' },
      content: { rendered: '' },
      meta: {
        'descripcion-larga-producto': 'Los datos reales de JetEngine aún no están saliendo por la API REST de tu WordPress. Debemos activar la opción "Register in REST API" en JetEngine o usar el script expose-meta.php.',
        valor_profundidad_marco: '70 mm',
        valor_profundidad_hoja: '76 mm',
        acristalamiento: '16 mm - 54 mm',
        'valor_aislamiento-termico': 'Uw = 1,0 W/(m²K)',
        'valor_aislamiento-acustico': 'Rw = 48 dB',
        valor_seguridad: 'hasta RC2',
        valor_permeabilidad_aire: 'Clase 4',
        valor_estanqueidad_agua: 'Clase 9A',
        valor_resistencia_viento: 'Clase B5',
        'link-descarga': 'https://cms.grupoandrade.es/wp-content/uploads/2024/04/Scheda-Prodotto-Schuco-Focusing-1.pdf',
        finishes: [
          { url: 'https://www.schuecopws.it/wp-content/smush-webp/2024/04/Achatgrau-Glatt-150x150.jpg.webp', name: 'Achatgrau Glatt' },
          { url: 'https://www.schuecopws.it/wp-content/smush-webp/2024/04/Aluminium-Geburstet-150x150.jpg.webp', name: 'Aluminium Gebürstet' },
          { url: 'https://www.schuecopws.it/wp-content/smush-webp/2024/04/Anteak-1-150x150.jpg.webp', name: 'Anteak' }
        ]
      },
      images: [
        'https://www.schuecopws.it/wp-content/uploads/2024/01/Schueco_LivIng_Doppelmotiv_grigio-300dpi.jpg',
        'https://www.schuecopws.it/wp-content/uploads/2024/01/Schueco-LivIng.jpg',
      ]
    }
  ];
}
