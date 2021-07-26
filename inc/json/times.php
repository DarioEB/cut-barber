<?php 

$date = filter_var($_POST['date'], FILTER_SANITIZE_STRING);

require '../config/functions.php';

$times = requestTimes($date);

echo json_encode($times);