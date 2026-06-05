'use client';

import { useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ExperienciaSilencioProps {
  audioRuidoUrl?: string;
  audioSilencioUrl?: string;
}

type Estado = 'inicial' | 'ruido' | 'cerrando' | 'silencio';

export function ExperienciaSilencio({
  audioRuidoUrl = '/audio/ciudad-ruido.mp3',
  audioSilencioUrl = '/audio/interior-silencio.mp3',
}: ExperienciaSilencioProps) {
  const [estado, setEstado] = useState<Estado>('inicial');
  const audioRuidoRef = useRef<HTMLAudioElement | null>(null);
  const audioSilencioRef = useRef<HTMLAudioElement | null>(null);

  const cargarAudio = useCallback((url: string, ref: React.MutableRefObject<HTMLAudioElement | null>) => {
    if (ref.current) return ref.current;
    const audio = new Audio(url);
    audio.preload = 'auto';
    ref.current = audio;
    return audio;
  }, []);

  const iniciar = useCallback(async () => {
    if (estado !== 'inicial') return;

    const ruido = cargarAudio(audioRuidoUrl, audioRuidoRef);

    setEstado('ruido');
    try {
      await ruido.play();
    } catch {
      // El navegador bloqueó el audio — la animación continúa igualmente
    }

    // Después de 3 segundos, animar el cierre de la ventana
    setTimeout(() => {
      setEstado('cerrando');
      ruido.pause();
      ruido.currentTime = 0;

      // Tras la animación de cierre, reproducir el silencio
      setTimeout(async () => {
        setEstado('silencio');
        const silencio = cargarAudio(audioSilencioUrl, audioSilencioRef);
        try {
          await silencio.play();
        } catch {
          // fallback visual funciona igualmente
        }
      }, 1200);
    }, 3000);
  }, [estado, audioRuidoUrl, audioSilencioUrl, cargarAudio]);

  const reiniciar = useCallback(() => {
    audioRuidoRef.current?.pause();
    audioSilencioRef.current?.pause();
    if (audioRuidoRef.current) audioRuidoRef.current.currentTime = 0;
    if (audioSilencioRef.current) audioSilencioRef.current.currentTime = 0;
    setEstado('inicial');
  }, []);

  return (
    <section className="relative w-full min-h-screen bg-neutral-950 flex items-center justify-center overflow-hidden py-24">

      <div className="w-full max-w-5xl mx-auto px-8 lg:px-20 grid lg:grid-cols-2 gap-16 items-center">

        {/* Col izquierda — texto y CTA */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 mb-8">
            La experiencia
          </p>
          <h2 className="text-4xl lg:text-5xl font-light text-white leading-tight mb-6">
            Escucha la<br />
            <em className="not-italic text-white/50">diferencia.</em>
          </h2>
          <p className="text-white/50 font-light leading-relaxed mb-12 max-w-sm">
            Pulsa para escuchar lo que hay fuera de tu casa ahora mismo. Luego cierra la ventana.
          </p>

          <AnimatePresence mode="wait">
            {estado === 'inicial' && (
              <motion.button
                key="btn-escuchar"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                onClick={iniciar}
                className="flex items-center gap-5 group"
              >
                <span className="w-14 h-14 rounded-full border border-white/30 flex items-center justify-center group-hover:border-white transition-colors duration-500">
                  <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
                <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/60 group-hover:text-white transition-colors duration-500">
                  Escuchar
                </span>
              </motion.button>
            )}

            {estado === 'ruido' && (
              <motion.div
                key="estado-ruido"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-4"
              >
                <span className="flex gap-1">
                  {[0, 1, 2].map(i => (
                    <motion.span
                      key={i}
                      className="w-1 bg-white/60 rounded-full"
                      animate={{ height: ['8px', '20px', '8px'] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                    />
                  ))}
                </span>
                <span className="text-[11px] uppercase tracking-[0.25em] text-white/50">
                  Ruido exterior
                </span>
              </motion.div>
            )}

            {(estado === 'cerrando' || estado === 'silencio') && (
              <motion.div
                key="estado-silencio"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <p className="text-white/70 font-light text-lg leading-relaxed">
                  {estado === 'cerrando'
                    ? 'La ventana se cierra...'
                    : 'El ruido exterior desapareció por completo.'}
                </p>
                {estado === 'silencio' && (
                  <button
                    onClick={reiniciar}
                    className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/30 hover:text-white/60 transition-colors duration-500"
                  >
                    Repetir experiencia
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Col derecha — silueta de ventana animada */}
        <div className="flex items-center justify-center">
          <div className="relative w-64 h-80 lg:w-72 lg:h-96">

            {/* Marco de la ventana */}
            <div className="absolute inset-0 border border-white/20" />

            {/* Travesaño horizontal */}
            <div className="absolute top-1/2 left-0 right-0 h-px bg-white/20" />

            {/* Travesaño vertical */}
            <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/20" />

            {/* Hoja que se cierra (mitad derecha, superior) */}
            <motion.div
              className="absolute top-0 left-1/2 right-0 bottom-1/2 overflow-hidden origin-right"
              animate={
                estado === 'cerrando' || estado === 'silencio'
                  ? { scaleX: 0 }
                  : { scaleX: 1 }
              }
              transition={{ duration: 1.0, ease: [0.76, 0, 0.24, 1] }}
            >
              <div className="absolute inset-0 bg-white/5 border-l border-b border-white/10" />
              {/* Luz entrando */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-amber-100/10 to-transparent"
                animate={estado === 'ruido' ? { opacity: [0.3, 0.7, 0.3] } : { opacity: 0.3 }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>

            {/* Estado visual: después del cierre */}
            <AnimatePresence>
              {estado === 'silencio' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1.5, delay: 0.4 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <p className="text-white/30 text-[10px] uppercase tracking-widest text-center">
                    Silencio
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Partículas de ruido (solo en estado ruido) */}
            <AnimatePresence>
              {estado === 'ruido' && (
                <>
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 rounded-full bg-white/20"
                      style={{
                        left: `${20 + Math.random() * 60}%`,
                        top: `${20 + Math.random() * 60}%`,
                      }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: [0, 0.6, 0], scale: [0, 1.5, 0] }}
                      transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                      exit={{ opacity: 0 }}
                    />
                  ))}
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
