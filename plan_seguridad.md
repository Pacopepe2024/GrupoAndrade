# Plan de Seguridad y Navegación (Headless WP + Next.js)

Este documento detalla las estrategias de seguridad, infraestructura y experiencia de usuario definidas para el proyecto Headless de Grupo Andrade.

---

## 1. Experiencia de Usuario: Navegación y Enlaces

Tras la revisión del equipo, se ha tomado la siguiente decisión técnica respecto a la apertura de enlaces:

* **Enlaces Internos (Navegación SPA):** Se mantienen abriendo en la **misma pestaña**. Esto preserva la velocidad extrema de Next.js.
* **Enlaces Externos y PDFs:** Se configurarán explícitamente para abrir en una **nueva pestaña** (`target="_blank"`), evitando abandonar la web principal.

---

## 2. Estrategia de Seguridad Antihackeos (Headless)

La arquitectura Headless aísla completamente el frontend del backend. La web pública en Vercel (Next.js) no procesa bases de datos ni código PHP.

### Plan de Cierre "A cal y canto" (Día del Cutover)
Actualmente, el sitio WordPress original (`grupoandrade.es`) sigue público. El cierre total se hará el día del despliegue final (Fase de Cutover):

1. **Migración de Dominio**: 
   * `grupoandrade.es` apuntará a la web en Vercel (Next.js).
   * El WordPress (Elementor) se moverá a un subdominio oculto (ej. `cms.grupoandrade.es`).
2. **Ocultar el Panel de Administración**: 
   * Cambiar la ruta `/wp-admin` por una URL secreta.
3. **Bloqueo a Nivel de Servidor**:
   * Restringir el acceso frontend del subdominio mediante bloqueos por IP.
4. **Desactivar Edición en Caliente**: 
   * Definir `DISALLOW_FILE_EDIT` en el `wp-config.php`.

---

## 3. Privacidad de la API REST de WordPress

Por defecto, la API REST de WordPress es pública. Se ha decidido adoptar la siguiente estrategia:

* **Estrategia a futuro (VPS):** No se implementarán scripts de contraseña por el momento. Cuando la arquitectura se migre al **VPS propio**, WordPress y Next.js vivirán en la misma red interna. En ese momento, se configurará Nginx para bloquear cualquier petición pública a `/wp-json/` desde el exterior, permitiendo únicamente el tráfico interno desde el contenedor de Next.js. Esto proporciona seguridad absoluta a nivel de infraestructura sin sobrecargar el código de WordPress.
