<?php
require_once "DatabaseConnection.php";
require_once "authentication.php";
authenticate();

header('Content-Type: application/json');

try {
    $trainerUserID = $_SESSION['userID'];

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $moduleId = $_GET['id'] ?? '';

        if (empty($moduleId)) {
            echo json_encode(['success' => false, 'message' => 'Module ID is required']);
            exit;
        }

        $getModuleSql = "SELECT m.id, m.title, m.description, m.file_path, 
                                 c.courseID, c.courseName
                          FROM modulestable m
                          JOIN coursestable c ON m.course_id = c.courseID
                          WHERE m.id = ? AND m.trainerID = ?";
        $stmt = $conn->prepare($getModuleSql);
        $stmt->bind_param("is", $moduleId, $trainerUserID);
        $stmt->execute();
        $result = $stmt->get_result();
        $module = $result->fetch_assoc();

        if (!$module) {
            echo json_encode(['success' => false, 'message' => 'Module not found or access denied']);
            exit;
        }

        echo json_encode(['success' => true, 'data' => $module]);
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $moduleId = $_POST['moduleId'] ?? '';
        $title = $_POST['moduleTitle'] ?? '';
        $description = $_POST['description'] ?? '';
        $courseID = $_POST['courseModuleOption'] ?? '';

        if (empty($moduleId) || empty($title) || empty($courseID)) {
            echo json_encode(['success' => false, 'message' => 'Please fill in all required fields']);
            exit;
        }

        $verifyModuleSql = "SELECT id, file_path, title, description FROM modulestable WHERE id = ? AND trainerID = ?";
        $stmt = $conn->prepare($verifyModuleSql);
        $stmt->bind_param("is", $moduleId, $trainerUserID);
        $stmt->execute();
        $moduleResult = $stmt->get_result();
        $existingModule = $moduleResult->fetch_assoc();
        
        if (!$existingModule) {

            echo json_encode([
                'success' => false,
                'message' => 'Module not found or access denied'
            ]);
            exit;
        }

        $getCourseIdSql = "SELECT courseID, id FROM coursestable WHERE courseID = ?";
        $stmt = $conn->prepare($getCourseIdSql);
        $stmt->bind_param("s", $courseID);
        $stmt->execute();
        $courseResult = $stmt->get_result();
        $courseData = $courseResult->fetch_assoc();

        if (!$courseData) {
            echo json_encode(['success' => false, 'message' => 'Course not found']);
            exit;
        }

        $courseInternalId = $courseData['courseID'];

        $filePath = $existingModule['file_path'];
        if (isset($_FILES['uploadModuleFile']) && $_FILES['uploadModuleFile']['error'] === UPLOAD_ERR_OK) {
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

            if ($existingModule['file_path']) {
                $oldFilePath = $existingModule['file_path'];
                if (!file_exists($oldFilePath)) {
                    $oldFilePath = __DIR__ . '/' . $oldFilePath;
                }

                if (file_exists($oldFilePath)) {
                    if (unlink($oldFilePath)) {
                        error_log("Successfully deleted old file: " . $oldFilePath);
                    } else {
                        error_log("Failed to delete old file: " . $oldFilePath);
                    }
                } else {
                    error_log("File not found for deletion: " . $existingModule['file_path']);
                }
            }

            $uniqueFileName = 'Module_' . $title . '_' . $courseID . '.' . $fileExtension;
            $uploadPath = $uploadDir . $uniqueFileName;
            $filePath = '../uploads/modules/' . $uniqueFileName;

            if (!move_uploaded_file($file['tmp_name'], $uploadPath)) {
                echo json_encode(['success' => false, 'message' => 'Failed to upload file']);
                exit;
            }
        }

        $updateSql = "UPDATE modulestable 
                     SET course_id = ?, title = ?, description = ?, file_path = ?
                     WHERE id = ? AND trainerID = ?";
        $stmt = $conn->prepare($updateSql);
        $stmt->bind_param("ssssis", $courseInternalId, $title, $description, $filePath, $moduleId, $trainerUserID);

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Module updated successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to update module']);
        }
    }

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}
?>