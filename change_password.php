<?php
session_start();
include('connection.php');

$email = $_SESSION['email'];

$current = $_POST['current'];
$new = $_POST['new'];

$sql = "SELECT password FROM users WHERE userEmail='$email'";
$result = mysqli_query($conn, $sql);
$row = mysqli_fetch_assoc($result);

if (password_verify($current, $row['password'])) {

    $hashed = password_hash($new, PASSWORD_DEFAULT);

    $update = "UPDATE users SET password='$hashed' WHERE userEmail='$email'";
    mysqli_query($conn, $update);

    echo "success";
} else {
    echo "wrong";
}
?>