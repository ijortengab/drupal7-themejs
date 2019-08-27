<?php

/**
 * Memberikan informasi theme function in Javascript.
 *
 * Contoh:
 * Project Module/Theme mempunyai theme function di javascript sebagai berikut:
 *
 * ```
 * Drupal.theme.prototype.empty_string = function () {
 *   return '';
 * }
 * ```
 * Maka hook perlu memberikan associative array dengan key yakni `empty_string`.
 * Adapun informasi value yang diberikan merupakan associative array dengan
 * setidaknya terdapat key berupa `title`.
 */
function hook_themejs() {
    $items['empty_string'] = [
        // Required.
        'title' => 'Empty String',
        // Optional.
        'description' => 'A simple way to remove entire data in columns.',
        // Advanced.
        'available' => [
            '\\Drupal\\module_a\\Controller\\Action',
            '\\Drupal\\module_b\\Controller\\Action',
        ],
        'handler' => '\\Drupal\\module_b\\Controller\\Action',
    ];
    return $items;
}
