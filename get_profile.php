<?php
session_start();
include('connection.php');

$email = $_SESSION['email'];

$sql = "SELECT * FROM users WHERE userEmail = '$email'";
$result = mysqli_query($conn, $sql);

$user = mysqli_fetch_assoc($result);

echo json_encode($user);
?>