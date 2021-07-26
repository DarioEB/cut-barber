<?php 

$action = (isset($_POST['action'])) ? filter_var($_POST['action'], FILTER_SANITIZE_STRING) : null;
$name = (isset($_POST['name'])) ? filter_var($_POST['name'], FILTER_SANITIZE_STRING) : null;
$id = (isset($_POST['id'])) ? (int) filter_var($_POST['id'], FILTER_VALIDATE_INT) : null;
$enabled = (isset($_POST['enabled'])) ? (int) filter_var($_POST['enabled'], FILTER_VALIDATE_INT) : null;

if($action === 'add-category') {
    try {
        require '../config/database.php';

        $query = "INSERT INTO categories (name, enabled) VALUES ('${name}', 1)";

        $stmt = $conn->prepare($query);
        $stmt->execute();
        if($stmt->affected_rows) {
            $response = array(
                'response' => 'ok',
                'title' => "Categoría agregada correctamente",
                'text' => "La categoría '${name}' se agregó correctamente"
            );
        } else {
            $response = array(
                'response' => 'error'
            );
        }
        $conn->close();
    } catch(Exception $e) {
        $response = array(
            'error' => $e->getMessage()
        );
    }
    echo json_encode($response);
}

if($action === 'edit-category' && !is_null($id)) {
    try {
        require '../config/database.php';

        $query = "UPDATE categories SET name = '${name}' WHERE id = ${id}; ";

        $stmt = $conn->prepare($query);
        $stmt->execute();
        if($stmt->affected_rows) {
            $response = array(
                'response' => 'ok',
                'title' => "Categoría editó correctamente",
                'text' => "La categoría '${name}' se editó correctamente"
            );
        } else {
            $response = array(
                'response' => 'error'
            );
        }
        $conn->close();
    } catch(Exception $e) {
        $response = array(
            'error' => $e->getMessage()
        );
    }
    echo json_encode($response);
}

if($action === 'delete' && !is_null($id)) {
    try {
        require '../config/database.php';

        $query = "UPDATE categories SET enabled = ${enabled} WHERE id = ${id}";

        $stmt = $conn->prepare($query);
        $stmt->execute();
        if($stmt->affected_rows) {
            $response = array(
                'response' => 'ok',
                'title' => "Categoría deshabilitada correctamente",
                'text' => "La categoría '${name}' se deshabilitó correctamente"
            );
        } else {
            $response = array(
                'response' => 'error'
            );
        }
        $conn->close();
    } catch(Exception $e) {
        $response = array(
            'error' => $e->getMessage()
        );
    }
    echo json_encode($response);
}   