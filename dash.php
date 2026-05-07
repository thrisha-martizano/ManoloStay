<?php
header("Content-Type: application/json");
include('connection.php');

$data = json_decode(file_get_contents("php://input"), true);

$email = mysqli_real_escape_string($conn, $data['email']);


// BOOKINGS
$bookings = [];

$sql1 = "SELECT * FROM bookings
         WHERE userEmail = '$email'
         ORDER BY booking_id DESC";

$result1 = mysqli_query($conn, $sql1);

while($row = mysqli_fetch_assoc($result1)){
    $bookings[] = $row;
}


// PAYMENTS
$payments = [];

$sql2 = "SELECT * FROM payments
         WHERE userEmail = '$email'
         ORDER BY id DESC";

$result2 = mysqli_query($conn, $sql2);

while($row = mysqli_fetch_assoc($result2)){
    $payments[] = $row;
}


echo json_encode([
    "bookings" => $bookings,
    "payments" => $payments
]);
?>