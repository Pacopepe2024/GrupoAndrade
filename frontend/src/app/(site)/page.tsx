import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-brand-50 text-center">
      <div className="space-y-6 max-w-2xl">
        <h1 className="text-5xl font-bold text-brand-900">
          Grupo Andrade <span className="text-primary">Next.js</span>
        </h1>
        <p className="text-lg text-neutral-600">
          La base del proyecto está inicializada. El sistema de diseño ("Theme Engine") y las tipografías ya están inyectadas.
        </p>
        
        <div className="pt-8">
          <Link 
            href="/puertas-exteriores"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-primary rounded-xl shadow-lg shadow-primary/30 transition-all hover:-translate-y-1 hover:shadow-xl hover:bg-brand-600"
          >
            Ver Prototipo de Productos
          </Link>
        </div>
      </div>
    </main>
  );
}
