import Image from 'next/image';

interface HighlightBlock {
  title?: string;
  content?: string;
  image?: string;
}

interface ProductHighlightsProps {
  blocks: HighlightBlock[];
}

export function ProductHighlights({ blocks }: ProductHighlightsProps) {
  const validBlocks = blocks.filter(b => b.title || b.content || b.image);

  if (validBlocks.length === 0) return null;

  return (
    <section className="py-16 lg:py-24 bg-brand-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {validBlocks.map((block, index) => (
            <div key={index} className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-neutral-100">
              {block.image && (
                <div className="relative h-48 w-full bg-neutral-100">
                  <Image
                    src={block.image}
                    alt={block.title || 'Highlight image'}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                </div>
              )}
              <div className="p-6 flex flex-col flex-grow">
                {block.title && (
                  <h3 className="text-xl font-display font-bold text-slate-800 mb-3">
                    {block.title}
                  </h3>
                )}
                {block.content && (
                  <p className="text-neutral-600 text-sm leading-relaxed flex-grow">
                    {block.content}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
