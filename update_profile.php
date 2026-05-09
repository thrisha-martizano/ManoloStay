<?php
include "connection.php";

$oldEmail = $_POST['oldEmail'];
$name = $_POST['name'];
$email = $_POST['email'];

//This code updates user profile information using prepared statements. 
// Updates user account details & Uses prepared statements for security.

$sql = "UPDATE users SET userName=?, userEmail=? WHERE userEmail=?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sss", $name, $email, $oldEmail);

if ($stmt->execute()) {
    echo "updated";
} else {
    echo "error";
}
?>