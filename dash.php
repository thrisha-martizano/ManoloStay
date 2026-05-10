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
    echo json_encode(["bookings" => [], "payments" => []]);
    exit;
}

$email = mysqli_real_escape_string($conn, $email);

//To provide a personalized dashboard, a LEFT JOIN is used to combine the bookings and users tables. 
//This allows the system to display the user's name alongside their specific booking details by linking them via the userEmail field.

$bookings = [];
$sql1 = "SELECT bookings.*, users.userName
         FROM bookings
         LEFT JOIN users ON LOWER(TRIM(bookings.userEmail)) = LOWER(TRIM(users.userEmail))
         WHERE LOWER(TRIM(bookings.userEmail)) = LOWER(TRIM('$email'))
         ORDER BY bookings.booking_id DESC";
         
$result1 = mysqli_query($conn, $sql1);
if ($result1) {
    while ($row = mysqli_fetch_assoc($result1)) $bookings[] = $row;
}

$payments = [];
$sql2 = "SELECT * FROM payments
         WHERE LOWER(TRIM(userEmail)) = LOWER(TRIM('$email'))
         ORDER BY payment_date DESC";
$result2 = mysqli_query($conn, $sql2);
if ($result2) {
    while ($row = mysqli_fetch_assoc($result2)) $payments[] = $row;
}

echo json_encode(["bookings" => $bookings, "payments" => $payments]);
?>