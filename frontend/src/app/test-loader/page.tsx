import React from 'react';

export default async function TestLoaderPage() {
  // Simulamos un retraso de 3 segundos como si estuviera descargando muchas imágenes pesadas
  await new Promise((resolve) => setTimeout(resolve, 3000));

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-10 text-center">
      <h1 className="text-4xl font-display text-neutral-800">
        ¡Carga completada! 
        <br/><span className="text-xl text-neutral-500 font-sans mt-4 block">Has estado viendo el preloader durante 3 segundos.</span>
      </h1>
    </div>
  );
}
