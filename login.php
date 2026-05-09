<?php
session_start();
include('connection.php');

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $email = $_POST['email'];
    $password = $_POST['password'];
    
//This function validates user login credentials using password_verify(). 
// Authenticates users securely. Creates user session after successful login

    $sql = "SELECT * FROM users WHERE userEmail='$email'";
    $result = mysqli_query($conn, $sql);

    if ($row = mysqli_fetch_assoc($result)) {

        if (password_verify($password, $row['password'])) {

            $_SESSION['userEmail'] = $row['userEmail'];
            $_SESSION['user_name'] = $row['userName'];

            header("Location: dash.html");
            exit();

        } else {
            echo "Wrong password!";
        }

    } else {
        echo "User not found!";
    }
}
?>