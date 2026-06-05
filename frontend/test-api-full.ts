import { getCPTBySlug } from './src/lib/wordpress/api.ts';

async function run() {
  const product = await getCPTBySlug('schuco-pvc', 'symbiotic');
  console.log('meta for symbiotic:', product?.meta);
}
run();
