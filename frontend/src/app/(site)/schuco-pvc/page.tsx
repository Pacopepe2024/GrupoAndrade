import { HeroCinematografico } from '@/components/editorial/HeroCinematografico';
import { ExperienciaSilencio } from '@/components/editorial/ExperienciaSilencio';
import { PerfilAnimado } from '@/components/editorial/PerfilAnimado';
import Image from 'next/image';

export const metadata = {
  title: 'Arquitectura del Bienestar · Ventanas Schüco PVC',
  description: 'Vivir mejor empieza por el silencio. Descubre cómo las ventanas Schüco transforman la experiencia de tu hogar.',
};

const IMAGEN_HERO = 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1920&q=85';
const IMAGEN_CONFORT = 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1200&q=85';

export default function LandingArquitecturaBienestar() {
  return (
    <div className="bg-neutral-950">

      {/* ── 1. HERO CINEMATOGRÁFICO ── */}
      <HeroCinematografico
        titulo="Vivir mejor empieza<br />por el silencio."
        imagenFondo={IMAGEN_HERO}
      />

      {/* ── 2. LUZ Y CONFORT ── */}
      <section id="seccion-confort" className="w-full bg-[#FAFAF7] py-32 lg:py-40">
        <div className="max-w-7xl mx-auto px-8 lg:px-20 grid lg:grid-cols-2 gap-16 items-center">

          <div className="order-2 lg:order-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400 mb-10">
              Luz · Confort
            </p>
            <h2 className="text-5xl lg:text-6xl xl:text-7xl font-light text-neutral-900 leading-[1.05] tracking-tight mb-8">
              Más luz natural.<br />
              <span className="text-neutral-400">Menos ruido exterior.</span>
            </h2>
            <p className="text-lg font-light text-neutral-500 leading-relaxed max-w-md">
              La arquitectura de tu hogar define cómo te sientes en él. Una ventana no es un agujero en la pared: es la frontera entre tu mundo interior y el exterior.
            </p>
          </div>

          <div className="order-1 lg:order-2 relative aspect-[4/5] overflow-hidden">
            <Image
              src={IMAGEN_CONFORT}
              alt="Luz natural en interior"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      {/* ── 3. EXPERIENCIA DEL SILENCIO ── */}
      <ExperienciaSilencio />

      {/* ── 4. INGENIERÍA OCULTA — perfil animado ── */}
      <PerfilAnimado />

      {/* ── 5. CIERRE Y CTA ── */}
      <section className="w-full bg-neutral-950 py-40 lg:py-56">
        <div className="max-w-4xl mx-auto px-8 lg:px-20 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 mb-10">
            El siguiente paso
          </p>
          <blockquote className="text-4xl lg:text-6xl xl:text-7xl font-light text-white leading-tight mb-8">
            "Ahora la casa<br />
            <span className="text-white/40">se siente en paz."</span>
          </blockquote>
          <p className="text-white/40 font-light text-lg mb-16 max-w-md mx-auto leading-relaxed">
            Tu hogar puede sentirse diferente. Un asesor especializado puede acompañarte desde el primer momento.
          </p>
          <a
            href="#contacto"
            className="inline-flex items-center gap-6 border border-white/20 text-white text-[11px] font-bold uppercase tracking-[0.25em] px-10 py-5 hover:bg-white hover:text-neutral-950 transition-all duration-500"
          >
            Solicitar asesoramiento
          </a>
        </div>
      </section>

    </div>
  );
}
