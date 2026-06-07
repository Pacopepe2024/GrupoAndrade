'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface DimensionOverlayProps {
  activeDimension: string;
  valor?: string;
  cmsX?: string;
  cmsY?: string;
  cmsRotacion?: string;
  cmsAncho?: string;
}

export function DimensionOverlay({ activeDimension, valor, cmsX, cmsY, cmsRotacion, cmsAncho }: DimensionOverlayProps) {
  const [key, setKey] = useState(0);

  // Forzar re-animación cuando cambia la dimensión activa
  useEffect(() => {
    setKey(prev => prev + 1);
  }, [activeDimension]);

  // Coordenadas genéricas para el "efecto wow" basadas en la imagen de ejemplo.
  // En un sistema real, estas coordenadas vendrían de la BD para cada imagen.
  const isMarco = activeDimension.toLowerCase().includes('marco');
  const isHoja = activeDimension.toLowerCase().includes('hoja');

  // Si el CMS manda los datos, los usamos. Si no, fallback.
  const hasX = cmsX !== undefined && cmsX !== null && cmsX !== '';
  const hasY = cmsY !== undefined && cmsY !== null && cmsY !== '';
  const hasRot = cmsRotacion !== undefined && cmsRotacion !== null && cmsRotacion !== '';
  const anchoVisual = cmsAncho !== undefined && cmsAncho !== null && cmsAncho !== '' ? cmsAncho : "30";

  // 1. Determinar coordenadas base sin rotar
  const startXNum = hasX ? parseFloat(cmsX) : (isMarco ? 20 : 30);
  const startYNum = hasY ? parseFloat(cmsY) : (isMarco ? 90 : 30);
  const anchoNum = parseFloat(anchoVisual);
  
  const endXNum = hasX ? (startXNum + anchoNum) : (isMarco ? 80 : 30);
  const endYNum = hasY ? startYNum : (isMarco ? 90 : 80);

  // 2. Determinar rotación
  const rotNum = hasRot ? parseFloat(cmsRotacion) : (isMarco ? -25 : isHoja ? 25 : 0);
  const angleRad = (rotNum * Math.PI) / 180;

  // 3. Punto medio original y rotado para la etiqueta
  const midOriginalX = (startXNum + endXNum) / 2;
  const midOriginalY = (startYNum + endYNum) / 2;
  const dx = midOriginalX - startXNum;
  const dy = midOriginalY - startYNum;
  
  const rotatedDx = dx * Math.cos(angleRad) - dy * Math.sin(angleRad);
  const rotatedDy = dx * Math.sin(angleRad) + dy * Math.cos(angleRad);
  
  const finalMidX = startXNum + rotatedDx;
  const finalMidY = startYNum + rotatedDy;

  // Strings para el SVG
  const startX = `${startXNum}%`;
  const startY = `${startYNum}%`;
  const endX = `${endXNum}%`;
  const endY = `${endYNum}%`;
  const rotation = `rotate(${rotNum}deg)`;

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        key={key}
        className="absolute inset-0 z-50 pointer-events-none"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <svg className="w-full h-full" style={{ overflow: 'visible' }}>
          <g style={{ transformOrigin: `${startX} ${startY}`, transform: rotation }}>
            {/* Línea principal animada */}
            <motion.line
              x1={startX}
              y1={startY}
              x2={endX}
              y2={endY}
              stroke="#0A0A0A"
              strokeWidth="2"
            />
            
            {/* Remate inicio (tick) */}
            <motion.line
              x1={startX}
              y1={`calc(${startY} - 10px)`}
              x2={startX}
              y2={`calc(${startY} + 10px)`}
              stroke="#0A0A0A"
              strokeWidth="2"
            />

            {/* Remate fin (tick) */}
            <motion.line
              x1={endX}
              y1={`calc(${endY} - 10px)`}
              x2={endX}
              y2={`calc(${endY} + 10px)`}
              stroke="#0A0A0A"
              strokeWidth="2"
            />
          </g>
        </svg>

        {/* Etiqueta de texto (valor) centrada exactamente en la línea */}
        <div
          className="absolute bg-white/95 backdrop-blur-md px-3.5 py-1.5 text-[11px] font-bold shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-neutral-100 rounded-full text-neutral-900 tracking-wide"
          style={{ 
            left: `${finalMidX}%`, 
            top: `${finalMidY}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          {valor || activeDimension}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
