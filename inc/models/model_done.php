<?php 

$shift_id = (int) filter_var($_POST['shift_id'], FILTER_VALIDATE_INT);
$done = (int) filter_var($_POST['done'], FILTER_VALIDATE_INT);

if(isset($_POST)){
    try {
        require '../config/database.php';

        $query = "UPDATE shifts SET done = ${done} WHERE id = ${shift_id};";
        // echo json_encode($query);
        $stmt = $conn->prepare($query);
        $stmt->execute();
        // echo json_encode($stmt);
        if($stmt->affected_rows) {
            $response = array(
                'response' => 'ok'
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