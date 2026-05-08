<?php
session_start();
include('connection.php');

$email = $_SESSION['email'];

$current = $_POST['current'];
$new = $_POST['new'];

// check current password
$check = "SELECT password FROM users WHERE userEmail='$email'";
$result = mysqli_query($conn, $check);
$row = mysqli_fetch_assoc($result);

if ($row['password'] !== $current) {
    echo "fail";
    exit;
}

// update password
$sql = "UPDATE users SET password='$new' WHERE userEmail='$email'";

if (mysqli_query($conn, $sql)) {
    echo "success";
} else {
    echo "error";
}
?>