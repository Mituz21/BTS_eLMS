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
$status = $_POST['status'] ?? '';
$courseSchedule = $_POST['courseSchedule'] ?? '';

// Validate the input
if (empty($courseID) || empty($status)) {
    echo json_encode([
        'success' => false,
        'message' => 'Course ID and status are required.'
    ]);
    exit;
}

// Convert status to database format (1 for Offered, 0 for Not Offered)
$statusValue = ($status === 'Offered') ? '1' : '0';

try {
    // Prepare the SQL statement
    $stmt = $conn->prepare("UPDATE coursestable SET status = ?, courseSchedule = ? WHERE courseID = ?");
    $stmt->bind_param("sss", $statusValue, $courseSchedule, $courseID);
    
    // Execute the statement
    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Course updated successfully.'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Failed to update course: ' . $stmt->error
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