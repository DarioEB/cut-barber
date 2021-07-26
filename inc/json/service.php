<?php

require '../config/functions.php';

$service_id = (int) filter_var($_POST['service_id'], FILTER_VALIDATE_INT);

$service = getService($service_id);

echo json_encode($service);
