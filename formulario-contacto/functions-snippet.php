<?php
/**
 * Grupo Andrade - Contact Form AJAX Handler
 * Añadir este código a functions.php del tema hijo (o usar un plugin de snippets)
 */

// Encolar el nonce en el frontend
add_action('wp_enqueue_scripts', 'ga_contact_enqueue');
function ga_contact_enqueue() {
    wp_localize_script('jquery', 'ga_ajax', [
        'url'   => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('ga_contact_nonce'),
    ]);
}

// Manejar el envío (usuarios logueados y no logueados)
add_action('wp_ajax_ga_contact_submit',        'ga_contact_submit_handler');
add_action('wp_ajax_nopriv_ga_contact_submit', 'ga_contact_submit_handler');

function ga_contact_submit_handler() {
    // Verificar nonce
    if (!check_ajax_referer('ga_contact_nonce', 'nonce', false)) {
        wp_send_json_error(['msg' => 'Solicitud no válida.']);
    }

    // Recoger y sanear campos
    $nombre    = sanitize_text_field($_POST['nombre']    ?? '');
    $apellidos = sanitize_text_field($_POST['apellidos'] ?? '');
    $email     = sanitize_email($_POST['email']          ?? '');
    $telefono  = sanitize_text_field($_POST['telefono']  ?? '');
    $mensaje   = sanitize_textarea_field($_POST['mensaje'] ?? '');
    $acepto_datos = !empty($_POST['acepto_datos']);
    $acepto_com   = !empty($_POST['acepto_com']);

    // Validaciones servidor (segunda línea de defensa)
    $errores = [];
    if ($nombre    === '') $errores[] = 'Nombre';
    if ($apellidos === '') $errores[] = 'Apellidos';
    if ($email     === '' || !is_email($email)) $errores[] = 'Email válido';
    if (!preg_match('/^\d{9}$/', $telefono))    $errores[] = 'Teléfono (9 dígitos)';
    if ($mensaje   === '') $errores[] = 'Mensaje';
    if (!$acepto_datos)    $errores[] = 'Aceptar política de datos';

    if ($errores) {
        wp_send_json_error(['msg' => 'Faltan campos: ' . implode(', ', $errores)]);
    }

    // Construir y enviar email al administrador
    $admin_email = get_option('admin_email');
    $asunto      = 'Nuevo contacto - Grupo Andrade';
    $cuerpo      = sprintf(
        '<h2 style="font-family:sans-serif">Nuevo mensaje de contacto</h2>
        <table style="font-family:sans-serif;font-size:15px;border-collapse:collapse">
            <tr><td style="padding:6px 12px"><strong>Nombre</strong></td><td>%s %s</td></tr>
            <tr><td style="padding:6px 12px"><strong>Email</strong></td><td>%s</td></tr>
            <tr><td style="padding:6px 12px"><strong>Teléfono</strong></td><td>%s</td></tr>
            <tr><td style="padding:6px 12px;vertical-align:top"><strong>Mensaje</strong></td><td>%s</td></tr>
            <tr><td style="padding:6px 12px"><strong>Acepta comunicaciones</strong></td><td>%s</td></tr>
        </table>',
        esc_html($nombre),
        esc_html($apellidos),
        esc_html($email),
        esc_html($telefono),
        nl2br(esc_html($mensaje)),
        $acepto_com ? 'Sí' : 'No'
    );

    $headers = [
        'Content-Type: text/html; charset=UTF-8',
        'Reply-To: ' . $nombre . ' ' . $apellidos . ' <' . $email . '>',
    ];

    $enviado = wp_mail($admin_email, $asunto, $cuerpo, $headers);

    if ($enviado) {
        wp_send_json_success(['msg' => '¡Formulario enviado correctamente! Nos pondremos en contacto contigo pronto.']);
    } else {
        wp_send_json_error(['msg' => 'Error al enviar el formulario. Por favor, inténtelo de nuevo.']);
    }
}
