import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full bg-neutral-50 mt-auto">
      {/* Footer Links Area (Minimalist light gray background) */}
      <div className="max-w-[1300px] mx-auto px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
        
        {/* Column 1 */}
        <div className="flex flex-col gap-4">
          <Link href="#" className="text-neutral-700 hover:text-primary transition-colors">Sistemas para ventanas en PVC</Link>
          <Link href="#" className="text-neutral-700 hover:text-primary transition-colors">Sistemas para correderas en PVC</Link>
          <Link href="#" className="text-neutral-700 hover:text-primary transition-colors">Sistemas de cierre y ventilación Schüco</Link>
          <Link href="#" className="text-neutral-700 hover:text-primary transition-colors">Alto rendimiento para ventana</Link>
          <Link href="#" className="text-neutral-700 hover:text-primary transition-colors">Diseñado para Schüco</Link>
        </div>

        {/* Column 2 */}
        <div className="flex flex-col gap-4">
          <Link href="#" className="text-neutral-700 hover:text-primary transition-colors">Inspiración</Link>
          <Link href="#" className="text-neutral-700 hover:text-primary transition-colors">Noticias</Link>
          <Link href="#" className="text-neutral-700 hover:text-primary transition-colors">Sostenibilidad</Link>
        </div>

        {/* Column 3 */}
        <div className="flex flex-col gap-4">
          <span className="font-bold text-neutral-900 mb-2">Empresa</span>
          <Link href="#" className="text-neutral-700 hover:text-primary transition-colors">Quiénes somos</Link>
          <Link href="#" className="text-neutral-700 hover:text-primary transition-colors">Empleo</Link>
          <Link href="#" className="text-neutral-700 hover:text-primary transition-colors">Contacto</Link>
        </div>

        {/* Column 4 */}
        <div className="flex flex-col gap-4">
          <span className="font-bold text-neutral-900 mb-2">Área Privada</span>
          <Link href="#" className="text-neutral-700 hover:text-primary transition-colors">Acceso Partner</Link>
          <Link href="#" className="text-neutral-700 hover:text-primary transition-colors">Acceso Distribuidores</Link>
          <Link href="#" className="text-neutral-700 hover:text-primary transition-colors">Acceso Profesionales</Link>
        </div>

      </div>

      {/* Bottom Bar (Schüco Green) */}
      <div className="bg-primary text-white py-4">
        <div className="max-w-[1300px] mx-auto px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold tracking-wide">
          <div>© {new Date().getFullYear()} Grupo Andrade (Réplica de Diseño)</div>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-neutral-900 transition-colors">Política Social</Link>
            <Link href="#" className="hover:text-neutral-900 transition-colors">Canal de Denuncias</Link>
            <Link href="#" className="hover:text-neutral-900 transition-colors">Política de Privacidad</Link>
            <Link href="#" className="hover:text-neutral-900 transition-colors">Política de Cookies</Link>
            {/* Social Icons Placeholder */}
            <div className="flex gap-4 ml-4">
              <span className="cursor-pointer hover:text-neutral-900">f</span>
              <span className="cursor-pointer hover:text-neutral-900">in</span>
              <span className="cursor-pointer hover:text-neutral-900">yt</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
