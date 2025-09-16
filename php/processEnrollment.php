<?php
require_once "DatabaseConnection.php";
require_once "authentication.php";
authenticate();

header('Content-Type: application/json');

try {
    $enrollmentId = $_POST['enrollment_id'] ?? null;
    $action = $_POST['action'] ?? null;

    if (!$enrollmentId || !$action) {
        echo json_encode(['success' => false, 'message' => 'Missing required parameters']);
        exit;
    }

    if (!in_array($action, ['accept', 'reject'])) {
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
        exit;
    }

    $conn->autocommit(false);

    try {
        $getEnrollmentSql = "SELECT user_id, course_id FROM enrollmenttable WHERE id = ? AND status = 'pending'";
        $getStmt = $conn->prepare($getEnrollmentSql);
        $getStmt->bind_param("i", $enrollmentId);
        $getStmt->execute();
        $enrollment = $getStmt->get_result()->fetch_assoc();

        if (!$enrollment) {
            throw new Exception('Enrollment request not found or already processed');
        }

        if ($action === 'accept') {
            $getEnrollmentSql = "SELECT course_id, user_id FROM enrollmenttable WHERE id = ?";
            $getStmt = $conn->prepare($getEnrollmentSql);
            $getStmt->bind_param("i", $enrollmentId);
            $getStmt->execute();
            $enrollment = $getStmt->get_result()->fetch_assoc();
            $getStmt->close();

            if (!$enrollment) {
                throw new Exception("Enrollment not found");
            }

            $course_id = $enrollment['course_id'];
            $user_id = $enrollment['user_id'];

            $getCourseSql = "SELECT courseName FROM coursestable WHERE courseID = ?";
            $courseStmt = $conn->prepare($getCourseSql);
            $courseStmt->bind_param("s", $course_id);
            $courseStmt->execute();
            $course = $courseStmt->get_result()->fetch_assoc();
            $courseStmt->close();

            $courseName = $course['courseName'] ?? 'Unknown Course';

            $getTrackingSql = "SELECT id FROM trackingtable WHERE course_id = ?";
            $trackingStmt = $conn->prepare($getTrackingSql);
            $trackingStmt->bind_param("s", $course_id);
            $trackingStmt->execute();
            $trackingResult = $trackingStmt->get_result();

            if ($trackingResult->num_rows === 0) {
                $trackingStmt->close();
                throw new Exception("No tracking configuration found for this course. Please set up tracking first.");
            }

            $trackingData = $trackingResult->fetch_assoc();
            $trackingID = $trackingData['id'];
            $trackingStmt->close();

            $updateSql = "UPDATE enrollmenttable SET status = 'approved' WHERE id = ?";
            $updateStmt = $conn->prepare($updateSql);
            $updateStmt->bind_param("i", $enrollmentId);
            $updateStmt->execute();

            $insertEnrolledSql = "INSERT INTO enrolledtable (course_id, user_id, enrollment_id, status) VALUES (?, ?, ?, 'approved')";
            $insertStmt = $conn->prepare($insertEnrolledSql);
            $insertStmt->bind_param("ssi", $course_id, $user_id, $enrollmentId);
            $insertStmt->execute();

            $checkProgressSql = "SELECT id FROM studentprogress WHERE studentID = ? AND course_id = ?";
            $checkStmt = $conn->prepare($checkProgressSql);
            $checkStmt->bind_param("ss", $user_id, $course_id);
            $checkStmt->execute();
            $progressExists = $checkStmt->get_result()->num_rows > 0;
            $checkStmt->close();

            if (!$progressExists) {
                $insertProgressSql = "INSERT INTO studentprogress 
                             (studentID, course_id, courseName, trackingID, submittedActivity, 
                              submittedExam, submittedProjects, progress) 
                             VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

                $progressStmt = $conn->prepare($insertProgressSql);

                $submittedActivity = 0;
                $submittedExam = 0;
                $submittedProjects = 0;
                $progress = 0.00;

                $progressStmt->bind_param(
                    "sssiiiid",
                    $user_id,
                    $course_id,
                    $courseName,
                    $trackingID,
                    $submittedActivity,
                    $submittedExam,
                    $submittedProjects,
                    $progress
                );

                $progressStmt->execute();
                $progressStmt->close();
            }

            $message = 'Enrollment approved successfully';
        } else {
            $updateSql = "UPDATE enrollmenttable SET status = 'denied' WHERE id = ?";
            $updateStmt = $conn->prepare($updateSql);
            $updateStmt->bind_param("i", $enrollmentId);
            $updateStmt->execute();

            $message = 'Enrollment rejected successfully';
        }

        $conn->commit();
        echo json_encode(['success' => true, 'message' => $message]);

    } catch (Exception $e) {
        $conn->rollback();
        throw $e;
    }

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error processing enrollment: ' . $e->getMessage()]);
} finally {
    $conn->autocommit(true);
}
?>