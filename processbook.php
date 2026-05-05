<?php
session_start();
include('connection.php');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // 1. Collect form data
    $userEmail   = $_SESSION['loggedInUser']; // The logged-in user
    $bookingName = mysqli_real_escape_string($conn, $_POST['bookingName']);
    $amount      = mysqli_real_escape_string($conn, $_POST['amount']);
    $method      = "GCash"; // Default for now
    $status      = "Pending"; // It starts as pending until paid
    $date        = date('Y-m-d'); // Today's date

    // 2. The INSERT command to fill your empty table
    $sql = "INSERT INTO payments (userEmail, bookingName, amount, method, status, payment_date) 
            VALUES ('$userEmail', '$bookingName', '$amount', '$method', '$status', '$date')";

    if (mysqli_query($conn, $sql)) {
        // 3. After saving, go straight to the Payments page to see the new row!
        header("Location: payment.html");
        exit();
    } else {
        echo "Error: " . mysqli_error($conn);
    }
}
?>