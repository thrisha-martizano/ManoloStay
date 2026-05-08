<?php
include('connection.php');
header("Content-Type: application/json");

// 1. Get the booking ID from the JavaScript fetch request
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['booking_id'])) {
    echo json_encode(["success" => false, "error" => "No booking ID provided."]);
    exit;
}

$booking_id = mysqli_real_escape_string($conn, $data['booking_id']);

// 2. Start a transaction (to make sure BOTH tables update or neither does)
mysqli_begin_transaction($conn);

try {
    // A. Update the 'bookings' table to 'Cancelled'
    $sql_booking = "UPDATE bookings SET status = 'Cancelled' WHERE booking_id = '$booking_id'";
    if (!mysqli_query($conn, $sql_booking)) {
        throw new Exception("Failed to update booking status.");
    }

    // B. Update the 'payments' table to 'Refunded'
    // This links via the booking_id we just received
    $sql_payment = "UPDATE payments SET status = 'Refunded' WHERE booking_id = '$booking_id'";
    if (!mysqli_query($conn, $sql_payment)) {
        throw new Exception("Failed to update payment status.");
    }

    // 3. If everything worked, save the changes permanently
    mysqli_commit($conn);
    echo json_encode(["success" => true]);

} catch (Exception $e) {
    // 4. If something fails, undo everything to prevent data errors
    mysqli_rollback($conn);
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}

$conn->close();
?>