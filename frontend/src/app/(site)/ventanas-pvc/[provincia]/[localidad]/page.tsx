import { getCPT } from '@/lib/wordpress/api';
import * as motion from 'framer-motion/client';
import { SilenceExperience } from '@/components/products/SilenceExperience';

export async function generateStaticParams() {
  const localidades = await getCPT('localidades');
  return localidades.map((loc: any) => ({
    provincia: (loc.meta?.provincia || 'sevilla').toLowerCase(),
    localidad: loc.slug || 'sevilla',
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ provincia: string; localidad: string }>;
}) {
  const { provincia, localidad } = await params;
  const localidadName = localidad.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

  return {
    title: `Arquitectura del Bienestar en ${localidadName} | Grupo Andrade`,
    description: `Sistemas Schüco en ${localidadName}. Diseñados para transformar la luz, el confort y la experiencia de tu hogar.`,
  };
}

export default async function LuxuryGeographicLanding({
  params,
}: {
  params: Promise<{ provincia: string; localidad: string }>;
}) {
  const { provincia, localidad } = await params;
  const localidadFormat = localidad.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

  // Datos mock para asegurar la presentación visual si falla WP
  const data = {
    descripcion_clima_zona: `El clima en ${localidadFormat} exige sistemas de alta rotura de puente térmico para garantizar confort todo el año.`,
    foto_instalacion_zona: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop', // Casa moderna lujosa
    codigo_postal: '41001',
    coordenadas_mapa: '37.389,-5.984'
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#FAFAF7] font-sans selection:bg-[#E6E2DC] selection:text-[#0A0A0A]">
      
      {/* 1. Hero Cinematic */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={data.foto_instalacion_zona} 
            alt="Interior Arquitectónico"
            className="w-full h-full object-cover opacity-70 object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/80" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20, rotateX: 10 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1.5, ease: [0.2, 0.65, 0.3, 0.9] }}
            style={{ perspective: 1000 }}
            className="text-5xl md:text-7xl lg:text-8xl font-display font-light leading-tight tracking-tight mb-8 text-white drop-shadow-2xl"
          >
            Vivir mejor empieza<br />por el silencio.
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
            className="text-lg md:text-xl text-[#E6E2DC] font-light tracking-wide max-w-2xl text-center leading-relaxed mb-12 drop-shadow-md"
          >
            Sistemas de ventanas que transforman la luz, el confort y la experiencia de tu hogar en {localidadFormat}.
          </motion.p>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="border-b border-primary text-primary pb-2 text-sm uppercase tracking-[0.2em] font-semibold hover:border-white hover:text-white transition-colors duration-500"
          >
            Descubrir el confort
          </motion.button>
        </div>
      </section>

      {/* 2. Luz + Confort (Editorial) */}
      <section className="py-32 px-6 lg:px-12 max-w-7xl mx-auto bg-[#0A0A0A]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="flex flex-col gap-10 pr-0 lg:pr-12"
          >
            <h2 className="text-4xl md:text-6xl font-display font-light leading-[1.1] tracking-tight">
              Más luz natural.<br />Menos ruido exterior.
            </h2>
            <div className="w-12 h-[2px] bg-primary" />
            <p className="text-xl text-[#E6E2DC] font-light leading-relaxed">
              La temperatura se mantiene estable, el ruido de la calle desaparece. 
              El diseño interior cobra vida cuando la luz inunda la estancia sin alterar tu paz.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95, rotateY: -10 }}
            whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
            whileHover={{ scale: 1.02, rotateY: 5, rotateX: 2 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{ perspective: 1200, transformStyle: "preserve-3d" }}
            className="relative h-[70vh] w-full group cursor-pointer"
          >
            {/* Glow verde trasero sutil */}
            <div className="absolute -inset-4 bg-primary/20 blur-3xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <img 
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop" 
              alt="Luz natural en salón minimalista"
              className="w-full h-full object-cover rounded-xl grayscale-[20%] shadow-2xl shadow-black"
            />
          </motion.div>
        </div>
      </section>

      {/* 3. La Experiencia del Silencio */}
      <SilenceExperience />

      {/* 4. Ingeniería Oculta */}
      <section className="py-32 px-6 lg:px-12 bg-[#FAFAF7] text-[#0A0A0A]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5 }}
            className="order-2 lg:order-1 relative aspect-square w-full max-w-lg mx-auto"
          >
            {/* Macro detail image */}
            <img 
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop" 
              alt="Detalle marco de ventana"
              className="w-full h-full object-cover object-left grayscale brightness-110 contrast-125"
            />
          </motion.div>

          <div className="order-1 lg:order-2 flex flex-col gap-8">
            <h3 className="text-sm uppercase tracking-[0.2em] text-neutral-500 font-semibold">
              Detalles que no ves, pero sientes
            </h3>
            <h2 className="text-4xl md:text-5xl font-display font-light leading-tight">
              Ingeniería silenciosa.
            </h2>
            <p className="text-lg text-neutral-600 font-light leading-relaxed max-w-lg">
              Detrás de un diseño purista se esconde la tecnología térmica más avanzada de Schüco. 
              Múltiples cámaras de aislamiento y juntas ocultas que trabajan en silencio para que 
              el clima exterior no determine el clima de tu casa.
            </p>
          </div>

        </div>
      </section>

      {/* 5. Testimonios & CTA */}
      <section className="py-40 px-6 bg-[#0A0A0A] text-center flex flex-col items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
          className="max-w-3xl"
        >
          <p className="text-2xl md:text-4xl font-display font-light italic text-[#E6E2DC] leading-relaxed mb-20">
            "Ahora la casa se siente en paz. El ruido de la calle desapareció por completo y la luz lo cambió todo."
          </p>

          <h2 className="text-5xl font-display font-light mb-12">
            Tu hogar puede sentirse diferente.
          </h2>
          
          <motion.button 
            whileHover={{ scale: 1.05, translateY: -2 }}
            whileTap={{ scale: 0.95 }}
            className="bg-primary text-white px-10 py-5 text-sm uppercase tracking-[0.15em] font-semibold hover:bg-primary/90 transition-all duration-300 shadow-[0_0_30px_rgba(107,164,58,0.2)] hover:shadow-[0_0_50px_rgba(107,164,58,0.4)] rounded-sm"
          >
            Solicitar asesoramiento
          </motion.button>
        </motion.div>
      </section>

      {/* SEO Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HomeAndConstructionBusiness",
            "name": "Grupo Andrade - Arquitectura y Bienestar",
            "url": `https://grupoandrade.es/ventanas-pvc/${provincia}/${localidad}`,
            "areaServed": {
              "@type": "City",
              "name": localidadFormat
            }
          })
        }}
      />
    </div>
  );
}
