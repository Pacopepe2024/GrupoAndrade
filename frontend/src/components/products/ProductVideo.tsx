'use client';

interface ProductVideoProps {
  enlaceVideo?: string;
  videoUrl?: string;
}

export function ProductVideo({ enlaceVideo, videoUrl }: ProductVideoProps) {
  if (!enlaceVideo && !videoUrl) return null;

  // Si es un enlace de youtube, convertir a embed
  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/watch?v=')) {
      return url.replace('watch?v=', 'embed/');
    }
    if (url.includes('youtu.be/')) {
      return url.replace('youtu.be/', 'youtube.com/embed/');
    }
    return url;
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-5xl mx-auto px-6 lg:px-10">
        <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-lg bg-neutral-900">
          {enlaceVideo ? (
            <iframe
              src={getEmbedUrl(enlaceVideo)}
              title="Video del producto"
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : videoUrl ? (
            <video 
              src={videoUrl} 
              controls 
              className="w-full h-full object-cover"
              controlsList="nodownload"
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}
