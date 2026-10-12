<?php
$config = require __DIR__ . '/vpn-config.php';

function vg_public_ip(string $ip): bool {
    return filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) !== false;
}

function vg_client_ip(): string {
    $remote = trim((string)($_SERVER['REMOTE_ADDR'] ?? ''));
    if ($remote !== '' && vg_public_ip($remote)) return $remote;

    // Only trust forwarding headers when REMOTE_ADDR itself is private/reserved,
    // which is common behind a hosting reverse proxy.
    foreach (['HTTP_X_FORWARDED_FOR','HTTP_X_REAL_IP','HTTP_CLIENT_IP'] as $h) {
        if (empty($_SERVER[$h])) continue;
        foreach (explode(',', (string)$_SERVER[$h]) as $candidate) {
            $candidate = trim($candidate);
            if (preg_match('/^((?:\d{1,3}\.){3}\d{1,3}):\d+$/', $candidate, $m)) $candidate = $m[1];
            if (vg_public_ip($candidate)) return $candidate;
        }
    }
    return $remote;
}

function vg_requested_file(): ?string {
    $file = isset($_GET['file']) ? rawurldecode((string)$_GET['file']) : 'index.html';
    $file = ltrim(str_replace('\\', '/', $file), '/');
    if ($file === '' || !str_ends_with(strtolower($file), '.html') || str_contains($file, "\0")) return null;

    $root = realpath(__DIR__);
    $real = realpath(__DIR__ . '/' . $file);
    if ($root === false || $real === false || !is_file($real)) return null;

    $rootPrefix = rtrim($root, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR;
    if ($real !== $root . DIRECTORY_SEPARATOR . basename($real) && !str_starts_with($real, $rootPrefix)) return null;
    if (!str_starts_with($real, $rootPrefix)) return null;
    return $real;
}

function vg_cache_path(string $ip): string {
    $dir = __DIR__ . '/.vpn-cache';
    if (!is_dir($dir)) @mkdir($dir, 0755, true);
    return $dir . '/proxycheck-' . hash('sha256', $ip) . '.json';
}

function vg_cache_get(string $ip, int $ttl): ?array {
    $path = vg_cache_path($ip);
    if (!is_file($path) || time() - (int)@filemtime($path) > $ttl) return null;
    $d = json_decode((string)@file_get_contents($path), true);
    return is_array($d) ? $d : null;
}
function vg_cache_put(string $ip, array $d): void {
    @file_put_contents(vg_cache_path($ip), json_encode($d, JSON_UNESCAPED_SLASHES), LOCK_EX);
}

function vg_verified_search_bot(string $ip): bool {
    if (!vg_public_ip($ip)) return false;
    $host = @gethostbyaddr($ip);
    if (!$host || $host === $ip) return false;
    $host = strtolower(rtrim($host, '.'));
    $ok = false;
    foreach (['.googlebot.com','.google.com','.search.msn.com'] as $suffix) {
        if (strlen($host) > strlen($suffix) && substr($host, -strlen($suffix)) === $suffix) { $ok = true; break; }
    }
    if (!$ok) return false;
    $records = @dns_get_record($host, DNS_A | DNS_AAAA);
    if (!is_array($records)) return false;
    foreach ($records as $r) {
        if (($r['ip'] ?? null) === $ip || ($r['ipv6'] ?? null) === $ip) return true;
    }
    return false;
}

function vg_bool($v): bool {
    if (is_bool($v)) return $v;
    if (is_numeric($v)) return (bool)$v;
    return in_array(strtolower(trim((string)$v)), ['1','true','yes','y'], true);
}

function vg_lookup(string $ip, string $key): ?array {
    $hostTag = preg_replace('/[^A-Za-z0-9._-]/', '-', (string)($_SERVER['HTTP_HOST'] ?? 'static-site'));
    $url = 'https://proxycheck.io/v3/' . rawurlencode($ip)
         . '?key=' . rawurlencode($key)
         . '&p=0&tag=' . rawurlencode($hostTag);

    $body = false; $http = 0;
    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CONNECTTIMEOUT => 4,
            CURLOPT_TIMEOUT => 7,
            CURLOPT_FOLLOWLOCATION => false,
            CURLOPT_SSL_VERIFYPEER => true,
            CURLOPT_HTTPHEADER => ['Accept: application/json'],
            CURLOPT_USERAGENT => 'StaticSite-ProxyCheck-Gate/1.0',
        ]);
        $body = curl_exec($ch);
        $http = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        if ($body === false || $http < 200 || $http >= 300) return null;
    } else {
        $ctx = stream_context_create(['http' => ['timeout'=>7,'ignore_errors'=>true,'header'=>"Accept: application/json\r\nUser-Agent: StaticSite-ProxyCheck-Gate/1.0\r\n"]]);
        $body = @file_get_contents($url, false, $ctx);
        if ($body === false) return null;
    }

    $data = json_decode((string)$body, true);
    if (!is_array($data)) return null;
    $status = strtolower((string)($data['status'] ?? ''));
    if ($status !== 'ok' && $status !== 'warning') return null;
    $entry = $data[$ip] ?? null;
    return is_array($entry) ? $entry : null;
}

function vg_decision(array $entry, array $config): array {
    $d = is_array($entry['detections'] ?? null) ? $entry['detections'] : [];
    $anonymous = vg_bool($d['anonymous'] ?? ($entry['anonymous'] ?? false));
    $vpn = vg_bool($d['vpn'] ?? ($entry['vpn'] ?? false));
    $proxy = vg_bool($d['proxy'] ?? ($entry['proxy'] ?? false));
    $tor = vg_bool($d['tor'] ?? ($d['TOR'] ?? ($entry['tor'] ?? false)));

    $network = is_array($entry['network'] ?? null) ? $entry['network'] : [];
    $hosting = strtolower(trim((string)($network['type'] ?? ''))) === 'hosting'
        || vg_bool($d['hosting'] ?? ($entry['hosting'] ?? false));

    $operator = is_array($entry['operator'] ?? null) ? $entry['operator'] : [];
    $services = is_array($operator['services'] ?? null) ? $operator['services'] : [];
    $serviceText = strtolower(implode(' ', array_map(static fn($v) => is_scalar($v) ? (string)$v : '', $services)));
    if ($serviceText !== '') {
        if (str_contains($serviceText, 'proxy')) { $proxy = true; $anonymous = true; }
        if (str_contains($serviceText, 'vpn')) { $vpn = true; $anonymous = true; }
        if (str_contains($serviceText, 'tor')) { $tor = true; $anonymous = true; }
    }

    $reasons = [];
    if (!empty($config['block_vpn']) && $vpn) $reasons[] = 'VPN';
    if (!empty($config['block_proxy']) && $proxy) $reasons[] = 'Proxy';
    if (!empty($config['block_tor']) && $tor) $reasons[] = 'Tor';
    if (!empty($config['block_anonymous']) && $anonymous) $reasons[] = 'Anonymous';
    if (!empty($config['block_hosting']) && $hosting) $reasons[] = 'Hosting/Datacenter';

    return ['blocked'=>!empty($reasons),'reasons'=>$reasons,'checked_at'=>time()];
}

function vg_serve(string $file): never {
    header('Content-Type: text/html; charset=UTF-8');
    header('X-Static-Site-Protection: ProxyCheck');
    readfile($file);
    exit;
}

$file = vg_requested_file();
if ($file === null) {
    http_response_code(404);
    $nf = __DIR__ . '/404.html';
    if (is_file($nf)) vg_serve($nf);
    exit('404 Not Found');
}

$ip = vg_client_ip();
if ($ip === '' || !vg_public_ip($ip)) vg_serve($file);
if (in_array($ip, $config['allow_ips'] ?? [], true)) vg_serve($file);
if (vg_verified_search_bot($ip)) vg_serve($file);

$key = trim((string)($config['proxycheck_api_key'] ?? ''));
if ($key === '' || $key === 'PASTE_YOUR_PROXYCHECK_API_KEY_HERE') vg_serve($file);

$ttl = max(300, (int)($config['cache_seconds'] ?? 21600));
$decision = vg_cache_get($ip, $ttl);
if ($decision === null) {
    $lookup = vg_lookup($ip, $key);
    if ($lookup === null) {
        if (!empty($config['fail_open'])) vg_serve($file);
        $decision = ['blocked'=>true,'reasons'=>['Verification unavailable'],'checked_at'=>time()];
    } else {
        $decision = vg_decision($lookup, $config);
    }
    vg_cache_put($ip, $decision);
}

if (!empty($decision['blocked'])) {
    http_response_code(403);
    header('Content-Type: text/html; charset=UTF-8');
    header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
    header('Pragma: no-cache');
    header('X-Robots-Tag: noindex, nofollow', true);
    header('X-Static-Site-Protection: ProxyCheck');

    // Plain server-style 403 page. No custom VPN/proxy message or branding.
    exit('
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>403 Forbidden</title>

    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        html,
        body {
            width: 100%;
            height: 100%;
        }

        body {
            background: #ffffff;
            font-family: Arial, Helvetica, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
        }

        .error-page {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }

        .error-code {
            font-size: 120px;
            line-height: 1;
            font-weight: 700;
            color: #333333;
            letter-spacing: -6px;
        }

        .error-message {
            margin-top: 18px;
            font-size: 24px;
            line-height: 1.2;
            font-weight: 600;
            color: #333333;
        }

        @media (max-width: 600px) {
            .error-code {
                font-size: 90px;
                letter-spacing: -4px;
            }

            .error-message {
                font-size: 21px;
            }
        }
    </style>
</head>

<body>

    <div class="error-page">
        <div class="error-code">403</div>
        <div class="error-message">Forbidden</div>
    </div>

</body>
</html>
');
}

vg_serve($file);