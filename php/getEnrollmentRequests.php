<?php
require_once "DatabaseConnection.php";
require_once "authentication.php";
authenticate();

header('Content-Type: application/json');

try {
    $trainerUserID = $_SESSION['userID'];

    $sql = "SELECT 
            e.id,
            c.courseName,
            CONCAT(u.firstName, ' ', COALESCE(u.middleName, ''), ' ', u.lastName, ' ', COALESCE(u.suffix, '')) AS studentName,
            DATE_FORMAT(e.enrolled_at, '%m-%d-%y') as dateRequested
            FROM enrollmenttable e
            JOIN coursestable c ON e.course_id = c.courseID
            JOIN userstable u ON e.user_id = u.userID
            JOIN assignedcourses ac ON c.courseID = ac.course_id
            WHERE ac.trainer_id = ? AND e.status = 'pending'
            ORDER BY e.enrolled_at DESC";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $trainerUserID);
    $stmt->execute();
    $result = $stmt->get_result();

    $requests = [];
    while ($row = $result->fetch_assoc()) {
        $requests[] = $row;
    }

    echo json_encode([
        'success' => true,
        'data' => $requests
    ]);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error fetching enrollment requests: ' . $e->getMessage()
    ]);
}
?>