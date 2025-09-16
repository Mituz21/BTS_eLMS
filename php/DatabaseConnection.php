<?php

$host = "localhost";
$user = "root";
$pass = "";
$dbname = "elms_database";

$conn = new mysqli($host, $user, $pass, $dbname);

if($conn->connect_error){
    die("Connection Failed: " . $conn->connect_error);
}

?>