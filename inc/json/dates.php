<?php 

require '../config/functions.php';

$dates = getDisableDates();

echo json_encode($dates);