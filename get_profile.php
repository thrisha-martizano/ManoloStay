<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
include('connection.php');
header("Content-Type: application/json");

$email = null;
if (!empty($_GET['email'])) {
    $email = trim($_GET['email']);
} elseif (!empty($_SESSION['userEmail'])) {
    $email = trim($_SESSION['userEmail']);
}

if (!$email) {
    echo json_encode(["error" => "No email provided"]);
    exit;
}

$email = mysqli_real_escape_string($conn, $email);

$sql    = "SELECT userName, userEmail FROM users WHERE LOWER(TRIM(userEmail)) = LOWER(TRIM('$email'))";
$result = mysqli_query($conn, $sql);

if (!$result || mysqli_num_rows($result) === 0) {
    echo json_encode(["error" => "User not found", "email_searched" => $email]);
    exit;
}

$user = mysqli_fetch_assoc($result);
echo json_encode($user);
?>