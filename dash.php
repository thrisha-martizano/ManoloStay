<?php
session_start();
include('connection.php');

$user_id = $_SESSION['user_id'];

// BOOKINGS
$bookings = [];
$sql1 = "SELECT b.*, a.name AS accommodation_name
         FROM bookings b
         JOIN accommodations a ON b.accommodation_id = a.accommodation_id
         WHERE b.user_id = $user_id";

$result1 = mysqli_query($conn, $sql1);
while($row = mysqli_fetch_assoc($result1)){
    $bookings[] = $row;
}

// PAYMENTS
$payments = [];
$sql2 = "SELECT * FROM payments p
         JOIN bookings b ON p.booking_id = b.booking_id
         WHERE b.user_id = $user_id";

$result2 = mysqli_query($conn, $sql2);
while($row = mysqli_fetch_assoc($result2)){
    $payments[] = $row;
}

// OUTPUT JSON
echo json_encode([
    "bookings" => $bookings,
    "payments" => $payments
]);
?>