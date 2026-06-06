import { getCPT, getCPTBySlug } from './src/lib/wordpress/api';

async function run() {
  const product = await getCPTBySlug('schuco-pvc', 'symbiotic');
  console.log('meta for symbiotic:', product?.meta);
}
run();
