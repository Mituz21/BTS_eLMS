<?php
require_once "DatabaseConnection.php";
require_once "authentication.php";
authenticate();

header('Content-Type: application/json');

try {
    $userId = $_SESSION['userID'];
    $courseId = $_POST['course_id'] ?? null;

    if (!$courseId) {
        echo json_encode(['success' => false, 'message' => 'Course ID is required']);
        exit;
    }

    $courseCheckSql = "SELECT courseID FROM trainercourses WHERE courseID = ?";
    $courseCheckStmt = $conn->prepare($courseCheckSql);
    $courseCheckStmt->bind_param("i", $courseId);
    $courseCheckStmt->execute();
    $courseExists = $courseCheckStmt->get_result()->fetch_assoc();

    if (!$courseExists) {
        echo json_encode(['success' => false, 'message' => 'Invalid course ID: ' . $courseId]);
        exit;
    }

    $checkSql = "SELECT id FROM enrollmenttable WHERE user_id = ? AND course_id = ?";
    $checkStmt = $conn->prepare($checkSql);
    $checkStmt->bind_param("ss", $userId, $courseId);
    $checkStmt->execute();
    $existingEnrollment = $checkStmt->get_result()->fetch_assoc();

    if ($existingEnrollment) {
        echo json_encode(['success' => false, 'message' => 'You have already requested enrollment for this course']);
        exit;
    }

    $insertSql = "INSERT INTO enrollmenttable (user_id, course_id, status, enrolled_at) VALUES (?, ?, 'pending', NOW())";
    $insertStmt = $conn->prepare($insertSql);
    $insertStmt->bind_param("ss", $userId, $courseId);

    if ($insertStmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Enrollment request submitted successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to submit enrollment request']);
    }

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}
?>