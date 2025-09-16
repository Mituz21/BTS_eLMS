<?php
require_once "DatabaseConnection.php";
require_once "authentication.php";
authenticate();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $studentUserID = $_SESSION['userID'];
    $activityId = $_POST['activity_id'] ?? null;
    $activityType = $_POST['activity_type'] ?? null;
    $courseID = $_POST['course_id'] ?? null;
    
    if (!$activityId || !$activityType || !$courseID) {
        echo json_encode(['success' => false, 'message' => 'Missing required information']);
        exit;
    }
    
    $getStudentIdSql = "SELECT userID, id FROM userstable WHERE userID = ?";
    $stmt = $conn->prepare($getStudentIdSql);
    $stmt->bind_param("s", $studentUserID);
    $stmt->execute();
    $studentResult = $stmt->get_result();
    $studentData = $studentResult->fetch_assoc();
    
    if (!$studentData) {
        echo json_encode(['success' => false, 'message' => 'Student not found']);
        exit;
    }
    
    $studentID = $studentData['userID'];
    
    if (!isset($_FILES['submission_file']) || $_FILES['submission_file']['error'] !== UPLOAD_ERR_OK) {
        echo json_encode(['success' => false, 'message' => 'Please select a file to upload']);
        exit;
    }
    
    $uploadDir = '../uploads/submissions/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
    
    $file = $_FILES['submission_file'];
    $fileName = $file['name'];
    $fileExtension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
    
    $allowedExtensions = ['pdf', 'doc', 'docx', 'txt', 'jpg', 'jpeg', 'png'];
    if (!in_array($fileExtension, $allowedExtensions)) {
        echo json_encode(['success' => false, 'message' => 'Invalid file type. Please upload PDF, DOC, DOCX, TXT, JPG, JPEG, or PNG files only.']);
        exit;
    }
    
    $uniqueFileName = $studentUserID . '_' . $activityId . '_' . time() . '.' . $fileExtension;
    $uploadPath = $uploadDir . $uniqueFileName;
    $relativePath = 'uploads/submissions/' . $uniqueFileName;
    
    if (move_uploaded_file($file['tmp_name'], $uploadPath)) {
        $conn->autocommit(false);
        
        try {
            $checkSubmissionSql = "SELECT id FROM submissionstable WHERE activity_id = ? AND student_id = ?";
            $stmt = $conn->prepare($checkSubmissionSql);
            $stmt->bind_param("is", $activityId, $studentID);
            $stmt->execute();
            $existingSubmission = $stmt->get_result()->fetch_assoc();
            
            if ($existingSubmission) {
                $updateSubmissionSql = "UPDATE submissionstable SET file_path = ?, submitted_at = NOW() WHERE id = ?";
                $stmt = $conn->prepare($updateSubmissionSql);
                $stmt->bind_param("si", $relativePath, $existingSubmission['id']);
                $stmt->execute();
            } else {
                $insertSubmissionSql = "INSERT INTO submissionstable (activity_id, student_id, file_path, submitted_at) VALUES (?, ?, ?, NOW())";
                $stmt = $conn->prepare($insertSubmissionSql);
                $stmt->bind_param("iss", $activityId, $studentID, $relativePath);
                $stmt->execute();
            }
            
            initializeStudentProgress($studentUserID, $courseID, $conn);
            
            $conn->commit();
            echo json_encode(['success' => true, 'message' => 'Assignment submitted successfully!']);
            
        } catch (Exception $e) {
            $conn->rollback();
            echo json_encode(['success' => false, 'message' => 'Error submitting assignment: ' . $e->getMessage()]);
        }
        
    } else {
        echo json_encode(['success' => false, 'message' => 'Error uploading file. Please try again.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}

$conn->autocommit(true);
exit;

function initializeStudentProgress($studentUserID, $courseID, $conn) {
    $getCourseIdSql = "SELECT courseID, id FROM coursestable WHERE courseID = ?";
    $stmt = $conn->prepare($getCourseIdSql);
    $stmt->bind_param("s", $courseID);
    $stmt->execute();
    $courseResult = $stmt->get_result();
    $courseData = $courseResult->fetch_assoc();
    
    if (!$courseData) {
        throw new Exception('Course not found');
    }
    
    $courseInternalId = $courseData['courseID'];
    
    $getTrackingIdSql = "SELECT id FROM trackingtable WHERE course_id = ?";
    $stmt = $conn->prepare($getTrackingIdSql);
    $stmt->bind_param("s", $courseInternalId);
    $stmt->execute();
    $trackingResult = $stmt->get_result();
    $trackingData = $trackingResult->fetch_assoc();
    
    if (!$trackingData) {
        throw new Exception('Tracking data not found for course');
    }
    
    $trackingID = $trackingData['id'];
    
    $checkProgressSql = "SELECT * FROM studentprogress WHERE studentID = ? AND course_id = ?";
    $stmt = $conn->prepare($checkProgressSql);
    $stmt->bind_param("ss", $studentUserID, $courseInternalId);
    $stmt->execute();
    $progressResult = $stmt->get_result();
    $progressData = $progressResult->fetch_assoc();
    
    if (!$progressData) {
        $getCourseNameSql = "SELECT courseName FROM coursestable WHERE courseID = ?";
        $stmt = $conn->prepare($getCourseNameSql);
        $stmt->bind_param("s", $courseInternalId);
        $stmt->execute();
        $courseNameResult = $stmt->get_result();
        $courseNameData = $courseNameResult->fetch_assoc();
        $courseName = $courseNameData['courseName'];
        
        $insertProgressSql = "INSERT INTO studentprogress (studentID, course_id, courseName, trackingID, submittedActivity, submittedExam, submittedProjects, progress) 
                              VALUES (?, ?, ?, ?, 0, 0, 0, 0.00)";
        $stmt = $conn->prepare($insertProgressSql);
        $stmt->bind_param("sssi", $studentUserID, $courseInternalId, $courseName, $trackingID);
        $stmt->execute();
    }
}
function updateStudentProgressOnPassedGrade($studentUserID, $courseID, $activityType, $conn) {
    $getCourseIdSql = "SELECT courseID, id FROM coursestable WHERE courseID = ?";
    $stmt = $conn->prepare($getCourseIdSql);
    $stmt->bind_param("s", $courseID);
    $stmt->execute();
    $courseResult = $stmt->get_result();
    $courseData = $courseResult->fetch_assoc();
    
    if (!$courseData) {
        throw new Exception('Course not found');
    }
    
    $courseInternalId = $courseData['courseID'];
    
    $checkProgressSql = "SELECT * FROM studentprogress WHERE studentID = ? AND course_id = ?";
    $stmt = $conn->prepare($checkProgressSql);
    $stmt->bind_param("ss", $studentUserID, $courseInternalId);
    $stmt->execute();
    $progressResult = $stmt->get_result();
    $progressData = $progressResult->fetch_assoc();
    
    if ($progressData) {
        $updateField = '';
        switch (strtolower($activityType)) {
            case 'activity':
                $updateField = 'submittedActivity = submittedActivity + 1';
                break;
            case 'exam':
                $updateField = 'submittedExam = submittedExam + 1';
                break;
            case 'project':
                $updateField = 'submittedProjects = submittedProjects + 1';
                break;
            default:
                throw new Exception('Invalid activity type');
        }
        
        $updateProgressSql = "UPDATE studentprogress SET {$updateField} WHERE studentID = ? AND course_id = ?";
        $stmt = $conn->prepare($updateProgressSql);
        $stmt->bind_param("ss", $studentUserID, $courseInternalId);
        $stmt->execute();
        
        calculateProgress($studentUserID, $courseInternalId, $conn);
    }
}
function calculateProgress($studentUserID, $courseInternalId, $conn) {
    $getProgressSql = "SELECT submittedActivity, submittedExam, submittedProjects FROM studentprogress WHERE studentID = ? AND course_id = ?";
    $stmt = $conn->prepare($getProgressSql);
    $stmt->bind_param("ss", $studentUserID, $courseInternalId);
    $stmt->execute();
    $progressResult = $stmt->get_result();
    $progressData = $progressResult->fetch_assoc();
    
    $getTotalsSql = "SELECT totalActivity, totalExam, totalProjects FROM trackingtable WHERE course_id = ?";
    $stmt = $conn->prepare($getTotalsSql);
    $stmt->bind_param("s", $courseInternalId);
    $stmt->execute();
    $totalsResult = $stmt->get_result();
    $totalsData = $totalsResult->fetch_assoc();
    
    if ($progressData && $totalsData) {
        $activityProgress = $totalsData['totalActivity'] > 0 ? $progressData['submittedActivity'] / $totalsData['totalActivity'] : 0;
        $examProgress = $totalsData['totalExam'] > 0 ? $progressData['submittedExam'] / $totalsData['totalExam'] : 0;
        $projectProgress = $totalsData['totalProjects'] > 0 ? $progressData['submittedProjects'] / $totalsData['totalProjects'] : 0;
        
        $overallProgress = ($activityProgress + $examProgress + $projectProgress) / 3 * 100;
        
        $updateProgressSql = "UPDATE studentprogress SET progress = ? WHERE studentID = ? AND course_id = ?";
        $stmt = $conn->prepare($updateProgressSql);
        $stmt->bind_param("dss", $overallProgress, $studentUserID, $courseInternalId);
        $stmt->execute();
    }
}
?>