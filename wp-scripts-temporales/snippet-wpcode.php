```php
add_action('rest_api_init', function() {
  // Aquí listamos todos tus Custom Post Types (he corregido schuco-pvc)
  $cpts = ['puertas-exteriores', 'divisorias', 'canales', 'techal', 'okma', 'dicores', 'mosquilux', 'schuco-pvc', 'banners', 'google-reviews', 'espacios-de-trabajo'];
  
  foreach ($cpts as $cpt) {
    // 1. Exponer campos de Rank Math SEO
    register_rest_field($cpt, 'seo_meta', [
      'get_callback' => fn($post) => [
        'title'       => get_post_meta($post['id'], 'rank_math_title', true),
        'description' => get_post_meta($post['id'], 'rank_math_description', true),
        'og_title'    => get_post_meta($post['id'], 'rank_math_og_title', true),
        'og_image'    => get_post_meta($post['id'], 'rank_math_og_image_url', true),
      ],
    ]);

    // 2. Exponer TODOS los campos de JetEngine automáticamente
    register_rest_field($cpt, 'meta', [
      'get_callback' => function($post) {
        $all_meta = get_post_meta($post['id']);
        $clean_meta = [];
        foreach ($all_meta as $key => $value) {
          // Ocultamos la "basura" interna de WordPress que empieza por guión bajo
          if (strpos($key, '_') !== 0) {
            // Deserializamos el valor (útil para campos repetidores o galerías)
            $val = maybe_unserialize($value[0]);
            $clean_meta[$key] = $val;
          }
        }
        return $clean_meta;
      }
    ]);
  }
});
```
