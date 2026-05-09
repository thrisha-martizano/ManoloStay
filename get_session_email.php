<?php
// Returns the current PHP session email as JSON
// Used as fallback when localStorage is empty
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
header("Content-Type: application/json");

$email = $_SESSION['userEmail'] ?? null;
echo json_encode(["email" => $email]);
?>