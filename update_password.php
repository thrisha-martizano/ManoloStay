<?php
include "connection.php";

$email = $_POST['email'];
$currentPassword = $_POST['currentPassword'];
$newPassword = $_POST['newPassword'];

// FIND USER
$sql = "SELECT * FROM user WHERE userEmail=?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows > 0) {

    $user = $result->fetch_assoc();

    // CHECK CURRENT PASSWORD
    if ($user['password'] === $currentPassword) {

        // UPDATE PASSWORD
        $update = "UPDATE users SET password=? WHERE userEmail=?";
        $stmt2 = $conn->prepare($update);
        $stmt2->bind_param("ss", $newPassword, $email);

        if ($stmt2->execute()) {
            echo "success";
        } else {
            echo "Failed to update password";
        }

    } else {
        echo "Current password is incorrect";
    }

} else {
    echo "User not found";
}
?>