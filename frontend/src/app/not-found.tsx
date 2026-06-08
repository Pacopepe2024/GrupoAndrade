import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Página no encontrada | Grupo Andrade',
  description: 'La página que buscas no existe o ha sido movida.',
};

export default function NotFound() {
  return (
    <div className="min-h-[100dvh] bg-[#050505] flex items-center justify-center relative overflow-hidden p-6 md:p-10">
      
      {/* Elementos decorativos (Glassmorphism / Premium UI) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        {/* Glow verde sutil Schüco */}
        <div className="absolute top-1/4 -right-1/4 w-[500px] h-[500px] bg-[#78B928] rounded-full blur-[150px] opacity-20"></div>
        {/* Glow cálido Grupo Andrade */}
        <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-[#C17F3A] rounded-full blur-[200px] opacity-10"></div>
        {/* Grid de fondo (Arquitectura) */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px]"></div>
      </div>

      <div className="relative z-10 max-w-4xl w-full flex flex-col md:flex-row items-center gap-12 md:gap-20">
        
        {/* 404 Gigante (Estilo Arquitectónico) */}
        <div className="flex-1 w-full text-center md:text-right border-b md:border-b-0 md:border-r border-white/10 pb-8 md:pb-0 md:pr-20">
          <h1 className="text-8xl md:text-[180px] font-display font-light text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 leading-none tracking-tighter">
            404
          </h1>
          <p className="text-[#78B928] font-bold tracking-[0.3em] uppercase text-sm mt-4 md:mt-2">
            Espacio no encontrado
          </p>
        </div>

        {/* Copy Lujo Editorial */}
        <div className="flex-1 w-full text-center md:text-left">
          <h2 className="text-2xl md:text-4xl font-display text-white mb-6 leading-tight">
            La excelencia reside <br className="hidden md:block" />
            <span className="italic font-light text-white/70">en los detalles.</span>
          </h2>
          <p className="text-neutral-400 text-sm md:text-lg mb-10 max-w-md leading-relaxed">
            Pero parece que este se nos ha pasado por alto. La página que buscas no está disponible o ha sido movida de su ubicación original.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link 
              href="/"
              className="w-full sm:w-auto px-8 py-4 bg-[#78B928] text-white hover:bg-white hover:text-[#78B928] transition-all duration-300 text-sm uppercase tracking-widest font-bold text-center shadow-[0_0_20px_rgba(120,185,40,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]"
            >
              Volver al Inicio
            </Link>
            <Link 
              href="/schuco-pvc"
              className="w-full sm:w-auto px-8 py-4 bg-white/5 backdrop-blur-md text-white border border-white/10 hover:bg-white/10 transition-colors duration-300 text-sm uppercase tracking-widest font-bold text-center"
            >
              Ver Sistemas PVC
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
