<?php
require_once "DatabaseConnection.php";
require_once "authentication.php";
authenticate();

header('Content-Type: application/json');

try {
    $trainerUserID = $_SESSION['userID'];

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $activityId = $_GET['id'] ?? '';

        if (empty($activityId)) {
            echo json_encode(['success' => false, 'message' => 'Activity ID is required']);
            exit;
        }

        $getActivitySql = "SELECT a.id, a.title, a.description, a.due_date, a.type, a.file_path, 
                                 c.courseID, c.courseName
                          FROM activitiestable a
                          JOIN coursestable c ON a.course_id = c.courseID
                          WHERE a.id = ? AND a.created_by = ?";
        $stmt = $conn->prepare($getActivitySql);
        $stmt->bind_param("is", $activityId, $trainerUserID);
        $stmt->execute();
        $result = $stmt->get_result();
        $activity = $result->fetch_assoc();

        if (!$activity) {
            echo json_encode(['success' => false, 'message' => 'Activity not found or access denied']);
            exit;
        }

        echo json_encode(['success' => true, 'data' => $activity]);
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $activityId = $_POST['activityId'] ?? '';
        $title = $_POST['actTitle'] ?? '';
        $description = $_POST['description'] ?? '';
        $dueDate = $_POST['dueDate'] ?? null;
        $activityType = $_POST['activityType'] ?? '';
        $courseID = $_POST['courseActivityOption'] ?? '';

        if (empty($activityId) || empty($title) || empty($courseID) || empty($activityType)) {
            echo json_encode(['success' => false, 'message' => 'Please fill in all required fields']);
            exit;
        }

        $verifyActivitySql = "SELECT id, file_path, type FROM activitiestable WHERE id = ? AND created_by = ?";
        $stmt = $conn->prepare($verifyActivitySql);
        $stmt->bind_param("is", $activityId, $trainerUserID);
        $stmt->execute();
        $activityResult = $stmt->get_result();
        $existingActivity = $activityResult->fetch_assoc();
        
        if (!$existingActivity) {

            echo json_encode([
                'success' => false,
                'message' => 'Activity not found or access denied'
            ]);
            exit;
        }

        // Get course internal ID
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

        $filePath = $existingActivity['file_path'];
        if (isset($_FILES['uploadAct']) && $_FILES['uploadAct']['error'] === UPLOAD_ERR_OK) {
            $uploadDir = '../uploads/activities/';
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0755, true);
            }

            $file = $_FILES['uploadAct'];
            $fileExtension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

            $allowedExtensions = ['pdf', 'doc', 'docx', 'txt'];
            if (!in_array($fileExtension, $allowedExtensions)) {
                echo json_encode(['success' => false, 'message' => 'Invalid file type. Only PDF, DOC, DOCX, and TXT files are allowed.']);
                exit;
            }

            if ($existingActivity['file_path']) {
                $oldFilePath = $existingActivity['file_path'];
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
                    error_log("File not found for deletion: " . $existingActivity['file_path']);
                }
            }

            $uniqueFileName = 'Activity_' . $title . '_' . $courseID . '.' . $fileExtension;
            $uploadPath = $uploadDir . $uniqueFileName;
            $filePath = '../uploads/activities/' . $uniqueFileName;

            if (!move_uploaded_file($file['tmp_name'], $uploadPath)) {
                echo json_encode(['success' => false, 'message' => 'Failed to upload file']);
                exit;
            }
        }

        $updateSql = "UPDATE activitiestable 
                     SET course_id = ?, title = ?, description = ?, file_path = ?, due_date = ?, type = ? 
                     WHERE id = ? AND created_by = ?";
        $stmt = $conn->prepare($updateSql);
        $stmt->bind_param("sssssiis", $courseInternalId, $title, $description, $filePath, $dueDate, $activityType, $activityId, $trainerUserID);

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Activity updated successfully']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to update activity']);
        }
    }

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}
?>