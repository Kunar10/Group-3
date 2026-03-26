<?php
session_start();
header('Content-Type: application/json');
require_once '../db/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); echo json_encode(['error' => 'Method not allowed']); exit;
}

$role     = trim($_POST['role'] ?? '');
$username = trim($_POST['username'] ?? '');
$password = trim($_POST['password'] ?? '');

if (!$role || !$username || !$password) {
    http_response_code(400); echo json_encode(['error' => 'All fields are required.']); exit;
}

$db = getDB();

if ($role === 'admin') {
    $stmt = $db->prepare("SELECT id, password_hash, username FROM admins WHERE username = ?");
    $stmt->bind_param('s', $username);
    $stmt->execute();
    $stmt->bind_result($id, $hash, $uname);
    $stmt->fetch(); $stmt->close();
    if ($id && password_verify($password, $hash)) {
        $_SESSION['user_id'] = $id;
        $_SESSION['user_role'] = 'admin';
        $_SESSION['user_name'] = $uname;
        echo json_encode(['success' => true, 'role' => 'admin', 'redirect' => 'admin/dashboard.html']);
    } else {
        http_response_code(401); echo json_encode(['error' => 'Invalid admin credentials.']);
    }

} elseif ($role === 'student') {
    $stmt = $db->prepare("SELECT id, password_hash, full_name, course, year_of_study, status FROM students WHERE reg_number = ? OR email = ?");
    $stmt->bind_param('ss', $username, $username);
    $stmt->execute();
    $stmt->bind_result($id, $hash, $name, $course, $year, $status);
    $stmt->fetch(); $stmt->close();
    if ($id && password_verify($password, $hash)) {
        if ($status !== 'active') {
            http_response_code(403); echo json_encode(['error' => 'Your account is ' . $status . '. Contact the department.']); exit;
        }
        $_SESSION['user_id'] = $id;
        $_SESSION['user_role'] = 'student';
        $_SESSION['user_name'] = $name;
        $_SESSION['user_course'] = $course;
        $_SESSION['user_year'] = $year;
        echo json_encode(['success' => true, 'role' => 'student', 'redirect' => 'student/dashboard.html']);
    } else {
        http_response_code(401); echo json_encode(['error' => 'Invalid registration number or password.']);
    }

} elseif ($role === 'staff') {
    $stmt = $db->prepare("SELECT id, password_hash, full_name, role, status FROM staff WHERE staff_id = ? OR email = ?");
    $stmt->bind_param('ss', $username, $username);
    $stmt->execute();
    $stmt->bind_result($id, $hash, $name, $staffRole, $status);
    $stmt->fetch(); $stmt->close();
    if ($id && password_verify($password, $hash)) {
        if ($status !== 'active') {
            http_response_code(403); echo json_encode(['error' => 'Your account is inactive. Contact admin.']); exit;
        }
        $_SESSION['user_id'] = $id;
        $_SESSION['user_role'] = 'staff';
        $_SESSION['user_name'] = $name;
        $_SESSION['user_staff_role'] = $staffRole;
        echo json_encode(['success' => true, 'role' => 'staff', 'redirect' => 'staff/dashboard.html']);
    } else {
        http_response_code(401); echo json_encode(['error' => 'Invalid staff ID or password.']);
    }

} else {
    http_response_code(400); echo json_encode(['error' => 'Invalid role selected.']);
}

$db->close();
?>
