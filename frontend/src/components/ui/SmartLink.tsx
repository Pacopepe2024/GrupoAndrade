'use client';

import React from 'react';
import Link from 'next/link';

interface SmartLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function SmartLink({ href, children, className, ...props }: SmartLinkProps) {
  // Verificamos si es externo (empieza por http/https y no es de nuestro dominio principal)
  // O si es un archivo PDF (termina en .pdf, independientemente del dominio)
  const isPdf = href.toLowerCase().endsWith('.pdf');
  const isExternal = href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:');

  if (isExternal || isPdf) {
    return (
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer" 
        className={className}
        {...props}
      >
        {children}
      </a>
    );
  }

  // Si es un enlace interno a la propia SPA, usamos el enrutador de Next.js
  return (
    <Link 
      href={href} 
      className={className}
      {...props}
    >
      {children}
    </Link>
  );
}
