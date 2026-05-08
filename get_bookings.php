<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
include('connection.php');
header("Content-Type: application/json");

$email = null;
if (!empty($_SESSION['userEmail'])) {
    $email = trim($_SESSION['userEmail']);
} else {
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

$sql = "SELECT * FROM bookings
        WHERE LOWER(TRIM(userEmail)) = LOWER(TRIM('$email'))
        ORDER BY booking_id DESC";

$result = mysqli_query($conn, $sql);
$bookings = [];
if ($result) {
    while ($row = mysqli_fetch_assoc($result)) $bookings[] = $row;
}

echo json_encode($bookings);
?>