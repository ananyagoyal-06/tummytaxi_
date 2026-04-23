<?php
header("Content-Type: application/json");
include "config.php";

$action = $_GET['action'] ?? '';

if ($action == "orders") {

    $result = $conn->query("SELECT * FROM orders ORDER BY id DESC");

    $orders = [];

    while ($row = $result->fetch_assoc()) {
        $orders[] = $row;
    }

    echo json_encode($orders);
}

elseif ($action == "stats") {

    $totalOrders = $conn->query("SELECT COUNT(*) as total FROM orders")->fetch_assoc()['total'];
    $totalRevenue = $conn->query("SELECT SUM(total_amount) as revenue FROM orders")->fetch_assoc()['revenue'];

    echo json_encode([
        "total_orders" => $totalOrders,
        "total_revenue" => $totalRevenue
    ]);
}

else {
    echo json_encode(["message" => "Invalid action"]);
}
?>