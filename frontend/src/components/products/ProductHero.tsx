'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useIsPresent } from 'framer-motion';
import { DimensionOverlay } from './DimensionOverlay';
import { Modal } from '@/components/ui/Modal';
import { SmartLink } from '@/components/ui/SmartLink';
import { RequestInfoForm } from '@/components/forms/RequestInfoForm';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { AnatomyModal } from '@/components/products/AnatomyModal';

interface Finish {
  url: string
  fullUrl?: string
  name?: string
}

export interface FinishesData {
  lisos?: Finish[];
  texturados?: Finish[];
  topalum?: Finish[];
  estandar?: Finish[];
}

interface ProductHeroProps {
  title: string
  descripcion: string
  images: string[]
  dimensiones: { label: string; valor: string; x?: string; y?: string; rotacion?: string; ancho?: string }[]
  prestaciones: { label: string; valor: string }[]
  finishes?: FinishesData
  linkDescarga?: string
  fabricante?: string
  anatomyHotspots?: any[]
  anatomyBlocks?: any[]
  anatomyBaseImage?: string
  lifestyleImage?: string
  lifestyleHotspots?: any[]
  lifestyleBlocks?: any[]
  ctaPhrase?: string
  ctaButtonText?: string
  ctaLink?: string
}

// 10 transiciones cinematográficas — una por imagen, sin desenfoque
type Dir = number;

const TRANSITIONS: Array<{
  initial: object | ((dir: Dir) => object);
  animate: object;
  exit: object | ((dir: Dir) => object);
  transition: object;
}> = [
  // 0 — Slide horizontal (Netflix)
  {
    initial: (d: Dir) => ({ x: d >= 0 ? '100%' : '-100%' }),
    animate: { x: 0 },
    exit:    (d: Dir) => ({ x: d >= 0 ? '-7%' : '7%', opacity: 0, scale: 0.97 }),
    transition: { duration: 0.72, ease: [0.76, 0, 0.24, 1] },
  },
  // 1 — Zoom reveal (Apple Keynote)
  {
    initial: { scale: 1.07, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit:    { scale: 0.95, opacity: 0 },
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
  // 2 — Cortina desde la derecha (clip-path)
  {
    initial: { clipPath: 'inset(0 100% 0 0)', scale: 1.03 },
    animate: { clipPath: 'inset(0 0% 0 0)', scale: 1 },
    exit:    { opacity: 0, scale: 0.98 },
    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
  },
  // 3 — Push vertical desde abajo
  {
    initial: { y: '9%', opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit:    { y: '-5%', opacity: 0 },
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
  // 4 — Cortina desde abajo
  {
    initial: { clipPath: 'inset(100% 0 0 0)' },
    animate: { clipPath: 'inset(0% 0 0 0)' },
    exit:    { opacity: 0, scale: 0.99 },
    transition: { duration: 0.85, ease: [0.76, 0, 0.24, 1] },
  },
  // 5 — Zoom desde pequeño
  {
    initial: { scale: 0.93, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit:    { scale: 1.05, opacity: 0 },
    transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
  },
  // 6 — Push horizontal inverso con parallax
  {
    initial: (d: Dir) => ({ x: d >= 0 ? '-9%' : '9%', opacity: 0, scale: 1.03 }),
    animate: { x: 0, opacity: 1, scale: 1 },
    exit:    (d: Dir) => ({ x: d >= 0 ? '100%' : '-100%', opacity: 0.8 }),
    transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] },
  },
  // 7 — Cortina desde arriba
  {
    initial: { clipPath: 'inset(0 0 100% 0)', scale: 1.02 },
    animate: { clipPath: 'inset(0 0 0% 0)', scale: 1 },
    exit:    { opacity: 0, scale: 0.98 },
    transition: { duration: 0.82, ease: [0.76, 0, 0.24, 1] },
  },
  // 8 — Diagonal cinematográfico
  {
    initial: { x: '5%', y: '4%', opacity: 0, scale: 1.02 },
    animate: { x: 0, y: 0, opacity: 1, scale: 1 },
    exit:    { x: '-3%', y: '-3%', opacity: 0 },
    transition: { duration: 0.88, ease: [0.16, 1, 0.3, 1] },
  },
  // 9 — Cross-dissolve con micro-escala (cine clásico)
  {
    initial: { opacity: 0, scale: 1.015 },
    animate: { opacity: 1, scale: 1 },
    exit:    { opacity: 0, scale: 0.985 },
    transition: { duration: 1.05, ease: 'easeInOut' },
  },
];

function resolveVariant(v: object | ((d: Dir) => object), dir: Dir) {
  return typeof v === 'function' ? v(dir) : v;
}

function formatFinishName(url: string): string {
  if (!url) return '';
  const parts = url.split('/');
  let filename = parts[parts.length - 1];
  if (!filename) return '';
  // Remove extension (including .jpg, .webp etc)
  filename = filename.replace(/\.[^/.]+$/, "");
  // Remove leading numbers and dashes (e.g. "24-marfil-claro" -> "marfil-claro")
  filename = filename.replace(/^\d+-?/, "");
  // Replace hyphens and underscores with spaces
  filename = filename.replace(/[-_]/g, " ");
  // Capitalize words
  return filename.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
}

export function ProductHero({
  title,
  descripcion,
  images,
  dimensiones,
  prestaciones,
  finishes = {},
  linkDescarga,
  fabricante,
  anatomyHotspots,
  anatomyBlocks,
  anatomyBaseImage,
  lifestyleImage,
  lifestyleHotspots,
  lifestyleBlocks,
  ctaPhrase,
  ctaButtonText,
  ctaLink
}: ProductHeroProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [lightbox, setLightbox] = useState<{ url: string; name: string } | null>(null);
  const [prestOpen, setPrestOpen] = useState(false);
  const [activeDimension, setActiveDimension] = useState<{ label: string; valor: string; x?: string; y?: string; rotacion?: string; ancho?: string } | null>(null);
  const [isPrestacionesModalOpen, setIsPrestacionesModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAnatomyOpen, setIsAnatomyOpen] = useState(false);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const thumbsContainerRef = useRef<HTMLDivElement>(null);

  const availableFamilies = useMemo(() => {
    const families = [];
    if (finishes.lisos && finishes.lisos.length > 0) families.push({ id: 'lisos', label: 'Lisos' });
    if (finishes.texturados && finishes.texturados.length > 0) families.push({ id: 'texturados', label: 'Texturados' });
    if (finishes.topalum && finishes.topalum.length > 0) families.push({ id: 'topalum', label: 'TopAlum' });
    if (finishes.estandar && finishes.estandar.length > 0) families.push({ id: 'estandar', label: 'Estándar' });
    return families;
  }, [finishes]);

  const [activeFamily, setActiveFamily] = useState(availableFamilies[0]?.id || '');

  useEffect(() => {
    if (availableFamilies.length > 0 && !availableFamilies.find(f => f.id === activeFamily)) {
      setActiveFamily(availableFamilies[0].id);
    }
  }, [availableFamilies, activeFamily]);

  const currentFinishes = (activeFamily ? finishes[activeFamily as keyof FinishesData] : []) || [];

  const goTo = (i: number) => {
    setDirection(i >= activeIndex ? 1 : -1);
    setActiveIndex(i);
  };

  // Auto-scroll de miniaturas
  useEffect(() => {
    if (thumbsContainerRef.current) {
      const activeThumb = thumbsContainerRef.current.children[activeIndex] as HTMLElement;
      if (activeThumb) {
        const isDesktop = window.innerWidth >= 1024;
        if (isDesktop) {
          thumbsContainerRef.current.scrollTo({ top: activeThumb.offsetTop - 20, behavior: 'smooth' });
        } else {
          thumbsContainerRef.current.scrollTo({ left: activeThumb.offsetLeft - 20, behavior: 'smooth' });
        }
      }
    }
  }, [activeIndex]);

  // Automatización de Dimensiones (Efecto Vídeo secuencial a 2 segundos)
  useEffect(() => {
    if (activeIndex === 0 && dimensiones && dimensiones.length > 0) {
      let currentIndex = 0;
      setActiveDimension(dimensiones[0]);
      
      const intervalId = setInterval(() => {
        currentIndex = (currentIndex + 1) % dimensiones.length;
        setActiveDimension(dimensiones[currentIndex]);
      }, 3500);
      
      return () => clearInterval(intervalId);
    } else {
      setActiveDimension(null);
    }
  }, [activeIndex, dimensiones]);

  // Trigger Anatomy Modal on second image
  useEffect(() => {
    if (activeIndex === 1 && anatomyBlocks && anatomyBlocks.length > 0) {
      setIsAnatomyOpen(true);
    }
  }, [activeIndex, anatomyBlocks]);

  const t = TRANSITIONS[activeIndex % TRANSITIONS.length];

  return (
    <>
      {/* Lightbox acabados */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[9999] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <div className="relative flex flex-col items-center w-full max-w-[400px]" onClick={e => e.stopPropagation()}>
            <div className="relative w-full aspect-square md:w-[400px] md:h-[400px] rounded-full overflow-hidden border-8 border-white/10 shadow-2xl bg-white">
              <Image src={lightbox.url} alt={lightbox.name || 'Acabado'} fill className="object-cover" sizes="(max-width: 768px) 100vw, 400px" />
            </div>
            {lightbox.name && (
              <p className="text-white text-center text-xl mt-8 font-medium tracking-wide drop-shadow-md">{lightbox.name}</p>
            )}
            <button onClick={() => setLightbox(null)} className="absolute -top-12 right-0 md:-right-12 text-white/70 hover:text-white text-4xl font-light transition-colors">
              &times;
            </button>
          </div>
        </div>
      )}

      <section className="flex flex-col lg:flex-row items-start lg:justify-center px-4 sm:px-8 lg:px-10 xl:px-[50px] gap-4 lg:gap-[30px] w-full max-w-[1800px] mx-auto">

        {/* Título móvil */}
        <div className="block lg:hidden w-full pt-4">
          <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 mb-2">
            Sistemas · <span className="text-[#6BA43A]">{fabricante || 'Sistemas PVC'}</span>
          </p>
          <h1 className="text-3xl font-bold text-neutral-900 leading-tight" dangerouslySetInnerHTML={{ __html: title }} />
        </div>

        {/* Col A — Miniaturas */}
        <div className="order-2 lg:order-1 w-full lg:w-[100px] shrink-0 lg:sticky lg:top-[120px] lg:z-10">
          <div
            ref={thumbsContainerRef}
            className="flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto w-full lg:h-[min(800px,55vw)] hide-scrollbar pb-2 lg:pb-0"
          >
            {images.map((src, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`relative shrink-0 w-[80px] h-[80px] lg:w-[100px] lg:h-[100px] border-2 transition-all duration-300 overflow-hidden bg-neutral-100 ${
                  activeIndex === i ? 'border-[#6BA43A] scale-105' : 'border-transparent hover:border-neutral-300'
                }`}
              >
                <Image src={src} alt={`${title} ${i + 1}`} fill className="object-cover" sizes="100px" />
              </button>
            ))}
          </div>
        </div>

        {/* Col B — Imagen principal con transiciones cinematográficas */}
        <div 
          className={`order-1 lg:order-2 w-full lg:flex-1 lg:max-w-[800px] aspect-square shrink-0 bg-[#F4F4F4] overflow-hidden relative lg:sticky lg:top-[120px] lg:z-10 ${activeIndex === 1 && anatomyBlocks && anatomyBlocks.length > 0 ? 'cursor-pointer' : ''}`}
          onClick={() => {
            if (activeIndex === 1 && anatomyBlocks && anatomyBlocks.length > 0) {
              setIsAnatomyOpen(true);
            }
          }}
        >

          <AnimatePresence mode="sync">
            <GallerySlide
              key={activeIndex}
              src={images[activeIndex]}
              alt={`${title} - ${activeIndex + 1}`}
              t={t}
              direction={direction}
              showOverlay={activeIndex === 0 && !!activeDimension}
              activeDimension={activeDimension}
              priority={activeIndex === 0}
            />
          </AnimatePresence>

          {/* Indicador de imagen */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`rounded-full transition-all duration-300 ${
                    activeIndex === i ? 'w-4 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/40'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Flechas de navegación */}
          {images.length > 1 && (
            <>
              <button
                onClick={() => goTo(activeIndex === 0 ? images.length - 1 : activeIndex - 1)}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white/10 hover:bg-white/30 backdrop-blur-[2px] flex items-center justify-center transition-all duration-300 rounded-full"
              >
                <svg width="14" height="14" fill="none" stroke="white" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => goTo(activeIndex === images.length - 1 ? 0 : activeIndex + 1)}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white/10 hover:bg-white/30 backdrop-blur-[2px] flex items-center justify-center transition-all duration-300 rounded-full"
              >
                <svg width="14" height="14" fill="none" stroke="white" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Col C — Info */}
        <div className="order-3 lg:order-3 w-full lg:w-[450px] xl:w-[600px] lg:shrink-0 flex flex-col min-h-full pb-10 lg:ml-[20px] xl:ml-[30px]">
          <div className="lg:px-6 xl:px-10 flex flex-col min-h-full">

            {/* Título desktop */}
            <div className="hidden lg:block">
              <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 mb-2">
                Sistemas · <span className="text-[#6BA43A]">{fabricante || 'Sistemas PVC'}</span>
              </p>
              <h1 className="text-3xl xl:text-4xl font-bold text-neutral-900 leading-tight mb-5" dangerouslySetInnerHTML={{ __html: title }} />
            </div>

            {/* Descripción */}
            <div
              className="text-[16px] leading-[1.8] text-neutral-500 font-light mb-7 [&>p]:mb-6 last:[&>p]:mb-0 [&_a]:text-[#6BA43A] [&_a]:underline [&_strong]:font-bold [&_strong]:text-neutral-900 [&_u]:underline-offset-4 [&_u]:decoration-[#6BA43A]/40 mt-4 lg:mt-0"
              dangerouslySetInnerHTML={{ __html: descripcion }}
            />

            {/* Revestimientos (Rivestimenti) */}
            {availableFamilies.length > 0 && (
              <div className="mb-7">
                <div className="flex flex-col mb-4">
                  <h3 className="text-[14px] text-neutral-900 font-bold uppercase tracking-wider mb-2">Revestimientos</h3>
                  {/* Pestañas de Familias */}
                  {availableFamilies.length > 1 && (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {availableFamilies.map(fam => (
                        <button
                          key={fam.id}
                          onClick={() => setActiveFamily(fam.id)}
                          className={`px-3 py-1.5 text-[11px] font-bold tracking-wide rounded-full transition-colors ${
                            activeFamily === fam.id 
                              ? 'bg-neutral-900 text-white' 
                              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                          }`}
                        >
                          {fam.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <button ref={prevRef} className="shrink-0 w-[52px] h-[52px] flex items-center justify-center bg-[#f4f4f4] hover:bg-neutral-200 text-neutral-600 transition-colors disabled:opacity-30">
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <div className="flex-1 overflow-hidden">
                    <Swiper
                      modules={[Navigation]}
                      navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
                      onBeforeInit={(swiper) => {
                        if (typeof swiper.params.navigation !== 'boolean' && swiper.params.navigation) {
                          swiper.params.navigation.prevEl = prevRef.current;
                          swiper.params.navigation.nextEl = nextRef.current;
                        }
                      }}
                      slidesPerView="auto"
                      spaceBetween={4}
                      grabCursor
                    >
                      {currentFinishes.map((f, i) => {
                        const displayName = f.name || formatFinishName(f.url);
                        return (
                          <SwiperSlide key={`${activeFamily}-${i}`} style={{ width: '52px' }}>
                            <button
                              onClick={() => setLightbox({ url: f.fullUrl || f.url, name: displayName })}
                              className="w-[52px] h-[52px] bg-[#f4f4f4] hover:bg-neutral-200 transition-colors flex items-center justify-center"
                              title={displayName}
                            >
                              <div className="relative w-[38px] h-[38px] rounded-full overflow-hidden">
                                <Image src={f.url} alt={displayName || `acabado ${i + 1}`} fill className="object-cover" sizes="38px" />
                              </div>
                            </button>
                          </SwiperSlide>
                        );
                      })}
                    </Swiper>
                  </div>
                  <button ref={nextRef} className="shrink-0 w-[52px] h-[52px] flex items-center justify-center bg-[#f4f4f4] hover:bg-neutral-200 text-neutral-600 transition-colors disabled:opacity-30">
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            )}



            {/* Prestaciones */}
            {prestaciones.length > 0 && (
              <div className="mb-7">
                <button
                  onClick={() => setIsPrestacionesModalOpen(true)}
                  className="w-full flex items-center justify-between py-2.5 border-y border-neutral-200 group hover:border-primary transition-colors"
                >
                  <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 group-hover:text-primary transition-colors">Prestaciones técnicas</p>
                  <svg className="w-4 h-4 text-neutral-400 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}

            <div className="lg:flex-1" />

            {/* CTAs */}
            <div className="flex flex-col gap-2.5 pt-4 mt-6 lg:mt-0">
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full bg-neutral-900 text-white text-[12px] font-bold uppercase tracking-widest py-4 hover:bg-[#6BA43A] transition-colors"
              >
                Solicitar información
              </button>
              {linkDescarga && (
                <SmartLink
                  href={linkDescarga}
                  className="w-full border border-neutral-300 text-neutral-600 text-[12px] font-bold uppercase tracking-widest py-3 flex items-center justify-center gap-2 hover:border-neutral-900 hover:text-neutral-900 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Ficha técnica
                </SmartLink>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Modal de Solicitud de Información */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Solicitar información"
      >
        <RequestInfoForm productName={title} />
      </Modal>

      {/* Modal de Prestaciones Técnicas */}
      <Modal 
        isOpen={isPrestacionesModalOpen} 
        onClose={() => setIsPrestacionesModalOpen(false)}
        title="Prestaciones Técnicas"
      >
        <div className="flex flex-col gap-1 px-4 pb-6">
          {prestaciones.map((p, i) => (
            <div key={i} className="flex flex-col sm:flex-row justify-between sm:items-center py-4 border-b border-neutral-100 last:border-0 gap-2">
              <span className="text-sm text-neutral-500">{p.label}</span>
              <span className="text-base font-bold text-neutral-900 sm:text-right">{p.valor}</span>
            </div>
          ))}
        </div>
      </Modal>

      {/* Modal Anatomía 3D */}
      <AnatomyModal
        isOpen={isAnatomyOpen}
        onClose={() => setIsAnatomyOpen(false)}
        hotspots={anatomyHotspots || []}
        blocks={anatomyBlocks || []}
        baseImage={anatomyBaseImage || '/placeholder.jpg'}
        lifestyleImage={lifestyleImage}
        lifestyleHotspots={lifestyleHotspots}
        lifestyleBlocks={lifestyleBlocks}
        ctaPhrase={ctaPhrase}
        ctaButtonText={ctaButtonText}
        ctaLink={ctaLink}
        onRequestInfo={() => setIsModalOpen(true)}
      />
    </>
  );
}

/* ── Subcomponente: slide individual con z-index reactivo ── */
function GallerySlide({
  src, alt, t, direction, showOverlay, activeDimension, priority,
}: {
  src: string;
  alt: string;
  t: typeof TRANSITIONS[0];
  direction: number;
  showOverlay: boolean;
  activeDimension: { label: string; valor: string; x?: string; y?: string; rotacion?: string; ancho?: string } | null;
  priority: boolean;
}) {
  const isPresent = useIsPresent();

  return (
    <motion.div
      initial={resolveVariant(t.initial, direction) as any}
      animate={t.animate as any}
      exit={resolveVariant(t.exit, direction) as any}
      transition={t.transition}
      style={{ position: 'absolute', inset: 0, zIndex: isPresent ? 1 : 0 }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className={`object-cover ${showOverlay ? 'brightness-90 grayscale-[30%] transition-all duration-700' : ''}`}
        priority={priority}
        sizes="(max-width: 1024px) 100vw, 60vw"
      />
      {showOverlay && activeDimension && (
        <DimensionOverlay
          activeDimension={activeDimension.label}
          valor={activeDimension.valor}
          cmsX={activeDimension.x}
          cmsY={activeDimension.y}
          cmsRotacion={activeDimension.rotacion}
          cmsAncho={activeDimension.ancho}
        />
      )}
    </motion.div>
  );
}
