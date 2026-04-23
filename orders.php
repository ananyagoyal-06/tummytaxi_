<?php
header("Content-Type: application/json");

$conn = new mysqli("localhost", "root", "", "tummytaxi");

if ($conn->connect_error) {
    echo json_encode(["success" => false, "error" => "DB connection failed"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["success" => false, "error" => "No data received"]);
    exit;
}

$customer_name = $data['name'] ?? "Guest";
$total = $data['total'] ?? 0;

$order_number = "TT" . rand(1000,9999);
$restaurant_name = "Tummy Taxi";
$status = "Pending";

$sql = "INSERT INTO orders (order_number, customer_name, restaurant_name, total_amount, status)
VALUES ('$order_number', '$customer_name', '$restaurant_name', '$total', '$status')";

if ($conn->query($sql)) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => $conn->error]);
}
?>