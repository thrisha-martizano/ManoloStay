<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
include('connection.php');
header("Content-Type: application/json");

$email = null;

if (!empty($_SESSION['userEmail'])) {
    $email = trim($_SESSION['userEmail']);
}

if (!$email) {
    $body = file_get_contents("php://input");
    $data = json_decode($body, true);
    if (!empty($data['email'])) {
        $email = trim($data['email']);
        $_SESSION['userEmail'] = $email;
    }
}

if (!$email) {
    echo json_encode([]);
    exit;
}

$email = mysqli_real_escape_string($conn, $email);

// ✅ LOWER() on both sides = case-insensitive match (fixes Gmail capitalisation issues)
$sql = "SELECT * FROM payments
        WHERE LOWER(TRIM(userEmail)) = LOWER(TRIM('$email'))
        ORDER BY payment_date DESC";

$result = mysqli_query($conn, $sql);

if (!$result) {
    echo json_encode(["error" => mysqli_error($conn)]);
    exit;
}

$payments = [];
while ($row = mysqli_fetch_assoc($result)) {
    $payments[] = $row;
}

echo json_encode($payments);
?>