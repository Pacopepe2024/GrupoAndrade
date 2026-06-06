'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useSpring } from 'framer-motion';
import styles from './SchucoPVCAnatomy.module.css';

// === CONFIGURACIÓN DE PUNTOS CALIENTES (HOTSPOTS) ===
// Aquí puedes editar fácilmente las posiciones X/Y y el tamaño del spotlight
const HOTSPOTS = [
  { id: 0, x: 54, y: 18, spotlightSize: 246 },
  { id: 1, x: 58, y: 38, spotlightSize: 214 },
  { id: 2, x: 48, y: 58, spotlightSize: 294 },
  { id: 3, x: 38, y: 71, spotlightSize: 248 },
  { id: 4, x: 65, y: 64, spotlightSize: 228 },
];

const BLOCKS = [
  {
    title: 'Acristalamiento eficiente',
    text: 'El vidrio se presenta como una pieza de precisión: menos pérdida energética, más confort interior y una lectura visual mucho más limpia.',
    kpis: [
      { label: 'Confort', value: 'Temperatura más estable' },
      { label: 'Luz', value: 'Lectura visual limpia' },
      { label: 'Silencio', value: 'Mejor sensación interior' },
    ]
  },
  {
    title: 'Juntas de estanqueidad',
    text: 'El foco se desplaza a las juntas para explicar el sellado perimetral sin romper la imagen ni crear una animación agresiva.',
    kpis: [
      { label: 'Aire', value: 'Menos filtraciones' },
      { label: 'Agua', value: 'Protección perimetral' },
      { label: 'Ruido', value: 'Cierre más compacto' },
    ]
  },
  {
    title: 'Perfil multicámara',
    text: 'Las cámaras interiores se iluminan de forma selectiva para mostrar la ingeniería oculta del perfil de PVC y su función aislante.',
    kpis: [
      { label: 'Multi', value: 'Cavidades interiores' },
      { label: 'Térmico', value: 'Barrera de aislamiento' },
      { label: 'Diseño', value: 'Estructura optimizada' },
    ]
  },
  {
    title: 'Refuerzo estructural',
    text: 'Una transición suave resalta la zona estructural y transmite solidez, estabilidad y producto de alto rendimiento.',
    kpis: [
      { label: 'Firmeza', value: 'Mayor estabilidad' },
      { label: 'Vida útil', value: 'Bajo mantenimiento' },
      { label: 'Marco', value: 'Geometría resistente' },
    ]
  },
  {
    title: 'Drenaje oculto',
    text: 'El detalle técnico se explica con un foco preciso y una estética limpia, sin recargar la composición ni distraer del producto.',
    kpis: [
      { label: 'Agua', value: 'Evacuación integrada' },
      { label: 'Estética', value: 'Sin elementos visibles' },
      { label: 'Sistema', value: 'Funcionamiento conjunto' },
    ]
  }
];

export function SchucoPVCAnatomy() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Progress bar logic
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Intersection Observer to detect which block is active
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-index'));
            if (!isNaN(index)) {
              setActiveIndex(index);
            }
          }
        });
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: 0.1 }
    );

    const blocks = document.querySelectorAll('.scroll-block');
    blocks.forEach((b) => observer.observe(b));

    return () => observer.disconnect();
  }, []);

  // 3D Parallax effect on mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    // Limit to +/- 2.5 degrees as requested
    setMousePos({ x: x * 5, y: y * 5 });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  const currentHotspot = HOTSPOTS[activeIndex] || HOTSPOTS[0];
  const currentBlock = BLOCKS[activeIndex] || BLOCKS[0];

  return (
    <section className={styles.container} ref={containerRef}>
      <div className={styles.glowTop}></div>
      
      {/* Progress Bar */}
      <div className={styles.progressBarContainer}>
        <motion.div className={styles.progressBar} style={{ scaleX }} />
      </div>

      {/* Side Navigation */}
      <nav className={styles.sideNav} aria-label="Navegación de características">
        {HOTSPOTS.map((_, i) => (
          <button
            key={i}
            className={`${styles.navDot} ${i === activeIndex ? styles.active : ''}`}
            onClick={() => {
              const el = document.getElementById(`block-${i}`);
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }}
            aria-label={`Ir a característica ${i + 1}`}
          />
        ))}
      </nav>

      {/* Hero Header */}
      <div className={styles.hero}>
        <h2 className={styles.heroTitle}>Ingeniería en PVC.</h2>
        <p className={styles.heroSubtitle}>
          Una presentación premium para mostrar la ventana por dentro: luz superior, foco técnico, hotspots y lectura clara.
        </p>
        <button 
          className={styles.heroButton}
          onClick={() => document.getElementById('block-0')?.scrollIntoView({ behavior: 'smooth' })}
        >
          Ver anatomía
        </button>
      </div>

      {/* Main Sticky Layout */}
      <div className={styles.stickyLayout}>
        
        {/* Left Col: Sticky Image Stage */}
        <div className={styles.imageCol}>
          <div 
            className={styles.productStage}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <motion.div 
              className={styles.productImageWrapper}
              animate={{ rotateY: mousePos.x, rotateX: -mousePos.y }}
              transition={{ type: 'spring', stiffness: 100, damping: 30 }}
            >
              {/* Base Image (Darkened) */}
              <Image 
                src="/images/perfil-pvc.webp" 
                alt="Perfil PVC Schüco" 
                fill 
                className={styles.productImage} 
                style={{ opacity: 0.3 }}
                priority
              />
              
              {/* Masked Highlighted Image */}
              <motion.div
                className={styles.spotlightMask}
                animate={{
                  WebkitMaskImage: `radial-gradient(${currentHotspot.spotlightSize}px circle at ${currentHotspot.x}% ${currentHotspot.y}%, black 40%, transparent 100%)`,
                  maskImage: `radial-gradient(${currentHotspot.spotlightSize}px circle at ${currentHotspot.x}% ${currentHotspot.y}%, black 40%, transparent 100%)`,
                  backgroundColor: 'rgba(0,0,0,0)'
                } as any}
                transition={{ type: 'tween', duration: 0.8, ease: "easeInOut" }}
              >
                <Image 
                  src="/images/perfil-pvc.webp" 
                  alt="Highlight" 
                  fill 
                  className={styles.productImage} 
                />
              </motion.div>

              {/* Hotspot Markers */}
              {HOTSPOTS.map((h, i) => (
                <div 
                  key={h.id}
                  className={`${styles.hotspot} ${i === activeIndex ? styles.active : ''}`}
                  style={{ left: `${h.x}%`, top: `${h.y}%` }}
                  onClick={() => {
                    const el = document.getElementById(`block-${i}`);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }}
                  role="button"
                  aria-label={`Característica ${i + 1}`}
                >
                  <div className={styles.hotspotInner}></div>
                </div>
              ))}
            </motion.div>

            {/* Floating Glass Card */}
            <div className={styles.glassCard}>
              <div className={styles.glassCardTitle}>
                <span>{String(activeIndex + 1).padStart(2, '0')}</span>
                {currentBlock.title}
              </div>
              <p className={styles.glassCardText}>
                {currentBlock.text}
              </p>
            </div>
          </div>
        </div>

        {/* Right Col: Scrolling Text Blocks */}
        <div className={styles.textCol}>
          {BLOCKS.map((block, i) => (
            <div 
              key={i} 
              id={`block-${i}`}
              data-index={i}
              className={`scroll-block ${styles.textBlock} ${i === activeIndex ? styles.active : ''}`}
            >
              <div className={styles.textBlockNumber}>{String(i + 1).padStart(2, '0')}</div>
              <h3 className={styles.textBlockTitle}>{block.title}</h3>
              <p className={styles.textBlockDescription}>{block.text}</p>
              
              <div className={styles.kpiGrid}>
                {block.kpis.map((kpi, idx) => (
                  <div key={idx} className={styles.kpiItem}>
                    <span className={styles.kpiLabel}>{kpi.label}</span>
                    <span className={styles.kpiValue}>{kpi.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Final Brand Block */}
          <div className={`scroll-block ${styles.textBlock}`} style={{ minHeight: '40vh', opacity: 1, transform: 'none' }}>
            <h3 className={styles.textBlockTitle}>Premium, técnico y alineado con la identidad visual.</h3>
            <p className={styles.textBlockDescription}>
              Una sección visualmente potente, pero sobria: verde corporativo para guiar la atención, negro para profundidad y blanco para claridad.
            </p>
            <div className={styles.colorChips}>
              <div className={styles.colorChip}>
                <div className={styles.colorDot} style={{ backgroundColor: '#78B928' }}></div>
                <span className={styles.colorName}>Verde #78B928</span>
              </div>
              <div className={styles.colorChip}>
                <div className={styles.colorDot} style={{ backgroundColor: '#000000' }}></div>
                <span className={styles.colorName}>Negro #000000</span>
              </div>
              <div className={styles.colorChip}>
                <div className={styles.colorDot} style={{ backgroundColor: '#FFFFFF' }}></div>
                <span className={styles.colorName}>Blanco #FFFFFF</span>
              </div>
              <div className={styles.colorChip}>
                <div className={styles.colorDot} style={{ backgroundColor: '#E6E8E2' }}></div>
                <span className={styles.colorName}>Gris Técnico #E6E8E2</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
