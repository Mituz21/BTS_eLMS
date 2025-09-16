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
    $moduleId = $_POST['module_id'] ?? null;
    $userId = $_SESSION['userID'];
    
    if (!$moduleId) {
        echo json_encode(['success' => false, 'message' => 'Module ID required']);
        exit;
    }
    
    
    $userSql = "SELECT userID, id FROM userstable WHERE userID = ?";
    $stmt = $conn->prepare($userSql);
    $stmt->bind_param("s", $userId);
    $stmt->execute();
    $userResult = $stmt->get_result();
    
    if ($userResult->num_rows === 0) {
        echo json_encode(['success' => false, 'message' => 'User not found']);
        exit;
    }
    
    $userIdNumber = $userResult->fetch_assoc()['userID'];
    
    
    $verifySql = "SELECT file_path FROM modulestable WHERE id = ? AND trainerID = ?";
    $stmt = $conn->prepare($verifySql);
    $stmt->bind_param("is", $moduleId, $userIdNumber);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        echo json_encode(['success' => false, 'message' => 'Module not found or not authorized']);
        exit;
    }
    
    $module = $result->fetch_assoc();
    
    
    $deleteSql = "DELETE FROM modulestable WHERE id = ? AND trainerID = ?";
    $stmt = $conn->prepare($deleteSql);
    $stmt->bind_param("is", $moduleId, $userIdNumber);
    $stmt->execute();
    
    
    if ($module['file_path'] && file_exists('../' . $module['file_path'])) {
        unlink('../' . $module['file_path']);
    }
    
    echo json_encode([
        'success' => true,
        'message' => 'Module deleted successfully'
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error deleting module: ' . $e->getMessage()
    ]);
}
?>