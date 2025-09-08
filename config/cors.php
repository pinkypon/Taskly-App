<?php

// cors.phpasdsa
return [
    'paths' => ['api/*', 'login', 'logout', 'register', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://taskly.test',         // Laravel
        'http://taskly.test:5174',    // ✅ Vite dev server
        'https://taskly-d79v.onrender.com',
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];


// 'paths' => ['api/*', 'login', 'logout', 'register', 'sanctum/csrf-cookie'],

// 'allowed_methods' => ['*'],

// 'allowed_origins' => [
//     'http://taskly.test',         // Laravel
//     'http://taskly.test:5174',    // ✅ Vite dev server
// ],

// 'allowed_origins_patterns' => [],

// 'allowed_headers' => ['*'],

// 'exposed_headers' => [],

// 'max_age' => 0,

// 'supports_credentials' => true,