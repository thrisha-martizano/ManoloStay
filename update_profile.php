<?php
session_start();
include('connection.php');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_SESSION['loggedInUser']; 
    
    // Collect the data sent from your prof.js fetch request
    $name    = mysqli_real_escape_with_string($conn, $_POST['name']);
    $phone   = mysqli_real_escape_with_string($conn, $_POST['phone']);
    $dob     = mysqli_real_escape_with_string($conn, $_POST['dob']);
    $address = mysqli_real_escape_with_string($conn, $_POST['address']);


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