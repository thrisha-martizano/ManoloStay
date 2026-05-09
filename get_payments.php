<?php
session_start();
include('connection.php');

header("Content-Type: application/json");

if(!isset($_SESSION['userEmail'])){
    echo json_encode([]);
    exit;
}

$email = $_SESSION['userEmail'];

//retrieves payment history from the database. Retrieves payment transactions & 
// Displays payment records dynamically

$sql = "SELECT * FROM payments
        WHERE userEmail = '$email'
        ORDER BY payment_date DESC";

$result = mysqli_query($conn, $sql);

$payments = [];

while($row = mysqli_fetch_assoc($result)){
    $payments[] = $row;
}

echo json_encode($payments);
?>