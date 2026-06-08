'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useSpring } from 'framer-motion';
import styles from './SchucoPVCAnatomy.module.css';

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

export interface SchucoPVCAnatomyProps {
  hotspots: AnatomyHotspot[];
  blocks: AnatomyBlock[];
  baseImage: string;
  lifestyleImage?: string;
  lifestyleHotspots?: AnatomyHotspot[];
  lifestyleBlocks?: AnatomyBlock[];
}

export function SchucoPVCAnatomy({ hotspots = [], blocks = [], baseImage = '/placeholder.jpg' }: SchucoPVCAnatomyProps) {
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

  const currentHotspot = hotspots[activeIndex] || hotspots[0] || { x: 50, y: 50, spotlightSize: 200 };
  const currentBlock = blocks[activeIndex] || blocks[0] || { title: '', text: '', kpis: [] };

  return (
    <section className={styles.container} ref={containerRef}>
      <div className={styles.glowTop}></div>
      
      {/* Progress Bar */}
      <div className={styles.progressBarContainer}>
        <motion.div className={styles.progressBar} style={{ scaleX }} />
      </div>

      {/* Side Navigation */}
      <nav className={styles.sideNav} aria-label="Navegación de características">
        {hotspots.map((_, i) => (
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
                src={baseImage}
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
                  WebkitMaskImage: `radial-gradient(${currentHotspot.spotlightSize || 200}px circle at ${currentHotspot.x}% ${currentHotspot.y}%, black 40%, transparent 100%)`,
                  maskImage: `radial-gradient(${currentHotspot.spotlightSize || 200}px circle at ${currentHotspot.x}% ${currentHotspot.y}%, black 40%, transparent 100%)`,
                  backgroundColor: 'rgba(0,0,0,0)'
                } as any}
                transition={{ type: 'tween', duration: 0.8, ease: "easeInOut" }}
              >
                <Image 
                  src={baseImage}
                  alt="Highlight" 
                  fill 
                  className={styles.productImage} 
                />
              </motion.div>

              {/* Hotspot Markers */}
              {hotspots.map((h, i) => (
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
          {blocks.map((block, i) => (
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
