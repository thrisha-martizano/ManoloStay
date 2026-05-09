<?php
// gaset sa database connection details
$servername = "localhost"; 
$username = "root";        
$password = "";            
$database = "manolostay_db";

// Create the connection
$conn = mysqli_connect($servername, $username, $password, $database);

//gacheck if the connection was successful
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}
// echo only for debugging
// echo "Connected successfully!";
?>