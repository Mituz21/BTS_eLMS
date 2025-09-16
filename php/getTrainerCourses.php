<?php
require_once "DatabaseConnection.php";
require_once "authentication.php";
authenticate();

header('Content-Type: application/json');

try {
    $userId = $_SESSION['userID'];
    $sql = "SELECT 
            ac.id, 
            c.courseID,
            c.courseName,
            COUNT(DISTINCT et.user_id) AS studentCount,
            COALESCE(AVG(sp.progress), 0) AS avgProgress,
            ct.status AS selfEnrollStatus
        FROM assignedcourses ac
        INNER JOIN coursestable c 
            ON ac.course_id = c.courseID
        INNER JOIN userstable u 
            ON ac.trainer_id = u.userID
        LEFT JOIN enrolledtable et 
            ON c.courseID = et.course_id 
           AND et.status = 'approved'
        LEFT JOIN studentprogress sp 
            ON c.courseID = sp.course_id
        LEFT JOIN coursetracker ct 
            ON c.courseID = ct.course_id
        WHERE u.userID = ?
        GROUP BY ac.id, c.courseName, ct.status";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $userId);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $courses = [];
    while ($row = $result->fetch_assoc()) {
        $courses[] = [
            'courseID' => $row['courseID'],
            'courseName' => $row['courseName'],
            'studentCount' => (int)$row['studentCount'],
            'avgProgress' => round((float)$row['avgProgress'], 1),
            'selfEnrollStatus' => $row['selfEnrollStatus']
        ];
    }
    
    echo json_encode([
        'success' => true,
        'data' => $courses
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error fetching courses: ' . $e->getMessage()
    ]);
}
?>