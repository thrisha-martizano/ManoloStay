<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
include('connection.php');

$email       = trim($_POST['email']          ?? '');

$currentPass = trim($_POST['currentPassword'] ?? '');
$newPass     = trim($_POST['newPassword']     ?? '');

if (!$email || !$currentPass || !$newPass) {
    echo "Please fill in all fields.";
    exit;
}

$email = mysqli_real_escape_string($conn, $email);

// Check current password matches DB
$check  = "SELECT password FROM users WHERE LOWER(TRIM(userEmail)) = LOWER(TRIM('$email'))";
$result = mysqli_query($conn, $check);
$row    = mysqli_fetch_assoc($result);

if (!$row) {
    echo "User not found.";
    exit;
}

if ($row['password'] !== $currentPass) {
    echo "Current password is incorrect.";
    exit;
}

// Update to new password
$newPass = mysqli_real_escape_string($conn, $newPass);
$sql     = "UPDATE users SET password='$newPass' WHERE LOWER(TRIM(userEmail)) = LOWER(TRIM('$email'))";

if (mysqli_query($conn, $sql)) {
    echo "success";
} else {
    echo "Database error: " . mysqli_error($conn);
}
?>