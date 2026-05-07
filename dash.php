<?php
session_start();
include('connection.php');

header("Content-Type: application/json");

if(!isset($_SESSION['userEmail'])){
    echo json_encode([
        "bookings" => [],
        "payments" => []
    ]);
    exit;
}

$email = $_SESSION['userEmail'];


// BOOKINGS WITH USER INFO (INNER JOIN)
$bookings = [];

$sql1 = "
SELECT 
    bookings.*,
    users.userName
FROM bookings
INNER JOIN users
ON bookings.userEmail = users.userEmail
WHERE bookings.userEmail = '$email'
ORDER BY bookings.booking_id DESC
";

$result1 = mysqli_query($conn, $sql1);

while($row = mysqli_fetch_assoc($result1)){
    $bookings[] = $row;
}


// PAYMENTS WITH BOOKING INFO (INNER JOIN)
$payments = [];

$sql2 = "
SELECT 
    payments.*,
    bookings.accommodation_name
FROM payments
INNER JOIN bookings
ON payments.booking_id = bookings.booking_id
WHERE payments.userEmail = '$email'
ORDER BY payments.payment_date DESC
";

$result2 = mysqli_query($conn, $sql2);

while($row = mysqli_fetch_assoc($result2)){
    $payments[] = $row;
}

echo json_encode([
    "bookings" => $bookings,
    "payments" => $payments
]);
?>