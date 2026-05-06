<?php
session_start();
include('connection.php');

$email = $_SESSION['email'];

$name = $_POST['name'];
$phone = $_POST['phone'];
$dob = $_POST['dob'];
$address = $_POST['address'];

$sql = "UPDATE users 
SET userName='$name', phone='$phone', dob='$dob', address='$address'
WHERE userEmail='$email'";

mysqli_query($conn, $sql);

echo "updated";
?>