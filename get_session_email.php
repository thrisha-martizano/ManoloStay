<?php

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
header("Content-Type: application/json");

$email = $_SESSION['userEmail'] ?? null;
echo json_encode(["email" => $email]);
?>