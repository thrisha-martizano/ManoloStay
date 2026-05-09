<?php

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

include('connection.php');
header("Content-Type: application/json");

$body = file_get_contents("php://input");
$data = json_decode($body, true);

if (empty($data['booking_id'])) {
    echo json_encode(["success" => false, "error" => "No booking ID provided."]);
    exit;
}

$booking_id = intval($data['booking_id']);

//  Update bookings table ang ga set sa status to 'Cancelled' booking nav
$sql1 = "UPDATE bookings SET status = 'Cancelled' WHERE booking_id = $booking_id";
$result1 = mysqli_query($conn, $sql1);

if (!$result1) {
    echo json_encode(["success" => false, "error" => "Booking update failed: " . mysqli_error($conn)]);
    exit;
}

// Update payments table ang ga sa set status to 'Refunded' in payment nav
$sql2 = "UPDATE payments SET status = 'Refunded' WHERE booking_id = $booking_id";
$result2 = mysqli_query($conn, $sql2);

if (!$result2) {
    echo json_encode(["success" => false, "error" => "Payment update failed: " . mysqli_error($conn)]);
    exit;
}

echo json_encode(["success" => true]);
?>