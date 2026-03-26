<?php
session_start();
header('Content-Type: application/json');
require_once '../db/config.php';

if (empty($_SESSION['admin_id'])) {
    http_response_code(401); echo json_encode(['error' => 'Unauthorized']); exit;
}

$db = getDB();
$action = $_GET['action'] ?? 'list';

if ($action === 'list') {
    $status = $_GET['status'] ?? '';
    $search = $_GET['search'] ?? '';
    $sql = "SELECT id, full_name, email, phone, course, study_mode, status, submitted_at FROM registrations WHERE 1=1";
    $params = []; $types = '';
    if ($status) { $sql .= " AND status = ?"; $params[] = $status; $types .= 's'; }
    if ($search) { $sql .= " AND (full_name LIKE ? OR email LIKE ? OR national_id LIKE ?)";
        $s = "%$search%"; $params[] = $s; $params[] = $s; $params[] = $s; $types .= 'sss'; }
    $sql .= " ORDER BY submitted_at DESC";
    $stmt = $db->prepare($sql);
    if ($params) { $stmt->bind_param($types, ...$params); }
    $stmt->execute();
    $result = $stmt->get_result();
    $rows = [];
    while ($row = $result->fetch_assoc()) $rows[] = $row;
    echo json_encode($rows);

} elseif ($action === 'detail') {
    $id = (int)($_GET['id'] ?? 0);
    $stmt = $db->prepare("SELECT * FROM registrations WHERE id = ?");
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $row = $stmt->get_result()->fetch_assoc();
    echo json_encode($row ?: ['error' => 'Not found']);

} elseif ($action === 'update_status' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = (int)($_POST['id'] ?? 0);
    $status = $_POST['status'] ?? '';
    if (!in_array($status, ['pending','approved','rejected'])) {
        http_response_code(400); echo json_encode(['error' => 'Invalid status']); exit;
    }
    $stmt = $db->prepare("UPDATE registrations SET status = ? WHERE id = ?");
    $stmt->bind_param('si', $status, $id);
    $stmt->execute();
    echo json_encode(['success' => true]);

} elseif ($action === 'messages') {
    $stmt = $db->prepare("SELECT id, full_name, email, subject, is_read, submitted_at FROM contact_messages ORDER BY submitted_at DESC LIMIT 20");
    $stmt->execute();
    $result = $stmt->get_result();
    $rows = [];
    while ($row = $result->fetch_assoc()) $rows[] = $row;
    echo json_encode($rows);

} elseif ($action === 'stats') {
    $stats = [];
    foreach (['pending','approved','rejected'] as $s) {
        $r = $db->query("SELECT COUNT(*) as c FROM registrations WHERE status='$s'");
        $stats[$s] = (int)$r->fetch_assoc()['c'];
    }
    $r = $db->query("SELECT COUNT(*) as c FROM registrations");
    $stats['total'] = (int)$r->fetch_assoc()['c'];
    $r = $db->query("SELECT COUNT(*) as c FROM contact_messages WHERE is_read=0");
    $stats['unread_messages'] = (int)$r->fetch_assoc()['c'];
    echo json_encode($stats);

} elseif ($action === 'logout') {
    session_destroy();
    echo json_encode(['success' => true]);
}

$db->close();
?>
