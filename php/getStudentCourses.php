<?php
require_once 'DatabaseConnection.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['studentID']) || empty($input['studentID'])) {
        echo json_encode(['success' => false, 'message' => 'Student ID is required']);
        exit;
    }
    
    $studentID = $input['studentID'];
    
    try {
        $userStmt = $conn->prepare("SELECT id, CONCAT(firstName, ' ', IFNULL(middleName,''), ' ', lastName, ' ', IFNULL(suffix,'')) AS fullName, userID FROM userstable WHERE userID = ?");
        $userStmt->bind_param("s", $studentID);
        $userStmt->execute();
        $userResult = $userStmt->get_result();
        
        if ($userResult->num_rows === 0) {
            echo json_encode(['success' => false, 'message' => 'Student not found']);
            exit;
        }
        
        $userData = $userResult->fetch_assoc();
        $userIntID = $userData['id'];
        $studentInfo = [
            'fullName' => $userData['fullName'],
            'userID' => $userData['userID']
        ];
        $userStmt->close();
        
        $coursesQuery = "SELECT 
            sp.id,
            sp.course_id,
            sp.courseName,
            sp.trackingID,
            sp.submittedActivity,
            sp.submittedExam,
            sp.submittedProjects,
            sp.progress,
            sp.last_updated
            FROM studentprogress sp
            WHERE sp.studentID = ?
            ORDER BY sp.last_updated DESC";
        
        $stmt = $conn->prepare($coursesQuery);
        $stmt->bind_param("s", $studentID);
        $stmt->execute();
        $coursesResult = $stmt->get_result();
        
        $courses = [];
        while ($row = $coursesResult->fetch_assoc()) {
            $courses[] = [
                'id' => $row['id'],
                'courseName' => $row['courseName'],
                'course_id' => $row['course_id'],
                'trackingID' => $row['trackingID'],
                'submittedActivity' => $row['submittedActivity'],
                'submittedExam' => $row['submittedExam'],
                'submittedProjects' => $row['submittedProjects'],
                'progress' => $row['progress'],
                'last_updated' => $row['last_updated']
            ];
        }
        $stmt->close();
        
        echo json_encode([
            'success' => true,
            'studentInfo' => $studentInfo,
            'courses' => $courses
        ]);
        
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    }
    
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}

$conn->close();
?>