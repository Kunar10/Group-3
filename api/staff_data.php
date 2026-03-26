<?php
session_start();
header('Content-Type: application/json');
require_once '../db/config.php';

if (empty($_SESSION['user_id']) || $_SESSION['user_role'] !== 'staff') {
    http_response_code(401); echo json_encode(['error' => 'Unauthorized']); exit;
}

$db = getDB();
$action = $_GET['action'] ?? 'profile';

if ($action === 'profile') {
    $id = (int)$_SESSION['user_id'];
    $stmt = $db->prepare("SELECT staff_id, full_name, email, phone, role, department, qualification, status FROM staff WHERE id = ?");
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $row = $stmt->get_result()->fetch_assoc();
    echo json_encode($row ?: ['error' => 'Profile not found']);
}

$db->close();
?>
