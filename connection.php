<?php
// Step 1: Set your database connection details
$servername = "localhost"; 
$username = "root";        
$password = "";            
$database = "manolostay_db";

// Step 2: Create the connection
$conn = mysqli_connect($servername, $username, $password, $database);

// Step 3: Check if the connection was successful
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}
// echo only for debugging
// echo "Connected successfully!";
?>