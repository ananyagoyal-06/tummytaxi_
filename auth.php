<?php
header("Content-Type: application/json");
include "config.php";

$data = json_decode(file_get_contents("php://input"), true);

$action = $_GET['action'] ?? '';

if ($action == "register") {

    $name = $data['name'];
    $email = $data['email'];
    $password = $data['password'];

    $password = md5($password);

    $sql = "INSERT INTO users (name, email, password) 
            VALUES ('$name', '$email', '$password')";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["success" => true, "message" => "User registered"]);
    } else {
        echo json_encode(["error" => $conn->error]);
    }

}

elseif ($action == "login") {

    $email = $data['email'];
    $password = md5($data['password']);

    $sql = "SELECT * FROM users WHERE email='$email' AND password='$password'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        echo json_encode(["success" => true, "message" => "Login successful"]);
    } else {
        echo json_encode(["success" => false, "message" => "Invalid credentials"]);
    }
}

else {
    echo json_encode(["message" => "Invalid action"]);
}
?>