<?php

require '../config/functions.php';

$services = getCategories();

echo json_encode($services);