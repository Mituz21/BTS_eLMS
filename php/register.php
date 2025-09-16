<?php

require 'DatabaseConnection.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $firstName   = trim($_POST['fname']);
    $middleName  = trim($_POST['mname']);
    $lastName    = trim($_POST['lname']);
    $nameSuffix  = trim($_POST['suffix']);

    $address     = trim($_POST['address']);
    $gender      = $_POST['gender'];
    $bdate       = isset($_POST['bdate']) ? $_POST['bdate'] : null;
    $role        = "guest";

    $cnum        = $_POST['cnum'];
    $mobileNumber = preg_replace('/^0/', '+63', trim($cnum));
    $education   = trim($_POST['education']);
    $email       = trim($_POST['uname']);
    $password    = trim($_POST['password']);
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    $bio         = "Student of Benguet Technical School";
    $year        = date("Y");
    $prefix      = $year . "G-";
    $dateCreated = date('Y-m-d');

    $age = null;
    if (!empty($bdate)) {
        $birthDateObj = new DateTime($bdate);
        $today = new DateTime();
        $age = $today->diff($birthDateObj)->y;
    }

    $query = "SELECT userID FROM userstable WHERE userID LIKE ? ORDER BY id DESC LIMIT 1";
    $like  = $prefix . "%";
    $stmt  = $conn->prepare($query);
    $stmt->bind_param("s", $like);
    $stmt->execute();
    $res = $stmt->get_result();

    if ($res && $row = $res->fetch_assoc()) {
        $lastNum = (int)substr($row['userID'], strlen($prefix));
        $newID = $lastNum + 1;
    } else {
        $newID = 1;
    }

    do {
        $userID = $prefix . str_pad($newID, 5, "0", STR_PAD_LEFT);
        $check = $conn->prepare("SELECT COUNT(*) AS cnt FROM userstable WHERE userID = ?");
        $check->bind_param("s", $userID);
        $check->execute();
        $count = $check->get_result()->fetch_assoc()['cnt'];
        $check->close();

        if ($count > 0) {
            $newID++;
        } else {
            break;
        }
    } while (true);

    $sqlSend = "INSERT INTO userstable
                (userID, firstName, middleName, lastName, suffix, gender, age, birthDate, bio, role, mobileNumber, email, password, education, dateCreated)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    $statement = $conn->prepare($sqlSend);
    $statement->bind_param(
        "ssssssissssssss",
        $userID,
        $firstName,
        $middleName,
        $lastName,
        $nameSuffix,
        $gender,
        $age,
        $bdate,
        $bio,
        $role,
        $mobileNumber,
        $email,
        $hashedPassword,
        $education,
        $dateCreated
    );

    if ($statement->execute()) {
        echo json_encode(["status" => "success", "message" => "User Registered! $userID"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Error: " . $statement->error]);
    }

    $statement->close();
    $conn->close();
}

?>
