<?php
require 'DatabaseConnection.php';
header('Content-Type: application/json');

// Check if the request is a POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid request method. Only POST requests are allowed.'
    ]);
    exit;
}

// Get the POST data
$courseID = $_POST['courseID'] ?? '';
$courseName = $_POST['courseName'] ?? '';
$courseSchedule = $_POST['courseSchedule'] ?? '';
$description = $_POST['description'] ?? '';
$status = $_POST['status'] ?? '';
$basicCompetencies = $_POST['basicCompetency'] ?? [];
$commonCompetencies = $_POST['commonCompetency'] ?? [];
$coreCompetencies = $_POST['coreCompetency'] ?? [];


// Validate the input
if (empty($courseID) || empty($courseName) || empty($status)) {
    echo json_encode([
        'success' => false,
        'message' => 'Course ID, name, and status are required.'
    ]);
    exit;
}

// Check if course ID already exists
$checkStmt = $conn->prepare("SELECT id FROM coursestable WHERE courseID = ?");
$checkStmt->bind_param("s", $courseID);
$checkStmt->execute();
$checkResult = $checkStmt->get_result();

if ($checkResult->num_rows > 0) {
    echo json_encode([
        'success' => false,
        'message' => 'A course with this ID already exists.'
    ]);
    $checkStmt->close();
    exit;
}
$checkStmt->close();

$statusValue = ($status === 'Offered') ? 'Offered' : 'Not Offered';

$filePath = 'uploads/images/default-course.jpg';

try {
    // Prepare the SQL statement
    $stmt = $conn->prepare("INSERT INTO coursestable (courseID, courseName, courseSchedule, description, filePath, status) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssss", $courseID, $courseName, $courseSchedule, $description, $filePath, $statusValue);

    // Execute the statement
    if ($stmt->execute()) {
        $courseTableID = $conn->insert_id;
        if (!empty($basicCompetencies)) {
            $stmtBasic = $conn->prepare("INSERT INTO basiccompetency (courseID, basicPoints) VALUES (?, ?)");
            foreach ($basicCompetencies as $point) {
                if (!empty(trim($point))) {
                    $stmtBasic->bind_param("is", $courseTableID, $point);
                    $stmtBasic->execute();
                }
            }
            $stmtBasic->close();
        }

        if (!empty($commonCompetencies)) {
            $stmtCommon = $conn->prepare("INSERT INTO commoncompetency (courseID, commonPoints) VALUES (?, ?)");
            foreach ($commonCompetencies as $point) {
                if (!empty(trim($point))) {
                    $stmtCommon->bind_param("is", $courseTableID, $point);
                    $stmtCommon->execute();
                }
            }
            $stmtCommon->close();
        }

        if (!empty($coreCompetencies)) {
            $stmtCore = $conn->prepare("INSERT INTO corecompetency (courseID, corePoints) VALUES (?, ?)");
            foreach ($coreCompetencies as $point) {
                if (!empty(trim($point))) {
                    $stmtCore->bind_param("is", $courseTableID, $point);
                    $stmtCore->execute();
                }
            }
            $stmtCore->close();
        }
        echo json_encode([
            'success' => true,
            'message' => 'Course and competencies added successfully.'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Failed to add course: ' . $stmt->error
        ]);
    }

    $stmt->close();
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}


$conn->close();
?>