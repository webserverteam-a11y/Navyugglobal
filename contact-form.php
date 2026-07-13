<?php
/**
 * Navyug contact form handler
 * Upload this file to your Hostinger public_html folder.
 * Set your SendGrid API key in the $SENDGRID_API_KEY variable below.
 *
 * Endpoint: https://yourdomain.com/contact-form.php
 */

// ─── Configuration ───────────────────────────────────────────────────────────
// Real key is read from the SENDGRID_API_KEY environment variable if set;
// otherwise paste your key in place of the placeholder below.
// On Hostinger: edit this line in File Manager and replace the placeholder with your real SG.xxxx key.
$SENDGRID_API_KEY = getenv('SENDGRID_API_KEY') ?: 'YOUR_SENDGRID_API_KEY_HERE';
$TO_EMAILS        = [
    'navyugglobalventures@gmail.com',
    'dishan.m@ditechcdm.com',   // REMOVE before going live
    'shubham.s@ditechcdm.com',  // REMOVE before going live
];
$FROM_EMAIL       = 'navyugglobalventures@gmail.com';       // Must be verified in SendGrid
$FROM_NAME        = 'Navyug Global Ventures';
// ─────────────────────────────────────────────────────────────────────────────

define('MAX_ATTACHMENTS', 5);
define('MAX_FILE_BYTES', 20 * 1024 * 1024);   // 20 MB per file
define('MAX_TOTAL_BYTES', 20 * 1024 * 1024);  // 20 MB total

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['message' => 'Method not allowed.']);
    exit;
}

// ─── Validate config ─────────────────────────────────────────────────────────
if (empty(trim($SENDGRID_API_KEY)) || trim($SENDGRID_API_KEY) === 'YOUR_SENDGRID_API_KEY_HERE') {
    http_response_code(500);
    echo json_encode(['message' => 'Mail service not configured.']);
    exit;
}

// ─── Read & sanitise fields ───────────────────────────────────────────────────
$firstName = trim(strip_tags($_POST['firstName'] ?? ''));
$lastName  = trim(strip_tags($_POST['lastName']  ?? ''));
$email     = trim(filter_var($_POST['email'] ?? '', FILTER_SANITIZE_EMAIL));
$phone     = trim(strip_tags($_POST['phone']     ?? ''));
$company   = trim(strip_tags($_POST['company']   ?? ''));
$jobTitle  = trim(strip_tags($_POST['jobTitle']  ?? ''));
$message   = trim(strip_tags($_POST['message']   ?? ''));
$website   = trim(strip_tags($_POST['website']   ?? '')); // honeypot

// ─── Honeypot ─────────────────────────────────────────────────────────────────
if ($website !== '') {
    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'Message sent successfully.']);
    exit;
}

// ─── Validation ──────────────────────────────────────────────────────────────
if (!$firstName || !$lastName || !$email || !$phone || !$message) {
    http_response_code(422);
    echo json_encode(['message' => 'Please complete all required fields.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['message' => 'Please enter a valid email address.']);
    exit;
}

// ─── Attachments ─────────────────────────────────────────────────────────────
$attachments = [];

if (!empty($_FILES['attachments'])) {
    $files = normalise_files($_FILES['attachments']);

    if (count($files) > MAX_ATTACHMENTS) {
        http_response_code(422);
        echo json_encode(['message' => 'Maximum 5 files allowed.']);
        exit;
    }

    $allowed_types = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/png',
        'application/zip',
        'application/x-zip-compressed',
    ];

    $total_bytes = 0;

    foreach ($files as $file) {
        if (empty($file['name']) || empty($file['tmp_name']) || $file['error'] !== UPLOAD_ERR_OK) {
            continue;
        }

        if ($file['size'] > MAX_FILE_BYTES) {
            http_response_code(422);
            echo json_encode(['message' => 'Each file must be less than 20MB.']);
            exit;
        }

        $total_bytes += $file['size'];
        if ($total_bytes > MAX_TOTAL_BYTES) {
            http_response_code(422);
            echo json_encode(['message' => 'Total upload size must be under 20MB.']);
            exit;
        }

        $finfo    = new finfo(FILEINFO_MIME_TYPE);
        $mime     = $finfo->file($file['tmp_name']);
        $ext_mime = mime_content_type($file['tmp_name']);

        if (!in_array($mime, $allowed_types, true) && !in_array($ext_mime, $allowed_types, true)) {
            http_response_code(422);
            echo json_encode(['message' => 'Only PDF, DOC, DOCX, JPG, PNG, and ZIP files are allowed.']);
            exit;
        }

        $content = file_get_contents($file['tmp_name']);
        if ($content === false) {
            http_response_code(422);
            echo json_encode(['message' => 'Could not read an uploaded file.']);
            exit;
        }

        $attachments[] = [
            'content'     => base64_encode($content),
            'type'        => $mime,
            'filename'    => basename($file['name']),
            'disposition' => 'attachment',
        ];
    }
}

// ─── Build SendGrid payload ───────────────────────────────────────────────────
$to = array_map(fn($e) => ['email' => $e], $TO_EMAILS);

$subject  = "New pitch enquiry from $firstName $lastName";
$html     = build_email_html($firstName, $lastName, $email, $phone, $company, $jobTitle, $message);

$payload = [
    'personalizations' => [['to' => $to, 'subject' => $subject]],
    'from'             => ['email' => $FROM_EMAIL, 'name' => $FROM_NAME],
    'reply_to'         => ['email' => $email, 'name' => "$firstName $lastName"],
    'content'          => [['type' => 'text/html', 'value' => $html]],
];

if (!empty($attachments)) {
    $payload['attachments'] = $attachments;
}

// ─── Send via SendGrid ────────────────────────────────────────────────────────
$ch = curl_init('https://api.sendgrid.com/v3/mail/send');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => json_encode($payload),
    CURLOPT_HTTPHEADER     => [
        'Authorization: Bearer ' . $SENDGRID_API_KEY,
        'Content-Type: application/json',
    ],
    CURLOPT_TIMEOUT        => 20,
]);

$response    = curl_exec($ch);
$status_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curl_error  = curl_error($ch);
curl_close($ch);

if ($curl_error || $status_code < 200 || $status_code >= 300) {
    error_log("SendGrid error ($status_code): $response | cURL: $curl_error");
    http_response_code(502);
    echo json_encode(['message' => 'Could not send your message. Please try again.']);
    exit;
}

http_response_code(200);
echo json_encode(['success' => true, 'message' => 'Message sent successfully.']);

// ─── Helpers ─────────────────────────────────────────────────────────────────
function normalise_files(array $file_group): array
{
    if (!is_array($file_group['name'])) {
        return [$file_group];
    }

    $files = [];
    foreach ($file_group['name'] as $i => $name) {
        $files[] = [
            'name'     => $name,
            'type'     => $file_group['type'][$i]     ?? '',
            'tmp_name' => $file_group['tmp_name'][$i] ?? '',
            'error'    => $file_group['error'][$i]    ?? UPLOAD_ERR_NO_FILE,
            'size'     => $file_group['size'][$i]     ?? 0,
        ];
    }
    return $files;
}

function esc(string $s): string
{
    return htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function build_email_html(
    string $firstName,
    string $lastName,
    string $email,
    string $phone,
    string $company,
    string $jobTitle,
    string $message
): string {
    $rows = [
        'First Name' => esc($firstName),
        'Last Name'  => esc($lastName),
        'Email'      => esc($email),
        'Phone'      => esc($phone),
        'Company'    => esc($company) ?: '-',
        'Job Title'  => esc($jobTitle) ?: '-',
        'Message'    => nl2br(esc($message)),
    ];

    $html_rows = '';
    foreach ($rows as $label => $value) {
        $html_rows .= "
        <tr>
          <td style='padding:8px 12px;border:1px solid #e5e7eb;font-weight:600;width:140px;white-space:nowrap;'>$label</td>
          <td style='padding:8px 12px;border:1px solid #e5e7eb;'>$value</td>
        </tr>";
    }

    return "
    <div style='font-family:Arial,sans-serif;color:#111827;max-width:740px;margin:0 auto;'>
      <h2 style='color:#1e3a5f;margin-bottom:20px;'>New Navyug contact form submission</h2>
      <table style='border-collapse:collapse;width:100%;'>$html_rows</table>
    </div>";
}
