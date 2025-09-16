<?php
require 'DatabaseConnection.php';
header('Content-Type: application/json');

// Check if the request is a GET, POST or DELETE request
if (!in_array($_SERVER['REQUEST_METHOD'], ['GET', 'POST', 'DELETE'])) {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid request method. Only GET, POST and DELETE requests are allowed.'
    ]);
    exit;
}

$response = ['success' => false, 'message' => '', 'data' => []];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Fetch all announcements
    $result = $conn->query("SELECT * FROM announcementtable ORDER BY created_at DESC");
    
    if (!$result) {
        echo json_encode([
            'success' => false,
            'message' => 'Database error: ' . $conn->error
        ]);
        exit;
    }
    
    $announcements = [];
    while ($row = $result->fetch_assoc()) {
        $announcements[] = $row;
    }
    
    echo json_encode([
        'success' => true,
        'data' => $announcements
    ]);
    exit;
} 
elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['type']) || !isset($data['message'])) {
        echo json_encode([
            'success' => false,
            'message' => 'Type and message are required.'
        ]);
        exit;
    }
    
    $stmt = $conn->prepare("INSERT INTO announcementtable 
                          (course_id, created_by, type, message, expires_at) 
                          VALUES (?, ?, ?, ?, ?)");
    
    if (!$stmt) {
        echo json_encode([
            'success' => false,
            'message' => 'Database error: ' . $conn->error
        ]);
        exit;
    }
    
    $course_id = $data['course_id'] ?? null;
    $user_id = $_SESSION['userID'] ?? null;
    $expires_at = $data['expires_at'] ?? null;
    
    $stmt->bind_param("issss", 
        $course_id,
        $user_id,
        $data['type'],
        $data['message'],
        $expires_at
    );
    
    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Announcement created successfully.'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Failed to create announcement: ' . $stmt->error
        ]);
    }
    
    $stmt->close();
    exit;
}
elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Delete announcement
    $id = $_GET['id'] ?? null;
    
    if (!$id) {
        echo json_encode([
            'success' => false,
            'message' => 'Announcement ID is required.'
        ]);
        exit;
    }
    
    $stmt = $conn->prepare("DELETE FROM announcementtable WHERE id = ?");
    
    if (!$stmt) {
        echo json_encode([
            'success' => false,
            'message' => 'Database error: ' . $conn->error
        ]);
        exit;
    }
    
    $stmt->bind_param("i", $id);
    
    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Announcement deleted successfully.'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Failed to delete announcement: ' . $stmt->error
        ]);
    }
    
    $stmt->close();
    exit;
}

$conn->close();
?>