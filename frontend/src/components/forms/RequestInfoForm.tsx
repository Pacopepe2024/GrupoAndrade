'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface RequestInfoFormProps {
  productName: string;
}

export function RequestInfoForm({ productName }: RequestInfoFormProps) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [url, setUrl] = useState('');

  useEffect(() => {
    // Capturamos la URL del cliente al montar el componente
    setUrl(window.location.href);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    try {
      // Enviamos al endpoint de la API simulado
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Error al enviar el formulario');
      
      setStatus('success');
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-10 text-center"
      >
        <div className="w-16 h-16 bg-brand-500/10 text-primary rounded-full flex items-center justify-center mb-6">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <h4 className="text-2xl font-heading font-bold text-text-main mb-3">
          ¡Solicitud enviada!
        </h4>
        <p className="text-[14px] text-neutral-600 leading-relaxed max-w-md mx-auto">
          Hemos recibido su petición.<br/><br/>
          En breve un técnico comercial se pondrá en contacto con usted.<br/><br/>
          <strong>Gracias</strong> por contactar con Grupo Andrade.
        </p>
      </motion.div>
    );
  }

  // Clases compartidas para los inputs (con fix para el fondo azul de autocompletado en Chrome)
  const inputClasses = "w-full bg-transparent border-0 border-b border-neutral-300 px-0 py-2 text-[14px] text-neutral-900 placeholder-neutral-400 focus:ring-0 focus:border-neutral-700 outline-none transition-colors [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_#ffffff] [&:-webkit-autofill]:[-webkit-text-fill-color:#171717]";

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-4">
      {/* Campos ocultos de contexto para el comercial */}
      <input type="hidden" name="product" value={productName} />
      <input type="hidden" name="url" value={url} />

      <div className="space-y-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-6">
          <div className="relative">
            <input
              type="text"
              id="nombre"
              name="nombre"
              required
              className={inputClasses}
              placeholder="Nombre"
            />
          </div>
          <div className="relative">
            <input
              type="text"
              id="apellidos"
              name="apellidos"
              required
              className={inputClasses}
              placeholder="Apellidos"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-6">
          <div className="relative">
            <input
              type="email"
              id="email"
              name="email"
              required
              className={inputClasses}
              placeholder="Email"
            />
          </div>
          <div className="relative">
            <input
              type="tel"
              id="telefono"
              name="telefono"
              required
              maxLength={9}
              pattern="[0-9]{9}"
              title="Debe contener exactamente 9 dígitos"
              className={inputClasses}
              placeholder="Teléfono"
            />
          </div>
        </div>

        <div className="relative">
          <textarea
            id="mensaje"
            name="mensaje"
            required
            rows={3}
            className={`${inputClasses} resize-none`}
            placeholder="Mensaje"
          ></textarea>
        </div>
      </div>

      <div className="space-y-4 pt-2">
        <p className="text-[13px] text-neutral-600 leading-[1.6]">
          Para poder proporcionarte el contenido solicitado, debemos almacenar y procesar tus datos personales. Si aceptas que almacenemos tus datos personales para este fin, marca la casilla de abajo.
        </p>

        <div className="flex items-start gap-3">
          <div className="flex items-center h-5">
            <input
              id="acepto_datos"
              name="acepto_datos"
              type="checkbox"
              required
              className="w-4 h-4 rounded-sm border-neutral-400 text-[#111] focus:ring-[#111] focus:ring-offset-0 cursor-pointer"
            />
          </div>
          <div className="text-[13px] leading-[1.5]">
            <label htmlFor="acepto_datos" className="font-medium text-neutral-900 cursor-pointer">
              Acepto permitir al Grupo Andrade almacenar y procesar mis datos personales.*
            </label>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex items-center h-5">
            <input
              id="acepto_com"
              name="acepto_com"
              type="checkbox"
              className="w-4 h-4 rounded-sm border-neutral-400 text-[#111] focus:ring-[#111] focus:ring-offset-0 cursor-pointer"
            />
          </div>
          <div className="text-[13px] leading-[1.5]">
            <label htmlFor="acepto_com" className="text-neutral-900 cursor-pointer">
              Acepto recibir otras comunicaciones de Grupo Andrade.
            </label>
          </div>
        </div>

        <p className="text-[13px] text-neutral-600 leading-[1.6] pt-2">
          Puedes darte de baja de estas comunicaciones en cualquier momento. Consulta nuestra <a href="/politica-de-privacidad" target="_blank" className="text-neutral-900 font-bold underline hover:text-neutral-600">Política de Privacidad</a>.
        </p>
      </div>

      {status === 'error' && (
        <div className="p-4 bg-[#fdedec] text-[#c0392b] text-[13px] text-center font-medium">
          Ha ocurrido un error al enviar tu solicitud. Por favor, inténtalo de nuevo o contáctanos por teléfono.
        </div>
      )}

      <div className="pt-2">
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="w-full bg-[#111] hover:bg-[#333] text-white text-[13px] font-semibold uppercase tracking-[2px] py-5 transition-colors disabled:bg-[#aaa] disabled:cursor-not-allowed flex justify-center items-center gap-3 rounded-none"
        >
          {status === 'submitting' ? (
            <>
              <svg className="animate-spin -ml-1 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Enviando...
            </>
          ) : (
            'Enviar formulario'
          )}
        </button>
      </div>
    </form>
  );
}
