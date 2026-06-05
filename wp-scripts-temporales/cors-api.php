<?php
/**
 * Plugin Name: Grupo Andrade - CORS API
 * Description: Permite peticiones CORS a la REST API desde el frontend de Next.js.
 */

add_filter('rest_pre_serve_request', function($value) {
  // Ajusta 'https://tudominio.com' al dominio o puerto de Vercel/Localhost más adelante
  header('Access-Control-Allow-Origin: *'); 
  header('Access-Control-Allow-Methods: GET, OPTIONS');
  return $value;
});
