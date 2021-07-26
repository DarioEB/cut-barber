<?php

require '../config/functions.php';

$date = '2021-06-16';

$times = requestTimes($date);

echo json_encode($times);