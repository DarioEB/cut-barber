<?php

include '../config/functions.php';

$date = filter_var($_POST['date'], FILTER_SANITIZE_STRING);

$shifts = requestShifts($date);

echo json_encode($shifts);
