<?php
$services = [];
require '../config/functions.php';
$name = filter_var($_POST['name'], FILTER_SANITIZE_STRING );
$date = filter_var($_POST['date'], FILTER_SANITIZE_STRING);    
$timeId = (int) filter_var($_POST['time'], FILTER_VALIDATE_INT);
$services = $_POST['services'];
$totalPrice = (float) filter_var($_POST['totalPrice'], FILTER_SANITIZE_NUMBER_FLOAT);

if(isset($_POST)) {
    require '../config/database.php';
    try {
        $query = "INSERT INTO shifts (name, date, time, total_price) VALUES ('${name}', '${date}', ${timeId}, ${totalPrice})";
        $stmt = $conn->prepare($query);
        $stmt->execute();
        // echo json_encode($services);
        if($stmt->affected_rows) {
            $idInsert = $stmt->insert_id;
            $query = insertServices($services, $idInsert);
            $stmt = $conn->prepare($query);
            $stmt->execute();
            if ($stmt->affected_rows) {
                $response = array(
                    'response' => 'ok', 
                    'id_insert' => $idInsert,
                    'id_shift_service' => $stmt->insert_id,
                );
            } else {
                $response = array(
                    'response' => 'error'
                );
            }
        } else {
            $response = array(
                'response' => 'error'
            );
        }
        $stmt->close();
        $conn->close();
        
    } catch (Exception $e) {
        $response = array(
            'error' => $e->getMessage()
        );
    }
    echo json_encode($response);
}

function insertServices($services, $idInsert) {
    $query = " INSERT INTO shifts_services (shift, service) VALUES ";
    for($i = 0; $i < count($services); $i++) {
        $service = (int) filter_var($services[$i], FILTER_VALIDATE_INT);
        if($i == count($services) - 1) {
            $query .= "(${idInsert}, ${service}); ";
        } else {
            $query .= "(${idInsert}, ${service}), ";
        }
    }
    // echo json_encode($query);    
    return $query;
}