<?php
// FILE LOCATION: ROOT folder (same as dash.php, connection.php)

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

include('connection.php');
header("Content-Type: application/json");

// Read the booking_id from POST JSON body
$body = file_get_contents("php://input");
$data = json_decode($body, true);

if (empty($data['booking_id'])) {
    echo json_encode(["success" => false, "error" => "No booking ID provided."]);
    exit;
}

$booking_id = intval($data['booking_id']);

// STEP 1: Update bookings table — set status to 'Cancelled'
$sql1 = "UPDATE bookings SET status = 'Cancelled' WHERE booking_id = $booking_id";
$result1 = mysqli_query($conn, $sql1);

if (!$result1) {
    echo json_encode(["success" => false, "error" => "Booking update failed: " . mysqli_error($conn)]);
    exit;
}

// STEP 2: Update payments table — set status to 'Refunded'
$sql2 = "UPDATE payments SET status = 'Refunded' WHERE booking_id = $booking_id";
$result2 = mysqli_query($conn, $sql2);

if (!$result2) {
    echo json_encode(["success" => false, "error" => "Payment update failed: " . mysqli_error($conn)]);
    exit;
}

echo json_encode(["success" => true]);
?>