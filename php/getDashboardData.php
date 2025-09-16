<?php
require_once "DatabaseConnection.php";
require_once "authentication.php";
authenticate();

header('Content-Type: application/json');

try {
    $userId = $_SESSION['userID'];
    
    $coursesSql = "SELECT COUNT(*) as course_count FROM assignedcourses ac 
                   JOIN userstable u ON ac.trainer_id = u.userID
                   WHERE u.userID = ?";
    $stmt = $conn->prepare($coursesSql);
    $stmt->bind_param("s", $userId);
    $stmt->execute();
    $coursesResult = $stmt->get_result()->fetch_assoc();
    
    // Get total trainees across all trainer's courses
    $traineesSql = "SELECT COUNT(DISTINCT et.user_id) as trainee_count 
                    FROM enrolledtable et 
                    JOIN assignedcourses ac ON et.course_id = ac.course_id 
                    JOIN userstable u ON ac.trainer_id = u.userID
                    WHERE u.userID = ? AND et.status = 'approved'";
    $stmt = $conn->prepare($traineesSql);
    $stmt->bind_param("s", $userId);
    $stmt->execute();
    $traineesResult = $stmt->get_result()->fetch_assoc();
    
    // Get pending submissions
    $submissionsSql = "SELECT COUNT(*) as pending_count 
                       FROM submissionstable s 
                       JOIN activitiestable a ON s.activity_id = a.id 
                       JOIN assignedcourses ac ON a.course_id = ac.course_id 
                       JOIN userstable u ON ac.trainer_id = u.userID 
                       LEFT JOIN gradestable g ON s.id = g.submission_id 
                       WHERE u.userID = ? AND g.id IS NULL";
    $stmt = $conn->prepare($submissionsSql);
    $stmt->bind_param("s", $userId);
    $stmt->execute();
    $submissionsResult = $stmt->get_result()->fetch_assoc();
    
    // Get recent enrollment requests
    $enrollmentSql = "SELECT e.id, c.courseName, 
                      CONCAT(u.firstName, ' ', u.middleName, ' ', u.lastName, ' ', u.suffix) as studentName,
                      e.enrolled_at 
                      FROM enrollmenttable e 
                      JOIN coursestable c ON e.course_id = c.courseID 
                      JOIN userstable u ON e.user_id = u.userID 
                      JOIN assignedcourses ac ON c.courseID = ac.course_id 
                      JOIN userstable t ON ac.trainer_id = t.userID 
                      WHERE t.userID = ? AND e.status = 'pending' 
                      ORDER BY e.enrolled_at DESC LIMIT 1";
    $stmt = $conn->prepare($enrollmentSql);
    $stmt->bind_param("s", $userId);
    $stmt->execute();
    $enrollmentResult = $stmt->get_result()->fetch_assoc();

    $enrollmentRequestTotalSql = "SELECT COUNT(*) AS enrollment_total
                      FROM enrollmenttable e 
                      JOIN coursestable c ON e.course_id = c.courseID 
                      JOIN userstable u ON e.user_id = u.userID 
                      JOIN assignedcourses ac ON c.courseID = ac.course_id 
                      JOIN userstable t ON ac.trainer_id = t.userID 
                      WHERE t.userID = ? AND e.status = 'pending'";
    $stmt = $conn->prepare($enrollmentRequestTotalSql);
    $stmt->bind_param("s", $userId);
    $stmt -> execute();
    $enrollmentRequestResult = $stmt -> get_result()->fetch_assoc();
    
    echo json_encode([
        'success' => true,
        'data' => [
            'courses' => $coursesResult['course_count'],
            'trainees' => $traineesResult['trainee_count'],
            'pendingSubmissions' => $submissionsResult['pending_count'],
            'recentEnrollment' => $enrollmentResult,
            'totalEnrollments' => $enrollmentRequestResult['enrollment_total']
        ]
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error fetching dashboard data: ' . $e->getMessage()
    ]);
}
?>