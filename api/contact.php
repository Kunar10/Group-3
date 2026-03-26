<?php
header('Content-Type: application/json');
require_once '../db/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); echo json_encode(['error' => 'Method not allowed']); exit;
}

$name    = htmlspecialchars(strip_tags(trim($_POST['name'] ?? '')));
$email   = trim($_POST['email'] ?? '');
$subject = htmlspecialchars(strip_tags(trim($_POST['subject'] ?? '')));
$message = htmlspecialchars(strip_tags(trim($_POST['message'] ?? '')));

if (!$name || !$email || !$subject || !$message) {
    http_response_code(400); echo json_encode(['error' => 'All fields are required.']); exit;
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400); echo json_encode(['error' => 'Invalid email address.']); exit;
}

$db = getDB();
$stmt = $db->prepare("INSERT INTO contact_messages (full_name, email, subject, message) VALUES (?,?,?,?)");
$stmt->bind_param('ssss', $name, $email, $subject, $message);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Message sent successfully!']);
} else {
    http_response_code(500); echo json_encode(['error' => 'Failed to send message.']);
}
$stmt->close(); $db->close();
?>
