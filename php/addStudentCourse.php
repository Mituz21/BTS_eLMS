<?php
require_once 'DatabaseConnection.php';
require_once 'authentication.php';

authenticate();

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['studentID']) || empty($input['studentID'])) {
        echo json_encode(['success' => false, 'message' => 'Student ID is required']);
        exit;
    }

    if (!isset($input['courseIDs']) || empty($input['courseIDs'])) {
        echo json_encode(['success' => false, 'message' => 'At least one course must be selected']);
        exit;
    }

    $studentID = $input['studentID'];
    $courseIDs = $input['courseIDs'];

    try {
        $conn->begin_transaction();

        $addedCourses = [];
        $skippedCourses = [];

        $userStmt = $conn->prepare("SELECT userID FROM userstable WHERE userID = ? AND role = 'trainee'");
        $userStmt->bind_param("s", $studentID);
        $userStmt->execute();
        $userResult = $userStmt->get_result();

        if ($userResult->num_rows === 0) {
            throw new Exception("Student not found or not a trainee");
        }
        $userStmt->close();

        foreach ($courseIDs as $courseID) {
            $courseIdStmt = $conn->prepare("SELECT id, courseName, status FROM coursestable WHERE courseID = ?");
            $courseIdStmt->bind_param("s", $courseID);
            $courseIdStmt->execute();
            $courseIdResult = $courseIdStmt->get_result();

            if ($courseIdResult->num_rows === 0) {
                continue;
            }

            $courseData = $courseIdResult->fetch_assoc();
            $courseName = $courseData['courseName'];
            $courseStatus = $courseData['status'];
            $courseIdStmt->close();

            if ($courseStatus !== 'Offered') {
                $skippedCourses[] = $courseName . "Not Offered";
                continue;
            }

            $checkStmt = $conn->prepare("SELECT id FROM studentprogress WHERE studentID = ? AND course_id = ?");
            $checkStmt->bind_param("ss", $studentID, $courseID);
            $checkStmt->execute();
            $checkResult = $checkStmt->get_result();

            $trackingStmt = $conn->prepare("SELECT id FROM trackingtable WHERE course_id = ?");
            $trackingStmt->bind_param("s", $courseID);
            $trackingStmt->execute();
            $trackingResult = $trackingStmt->get_result();

            if ($trackingResult->num_rows > 0) {
                $trackingData = $trackingResult->fetch_assoc();
                $trackingID = $trackingData['id'];
            } else {
                $createTrackingStmt = $conn->prepare("INSERT INTO trackingtable (course_id, totalActivity, totalExam, totalProjects) VALUES (?, 0, 0, 0)");
                $createTrackingStmt->bind_param("s", $courseID);
                $createTrackingStmt->execute();
                $trackingID = $conn->insert_id;
                $createTrackingStmt->close();
            }
            $trackingStmt->close();

            if ($checkResult->num_rows > 0) {
                $skippedCourses[] = $courseName . " (Already Enrolled)";
            } else {
                $insertStmt = $conn->prepare("
                    INSERT INTO studentprogress 
                    (studentID, course_id, courseName, trackingID, submittedActivity, submittedExam, submittedProjects, progress, last_updated) 
                    VALUES (?, ?, ?, ?, 0, 0, 0, 0.0, NOW())
                ");
                $insertStmt->bind_param("sssi", $studentID, $courseID, $courseName, $trackingID);
                if ($insertStmt->execute()) {
                    $addedCourses[] = $courseName;
                }
                $insertStmt->close();
            }
            $checkStmt->close();
        }

        if (!empty($addedCourses)) {
            $updateStmt = $conn->prepare("UPDATE traineestable SET status = 'Ongoing' WHERE studentID = ?");
            $updateStmt->bind_param("s", $studentID);
            $updateStmt->execute();
            $updateStmt->close();
        }

        $conn->commit();

        $message = '';
        if (!empty($addedCourses)) {
            $message .= 'Successfully added courses: ' . implode(', ', $addedCourses);
        }
        if (!empty($skippedCourses)) {
            if (!empty($message)) $message .= '\n';
            $message .= 'Skipped: ' . implode(', ', $skippedCourses);
        }

        echo json_encode([
            'success' => true,
            'message' => $message,
            'addedCourses' => $addedCourses,
            'skippedCourses' => $skippedCourses
        ]);

    } catch (Exception $e) {
        $conn->rollback();
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}

$conn->close();
?>