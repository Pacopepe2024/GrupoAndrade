'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export interface AnatomyHotspot {
  id: number;
  x: number;
  y: number;
  spotlightSize?: number;
}

export interface AnatomyBlock {
  title: string;
  text: string;
  kpis: { label: string; value: string }[];
}

export interface AnatomyModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotspots: AnatomyHotspot[];
  blocks: AnatomyBlock[];
  baseImage: string;
  lifestyleImage?: string;
  lifestyleHotspots?: any[];
  lifestyleBlocks?: any[];
  ctaPhrase?: string;
  ctaButtonText?: string;
  ctaLink?: string;
  onRequestInfo?: () => void;
}

export function AnatomyModal({ 
  isOpen, 
  onClose, 
  hotspots = [], 
  blocks = [], 
  baseImage = '/placeholder.jpg',
  lifestyleImage,
  lifestyleHotspots,
  lifestyleBlocks,
  ctaPhrase = 'Descubre la excelencia para tu proyecto.',
  ctaButtonText = 'Solicitar presupuesto',
  ctaLink = '/contacto',
  onRequestInfo
}: AnatomyModalProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef(false);

  const hasLifestyle = Boolean(lifestyleImage && lifestyleHotspots && lifestyleHotspots.length > 0);
  const totalPoints = hotspots.length + (hasLifestyle ? lifestyleHotspots!.length : 0) + 1; // +1 para CTA
  const isCTAActive = activeIndex === totalPoints - 1;
  const isLifestyleActive = hasLifestyle && activeIndex >= hotspots.length && !isCTAActive;
  const mode = isCTAActive ? 'cta' : (isLifestyleActive ? 'lifestyle' : 'technical');
  const localIndex = isLifestyleActive ? activeIndex - hotspots.length : activeIndex;

  const currentBaseImage = mode === 'technical' ? baseImage : (lifestyleImage || baseImage);

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setActiveIndex(0);
    }
  }, [isOpen]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

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
      // Scroll abajo -> siguiente
      if (activeIndex < totalPoints - 1) {
        isScrolling.current = true;
        setActiveIndex(prev => prev + 1);
        setTimeout(() => { isScrolling.current = false; }, 1000);
      }
    } else if (e.deltaY < 0) {
      // Scroll arriba -> anterior
      if (activeIndex > 0) {
        isScrolling.current = true;
        setActiveIndex(prev => prev - 1);
        setTimeout(() => { isScrolling.current = false; }, 1000);
      }
    }
  };

  const currentHotspot = mode === 'technical' ? (hotspots[localIndex] || hotspots[0] || { x: 50, y: 50, spotlightSize: 200 }) : (mode === 'lifestyle' ? (lifestyleHotspots?.[localIndex] || lifestyleHotspots?.[0] || { x: 50, y: 50, spotlightSize: 200 }) : { x: 50, y: 50, spotlightSize: 200 });
  const currentBlock = mode === 'technical' ? (blocks[localIndex] || blocks[0] || { title: '', text: '', kpis: [] }) : (mode === 'lifestyle' ? (lifestyleBlocks?.[localIndex] || lifestyleBlocks?.[0] || { title: '', text: '', kpis: [] }) : { title: '', text: '', kpis: [] });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
      {/* Modal Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        onWheel={handleWheel}
        className="relative w-full h-full max-w-[95vw] max-h-[95vh] bg-[#0a0a0a] rounded-3xl overflow-hidden shadow-2xl border border-slate-800/50 flex flex-col md:flex-row"
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-50 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-colors border border-white/10"
          aria-label="Cerrar vista 3D"
        >
          <X size={24} />
        </button>

        {/* Side Navigation (Dots) */}
        <nav className="absolute left-6 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-4" aria-label="Navegación de características">
          {Array.from({ length: totalPoints }).map((_, i) => {
            const isDotTechnical = i < hotspots.length;
            const isDotActive = i === activeIndex;
            return (
              <button
                key={i}
                className={`w-3 h-3 rounded-full transition-all duration-300 border border-white/30 ${
                  isDotActive 
                    ? (isDotTechnical ? 'bg-[#78B928] scale-125 border-[#78B928] shadow-[0_0_10px_rgba(120,185,40,0.6)]' : 'bg-white scale-125 border-white shadow-[0_0_10px_rgba(255,255,255,0.6)]') 
                    : 'bg-transparent hover:bg-white/20'
                }`}
                onClick={() => setActiveIndex(i)}
                aria-label={`Ir a característica ${i + 1}`}
              />
            );
          })}
        </nav>

        <AnimatePresence mode="wait">
          {mode === 'cta' ? (
            <motion.div
              key="cta-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 bg-neutral-950 flex flex-col items-center justify-center p-6 md:p-12 z-40 rounded-3xl"
            >
              <motion.h3 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="text-3xl md:text-4xl lg:text-5xl font-display text-white mb-10 italic font-light leading-tight text-center max-w-3xl"
              >
                "{ctaPhrase}"
              </motion.h3>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.5, ease: "easeOut" }}
              >
                {ctaLink === '#solicitar' ? (
                  <button 
                    onClick={() => {
                      onClose();
                      onRequestInfo?.();
                    }}
                    className="inline-block w-full md:w-auto px-10 py-5 bg-[#78B928] text-white hover:bg-white hover:text-[#78B928] transition-colors text-base uppercase tracking-widest font-bold shadow-[0_0_20px_rgba(120,185,40,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)]"
                  >
                    {ctaButtonText}
                  </button>
                ) : (
                  <a 
                    href={ctaLink}
                    onClick={onClose}
                    className="inline-block w-full md:w-auto px-10 py-5 bg-[#78B928] text-white hover:bg-white hover:text-[#78B928] transition-colors text-base uppercase tracking-widest font-bold shadow-[0_0_20px_rgba(120,185,40,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)]"
                  >
                    {ctaButtonText}
                  </a>
                )}
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="content-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col md:flex-row h-full w-full"
            >
              {/* Left Column: Interactive Image */}
              <div className={`flex-1 relative flex items-center justify-center p-4 md:p-8 overflow-hidden transition-colors duration-1000 ${mode === 'technical' ? 'bg-gradient-to-b from-[#111] to-[#050505]' : 'bg-black'}`}>
                <div className={`w-full relative ${mode === 'technical' ? 'max-w-xl aspect-square' : 'h-full'}`}>
                  <AnimatePresence>
                    <motion.div 
                      key={mode}
                      className="w-full h-full absolute inset-0"
                      initial={{ opacity: 0, scale: 1.02 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      {mode === 'technical' ? (
                        <>
                          <Image 
                            src={currentBaseImage}
                            alt="Perfil base" 
                            fill 
                            className="object-contain" 
                            style={{ opacity: 0.2 }}
                            priority
                          />
                          <motion.div
                            className="absolute inset-0"
                            animate={{
                              WebkitMaskImage: `radial-gradient(${currentHotspot.spotlightSize || 200}px circle at ${currentHotspot.x || 50}% ${currentHotspot.y || 50}%, black 40%, transparent 100%)`,
                              maskImage: `radial-gradient(${currentHotspot.spotlightSize || 200}px circle at ${currentHotspot.x || 50}% ${currentHotspot.y || 50}%, black 40%, transparent 100%)`,
                              backgroundColor: 'rgba(0,0,0,0)'
                            } as any}
                            transition={{ type: 'tween', duration: 0.5, ease: "easeInOut" }}
                          >
                            <Image 
                              src={currentBaseImage}
                              alt="Highlight" 
                              fill 
                              className="object-contain" 
                            />
                          </motion.div>
                        </>
                      ) : (
                        <Image 
                          src={currentBaseImage}
                          alt="Lifestyle" 
                          fill 
                          className="object-cover rounded-3xl opacity-80" 
                          priority
                        />
                      )}

                      {/* Hotspot Markers */}
                      {(mode === 'technical' ? hotspots : (mode === 'lifestyle' ? (lifestyleHotspots || []) : [])).map((h: any, i: number) => (
                        <div 
                          key={h.id || i}
                          className={`absolute w-8 h-8 -ml-4 -mt-4 rounded-full flex items-center justify-center cursor-pointer transition-all duration-500 z-20 ${i === localIndex && !isCTAActive ? 'scale-100 opacity-100' : 'scale-75 opacity-50 hover:opacity-80'}`}
                          style={{ left: `${h.x || 50}%`, top: `${h.y || 50}%` }}
                          onClick={() => setActiveIndex(mode === 'technical' ? i : hotspots.length + i)}
                          role="button"
                          aria-label={`Característica ${i + 1}`}
                        >
                          <div className={`w-3 h-3 rounded-full ${i === localIndex && !isCTAActive ? (mode === 'technical' ? 'bg-[#78B928] shadow-[0_0_15px_#78B928]' : 'bg-white shadow-[0_0_15px_#ffffff]') : 'bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]'}`}></div>
                          {i === localIndex && !isCTAActive && (
                            <motion.div 
                              className={`absolute inset-0 rounded-full border ${mode === 'technical' ? 'border-[#78B928]' : 'border-white'}`}
                              animate={{ scale: [1, 2], opacity: [1, 0] }}
                              transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
                            />
                          )}
                        </div>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Right Column: Dynamic Text Information */}
              <div className="w-full md:w-[450px] bg-neutral-900/80 backdrop-blur-xl border-l border-white/5 p-10 flex flex-col justify-center shrink-0">
                <div className="mb-12 transition-colors duration-500">
                  <h2 className={`text-sm font-bold uppercase tracking-widest mb-2 ${mode === 'technical' ? 'text-[#78B928]' : 'text-neutral-300'}`}>
                    {mode === 'technical' ? 'Ingeniería Schüco' : 'Experiencia Grupo Andrade'}
                  </h2>
                  <div className={`h-px w-12 bg-gradient-to-r ${mode === 'technical' ? 'from-[#78B928]' : 'from-neutral-300'} to-transparent`}></div>
                </div>

                <div className="relative min-h-[220px] md:min-h-[300px] flex flex-col justify-center h-full">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${mode}-${activeIndex}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="absolute inset-0 flex flex-col justify-center"
                    >
                      <div className="flex items-center gap-4 md:block mb-2 md:mb-4">
                        <div className="text-white/20 text-6xl font-light mb-4">
                          {String(activeIndex + 1).padStart(2, '0')}
                        </div>
                        <h3 className="text-3xl font-display text-white mb-6 leading-tight">
                          {currentBlock.title}
                        </h3>
                      </div>
                      <p className="text-neutral-400 text-lg mb-10 leading-relaxed flex-1">
                        {currentBlock.text}
                      </p>
                      
                      {currentBlock.kpis && currentBlock.kpis.length > 0 && (
                        <div className="grid grid-cols-2 gap-x-6 gap-y-8 mb-6">
                          {currentBlock.kpis.map((kpi: any, idx: number) => (
                            <div key={idx}>
                              <span className="block text-xs text-neutral-500 uppercase tracking-wider mb-1">{kpi.label}</span>
                              <span className="block text-lg font-medium text-white">{kpi.value}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </div>
  );
}
