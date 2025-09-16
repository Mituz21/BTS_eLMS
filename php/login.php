<?php
require 'DatabaseConnection.php';
session_start();

if ($_SERVER['REQUEST_METHOD'] === "POST") {
    $user = $_POST["username"];
    $password = $_POST["pass"];

    $stmt = $conn->prepare("SELECT id, userID, role, firstName, password 
                            FROM userstable 
                            WHERE userID = ? OR email = ?");
    $stmt->bind_param("ss", $user, $user);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();

    header("Content-Type: application/json");

    if ($row && password_verify($password, $row['password'])) {
        $_SESSION['userID'] = $row['userID'];
        $_SESSION['role'] = $row['role'];
        $_SESSION['firstName'] = $row['firstName'];

        if ($row['role'] == 'trainee' || $row['role'] == 'guest') {
            $page = "./html/student.php#dashboard";
        } elseif ($row['role'] == 'trainer') {
            $page = "./html/trainer-page.php#dashboard";
        } elseif ($row['role'] == 'admin') {
            $page = "./html/admin.php#trainerMgt";
        }

        $data = [
            "status" => "success",
            "role" => $row["role"],
            "redirect" => $page
        ];

        echo json_encode($data);
        exit;
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Invalid Username or Password!"
        ]);
        exit;
    }
}
?>
