<?php

require '../config/functions.php';

$id = (int) filter_var($_POST['id'], FILTER_VALIDATE_INT);

$category = getCategory($id);

echo json_encode($category);

