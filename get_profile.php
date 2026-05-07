<?php
include "connection.php";

$email = $_GET['email'];

$sql = "SELECT * FROM user WHERE userEmail=?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();

$result = $stmt->get_result();
echo json_encode($result->fetch_assoc());
?>