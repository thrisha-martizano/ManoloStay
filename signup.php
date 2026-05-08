<?php
session_start(); 
include('connection.php'); 

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = mysqli_real_escape_string($conn, $_POST['userName']);
$email = mysqli_real_escape_string($conn, $_POST['userEmail']);
$pass = password_hash($_POST['password'], PASSWORD_DEFAULT);

$sql = "INSERT INTO users (userName, userEmail, password)
VALUES ('$name', '$email', '$pass')";

    if (mysqli_query($conn, $sql)) {
        
        $_SESSION['loggedInUser'] = $email;

        // 2. Redirect to the dashboard
        header("Location: dash.html"); 
        exit(); 
    } else {
        echo "Error: " . mysqli_error($conn);
    }
}
?>