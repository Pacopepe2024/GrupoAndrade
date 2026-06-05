<?php
/**
 * Plugin Name: Grupo Andrade - Expose Meta
 * Description: Expone los meta fields de JetEngine y Rank Math via REST API.
 */

add_action('rest_api_init', function() {
  $cpts = ['puertas-exteriores', 'divisorias', 'canales', 'techal', 'okma', 'dicores', 'mosquilux', 'schueco-pvc', 'banners', 'google-reviews', 'oficinas'];
  
  foreach ($cpts as $cpt) {
    register_rest_field($cpt, 'seo_meta', [
      'get_callback' => fn($post) => [
        'title'       => get_post_meta($post['id'], 'rank_math_title', true),
        'description' => get_post_meta($post['id'], 'rank_math_description', true),
        'og_title'    => get_post_meta($post['id'], 'rank_math_og_title', true),
        'og_image'    => get_post_meta($post['id'], 'rank_math_og_image_url', true),
      ],
    ]);
  }
});
