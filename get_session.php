<?php
session_start();
// This tells the JavaScript: "The person logged in is user@email.com"
echo json_encode(['email' => $_SESSION['userEmail'] ?? null]);
?>