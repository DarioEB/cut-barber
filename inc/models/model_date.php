<?php

$action = (isset($_POST['action'])) ? filter_var($_POST['action'], FILTER_SANITIZE_STRING) : null;
$date = (isset($_POST['date'])) ? filter_var($_POST['date'], FILTER_SANITIZE_STRING) : null;
$id = (isset($_POST['id'])) ? (int) filter_var($_POST['id'], FILTER_VALIDATE_INT) : null;

if($action === 'disable') {
    try {
        require '../config/database.php';

        $query = "INSERT INTO date_disabled (date) VALUES ('${date}')";

        $stmt = $conn->prepare($query);
        $stmt->execute();
        if($stmt->affected_rows) {
            $response = array(
                'response' => 'ok',
                'title' => 'Fecha deshibilitada',
                'text' => "La fecha '${date}' se deshibilitó correctamente"
            );
        } else {
            $response = array(
                'response' => 'error'
            );
        }

    } catch (Exception $e) {
        $response = array(
            'error' => $e->getMessage()
        );
    }
    echo json_encode($response);
}

if($action === 'enable' && !is_null($id)) {
    try {
        require '../config/database.php';

        $query = "DELETE FROM date_disabled WHERE id = ${id}";

        $stmt = $conn->prepare($query);
        $stmt->execute();
        if($stmt->affected_rows) {
            $response = array(
                'response' => 'ok',
                'title' => 'Fecha Habilitada',
                'text' => "La fecha ${date} se deshibilitó correctamente"
            );
        } else {
            $response = array(
                'response' => 'error'
            );
        }

    } catch (Exception $e) {
        $response = array(
            'error' => $e->getMessage()
        );
    }
    echo json_encode($response);
}

if($action === 'verify') {
    require '../config/functions.php';

    $response = verifyDate($date);

    echo json_encode($response);
}