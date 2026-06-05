'use client';

import { useState, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import * as motion from 'framer-motion/client';

export function SilenceExperience() {
  const [isSilent, setIsSilent] = useState(false);
  
  // En producción, aquí irían audios reales de tráfico y silencio interior.
  // Usamos useRef para mantener la referencia a los elementos de audio si se añadieran.
  
  const toggleSilence = () => {
    setIsSilent(!isSilent);
  };

  return (
    <section className="relative w-full h-[80vh] flex items-center justify-center bg-[#0A0A0A] overflow-hidden">
      {/* Background Image that changes on interaction */}
      <motion.div 
        className="absolute inset-0 z-0"
        initial={false}
        animate={{ 
          filter: isSilent ? 'brightness(1) blur(0px)' : 'brightness(0.6) blur(4px)',
          scale: isSilent ? 1 : 1.05
        }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
      >
        <img 
          src="https://www.schuecopws.it/wp-content/uploads/2024/01/Schueco_LivIng_Doppelmotiv_grigio-300dpi.jpg" 
          alt="Interior con Ventanas Schüco"
          className="w-full h-full object-cover opacity-80"
        />
      </motion.div>

      {/* Overlay gradient */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative z-20 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
        
        <motion.h2 
          className="text-4xl md:text-6xl font-display font-light text-[#FAFAF7] mb-8 tracking-wide"
          initial={false}
          animate={{ opacity: isSilent ? 0 : 1 }}
          transition={{ duration: 0.5 }}
        >
          Escucha la ciudad.
        </motion.h2>

        <motion.h2 
          className="text-4xl md:text-6xl font-display font-light text-[#FAFAF7] mb-8 tracking-wide absolute top-0"
          initial={false}
          animate={{ opacity: isSilent ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        >
          El ruido exterior desapareció por completo.
        </motion.h2>

        {/* The Toggle Button */}
        <button 
          onClick={toggleSilence}
          className="group relative mt-[100px] md:mt-[120px] flex items-center justify-center w-24 h-24 rounded-full border border-[#E6E2DC]/30 bg-black/20 backdrop-blur-md hover:bg-white/10 transition-all duration-500"
        >
          {isSilent ? (
            <VolumeX className="w-8 h-8 text-[#FAFAF7] opacity-80" />
          ) : (
            <Volume2 className="w-8 h-8 text-[#FAFAF7] opacity-80 group-hover:scale-110 transition-transform duration-500" />
          )}
          
          {/* Subtle glow ring */}
          <div className="absolute inset-0 rounded-full border border-white/10 scale-150 animate-pulse opacity-20 pointer-events-none" />
        </button>

        <p className="mt-8 text-sm uppercase tracking-widest text-[#E6E2DC]/60">
          {isSilent ? 'Aislamiento Acústico Activado' : 'Pulsa para cerrar la ventana'}
        </p>

      </div>
    </section>
  );
}
