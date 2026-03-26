<?php
session_start();
header('Content-Type: application/json');
require_once '../db/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); echo json_encode(['error' => 'Method not allowed']); exit;
}

$username = trim($_POST['username'] ?? '');
$password = trim($_POST['password'] ?? '');

if (!$username || !$password) {
    http_response_code(400); echo json_encode(['error' => 'Username and password required']); exit;
}

$db = getDB();
$stmt = $db->prepare("SELECT id, password_hash FROM admins WHERE username = ?");
$stmt->bind_param('s', $username);
$stmt->execute();
$stmt->bind_result($id, $hash);
$stmt->fetch();
$stmt->close();
$db->close();

if ($id && password_verify($password, $hash)) {
    $_SESSION['admin_id'] = $id;
    $_SESSION['admin_user'] = $username;
    echo json_encode(['success' => true]);
} else {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid credentials']);
}
?>
