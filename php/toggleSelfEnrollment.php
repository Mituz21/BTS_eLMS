<?php
require_once "DatabaseConnection.php";
require_once "authentication.php";
authenticate();

header('Content-Type: application/json');

try {
    $courseId = $_POST['course_id'] ?? null;
    
    if (!$courseId) {
        echo json_encode(['success' => false, 'message' => 'Course ID required']);
        exit;
    }
    
    $checkSql = "SELECT status FROM coursetracker WHERE course_id = ?";
    $stmt = $conn->prepare($checkSql);
    $stmt->bind_param("s", $courseId);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $newStatus = ($row['status'] == "enabled") ? "disabled" : "enabled";
        
        $updateSql = "UPDATE coursetracker SET status = ? WHERE course_id = ?";
        $stmt = $conn->prepare($updateSql);
        $stmt->bind_param("ss", $newStatus, $courseId);
        $stmt->execute();
    } else {
        $insertSql = "INSERT INTO coursetracker (course_id, status) VALUES (?, 'enabled')";
        $stmt = $conn->prepare($insertSql);
        $stmt->bind_param("s", $courseId);
        $stmt->execute();
        $newStatus = 'enabled';
    }
    
    echo json_encode([
        'success' => true,
        'status' => $newStatus,
        'message' => 'Self-enrollment status updated successfully'
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error updating status: ' . $e->getMessage()
    ]);
}
?>