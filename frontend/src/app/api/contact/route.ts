import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Configuración de destino del email comercial
    // Idealmente esto vendrá de las variables de entorno (.env.local)
    const DESTINATION_EMAIL = process.env.CONTACT_EMAIL || 'jose@grupoandrade.es';
    
    // Aquí iría la lógica real de envío con Resend o Formspree:
    // 1. Validar los datos
    // 2. Insertar en base de datos (Supabase/WP)
    // 3. Enviar email al COMERCIAL (DESTINATION_EMAIL) con los datos del lead
    // 4. Enviar email de confirmación automática al CLIENTE (data.email)
    
    // Extraemos la información útil (por ejemplo, para logs en desarrollo)
    console.log(`\n=== ENVIANDO EMAIL A: ${DESTINATION_EMAIL} ===`);
    console.log('--- NUEVO LEAD RECIBIDO ---');
    console.log(`Producto: ${data.product}`);
    console.log(`URL Origen: ${data.url}`);
    console.log(`Nombre: ${data.name}`);
    console.log(`Email: ${data.email}`);
    console.log(`Teléfono: ${data.phone}`);
    console.log(`Mensaje: ${data.message || 'Sin mensaje'}`);
    console.log('---------------------------');

    // Simulamos un pequeño retraso de red
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // Si todo va bien, devolvemos OK
    return NextResponse.json({ success: true, message: 'Solicitud enviada correctamente' });
  } catch (error) {
    console.error('Error procesando el formulario de contacto:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
