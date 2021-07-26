<?php

$username = $_POST['username'];
$password = $_POST['password'];

if(isset($_POST)) {
    require '../config/database.php';
    try {

        $query = "SELECT * FROM users WHERE username = '${username}';";
        $result = mysqli_query($conn, $query);

        if($result->num_rows) {
            $dataDB = mysqli_fetch_assoc($result);
            
            if ($dataDB['username'] === $username) {
                $password_hash = $dataDB['password'];

                if(password_verify($password, $password_hash)) {
                    $response = array(
                        'response' => 'ok'
                    );
                    session_start();
                    $_SESSION['admin'] = true;      
                } else {
                    $response = array(
                        'response' => 'Datos ingresados incorrectos'
                    ); 
                }
            } else {
                $response = array(
                    'response' => 'Datos ingresados incorrectos'
                );
            }
        } else {
            $response = array(
                'response' => 'Datos ingresados incorrectos'
            );
        }
        echo json_encode($response);
    } catch(Exception $e) {
        echo json_encode($e->getMessage());
    }
}