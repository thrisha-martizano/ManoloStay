<?php
header("Content-Type: application/json");

include('connection.php'); // ✅ reuse your DB connection

$sql = "SELECT bookingName, payment_date, amount, method, status 
        FROM payments 
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