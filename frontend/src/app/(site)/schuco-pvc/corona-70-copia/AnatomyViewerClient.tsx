'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Modal } from '@/components/ui/Modal';
import { RequestInfoForm } from '@/components/forms/RequestInfoForm';

export function AnatomyViewerClient({ 
  hotspots, 
  blocks, 
  baseImage, 
  productName,
  lifestyleImage,
  lifestyleHotspots,
  lifestyleBlocks,
  ctaPhrase = 'Descubre la excelencia para tu proyecto.',
  ctaButtonText = 'Solicitar presupuesto',
  ctaLink = '/contacto'
}: any) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef(false);

  const hasLifestyle = Boolean(lifestyleImage && lifestyleHotspots && lifestyleHotspots.length > 0);
  const totalPoints = hotspots.length + (hasLifestyle ? lifestyleHotspots!.length : 0) + 1; // +1 para el paso CTA
  const isCTAActive = activeIndex === totalPoints - 1;
  const isLifestyleActive = hasLifestyle && activeIndex >= hotspots.length && !isCTAActive;
  const mode = isCTAActive ? 'cta' : (isLifestyleActive ? 'lifestyle' : 'technical');
  const localIndex = isLifestyleActive ? activeIndex - hotspots.length : activeIndex;

  const currentBaseImage = mode === 'technical' ? baseImage : (lifestyleImage || baseImage);

  // Lock body scroll and explicitly hide header and footer
  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';
    
    const footer = document.querySelector('footer');
    if (footer) footer.style.display = 'none';
    
    const header = document.querySelector('header');
    if (header) header.style.display = 'none';
    
    return () => {
      document.body.style.overflow = 'unset';
      if (footer) footer.style.display = '';
      if (header) header.style.display = '';
    };
  }, []);

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
    if (Math.abs(e.deltaY) < 30) return;

    if (e.deltaY > 0) {
      if (activeIndex < totalPoints - 1) {
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

  const currentHotspot = mode === 'technical' ? (hotspots[localIndex] || hotspots[0] || {}) : (mode === 'lifestyle' ? (lifestyleHotspots[localIndex] || lifestyleHotspots[0] || {}) : {});
  const currentBlock = mode === 'technical' ? (blocks[localIndex] || blocks[0] || {}) : (mode === 'lifestyle' ? (lifestyleBlocks[localIndex] || lifestyleBlocks[0] || {}) : {});

  return (
    <div className="w-full h-[100dvh] bg-white flex items-center justify-center p-0 md:p-8 relative">
      
      {/* Navbar Custom de la app */}
      <AnimatePresence>
        {mode !== 'cta' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-0 left-0 w-full p-6 lg:p-10 flex justify-between items-center z-50 pointer-events-none"
          >
            <Link href="/" className="text-2xl md:text-3xl font-black tracking-tighter text-neutral-900 pointer-events-auto drop-shadow-sm">
              SCHÜCO
            </Link>
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="p-3 bg-neutral-100/80 backdrop-blur-md rounded-full text-neutral-900 hover:text-white hover:bg-[#78B928] transition-colors pointer-events-auto drop-shadow-sm"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-slate-900/95 backdrop-blur-xl flex flex-col pointer-events-auto"
          >
            <div className="p-6 lg:p-10 flex justify-between items-center">
              <span className="text-2xl md:text-3xl font-black tracking-tighter text-white">SCHÜCO</span>
              <button 
                onClick={() => setIsMenuOpen(false)} 
                className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-red-500 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center gap-8 text-2xl md:text-4xl font-display font-bold">
               <Link onClick={() => setIsMenuOpen(false)} href="/schuco-pvc" className="text-white hover:text-[#78B928] transition-colors">Sistemas PVC</Link>
               <Link onClick={() => setIsMenuOpen(false)} href="/inspiracion" className="text-white hover:text-[#78B928] transition-colors">Inspiración</Link>
               <Link onClick={() => setIsMenuOpen(false)} href="/empresa" className="text-white hover:text-[#78B928] transition-colors">Empresa</Link>
               <Link onClick={() => setIsMenuOpen(false)} href="/contacto" className="text-white hover:text-[#78B928] transition-colors">Contacto</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onWheel={handleWheel}
        className="relative w-full h-full md:max-h-[90vh] max-w-[1400px] bg-[#0a0a0a] rounded-none md:rounded-3xl overflow-hidden shadow-2xl border border-slate-800/50 flex flex-col md:flex-row mt-0 md:mt-10"
      >
        {/* Side Navigation (Dots) */}
        <nav className="absolute left-4 md:left-6 top-[35%] md:top-1/2 -translate-y-1/2 z-40 flex flex-col gap-3 md:gap-4" aria-label="Navegación de características">
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

        {/* Contenido Principal */}
        <AnimatePresence mode="wait">
          {mode === 'cta' ? (
            <motion.div
              key="cta-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="flex-1 w-full h-full bg-black flex flex-col items-center justify-center p-6 md:p-12 z-10"
            >
              <motion.h3 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="text-3xl md:text-5xl lg:text-6xl font-display text-white mb-12 italic font-light leading-tight text-center max-w-4xl"
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
                    onClick={() => setIsFormModalOpen(true)}
                    className="inline-block w-full md:w-auto px-10 py-5 bg-[#78B928] text-white hover:bg-white hover:text-[#78B928] transition-colors text-base md:text-lg uppercase tracking-widest font-bold shadow-[0_0_20px_rgba(120,185,40,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)]"
                  >
                    {ctaButtonText}
                  </button>
                ) : (
                  <Link 
                    href={ctaLink}
                    onClick={() => setIsMenuOpen(false)}
                    className="inline-block w-full md:w-auto px-10 py-5 bg-[#78B928] text-white hover:bg-white hover:text-[#78B928] transition-colors text-base md:text-lg uppercase tracking-widest font-bold shadow-[0_0_20px_rgba(120,185,40,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)]"
                  >
                    {ctaButtonText}
                  </Link>
                )}
              </motion.div>

              {/* Menu icon that appears after 3 seconds */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 3, ease: "easeOut" }}
                className="absolute top-0 left-0 w-full p-6 lg:p-10 flex justify-between items-center z-50"
              >
                <div className="text-2xl md:text-3xl font-black tracking-tighter text-white/50">
                  SCHÜCO
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-white/50 text-sm font-bold uppercase tracking-widest hidden md:block">Explorar sistemas</span>
                  <button 
                    onClick={() => setIsMenuOpen(true)}
                    className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-[#78B928] transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(120,185,40,0.4)]"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="content-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="flex-1 w-full h-full flex flex-col md:flex-row"
            >
              {/* Left Column: Interactive 3D Image or Lifestyle Photo */}
              <div className={`flex-1 relative flex items-center justify-center p-4 pt-20 md:p-8 overflow-hidden transition-colors duration-1000 ${mode === 'technical' ? 'bg-gradient-to-b from-[#111] to-[#050505]' : 'bg-black'}`}>
                <div 
                  ref={containerRef}
                  className={`w-full relative ${mode === 'technical' ? 'max-w-2xl aspect-square' : 'h-full'}`}
                  onMouseMove={mode === 'technical' ? handleMouseMove : undefined}
                  onMouseLeave={mode === 'technical' ? handleMouseLeave : undefined}
                >
                  <AnimatePresence>
                    <motion.div 
                      key={mode}
                      className="w-full h-full absolute inset-0"
                      initial={{ opacity: 0, scale: 1.02 }}
                      animate={{ opacity: 1, scale: 1, rotateY: mode === 'technical' ? mousePos.x : 0, rotateX: mode === 'technical' ? -mousePos.y : 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                      {mode === 'technical' ? (
                        <>
                          <Image 
                            src={currentBaseImage}
                            alt={`Perfil ${productName}`} 
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
                            transition={{ type: 'tween', duration: 0.8, ease: "easeInOut" }}
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
                          className="object-cover rounded-xl md:rounded-3xl opacity-80" 
                          priority
                        />
                      )}

                      {/* Hotspot Markers */}
                      {(mode === 'technical' ? hotspots : (mode === 'lifestyle' ? lifestyleHotspots : [])).map((h: any, i: number) => (
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

              {/* Right Column: Text Info */}
              <div className="w-full md:w-[450px] bg-neutral-900 md:bg-neutral-900/80 backdrop-blur-xl border-t md:border-t-0 border-l-0 md:border-l border-white/10 md:border-white/5 p-6 md:p-10 flex flex-col justify-center shrink-0 z-30 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] md:shadow-none">
                <div className="mb-4 md:mb-12 hidden md:block transition-colors duration-500">
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
                        <div className="text-white/20 text-4xl md:text-6xl font-light">
                          {String(activeIndex + 1).padStart(2, '0')}
                        </div>
                        <h3 className="text-xl md:text-3xl font-display text-white leading-tight flex-1">
                          {currentBlock.title}
                        </h3>
                      </div>
                      <p className="text-neutral-400 text-sm md:text-lg mb-6 md:mb-10 leading-relaxed line-clamp-3 md:line-clamp-none flex-1">
                        {currentBlock.text}
                      </p>
                      
                      {currentBlock.kpis && currentBlock.kpis.length > 0 && (
                        <div className="grid grid-cols-2 gap-x-4 md:gap-x-6 gap-y-4 md:gap-y-8 mb-6">
                          {currentBlock.kpis.map((kpi: any, idx: number) => (
                            <div key={idx}>
                              <span className="block text-[10px] md:text-xs text-neutral-500 uppercase tracking-wider mb-1">{kpi.label}</span>
                              <span className="block text-sm md:text-lg font-medium text-white">{kpi.value}</span>
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

      {/* Modal de Solicitud de Información */}
      <Modal 
        isOpen={isFormModalOpen} 
        onClose={() => setIsFormModalOpen(false)}
        title="Solicitar información"
      >
        <RequestInfoForm productName={productName} />
      </Modal>
    </div>
  );
}
