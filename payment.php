<?php
header("Content-Type: application/json");
include('connection.php');

// GET JSON INPUT
$data = json_decode(file_get_contents("php://input"), true);
$email = mysqli_real_escape_string($conn, $data['email']);

$sql = "SELECT bookingName, payment_date, amount, method, status 
        FROM payments
        WHERE userEmail = '$email'
        ORDER BY payment_date DESC";

$result = $conn->query($sql);

$payments = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $payments[] = $row;
    }
}

echo json_encode($payments);
$conn->close();
?>