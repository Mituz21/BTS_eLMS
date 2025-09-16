<?php
require_once "DatabaseConnection.php";
require_once "authentication.php";
authenticate();

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

try {
    $activityId = $_POST['activity_id'] ?? null;
    $userId = $_SESSION['userID'];
    
    if (!$activityId) {
        echo json_encode(['success' => false, 'message' => 'Activity ID required']);
        exit;
    }
    
    
    $userSql = "SELECT id FROM userstable WHERE userID = ?";
    $stmt = $conn->prepare($userSql);
    $stmt->bind_param("s", $userId);
    $stmt->execute();
    $userResult = $stmt->get_result();
    
    if ($userResult->num_rows === 0) {
        echo json_encode(['success' => false, 'message' => 'User not found']);
        exit;
    }
    
    $userIdNumber = $userResult->fetch_assoc()['id'];
    
    
    $verifySql = "SELECT file_path FROM activitiestable WHERE id = ? AND created_by = ?";
    $stmt = $conn->prepare($verifySql);
    $stmt->bind_param("ii", $activityId, $userIdNumber);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        echo json_encode(['success' => false, 'message' => 'Activity not found or not authorized']);
        exit;
    }
    
    $activity = $result->fetch_assoc();
    
    
    $deleteSql = "DELETE FROM activitiestable WHERE id = ? AND created_by = ?";
    $stmt = $conn->prepare($deleteSql);
    $stmt->bind_param("ii", $activityId, $userIdNumber);
    $stmt->execute();
    
    
    if ($activity['file_path'] && file_exists('../' . $activity['file_path'])) {
        unlink('../' . $activity['file_path']);
    }
    
    echo json_encode([
        'success' => true,
        'message' => 'Activity deleted successfully'
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error deleting activity: ' . $e->getMessage()
    ]);
}
?>