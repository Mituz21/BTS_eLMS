<?php
require_once "DatabaseConnection.php";
require_once "authentication.php";
authenticate();

header('Content-Type: application/json');

error_log("=== POST data ===");
foreach ($_POST as $key => $value) {
    error_log("POST['$key'] = '$value'");
}

try {
    $trainerUserID = $_SESSION['userID'];
    $getTrainerIdSql = "SELECT userID FROM userstable WHERE userID = ?";
    $stmt = $conn->prepare($getTrainerIdSql);
    $stmt->bind_param("s", $trainerUserID);
    $stmt->execute();
    $trainerResult = $stmt->get_result();
    $trainerData = $trainerResult->fetch_assoc();

    $trainerInternalId = $trainerData['userID'];
    
    if (!$trainerData) {
        echo json_encode(['success' => false, 'message' => 'Trainer not found']);
        exit;
    }

    $title = $_POST['moduleTitle'] ?? '';
    $description = $_POST['moduleDescription'] ?? '';
    $courseID = $_POST['courseModuleOption'] ?? '';

    $getCourseIdSql = "SELECT courseID, id FROM coursestable WHERE courseID = ?";
    $stmt = $conn->prepare($getCourseIdSql);
    $stmt->bind_param("s", $courseID);
    $stmt->execute();
    $courseResult = $stmt->get_result();
    $courseData = $courseResult->fetch_assoc();

    if (empty($title) || empty($courseID) || !isset($_FILES['uploadModuleFile'])) {
        echo json_encode(['success' => false, 'message' => 'Please fill in all required fields and select a file']);
        exit;
    }

    if (!$courseData) {
        echo json_encode(['success' => false, 'message' => 'Course not found']);
        exit;
    }

    $courseInternalId = $courseData['courseID'];

    if ($_FILES['uploadModuleFile']['error'] !== UPLOAD_ERR_OK) {
        echo json_encode(['success' => false, 'message' => 'File upload error']);
        exit;
    }

    $uploadDir = '../uploads/modules/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    $file = $_FILES['uploadModuleFile'];
    $fileExtension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

    $allowedExtensions = ['pdf', 'doc', 'docx', 'txt'];
    if (!in_array($fileExtension, $allowedExtensions)) {
        echo json_encode(['success' => false, 'message' => 'Invalid file type. Only PDF, DOC, DOCX, and TXT files are allowed.']);
        exit;
    }

    $uniqueFileName = 'Module_' . $title . '_' . $courseID . '.' . $fileExtension;
    $uploadPath = $uploadDir . $uniqueFileName;
    $filePath = '../uploads/modules/' . $uniqueFileName;

    if (!move_uploaded_file($file['tmp_name'], $uploadPath)) {
        echo json_encode(['success' => false, 'message' => 'Failed to upload file']);
        exit;
    }

    $insertSql = "INSERT INTO modulestable (course_id, trainerID, title, description, file_path) 
                  VALUES (?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($insertSql);
    $stmt->bind_param("sssss", $courseInternalId, $trainerInternalId, $title, $description, $filePath);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Module uploaded successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to upload module']);
    }

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}
?>