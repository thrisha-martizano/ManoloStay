<?php
include('connection.php');

$id = $_POST['booking_id'];
$dates = $_POST['dates'];
$guests = $_POST['guests'];

$sql = "UPDATE bookings 
SET check_in = '$dates', guests = '$guests'
WHERE booking_id = $id";

mysqli_query($conn, $sql);

echo "updated";
?>