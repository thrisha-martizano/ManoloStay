<?php
session_start();
include('connection.php');

$user_id = $_SESSION['user_id'];

$sql = "SELECT * FROM bookings WHERE userEmail = (
    SELECT userEmail FROM users WHERE user_id = $user_id
)";

$result = mysqli_query($conn, $sql);

$bookings = [];

while($row = mysqli_fetch_assoc($result)){
    $bookings[] = $row;
}

echo json_encode($bookings);
?>