<?php
include('connection.php'); // Your database connection file

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Collect data from the 'name' attributes in your HTML
    $fullname = $_POST['fullname'];
    $email = $_POST['userEmail'];
    $contactNo = $_POST['contactNo'];
    $check_in = $_POST['check_in'];
    $check_out = $_POST['check_out'];
    $guests = $_POST['guests'];
    $status = "Pending"; // Matches the 'status' column in your image

    // SQL matching image_e6b116.png columns
    $query = "INSERT INTO bookings (fullname, userEmail, contactNo, check_in, check_out, guests, status) 
              VALUES ('$fullname','$email', '$contactNo', '$check_in', '$check_out', '$guests', '$status')";

    if (mysqli_query($conn, $query)) {
        echo "<script>alert('Booking Saved to Database!'); window.location.href='books.php';</script>";
    } else {
        echo "Error: " . mysqli_error($conn);
    }
}
?>