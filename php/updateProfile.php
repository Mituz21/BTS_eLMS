<?php
header('Content-Type: application/json');
require_once 'DatabaseConnection.php';

session_start();
$userId = $_SESSION['userID'] ?? null;

if (!$userId) {
    echo json_encode(['status' => 'error', 'message' => 'User not logged in.']);
    exit;
}

$fullName = trim($_POST['profile-name'] ?? '');
$bio = trim($_POST['profile-bio'] ?? '');
$parts = explode(' ', $fullName);

$nameParts = explode(' ', $fullName);

$firstName = $nameParts[0] ?? '';
$middleName = '';
$lastName = '';
$suffix = '';

$suffixes = ['Jr', 'Sr', 'II', 'III', 'IV'];

if (count($parts) === 1) {
    $firstName = $parts[0];
} else {
    $lastPart = array_pop($parts);
    if (in_array(str_replace('.', '', $lastPart), $suffixes)) {
        $suffix = $lastPart;
        $lastName = array_pop($parts) ?? '';
    } else {
        $lastName = $lastPart;
    }
    if (count($parts) === 1) {
        $firstName = $parts[0];
    } elseif (count($parts) > 1) {
        $firstName = array_shift($parts);
        $middleName = implode(' ', $parts);
    }
}

$profileImagePath = null;
if (isset($_FILES['profileImage']) && $_FILES['profileImage']['error'] === UPLOAD_ERR_OK) {
    $uploadDir = '../uploads/profiles/';
    if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);

    $fileTmp = $_FILES['profileImage']['tmp_name'];
    $fileName = basename($_FILES['profileImage']['name']);
    $ext = pathinfo($fileName, PATHINFO_EXTENSION);
    $newFileName = 'user_' . $userId . '_' . time() . '.' . $ext;
    $destination = $uploadDir . $newFileName;

    if (move_uploaded_file($fileTmp, $destination)) {
        $profileImagePath = 'uploads/profiles/' . $newFileName;
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to upload image.']);
        exit;
    }
}

$fields = [
    'firstName' => $firstName,
    'middleName' => $middleName,
    'lastName' => $lastName,
    'suffix' => $suffix,
    'bio' => $bio
];

if ($profileImagePath) $fields['profileImage'] = $profileImagePath;

$setParts = [];
$params = [];
$types = '';

foreach ($fields as $key => $value) {
    $setParts[] = "$key = ?";
    $params[] = $value;
    $types .= 's';
}

$setStr = implode(', ', $setParts);
$params[] = $userId;
$types .= 'i';

$sql = "UPDATE userstable SET $setStr WHERE id = ?";

$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode(['status' => 'error', 'message' => 'Prepare failed: ' . $conn->error]);
    exit;
}

$stmt->bind_param($types, ...$params);

if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Profile updated successfully.']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
