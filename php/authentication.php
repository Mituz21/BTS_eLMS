<?php

session_start();

function authenticate()
{
    if (!isset($_SESSION["userID"])) {
        header("Location: ../index.php");
        exit();
    }
}
?>