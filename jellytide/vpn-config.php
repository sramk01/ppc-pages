<?php
return [
    // You may use the same private ProxyCheck API key on all websites you own.
    'proxycheck_api_key' => '75o529-232791-99gq26-5l08bb',

    'block_vpn' => true,
    'block_proxy' => true,
    'block_tor' => true,
    'block_anonymous' => true,

    // Strict mode: blocks cloud/VPS/datacenter/server networks too.
    'block_hosting' => true,

    // Cache each IP result for 6 hours to reduce API usage.
    'cache_seconds' => 21600,

    // Keep the website online if ProxyCheck is temporarily unreachable.
    'fail_open' => true,

    // Optional trusted public IPs that should never be blocked.
    'allow_ips' => [
        // '203.0.113.10',
    ],
];