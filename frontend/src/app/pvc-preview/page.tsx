import { SchucoPVCAnatomy } from '@/components/ui/SchucoPVCAnatomy';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Preview Anatomía PVC | Grupo Andrade',
  description: 'Previsualización interactiva de perfilería PVC',
};

export default function PvcPreviewPage() {
  return (
    <main className="bg-[#050605] min-h-screen text-white">
      <SchucoPVCAnatomy 
        hotspots={[]}
        blocks={[]}
        baseImage=""
      />
    </main>
  );
}
