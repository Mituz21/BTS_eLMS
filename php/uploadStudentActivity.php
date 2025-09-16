<?php

session_start();
require_once "DatabaseConnection.php";

header("Content-Type: application/json");

$studentID = $_SESSION["userID"] ?? NULL;
if (!$studentID) {
    echo json_encode(['status' => 'error', 'message'=> 'Not logged in']);
    exit;
}

$activityID = $_POST['activity_id'] ?? NULL;
if (!$activityID) {
    echo json_encode(['status'=> 'error', 'message'=> 'Nothing selected']);
    exit;
}

if(!isset($_FILES['file-input']) || $_FILES['file-input']['error'] !== UPLOAD_ERR_OK) {
    echo json_encode(['status'=> 'error','message'=> 'Error on uploading the file.']);
    exit;
}

$uploadDir = "../uploads/submissions/";
if(!is_dir($uploadDir)){
    mkdir($uploadDir,0755, true);
}

$fileTmp = $_FILES['file-input']['tmp_name'];
$fileName = basename($_FILES['file-input']['name']);
$ext = pathinfo($fileName, PATHINFO_EXTENSION);

$newFileName = "Activity-" .$activityID . " " .$studentName . "." .$ext;
$destination = $uploadDir . $newFileName;

$filePath ="uploads/submissions/" . $newFileName;

$databaseCheck = "SELECT id FROM submissionstable WHERE activity_id = ? AND student_id = ?";
$stmt = $conn -> prepare($databaseCheck);
$stmt -> bind_param("ii", $activityID, $studentID);
$stmt -> execute();
$stmt -> store_result();

if ($stmt -> num_rows > 0) {
    echo json_encode(["status"=> "error","message"=> "Activity has been submitted already"]);
    $stmt -> close();
    $conn -> close();
    exit;
}
$stmt -> close();

$uploadActivity = "INSERT INTO submissionstable (activity_id, student_id, file_path, submitted_at) VALUES (?,?,?,NOW())";
$stmt = $conn -> prepare($uploadActivity);
$stmt -> bind_param("iis", $activity_id, $studentID);

?>