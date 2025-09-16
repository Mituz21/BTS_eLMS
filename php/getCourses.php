<?php
require 'DatabaseConnection.php';

header('Content-Type: application/json');

try {
    $query = "SELECT 
        id, 
        courseID, 
        courseName, 
        courseSchedule, 
        description, 
        filePath, 
        status 
        FROM coursestable";
    
    $result = $conn->query($query);
    
    $courses = [];
    while ($row = $result->fetch_assoc()) {
        $courses[] = [
            'id' => $row['id'],
            'courseID' => $row['courseID'],
            'courseName' => $row['courseName'],
            'courseSchedule' => $row['courseSchedule'],
            'description' => $row['description'],
            'filePath' => $row['filePath'],
            'status' => $row['status']
        ];
    }
    
    echo json_encode([
        'success' => true,
        'courses' => $courses
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}

$conn->close();
?>