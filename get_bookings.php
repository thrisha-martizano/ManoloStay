<?php
header("Content-Type: application/json");
include('connection.php');

$data = json_decode(file_get_contents("php://input"), true);

$email = mysqli_real_escape_string($conn, $data['email']);

$sql = "SELECT * FROM bookings 
        WHERE userEmail = '$email'
        ORDER BY booking_id DESC";

$result = mysqli_query($conn, $sql);

$bookings = [];

while($row = mysqli_fetch_assoc($result)){
    $bookings[] = $row;
}

echo json_encode($bookings);
?>