'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';

const camaras = [
  { label: 'Cámara exterior',          descripcion: 'Primera barrera contra el frío y el ruido' },
  { label: 'Rotura de puente térmico', descripcion: 'Elimina la transmisión de temperatura entre interior y exterior' },
  { label: 'Cámara central',           descripcion: 'Núcleo de aislamiento acústico' },
  { label: 'Refuerzo de acero',        descripcion: 'Rigidez estructural sin comprometer el aislamiento' },
  { label: 'Cámara interior',          descripcion: 'Regulación de temperatura en el ambiente habitable' },
  { label: 'Triple junta de sellado',  descripcion: 'Estanqueidad total al agua y al aire' },
];

export function PerfilAnimado() {
  const containerRef = useRef<HTMLDivElement>(null);

  // La sección es 7× la altura del viewport → el scroll tiene recorrido real
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <div ref={containerRef} className="relative bg-neutral-950" style={{ height: '700vh' }}>

      {/* Contenido sticky — se queda fijo mientras el usuario scrollea */}
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <div className="w-full max-w-7xl mx-auto px-8 lg:px-20">

          {/* Cabecera */}
          <div className="mb-12 lg:mb-16">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 mb-4">
              Sección transversal · Schüco PVC
            </p>
            <h2 className="text-3xl lg:text-5xl font-light text-white leading-tight">
              6 cámaras.<br />
              <span className="text-white/40">Un solo propósito: tu bienestar.</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">

            {/* Foto real del perfil */}
            <motion.div
              className="relative w-full max-w-sm mx-auto aspect-[3/4]"
              style={{
                scale: useTransform(scrollYProgress, [0, 0.3], [0.92, 1]),
                opacity: useTransform(scrollYProgress, [0, 0.15], [0.4, 1]),
              }}
            >
              <Image
                src="/images/editorial/perfil-schuco.webp"
                alt="Perfil de ventana Schüco PVC — sección transversal"
                fill
                className="object-contain drop-shadow-2xl"
                sizes="(max-width: 1024px) 80vw, 40vw"
              />
            </motion.div>

            {/* Lista de cámaras */}
            <div className="space-y-0 divide-y divide-white/10">
              {camaras.map((c, i) => (
                <CamaraFila key={i} camara={c} index={i} scrollYProgress={scrollYProgress} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CamaraFila({ camara, index, scrollYProgress }: {
  camara: typeof camaras[0]; index: number;
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'];
}) {
  const step = 1 / camaras.length;
  const opacity = useTransform(scrollYProgress, [index * step, (index + 0.8) * step], [0.15, 1]);
  const x = useTransform(scrollYProgress, [index * step, (index + 0.8) * step], [24, 0]);

  return (
    <motion.div style={{ opacity, x }} className="py-5 flex gap-5 items-start">
      <span className="text-[10px] font-bold text-white/25 tabular-nums pt-0.5 shrink-0 w-5">
        {String(index + 1).padStart(2, '0')}
      </span>
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-white mb-1">
          {camara.label}
        </p>
        <p className="text-xs font-light text-white/40 leading-relaxed">
          {camara.descripcion}
        </p>
      </div>
    </motion.div>
  );
}
