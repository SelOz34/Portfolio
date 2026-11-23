<?php

declare(strict_types=1);

// Contact form configuration.
$siteEmail = 's.oezbek@soz-studio.de';

$testMode = getenv('CONTACT_TEST_MODE') === '1';
$mailEnabled = getenv('CONTACT_ENABLE_MAIL') === '1';

// Allowed browser origins for local development.
$allowedOrigins = [
    'http://localhost:4200',
    'http://127.0.0.1:4200',
];

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function respond(int $status, array $data): never
{
    http_response_code($status);

    echo json_encode(
        $data,
        JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE
    );

    exit;
}

$origin = $_SERVER['HTTP_ORIGIN'] ?? null;

if ($origin !== null) {
    if (!in_array($origin, $allowedOrigins, true)) {
        respond(403, [
            'success' => false,
            'error' => 'Origin not allowed',
        ]);
    }

    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
}

$method = $_SERVER['REQUEST_METHOD'] ?? '';

if ($method === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($method !== 'POST') {
    header('Allow: POST, OPTIONS');

    respond(405, [
        'success' => false,
        'error' => 'Method not allowed',
    ]);
}

$contentType = $_SERVER['CONTENT_TYPE'] ?? '';

if (!preg_match(
    '~^application/json(?:\s*;|$)~i',
    $contentType
)) {
    respond(415, [
        'success' => false,
        'error' => 'Content type must be application/json',
    ]);
}

// Limit the request body to 16 KB.
$maxBodyBytes = 16384;
$contentLength = (int) ($_SERVER['CONTENT_LENGTH'] ?? 0);

if ($contentLength > $maxBodyBytes) {
    respond(413, [
        'success' => false,
        'error' => 'Request too large',
    ]);
}

$input = file_get_contents(
    'php://input',
    false,
    null,
    0,
    $maxBodyBytes + 1
);

if ($input === false || strlen($input) > $maxBodyBytes) {
    respond(413, [
        'success' => false,
        'error' => 'Request too large',
    ]);
}

try {
    $params = json_decode(
        $input,
        false,
        16,
        JSON_THROW_ON_ERROR
    );
} catch (JsonException $exception) {
    respond(400, [
        'success' => false,
        'error' => 'Invalid JSON',
    ]);
}

if (!is_object($params)) {
    respond(400, [
        'success' => false,
        'error' => 'Invalid JSON structure',
    ]);
}

$name = $params->name ?? null;
$email = $params->email ?? null;
$message = $params->message ?? null;
$website = $params->website ?? '';

if (
    !is_string($name) ||
    !is_string($email) ||
    !is_string($message) ||
    !is_string($website)
) {
    respond(400, [
        'success' => false,
        'error' => 'Invalid input types',
    ]);
}

// Optional honeypot field for basic bot detection.
if ($website !== '') {
    respond(400, [
        'success' => false,
        'error' => 'Invalid submission',
    ]);
}

$name = trim($name);
$email = trim($email);
$message = trim($message);

if (
    $name === '' ||
    strlen($name) > 200 ||
    !filter_var($email, FILTER_VALIDATE_EMAIL) ||
    strlen($email) > 254 ||
    $message === '' ||
    strlen($message) > 5000
) {
    respond(400, [
        'success' => false,
        'error' => 'Invalid input data',
    ]);
}

// Prepare escaped HTML email content.
$safeName = htmlspecialchars(
    $name,
    ENT_QUOTES | ENT_SUBSTITUTE,
    'UTF-8'
);

$safeEmail = htmlspecialchars(
    $email,
    ENT_QUOTES | ENT_SUBSTITUTE,
    'UTF-8'
);

$safeMessage = nl2br(
    htmlspecialchars(
        $message,
        ENT_QUOTES | ENT_SUBSTITUTE,
        'UTF-8'
    )
);

$subject = 'Website Contact Form';

$mailBody = "
    <strong>Name:</strong> {$safeName}<br>
    <strong>Email:</strong> {$safeEmail}<br><br>
    <strong>Message:</strong><br>
    {$safeMessage}
";

$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    'From: Website Contact <' . $siteEmail . '>',
    'Reply-To: ' . $email,
];

// Simulate processing without sending email.
if ($testMode) {
    respond(200, [
        'success' => true,
        'simulated' => true,
        'message' => 'Local test successful. No email was sent.',
    ]);
}

// Real email delivery must be explicitly enabled.
if (!$mailEnabled) {
    respond(503, [
        'success' => false,
        'error' => 'Email delivery is not configured',
    ]);
}

$success = mail(
    $siteEmail,
    $subject,
    $mailBody,
    implode("\r\n", $headers)
);

if (!$success) {
    respond(500, [
        'success' => false,
        'error' => 'Mail delivery failed',
    ]);
}

respond(200, [
    'success' => true,
    'simulated' => false,
]);
