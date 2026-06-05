'use client';
import { useState } from 'react';
import Link from 'next/link';

export function Header() {
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="relative w-full bg-surface border-b border-neutral-100 z-50">
      {/* Top Bar - Oculto en móvil, visible desde tablet */}
      <div className="hidden md:flex bg-neutral-900 text-white text-xs py-2 px-6 justify-between items-center tracking-wider uppercase font-bold">
        <span>Particulares</span>
        <div className="flex gap-6">
          <Link href="/empresa" className="hover:text-primary transition-colors">Empresa</Link>
          <Link href="/empleo" className="hover:text-primary transition-colors">Empleo</Link>
          <Link href="/contacto" className="hover:text-primary transition-colors">Contacto</Link>
          <Link href="/area-privada" className="hover:text-primary transition-colors">Área Privada</Link>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-[1300px] mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Hamburguesa Móvil */}
        <button 
          className="lg:hidden p-2 -ml-2 text-neutral-900 hover:text-primary transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Abrir menú"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Logo */}
        <Link href="/" className="text-2xl md:text-3xl font-black tracking-tighter">
          SCHÜCO
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex h-full items-center gap-8">
          <button 
            onMouseEnter={() => setIsMegaMenuOpen(true)}
            className="h-full flex items-center text-sm font-bold uppercase tracking-wider hover:text-primary border-b-2 border-transparent hover:border-primary transition-all"
          >
            Productos
          </button>
          <Link href="/inspiracion" className="h-full flex items-center text-sm font-bold uppercase tracking-wider hover:text-primary transition-colors">
            Inspiración
          </Link>
          <Link href="/noticias" className="h-full flex items-center text-sm font-bold uppercase tracking-wider hover:text-primary transition-colors">
            Noticias
          </Link>
          <Link href="/sostenibilidad" className="h-full flex items-center text-sm font-bold uppercase tracking-wider hover:text-primary transition-colors">
            Sostenibilidad
          </Link>
        </nav>

        {/* Search Icon */}
        <button className="p-2 hover:text-primary transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>

      {/* Mega Menu Dropdown (Desktop) */}
      {isMegaMenuOpen && (
        <div 
          onMouseLeave={() => setIsMegaMenuOpen(false)}
          className="hidden lg:block absolute top-full left-0 w-full bg-surface shadow-2xl border-t border-neutral-100 py-12 animate-in fade-in slide-in-from-top-4 duration-300"
        >
          <div className="w-full px-[5vw] lg:px-[8vw] grid grid-cols-4 gap-12">
            
            {/* Column 1 */}
            <div>
              <h4 className="text-xl font-bold mb-6">Sistemas para ventanas en PVC</h4>
              <ul className="space-y-4">
                <li><Link href="/schuco-pvc/focusing" className="text-neutral-600 hover:text-primary transition-colors block border-b border-neutral-100 pb-2">Schüco FocusIng</Link></li>
                <li><Link href="/schuco-pvc/living" className="text-neutral-600 hover:text-primary transition-colors block border-b border-neutral-100 pb-2">Schüco LivIng</Link></li>
                <li><Link href="/schuco-pvc/symbiotic" className="text-neutral-600 hover:text-primary transition-colors block border-b border-neutral-100 pb-2">Schüco Symbiotic</Link></li>
              </ul>
            </div>

            {/* Column 2 */}
            <div>
              <h4 className="text-xl font-bold mb-6">Sistemas para correderas en PVC</h4>
              <ul className="space-y-4">
                <li><Link href="/schuco-pvc/livingslide" className="text-neutral-600 hover:text-primary transition-colors block border-b border-neutral-100 pb-2">Schüco LivIngSlide</Link></li>
                <li><Link href="/schuco-pvc/softslide" className="text-neutral-600 hover:text-primary transition-colors block border-b border-neutral-100 pb-2">Schüco SoftSlide</Link></li>
              </ul>
            </div>

            {/* Column 3 */}
            <div>
              <h4 className="text-xl font-bold mb-6">Sistemas de cierre y ventilación</h4>
              <ul className="space-y-4">
                <li><Link href="/schuco-pvc/variotec-advanced" className="text-neutral-600 hover:text-primary transition-colors block border-b border-neutral-100 pb-2">VarioTec Advanced</Link></li>
                <li><Link href="/schuco-pvc/domotica" className="text-neutral-600 hover:text-primary transition-colors block border-b border-neutral-100 pb-2">Domótica y soluciones smart</Link></li>
              </ul>
            </div>

            {/* Column 4 */}
            <div>
              <h4 className="text-xl font-bold mb-6">Diseñado para Schüco</h4>
              <ul className="space-y-4">
                <li><Link href="/schuco-pvc/tabiques-interiores" className="text-neutral-600 hover:text-primary transition-colors block border-b border-neutral-100 pb-2">Tabiques interiores</Link></li>
                <li><Link href="/schuco-pvc/pergolas-bioclimaticas" className="text-neutral-600 hover:text-primary transition-colors block border-b border-neutral-100 pb-2">Pérgolas Bioclimáticas</Link></li>
              </ul>
            </div>

          </div>
          
          {/* Close Button / Bottom Bar */}
          <div className="mt-8 flex justify-center">
            <button 
              onClick={() => setIsMegaMenuOpen(false)}
              className="bg-neutral-800 text-white px-8 py-3 uppercase tracking-widest text-sm font-bold hover:bg-primary transition-colors"
            >
              Cerrar (X)
            </button>
          </div>
        </div>
      )}

      {/* Menú Desplegable Móvil (Mobile) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-surface shadow-2xl border-t border-neutral-100 h-[calc(100vh-80px)] overflow-y-auto animate-in fade-in slide-in-from-top-2">
          <div className="p-6 flex flex-col gap-6">
            
            {/* Mobile Nav Links */}
            <div className="flex flex-col gap-4 border-b border-neutral-100 pb-6">
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/inspiracion" className="text-xl font-bold uppercase tracking-wider text-neutral-900">Inspiración</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/noticias" className="text-xl font-bold uppercase tracking-wider text-neutral-900">Noticias</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/sostenibilidad" className="text-xl font-bold uppercase tracking-wider text-neutral-900">Sostenibilidad</Link>
            </div>

            {/* Mobile Products Menu (Aplanado para móvil) */}
            <div className="flex flex-col gap-4 pb-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-400 mb-2">Productos PVC</h3>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/schuco-pvc/focusing" className="text-lg font-bold text-neutral-800 hover:text-primary">Schüco FocusIng</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/schuco-pvc/living" className="text-lg font-bold text-neutral-800 hover:text-primary">Schüco LivIng</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/schuco-pvc/symbiotic" className="text-lg font-bold text-neutral-800 hover:text-primary">Schüco Symbiotic</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/schuco-pvc/livingslide" className="text-lg font-bold text-neutral-800 hover:text-primary">Schüco LivIngSlide</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/schuco-pvc/softslide" className="text-lg font-bold text-neutral-800 hover:text-primary">Schüco SoftSlide</Link>
            </div>

            {/* Mobile Top Bar Links (Empresa, contacto...) */}
            <div className="flex flex-col gap-4 bg-neutral-50 p-4 rounded-xl mt-auto">
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/empresa" className="text-sm font-bold uppercase tracking-wider text-neutral-600">Empresa</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/empleo" className="text-sm font-bold uppercase tracking-wider text-neutral-600">Empleo</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/contacto" className="text-sm font-bold uppercase tracking-wider text-neutral-600">Contacto</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/area-privada" className="text-sm font-bold uppercase tracking-wider text-primary">Área Privada</Link>
            </div>

          </div>
        </div>
      )}
    </header>
  );
}
