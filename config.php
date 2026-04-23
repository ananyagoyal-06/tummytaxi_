<?php
$conn = new mysqli("localhost","root","","tummytaxi");
if ($conn->connect_error) {
    die("Connection failed");
}
?>