<?php
require_once 'DatabaseConnection.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $firstName = $_POST['firstName'];
    $middleName = $_POST['middleName'];
    $lastName = $_POST['lastName'];
    $suffix = $_POST['suffix'];
    $gender = $_POST['gender'];
    $birthDate = $_POST['birthDate'];
    $bio = $_POST['bio'];
    $role = "trainer";

    $cnum = $_POST['mobileNumber'];
    $mobileNumber = preg_replace('/^0/', '+63', trim($cnum));

    $education = $_POST['education'];
    $dateCreated = date("Y-m-d");

    $birthDateObj = new DateTime($birthDate);
    $today = new DateTime();
    $age = $today->diff($birthDateObj)->y;

    $year = date("Y");
    $prefix = $year . "T-";

    $query = "SELECT userID FROM userstable WHERE userID LIKE ? ORDER BY id DESC LIMIT 1";
    $like = $prefix . "%";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $like);
    $stmt->execute();
    $res = $stmt->get_result();

    if ($res && $row = $res->fetch_assoc()) {
        $lastNum = (int) substr($row['userID'], strlen($prefix));
        $newID = $lastNum + 1;
    } else {
        $newID = 1;
    }
    $stmt->close();

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
    $email = strtolower($firstName . "." . $lastName) . "@bts.gov.ph";
    $plainPassword = $userID;
    $hashedPassword = password_hash($plainPassword, PASSWORD_BCRYPT);

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
        $suffix,
        $gender,
        $age,
        $birthDate,
        $bio,
        $role,
        $mobileNumber,
        $email,
        $hashedPassword,
        $education,
        $dateCreated
    );

    if ($statement->execute()) {
        $statement->close();

        $trainerName = trim($firstName . " " . $middleName . " " . $lastName . " " . $suffix);
        $stmt2 = $conn->prepare("INSERT INTO trainerstable 
                                        (trainerID, trainerName, status, assignedDate) 
                                        VALUES (?, ?, 'active', ?)");
        $stmt2->bind_param("sss", $userID, $trainerName, $dateCreated);
        $stmt2->execute();
        $stmt2->close();

        echo json_encode([
            'status' => 'success',
            'userID' => $userID,
            'email' => $email,
            'password' => $plainPassword
        ]);
        exit;
    } else {
        echo json_encode(["status" => "error", "message" => "Error: " . $statement->error]);
        $statement->close();
    }

    $conn->close();
}
?>