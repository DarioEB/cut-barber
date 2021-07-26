<?php

require '../config/functions.php';

$services = getServices();

echo json_encode($services);