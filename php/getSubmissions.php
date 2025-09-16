<?php
require_once "DatabaseConnection.php";
require_once "authentication.php";
authenticate();

header('Content-Type: application/json');

try {
    $userId = $_SESSION['userID'];
    
    $sql = "SELECT s.id, 
            CONCAT(u.firstName, ' ', IFNULL(u.middleName, ''), ' ', u.lastName, ' ', IFNULL(u.suffix, '')) as traineeName,
            c.courseName,
            a.title as activityTitle,
            DATE_FORMAT(s.submitted_at, '%m-%d-%Y') as dateSubmitted,
            s.file_path,
            CASE WHEN g.id IS NOT NULL THEN 'Graded' ELSE 'Pending' END as gradeStatus,
            g.grade,
            g.feedback
            FROM submissionstable s 
            JOIN activitiestable a ON s.activity_id = a.id 
            JOIN coursestable c ON a.course_id = c.courseID 
            JOIN userstable u ON s.student_id = u.userID 
            JOIN assignedcourses ac ON c.courseID = ac.course_id 
            JOIN userstable t ON ac.trainer_id = t.userID 
            LEFT JOIN gradestable g ON s.id = g.submission_id
            WHERE t.userID = ?
            ORDER BY s.submitted_at DESC";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $userId);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $submissions = [];
    while ($row = $result->fetch_assoc()) {
        $submissions[] = [
            'id' => $row['id'],
            'traineeName' => trim($row['traineeName']),
            'courseName' => $row['courseName'],
            'activityTitle' => $row['activityTitle'],
            'dateSubmitted' => $row['dateSubmitted'],
            'filePath' => $row['file_path'],
            'gradeStatus' => $row['gradeStatus'],
            'grade' => $row['grade'],
            'feedback' => $row['feedback']
        ];
    }
    
    echo json_encode([
        'success' => true,
        'data' => $submissions
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error fetching submissions: ' . $e->getMessage()
    ]);
}
?>