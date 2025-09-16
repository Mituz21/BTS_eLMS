<?php

require 'DatabaseConnection.php';
session_start();

if (!isset($_SESSION['userID'])) {
    echo json_encode(["status" => "error", "message" => "No User Found! Please Login"]);
    exit;
}

$userID = $_SESSION['userID'];

$stmt = $conn->prepare('SELECT firstName, middleName, lastName, suffix, bio, mobileNumber, email, profileImage FROM userstable where userID = ?');
$stmt -> bind_param('s', $userID);
$stmt -> execute();
$result = $stmt -> get_result();
$row = $result -> fetch_assoc();

if($row){
    echo json_encode([
        'status'=> 'success',
        "data" => $row
    ]);
} else {
    echo json_encode(["status"=> "error", "message"=> "User Not Found"]);
}
?>