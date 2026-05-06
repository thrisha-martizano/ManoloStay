<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

include('connection.php'); 

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $fullname = $_POST['fullname'];
    $email = $_POST['userEmail'];
    $contactNo = $_POST['contactNo'];
    $check_in = $_POST['check_in'];
    $check_out = $_POST['check_out'];
    $guests = $_POST['guests'];
    $status = "Pending";

    // 👉 INSERT BOOKING
    $query = "INSERT INTO bookings 
    (fullname, userEmail, contactNo, check_in, check_out, guests, status) 
    VALUES 
    ('$fullname','$email', '$contactNo', '$check_in', '$check_out', '$guests', '$status')";

    if (mysqli_query($conn, $query)) {

        // ✅ GET LAST BOOKING ID
        $booking_id = mysqli_insert_id($conn);

        // ✅ CREATE PAYMENT DATA
        $bookingName = $fullname; // or change to accommodation if you have it
        $amount = 0; // ⚠️ CHANGE THIS if you have price
        $method = "GCash";
        $payment_status = "Pending"; // match your booking status
        $date = date("Y-m-d");

        // ✅ INSERT PAYMENT
       $paymentQuery = "INSERT INTO payment
(booking_id, userEmail, bookingName, payment_date, amount, method, status)
VALUES 
('$booking_id', '$email', '$bookingName', '$date', '$amount', '$method', '$payment_status')";
        mysqli_query($conn, $paymentQuery);

        echo "Success";

    } else {
        echo "SQL Error: " . mysqli_error($conn); 
    }
}
?>