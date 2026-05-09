<?php
session_start(); 
error_reporting(E_ALL);
ini_set('display_errors', 1);
include('connection.php');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $fullname   = $_POST['fullname'];
    $email      = $_POST['userEmail'];
    $contactNo  = $_POST['contactNo'];
    $check_in   = $_POST['check_in'];
    $check_out  = $_POST['check_out'];
    $guests     = $_POST['guests'];
    $status     = "Pending";
    $amount     = $_POST['amount'];
    $bookingName = $_POST['accommodation_name'];

    // this is SET THE SESSION so that dash.php, get_bookings.php, payments.php can find the user
    $_SESSION['userEmail'] = $email;

    //  FOR INSERT BOOKING
    $query = "INSERT INTO bookings
    (fullname, userEmail, contactNo, accommodation_name, check_in, check_out, guests, amount, status)
    VALUES
    ('$fullname','$email','$contactNo','$bookingName','$check_in','$check_out','$guests','$amount','$status')";

    if (mysqli_query($conn, $query)) {
        $booking_id = mysqli_insert_id($conn);

        // FOR PAYMENT DATA
        $method         = "GCash";
        $payment_status = "paid";
        $date           = date("Y-m-d");

        // FOR INSERT PAYMENT
        $paymentQuery = "INSERT INTO payments
        (booking_id, userEmail, bookingName, payment_date, amount, method, status)
        VALUES
        ('$booking_id', '$email', '$bookingName', '$date', '$amount', '$method', '$payment_status')";

        mysqli_query($conn, $paymentQuery);

        header("Location: dash.html");
        exit;
    } else {
        echo "SQL Error: " . mysqli_error($conn);
    }
}
?>