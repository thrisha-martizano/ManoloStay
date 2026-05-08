<?php
include "connection.php";

$oldEmail = $_POST['oldEmail'];
$name = $_POST['name'];
$email = $_POST['email'];

$sql = "UPDATE user SET userName=?, userEmail=? WHERE userEmail=?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sss", $name, $email, $oldEmail);

if ($stmt->execute()) {
    echo "updated";
} else {
    echo "error";
}
?>