'use client';
import React, { useEffect, useState } from 'react';

export default function GlobalLoading() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulamos una carga inteligente que avanza rápido y luego se frena suavemente
    // Al finalizar la verdadera carga del servidor, Next.js desmontará este componente al instante.
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 40) return prev + Math.floor(Math.random() * 10) + 5; // Salto rápido inicial
        if (prev < 70) return prev + Math.floor(Math.random() * 5) + 2;  // Medio
        if (prev < 88) return prev + Math.floor(Math.random() * 2) + 1;  // Lento
        if (prev < 96) return prev + 1; // Muy lento al borde
        return prev; // Se estanca hasta que el servidor termine
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  const currentProgress = progress > 99 ? 99 : progress;

  return (
    <div className="fixed inset-0 z-[9999] bg-neutral-900 flex flex-col items-center justify-center animate-in fade-in duration-300">
      <div className="flex flex-col items-center gap-6">
        
        <div className="flex flex-col items-center text-center">
          <span className="text-xs md:text-sm font-sans tracking-[0.5em] text-neutral-300 uppercase ml-2">
            Grupo Andrade
          </span>
          <span className="text-[10px] text-primary font-bold tracking-widest mt-2">
            {currentProgress}%
          </span>
        </div>
        
        {/* Línea de progreso que crece basándose en el porcentaje */}
        <div className="relative w-64 h-[2px] bg-neutral-800 overflow-hidden rounded-full">
          <div 
            className="absolute top-0 left-0 h-full bg-primary transition-all duration-300 ease-out" 
            style={{ width: `${currentProgress}%` }}
          />
        </div>

        {/* Texto inferior de estado cambiante */}
        <span className="text-[9px] md:text-[10px] font-sans tracking-[0.4em] text-neutral-500 uppercase">
          {currentProgress > 85 ? 'Procesando' : 'Cargando'}
        </span>
        
      </div>
    </div>
  );
}
