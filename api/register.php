<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

require_once '../db/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Sanitize helper
function clean($val) {
    return htmlspecialchars(strip_tags(trim($val)));
}

$required = ['full_name','date_of_birth','gender','nationality','national_id','phone',
             'email','district','address','course','entry_year','study_mode',
             'o_level_school','o_level_year','o_level_grade',
             'emergency_name','emergency_phone','emergency_relation','declaration'];

foreach ($required as $field) {
    if (empty($_POST[$field])) {
        http_response_code(400);
        echo json_encode(['error' => "Field '$field' is required."]);
        exit;
    }
}

if (!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid email address.']);
    exit;
}

$db = getDB();

// Check duplicate email
$stmt = $db->prepare("SELECT id FROM registrations WHERE email = ?");
$stmt->bind_param('s', $_POST['email']);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows > 0) {
    http_response_code(409);
    echo json_encode(['error' => 'An application with this email already exists.']);
    $stmt->close(); $db->close(); exit;
}
$stmt->close();

$stmt = $db->prepare("
    INSERT INTO registrations
    (full_name, date_of_birth, gender, nationality, national_id, phone, email,
     district, address, course, entry_year, study_mode,
     o_level_school, o_level_year, o_level_grade,
     a_level_school, a_level_year, a_level_grade,
     diploma_school, diploma_year, diploma_grade,
     emergency_name, emergency_phone, emergency_relation, declaration)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
");

$fn   = clean($_POST['full_name']);
$dob  = clean($_POST['date_of_birth']);
$gen  = clean($_POST['gender']);
$nat  = clean($_POST['nationality']);
$nid  = clean($_POST['national_id']);
$ph   = clean($_POST['phone']);
$em   = clean($_POST['email']);
$dis  = clean($_POST['district']);
$add  = clean($_POST['address']);
$crs  = clean($_POST['course']);
$ey   = (int)$_POST['entry_year'];
$sm   = clean($_POST['study_mode']);
$ols  = clean($_POST['o_level_school']);
$oly  = (int)$_POST['o_level_year'];
$olg  = clean($_POST['o_level_grade']);
$als  = clean($_POST['a_level_school'] ?? '');
$aly  = !empty($_POST['a_level_year']) ? (int)$_POST['a_level_year'] : null;
$alg  = clean($_POST['a_level_grade'] ?? '');
$dips = clean($_POST['diploma_school'] ?? '');
$dipy = !empty($_POST['diploma_year']) ? (int)$_POST['diploma_year'] : null;
$dipg = clean($_POST['diploma_grade'] ?? '');
$en   = clean($_POST['emergency_name']);
$ep   = clean($_POST['emergency_phone']);
$er   = clean($_POST['emergency_relation']);
$dec  = 1;

$stmt->bind_param('ssssssssssisssssisissssssi',
    $fn,$dob,$gen,$nat,$nid,$ph,$em,$dis,$add,$crs,$ey,$sm,
    $ols,$oly,$olg,$als,$aly,$alg,$dips,$dipy,$dipg,$en,$ep,$er,$dec
);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Registration submitted successfully!', 'id' => $db->insert_id]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to save registration: ' . $stmt->error]);
}

$stmt->close();
$db->close();
?>
