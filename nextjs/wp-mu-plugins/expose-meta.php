<?php
/**
 * expose-meta.php
 * Instalar en: wp-content/mu-plugins/expose-meta.php
 *
 * Expone todos los meta fields de JetEngine (CPT schuco-pvc) y Rank Math
 * vía la REST API de WordPress para que Next.js pueda consumirlos.
 */

add_action('rest_api_init', function () {

    // ── CPTs que tienen meta fields ────────────────────────────────────────
    $cpts_con_seo = [
        'schuco-pvc',
        'puertas-exteriores',
        'divisorias',
        'canales',
        'techal',
        'okma',
        'dicores',
        'mosquilux',
    ];

    // SEO meta (Rank Math) — aplica a todos los CPTs
    foreach ($cpts_con_seo as $cpt) {
        register_rest_field($cpt, 'seo_meta', [
            'get_callback' => function ($post) {
                return [
                    'title'       => get_post_meta($post['id'], 'rank_math_title', true),
                    'description' => get_post_meta($post['id'], 'rank_math_description', true),
                    'og_title'    => get_post_meta($post['id'], 'rank_math_og_title', true),
                    'og_image'    => get_post_meta($post['id'], 'rank_math_og_image_url', true),
                ];
            },
            'schema' => ['type' => 'object'],
        ]);
    }

    // ── Meta fields de schuco-pvc ──────────────────────────────────────────
    register_rest_field('schuco-pvc', 'meta', [
        'get_callback' => function ($post) {
            $id = $post['id'];

            // Helper: devuelve datos de imagen a partir de un ID guardado
            $img = function ($meta_key) use ($id) {
                $img_id = (int) get_post_meta($id, $meta_key, true);
                if (!$img_id) return null;
                $data = wp_get_attachment_image_src($img_id, 'full');
                return $data ? [
                    'id'     => $img_id,
                    'url'    => $data[0],
                    'width'  => $data[1],
                    'height' => $data[2],
                    'alt'    => get_post_meta($img_id, '_wp_attachment_image_alt', true),
                ] : null;
            };

            // Helper: convierte un array de IDs (gallery) en array de objetos
            $gallery = function ($meta_key) use ($id, $img) {
                $raw = get_post_meta($id, $meta_key, true);
                if (empty($raw)) return [];
                $ids = is_array($raw) ? $raw : explode(',', $raw);
                return array_filter(array_map(function ($img_id) use ($img) {
                    // Reutilizamos el helper pasando el ID directamente
                    $img_id = (int) $img_id;
                    if (!$img_id) return null;
                    $data = wp_get_attachment_image_src($img_id, 'full');
                    return $data ? [
                        'id'  => $img_id,
                        'url' => $data[0],
                        'alt' => get_post_meta($img_id, '_wp_attachment_image_alt', true),
                    ] : null;
                }, $ids));
            };

            // Helper: tripleta prestación técnica
            $prestacion = function ($key_icono, $key_texto, $key_valor) use ($id, $img) {
                return [
                    'icono' => $img($key_icono),
                    'texto' => get_post_meta($id, $key_texto, true) ?: '',
                    'valor' => get_post_meta($id, $key_valor, true) ?: '',
                ];
            };

            $t = function ($key) use ($id) {
                return get_post_meta($id, $key, true) ?: '';
            };

            return [
                // Fotos
                'foto-encabezado' => $img('foto-encabezado'),
                'foto-listing'    => $img('foto-listing'),
                'foto-cad'        => $gallery('foto-cad'),

                // Diseño
                'nombre-fabricante'          => $t('nombre-fabricante'),
                'nombre-producto'            => $t('nombre-producto'),
                'descripcion--producto'      => $t('descripcion--producto'),
                'color-fondo-producto'       => $t('color-fondo-producto'),
                'descripcion-larga-producto' => $t('descripcion-larga-producto'),
                'descripcion-corta-listing'  => $t('descripcion-corta-listing'),

                // Videos
                'enlace-video' => $t('enlace-video'),
                'video'        => $img('video'),

                // Slider x4
                'nombre_slider1'          => $t('nombre_slider1'),
                'contenido_slider_uno'    => $t('contenido_slider_uno'),
                'imagen_slider_uno'       => $img('imagen_slider_uno'),
                'nombre_slider2'          => $t('nombre_slider2'),
                'contenido_slider_dos'    => $t('contenido_slider_dos'),
                'imagen_slider_dos'       => $img('imagen_slider_dos'),
                'nombre_slider2_tres'     => $t('nombre_slider2_tres'),
                'contenido_slider_tres'   => $t('contenido_slider_tres'),
                'imagen_slider_tres'      => $img('imagen_slider_tres'),
                'nombre_slider2_cuatro'   => $t('nombre_slider2_cuatro'),
                'contenido_slider_cuatro' => $t('contenido_slider_cuatro'),
                'imagen_slider_cuatro'    => $img('imagen_slider_cuatro'),

                // Prestaciones técnicas
                'profundidad_marco'    => $prestacion('icono_profundidad_marco',   'texto_profundidad_marco',   'valor_profundidad_marco'),
                'profundidad_hoja'     => $prestacion('icono_profundidad_hoja',    'texto_profundidad_hoja',    'valor_profundidad_hoja'),
                'tipos_hojas'          => $prestacion('icono_tipos_hojas',         'texto_tipos_de_hojas',      'valor_tipos_de_hojas'),
                'camaras'              => $prestacion('icono_camaras-living',      'texto_camaras_living',      'valor_camara_living'),
                'niveles_juntas'       => $prestacion('icono_niveles_juntas',      'texto_niveles_juntas',      'valor_niveles_juntas'),
                'refuerzos'            => $prestacion('icono_refuerzos',           'texto_tipos_refuerzos',     'valor_refuerzo'),
                'acristalamiento'      => $prestacion('icono_acristalamiento',     'texto_acristalamiento',     'acristalamiento'),
                'aislamiento_termico'  => $prestacion('icono_aislamiento_termico', 'aislamiento_termico',       'valor_aislamiento-termico'),
                'aislamiento_acustico' => $prestacion('icono_aislamiento_acustico','aislamiento_acustico',      'valor_aislamiento-acustico'),
                'seguridad'            => $prestacion('icono_seguridad',           'seguridad',                 'valor_seguridad'),
                'permeabilidad_aire'   => $prestacion('icono_permeabilidad_aire',  'permeabilidad_aire',        'valor_permeabilidad_aire'),
                'estanqueidad_agua'    => $prestacion('icono_estanqueidad',        'estanqueidad_agua',         'valor_estanqueidad_agua'),
                'resistencia_viento'   => $prestacion('icono_viento',              'resistencia_viento',        'valor_resistencia_viento'),
                'peso_maximo_hoja'     => $prestacion('icono_acabado_copy',        'peso-maximo_hoja',          'peso-maximo'),
                'acabado_superficies'  => $prestacion('icono_acabado',             'texto_acabado_superficies', 'valor_acabado_superficies'),
                // medidas máximas
                'texto_altura_blanco'  => $t('texto_altura_blanco'),
                'max-blanco'           => $t('max-blanco'),
                'texto_altura_color'   => $t('texto_altura_color'),
                'max-color'            => $t('max-color'),
                'umbral'               => $t('umbral'),
                'valor_umbral'         => $t('valor_umbral'),

                // Acabados
                'lisos'      => $gallery('lisos'),
                'texturados' => $gallery('texturados'),
                'topalum'    => $gallery('topalum'),

                // Inspírate
                'inspirate1' => $img('inspirate1'),
                'inspirate2' => $img('inspirate2'),
                'inspirate3' => $img('inspirate3'),
                'inspirate4' => $img('inspirate4'),

                // Enlaces popup
                'enlace_aislamiento_termico'        => $t('enlace_aislamiento_termico'),
                'enlace_aislamiento_termico_perfil' => $t('enlace_aislamiento_termico_perfil'),
                'enlace_aislamiento_acustico'        => $t('enlace_aislamiento_acustico'),
                'enlace_permeabilidad'               => $t('enlace_permeabilidad'),
                'enlace_estanqueidad'                => $t('enlace_estanqueidad'),
                'enlace_seguridad'                   => $t('enlace_seguridad'),
                'enlace_resistencia'                 => $t('enlace_resistencia'),

                // Catálogo
                'link-descarga'        => $t('link-descarga'),
                'link-descarga_flibox' => $t('link-descarga_flibox'),
                'shortcode'            => $t('shortcode'),

                // Datos listing
                'aplicacion'    => $t('aplicacion'),
                'guia_inferior' => $t('guia_inferior'),
                'orden'         => (int) $t('orden'),
                'link-listing'  => $t('link-listing'),

                // Iconos beneficio x6
                'icono-1' => $img('icono-1'), 'texto-icono-1' => $t('texto-icono-1'),
                'icono-2' => $img('icono-2'), 'texto-icono-2' => $t('texto-icono-2'),
                'icono-3' => $img('icono-3'), 'texto-icono-3' => $t('texto-icono-3'),
                'icono-4' => $img('icono-4'), 'texto-icono-4' => $t('texto-icono-4'),
                'icono-5' => $img('icono-5'), 'texto-icono-5' => $t('texto-icono-5'),
                'icono-6' => $img('icono-6'), 'texto-icono-6' => $t('texto-icono-6'),
            ];
        },
        'schema' => ['type' => 'object'],
    ]);
});
