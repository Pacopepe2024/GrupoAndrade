import { getCPTBySlug } from './src/lib/wordpress/api';

async function run() {
  const product = await getCPTBySlug('schuco-pvc', 'symbiotic');
  console.log('finishes:', product?.meta?.finishes);
  console.log('lisos:', product?.meta?.lisos);
  console.log('texturados:', product?.meta?.texturados);
  console.log('topalum:', product?.meta?.topalum);
}
run();
