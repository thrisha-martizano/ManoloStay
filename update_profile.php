<?php
session_start();
include('connection.php'); // Your handshake file

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get the email from the session so we know which user to update[cite: 11]
    $email = $_SESSION['loggedInUser']; 
    
    // Collect the data sent from your prof.js fetch request
    $name    = mysqli_real_escape_with_string($conn, $_POST['name']);
    $phone   = mysqli_real_escape_with_string($conn, $_POST['phone']);
    $dob     = mysqli_real_escape_with_string($conn, $_POST['dob']);
    $address = mysqli_real_escape_with_string($conn, $_POST['address']);

    // Update the database columns you just added[cite: 14, 16]
    $sql = "UPDATE users SET 
            userName = '$name', 
            phone = '$phone', 
            dob = '$dob', 
            address = '$address' 
            WHERE userEmail = '$email'";

    if (mysqli_query($conn, $sql)) {
        echo "Success";
    } else {
        echo "Error: " . mysqli_error($conn);
    }
}
?>