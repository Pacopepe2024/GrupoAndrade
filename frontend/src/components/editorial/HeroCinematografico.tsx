'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface HeroCinematograficoProps {
  titulo: string;
  subtitulo?: string;
  imagenFondo: string;
  videoUrl?: string;
}

export function HeroCinematografico({
  titulo,
  subtitulo,
  imagenFondo,
  videoUrl,
}: HeroCinematograficoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (!videoUrl || !isDesktop || !videoRef.current) return;
    const video = videoRef.current;
    video.load();
    video.play().catch(() => {});
  }, [videoUrl, isDesktop]);

  const scrollToConfort = () => {
    document.getElementById('seccion-confort')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative w-full h-screen min-h-[600px] overflow-hidden bg-neutral-950">

      {/* Imagen placeholder — siempre visible, el video la tapa cuando está listo */}
      <Image
        src={imagenFondo}
        alt={titulo}
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />

      {/* Video — solo desktop, se superpone sobre la imagen cuando carga */}
      {videoUrl && isDesktop && (
        <video
          ref={videoRef}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            videoReady ? 'opacity-100' : 'opacity-0'
          }`}
          muted
          loop
          playsInline
          preload="none"
          onCanPlay={() => setVideoReady(true)}
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      )}

      {/* Velo oscuro gradiente */}
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/30 to-neutral-950/20" />

      {/* Contenido editorial */}
      <div className="absolute inset-0 flex flex-col justify-end px-8 pb-20 lg:px-20 lg:pb-24 max-w-5xl">

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: 'easeOut', delay: 0.3 }}
          className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/50 mb-6"
        >
          Schüco · Arquitectura del Bienestar
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.8, ease: 'easeOut', delay: 0.6 }}
          className="text-5xl lg:text-7xl xl:text-8xl font-light text-white leading-[1.05] tracking-tight mb-6"
          dangerouslySetInnerHTML={{ __html: titulo }}
        />

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6, ease: 'easeOut', delay: 1.1 }}
          className="text-xl lg:text-2xl font-light text-white/70 mb-12 max-w-xl leading-relaxed"
        >
          {subtitulo || 'Vivir mejor empieza por el silencio.'}
        </motion.p>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, ease: 'easeOut', delay: 1.6 }}
          onClick={scrollToConfort}
          className="self-start flex items-center gap-4 text-white/60 text-[11px] font-bold uppercase tracking-[0.25em] hover:text-white transition-colors duration-500 group"
        >
          Descubrir el confort
          <span className="w-12 h-px bg-white/40 group-hover:bg-white group-hover:w-20 transition-all duration-500" />
        </motion.button>
      </div>
    </section>
  );
}
