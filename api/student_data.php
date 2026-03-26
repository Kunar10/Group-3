<?php
session_start();
header('Content-Type: application/json');
require_once '../db/config.php';

if (empty($_SESSION['user_id']) || $_SESSION['user_role'] !== 'student') {
    http_response_code(401); echo json_encode(['error' => 'Unauthorized']); exit;
}

$db = getDB();
$action = $_GET['action'] ?? 'profile';

if ($action === 'profile') {
    $id = (int)$_SESSION['user_id'];
    $stmt = $db->prepare("SELECT reg_number, full_name, email, phone, course, year_of_study, study_mode, gender, nationality, status FROM students WHERE id = ?");
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $row = $stmt->get_result()->fetch_assoc();
    $courses = ['bit'=>'B.Sc. Information Technology','bcs'=>'B.Sc. Computer Science','dse'=>'Diploma Software Engineering','cwd'=>'Certificate Web Development'];
    if ($row) $row['course_name'] = $courses[$row['course']] ?? $row['course'];
    echo json_encode($row ?: ['error' => 'Profile not found']);
}

$db->close();
?>
