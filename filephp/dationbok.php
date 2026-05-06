<?php
error_reporting(E_ALL);
ini_set('display_errors', 1); // This will show errors in the F12 Console

include('<filephp>connection.php'); 

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $fullname = $_POST['fullname'];
    $email = $_POST['userEmail'];
    $contactNo = $_POST['contactNo'];
    $check_in = $_POST['check_in'];
    $check_out = $_POST['check_out'];
    $guests = $_POST['guests'];
    $status = "Pending";

    $query = "INSERT INTO bookings (fullname, userEmail, contactNo, check_in, check_out, guests, status) 
              VALUES ('$fullname','$email', '$contactNo', '$check_in', '$check_out', '$guests', '$status')";

    if (mysqli_query($conn, $query)) {
        echo "Success";
    } else {
        // This will print the exact SQL error to your JavaScript console
        echo "SQL Error: " . mysqli_error($conn); 
    }
}
?>