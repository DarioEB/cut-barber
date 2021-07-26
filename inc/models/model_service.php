<?php

$action = (isset($_POST['action'])) ?  $_POST['action'] : null;
$name = (isset($_POST['name'])) ? $_POST['name'] : null;
$price = (isset($_POST['price'])) ? (float) $_POST['price'] : null;
$category = (isset($_POST['category'])) ? (int) $_POST['category'] : null;
$id = (isset($_POST['id'])) ? (int) $_POST['id'] : null;
$enabled = (isset($_POST['enabled'])) ? (int) $_POST['enabled'] : null;

if($action === 'add') {
    try {
        require '../config/database.php';
        $query = "INSERT INTO services (name, price, category, enabled) VALUES ('${name}', ${price}, ${category}, 1); ";

        $stmt = $conn->prepare($query);
        $stmt->execute();
        if($stmt->affected_rows) {
            $response = array(
                'response' => 'ok',
                'text' => "El servicio '${name}' se agregó correctamente",
                'title' => 'Servicio Agregado correctamente'
            );
        } else {
            $response = array(
                'response' => 'error'
            );
        }

        $conn->close();
        
    } catch (Exception $e) {
        $response = array(
            'response' => $e->getMessage()
        );
    }
    echo json_encode($response);
}

if($action === 'edit' && !is_null($id)) {
    try {
        require '../config/database.php';
        $query = " UPDATE services SET"; 
        $query .= " name = '${name}', price = ${price}, category = ${category}";
        $query .= " WHERE id = ${id}; ";

        $stmt = $conn->prepare($query);
        $stmt->execute();
        if($stmt->affected_rows) {
            $response = array(
                'response' => 'ok',
                'text' => "El servicio '${name}' se editó correctamente",
                'title' => 'Servicio editado correctamente'
            );
        } else {
            $response = array(
                'response' => 'error'
            );
        }
        $conn->close();
    } catch (Exception $e) {
        $response = array(
            'error' => $e->getMessage()
        );
    }

    echo json_encode($response);
}

if($action === 'delete' && !is_null($id)) {
    try {
        require '../config/database.php';
        $query = " UPDATE services SET"; 
        $query .= " enabled = ${enabled}";
        $query .= " WHERE id = ${id}; ";

        $stmt = $conn->prepare($query);
        $stmt->execute();
        
        if($stmt->affected_rows) {
            $status = ($enabled === 0) ? 'Deshabilitó' : 'Habilitó';
            $response = array(
                'response' => 'ok',
                'text' => "El servicio '${name}' se ${status} correctamente",
                'title' => 'Servicio editado correctamente'
            );
        } else {
            $response = array(
                'response' => 'error'
            );
        }
        $conn->close();
    } catch (Exception $e) {
        $response = array(
            'error' => $e->getMessage()
        );
    }
    echo json_encode($response);
}