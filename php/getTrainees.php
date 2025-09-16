<?php
require_once "DatabaseConnection.php";
require_once "authentication.php";
authenticate();

header('Content-Type: application/json');

try {
    $userId = $_SESSION['userID'];
    
    $sql = "SELECT DISTINCT 
            CONCAT(u.firstName, ' ', COALESCE(u.middleName, ''), ' ', u.lastName, ' ', COALESCE(u.suffix, '')) as name,
            u.email,
            c.courseName,
            COALESCE(sp.progress, 0) as progress
        FROM userstable u 
        JOIN enrolledtable et ON u.userID = et.user_id 
        JOIN coursestable c ON et.course_id = c.courseID 
        JOIN assignedcourses ac ON c.courseID = ac.course_id
        JOIN userstable t ON ac.trainer_id = t.userID
        LEFT JOIN studentprogress sp ON u.userID = sp.studentID AND c.courseID = sp.course_id
        WHERE t.userID = ? 
        AND et.status = 'approved' 
        AND u.role = 'trainee'
        ORDER BY u.firstName, u.lastName";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $userId);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $trainees = [];
    while ($row = $result->fetch_assoc()) {
        $trainees[] = [
            'name' => trim($row['name']),
            'email' => $row['email'],
            'courseName' => $row['courseName'],
            'progress' => round($row['progress'], 1) . '%'
        ];
    }
    
    echo json_encode([
        'success' => true,
        'count' => count($trainees), // debug count
        'userId' => $userId,         // debug session ID
        'data' => $trainees
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error fetching trainees: ' . $e->getMessage()
    ]);
}
?>