<?php
require_once "DatabaseConnection.php";
require_once "authentication.php";
authenticate();

header('Content-Type: application/json');

try {
    $trainerUserID = $_SESSION['userID'];
    
    $sql = "SELECT m.id, m.title, c.courseName, m.file_path,
            m.created_at
            FROM modulestable m 
            JOIN coursestable c ON m.course_id = c.courseID
            JOIN assignedcourses ac ON c.courseID = ac.course_id
            JOIN userstable u ON ac.trainer_id = u.userID
            WHERE u.userID = ?
            ORDER BY m.created_at DESC";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $trainerUserID);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $activities = [];
    while ($row = $result->fetch_assoc()) {
        $activities[] = $row;
    }
    
    echo json_encode([
        'success' => true,
        'data' => $activities
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error fetching activities: ' . $e->getMessage()
    ]);
}
?>