'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const randomHotspots = [
  { id: 0, x: 54, y: 18, spotlightSize: 246 },
  { id: 1, x: 58, y: 38, spotlightSize: 214 },
  { id: 2, x: 48, y: 58, spotlightSize: 294 },
];

const randomBlocks = [
  {
    title: 'Acristalamiento eficiente',
    text: 'El vidrio se presenta como una pieza de precisión: menos pérdida energética, más confort interior.',
    kpis: [{ label: 'Espesor', value: '16-54 mm' }, { label: 'Térmico', value: '1,1 W/m²K' }]
  },
  {
    title: 'Juntas de estanqueidad',
    text: 'El foco se desplaza a las juntas para explicar el sellado perimetral con alta tecnología.',
    kpis: [{ label: 'Niveles', value: '3 niveles' }, { label: 'Aire', value: 'Clase 4' }]
  },
  {
    title: 'Perfil multicámara',
    text: 'Las cámaras interiores se iluminan de forma selectiva para mostrar la ingeniería oculta del perfil.',
    kpis: [{ label: 'Cámaras', value: '7 cámaras' }, { label: 'Prof. marco', value: '82 mm' }]
  }
];

export default function PruebaAnatomiaPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    setMousePos({ x: x * 5, y: y * 5 });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (isScrolling.current) return;
    
    // Prevenir triggers accidentales muy pequeños en trackpads
    if (Math.abs(e.deltaY) < 30) return;

    if (e.deltaY > 0) {
      if (activeIndex < randomHotspots.length - 1) {
        isScrolling.current = true;
        setActiveIndex(prev => prev + 1);
        setTimeout(() => { isScrolling.current = false; }, 1000);
      }
    } else if (e.deltaY < 0) {
      if (activeIndex > 0) {
        isScrolling.current = true;
        setActiveIndex(prev => prev - 1);
        setTimeout(() => { isScrolling.current = false; }, 1000);
      }
    }
  };

  const currentHotspot = randomHotspots[activeIndex] || randomHotspots[0];
  const currentBlock = randomBlocks[activeIndex] || randomBlocks[0];

  return (
    <div className="w-full h-[calc(100vh-80px)] bg-slate-900 flex items-center justify-center p-4 md:p-8">
      {/* Contenedor principal estilo Modal pero como página */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onWheel={handleWheel}
        className="relative w-full h-full max-w-[1400px] bg-[#0a0a0a] rounded-3xl overflow-hidden shadow-2xl border border-slate-800/50 flex flex-col md:flex-row"
      >
        {/* Side Navigation (Dots) */}
        <nav className="absolute left-6 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-4" aria-label="Navegación de características">
          {randomHotspots.map((_, i) => (
            <button
              key={i}
              className={`w-3 h-3 rounded-full transition-all duration-300 border border-white/30 ${i === activeIndex ? 'bg-[#78B928] scale-125 border-[#78B928] shadow-[0_0_10px_rgba(120,185,40,0.6)]' : 'bg-transparent hover:bg-white/20'}`}
              onClick={() => setActiveIndex(i)}
              aria-label={`Ir a característica ${i + 1}`}
            />
          ))}
        </nav>

        {/* Left Column: Interactive 3D Image */}
        <div className="flex-1 relative bg-gradient-to-b from-[#111] to-[#050505] flex items-center justify-center p-8 overflow-hidden">
          <div 
            ref={containerRef}
            className="w-full max-w-2xl aspect-square relative"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <motion.div 
              className="w-full h-full absolute inset-0"
              animate={{ rotateY: mousePos.x, rotateX: -mousePos.y }}
              transition={{ type: 'spring', stiffness: 100, damping: 30 }}
            >
              {/* Base Image */}
              <Image 
                src="/images/perfil-pvc.webp" // Reemplaza con una imagen real o placeholder que exista
                alt="Perfil PVC de Prueba" 
                fill 
                className="object-contain" 
                style={{ opacity: 0.2 }}
                priority
              />
              
              {/* Highlighted Image */}
              <motion.div
                className="absolute inset-0"
                animate={{
                  WebkitMaskImage: `radial-gradient(${currentHotspot.spotlightSize}px circle at ${currentHotspot.x}% ${currentHotspot.y}%, black 40%, transparent 100%)`,
                  maskImage: `radial-gradient(${currentHotspot.spotlightSize}px circle at ${currentHotspot.x}% ${currentHotspot.y}%, black 40%, transparent 100%)`,
                  backgroundColor: 'rgba(0,0,0,0)'
                } as any}
                transition={{ type: 'tween', duration: 0.8, ease: "easeInOut" }}
              >
                <Image 
                  src="/images/perfil-pvc.webp"
                  alt="Highlight Prueba" 
                  fill 
                  className="object-contain" 
                />
              </motion.div>

              {/* Hotspot Markers */}
              {randomHotspots.map((h, i) => (
                <div 
                  key={h.id}
                  className={`absolute w-8 h-8 -ml-4 -mt-4 rounded-full flex items-center justify-center cursor-pointer transition-all duration-500 z-20 ${i === activeIndex ? 'scale-100 opacity-100' : 'scale-75 opacity-50 hover:opacity-80'}`}
                  style={{ left: `${h.x}%`, top: `${h.y}%` }}
                  onClick={() => setActiveIndex(i)}
                  role="button"
                >
                  <div className={`w-3 h-3 rounded-full ${i === activeIndex ? 'bg-[#78B928] shadow-[0_0_15px_#78B928]' : 'bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]'}`}></div>
                  {i === activeIndex && (
                    <motion.div 
                      className="absolute inset-0 rounded-full border border-[#78B928]"
                      animate={{ scale: [1, 2], opacity: [1, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
                    />
                  )}
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Right Column: Text Info */}
        <div className="w-full md:w-[450px] bg-neutral-900/80 backdrop-blur-xl border-l border-white/5 p-10 flex flex-col justify-center shrink-0">
          <div className="mb-12">
            <h2 className="text-[#78B928] text-sm font-bold uppercase tracking-widest mb-2">Ingeniería Schüco (Prueba)</h2>
            <div className="h-px w-12 bg-gradient-to-r from-[#78B928] to-transparent"></div>
          </div>

          <div className="relative min-h-[300px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="absolute inset-0"
              >
                <div className="text-white/20 text-6xl font-light mb-4">
                  {String(activeIndex + 1).padStart(2, '0')}
                </div>
                <h3 className="text-3xl font-display text-white mb-6 leading-tight">
                  {currentBlock.title}
                </h3>
                <p className="text-neutral-400 text-lg mb-10 leading-relaxed">
                  {currentBlock.text}
                </p>
                
                <div className="grid grid-cols-2 gap-x-6 gap-y-8">
                  {currentBlock.kpis.map((kpi, idx) => (
                    <div key={idx}>
                      <span className="block text-xs text-neutral-500 uppercase tracking-wider mb-1">{kpi.label}</span>
                      <span className="block text-lg font-medium text-white">{kpi.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
