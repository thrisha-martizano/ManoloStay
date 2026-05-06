<?php
include('connection.php');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Collect data using the 'name' tags from your HTML
    $userEmail     = mysqli_real_escape_string($conn, $_POST['userEmail']);
    $bookingName   = mysqli_real_escape_string($conn, $_POST['bookingName']);
    $amount        = mysqli_real_escape_string($conn, $_POST['amount']);
    $fullname      = mysqli_real_escape_string($conn, $_POST['fullname']);
    $contactNo     = mysqli_real_escape_string($conn, $_POST['contactNo']);
    
    // Static values for a new payment
    $method = "GCash"; 
    $status = "Paid";
    $date   = date("Y-m-d");

    // SQL command matching image_e55f44.png and image_e5c45b.png
    $sql = "INSERT INTO payments (userEmail, bookingName, amount, method, status, payment_date) 
            VALUES ('$userEmail', '$bookingName', '$amount', '$method', '$status', '$date')";

    if (mysqli_query($conn, $sql)) {
        // Redirect to your Payments page to see the new record
        header("Location: payments.html");
        exit();
    } else {
        echo "Error: " . mysqli_error($conn);
    }
}
?>