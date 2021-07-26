<?php

function debug($var) {
    echo "<pre>";
    var_dump($var);
    echo "</pre>";
}

function getServices()  {
    try {
        $query = "SELECT * FROM services ORDER BY price";
        require 'database.php';
        $services = [];
        $i = 0;
        $servicesDB = mysqli_query($conn, $query);
        if($servicesDB->num_rows) {
            while($service = mysqli_fetch_assoc($servicesDB)) {
                $services[$i]['id'] = (int) $service['id'];
                $services[$i]['name'] = $service['name'];
                $services[$i]['price'] = (float) $service['price'];
                $services[$i]['category'] = (int) $service['category'];
                $services[$i]['enabled'] = (int) $service['enabled'];
                $i++;
            }
        }

        return $services;
    } catch (Exception $e) {
        echo $e->message;
    }
}

function getCategories() {
    try {
        $query = "SELECT * FROM categories";
        require 'database.php';
        $categories = [];
        $i = 0;
        $categoriesDB = mysqli_query($conn, $query);
        if($categoriesDB->num_rows) {
            while($category = mysqli_fetch_assoc($categoriesDB)){
                $categories[$i]['id'] = (int) $category['id'];
                $categories[$i]['name'] = $category['name'];
                $categories[$i]['enabled'] = (int) $category['enabled'];
                $i++;
            }
        }
        return $categories;
    } catch( Exception $e) {
        echo $e->message;
    }
}

function getService($id) {
    try {
        require 'database.php';

        $query = "SELECT id, name, price, category, enabled FROM services WHERE id = ${id}";

        $result = mysqli_query($conn, $query);
        $row = mysqli_fetch_assoc($result);

        $service[0]['id'] = (int) $row['id'];
        $service[0]['name'] =  $row['name'];
        $service[0]['price'] = (float) $row['price'];
        $service[0]['category'] = (int) $row['category'];
        $service[0]['enabled'] = (int) $row['enabled'];

        return $service;
    } catch (Exception $e) {
        return $e->getMessage();
    }
}

function getCategory($id) {
    try {
        require 'database.php';

        $query = "SELECT id, name, enabled FROM categories WHERE id = ${id}; ";

        $result = mysqli_query($conn, $query);
        $row = mysqli_fetch_assoc($result);
        
        $category[0]['id'] = (int) $row['id'];
        $category[0]['name'] = $row['name'];
        $category[0]['enabled'] = (int) $row['enabled'];

        return $category;
    } catch (Exception $e) {
        return $e->getMessage();
    }
}

function getTimes() {
    try {
        $query = "SELECT * FROM timestable";
        require 'database.php';
        $times = [];
        $i = 0;
        $timesDB = mysqli_query($conn, $query);
        if($timesDB->num_rows) {
            while($time = mysqli_fetch_assoc($timesDB)){
                $times[$i]['id'] = (int) $time['id'];
                $times[$i]['time'] = $time['time'];
                $i++;
            }
        }
        return $times;
    } catch( Exception $e) {
        echo $e->message;
    }
}

function requestTimes($date) {
    require 'database.php';
    try {
        $query_timesDisb = "SELECT time FROM shifts WHERE date = '${date}' ";
        
        $query_times = "SELECT id, time FROM timestable";

        $times_disb = mysqli_query($conn, $query_timesDisb);
        $times_db = mysqli_query($conn, $query_times);
        
        $i= 0;
        if($times_disb->num_rows) {
            while($time = mysqli_fetch_assoc($times_disb)) {
                $array_times_disb[$i]['id'] = (int) $time['time']; 
                $i++;
            }
            $i = 0;
            while($time = mysqli_fetch_assoc($times_db)) {
                $array_times_db[$i]['id'] = (int) $time['id'];
                $array_times_db[$i]['time'] = $time['time'];
                $i++;
            }
            // debug(count($array_times_disb));
            $k = 0;
            for($i = 0; $i < count($array_times_db); $i++) {
                $ban = false;
                for($j = 0; $j < count($array_times_disb); $j++) {
                    if($array_times_db[$i]['id'] == $array_times_disb[$j]['id']) {
                        $ban = true;
                    }
                }
                if (!$ban) {
                    $array_times_enab[$k]['id'] = $array_times_db[$i]['id'];
                    $array_times_enab[$k]['time'] = $array_times_db[$i]['time'];
                    $array_times_enab[$k]['disabled'] = 0;
                    $k++;
                } else {
                    $array_times_enab[$k]['id'] = $array_times_db[$i]['id'];
                    $array_times_enab[$k]['time'] = $array_times_db[$i]['time'];
                    $array_times_enab[$k]['disabled'] = 1;
                    $k++;
                }
            }
            // debug($array_times_enab);
            return $array_times_enab;
        } else {
            $i = 0;
            while($time = mysqli_fetch_assoc($times_db)) {
                $array_times_db[$i]['id'] = (int) $time['id'];
                $array_times_db[$i]['time'] = $time['time'];
                $i++;
            }
            return $array_times_db;
        }
        
    } catch (Exception $e) {
        return $e;
    }
}

function requestShifts($date) {
    try {
        require 'database.php';

        $query = " SELECT sh.id, sh.name, tt.time AS time, sh.total_price, sh.done, s.name AS service"; 
        $query .= " FROM shifts AS sh INNER JOIN timestable AS tt ON tt.id = sh.time";
        $query .= " INNER JOIN shifts_services AS ss ON sh.id = ss.shift";
        $query .= " INNER JOIN services AS s ON s.id = ss.service  WHERE sh.date = '${date}' ORDER BY tt.id ";

        $result = mysqli_query($conn, $query);
        
        $shifts = [];
        $i = 0;
        $id = 0;
        $ban = false;
        if($result->num_rows) { 
            while($row = mysqli_fetch_assoc($result)) {
                $ban = false;
                if((int) $row['id'] === $id) {
                    $ban = true;
                    $shifts[$i]['services'][] = $row['service'];
                } else {
                    if(!$ban) { $i++; }
                    $id = (int) $row['id'];
                    $shifts[$i]['id'] = (int) $row['id'];
                    $shifts[$i]['name'] = $row['name'];
                    $shifts[$i]['time'] = $row['time'];
                    $shifts[$i]['total_price'] = $row['total_price'];
                    $shifts[$i]['done'] = (int) $row['done'];
                    $shifts[$i]['services'][] = $row['service'];
                }
            }
            // debug(mysqli_fetch_all($result));
        } else {
            
        }
        
        return (count($shifts) > 0) ? array_values($shifts) : $shifts;
        // return $shifts;
    } catch (Exception $e) {
        $response = array(
            'error' => $e->getMessage()
        );
    }
}

function verifyDate($date) {
    try {
        require 'database.php';
        $query = "SELECT * FROM date_disabled WHERE date = '${date}'";
        $result = mysqli_query($conn, $query);
        if($result->num_rows) {
            $response = array(
                'response' => 'disable'
            );
        } else {
            $response = array(
                'response' => 'enable'
            );
        }
        $conn->close();
    } catch(Exception $e) {
        $response = array(
            'error' => $e->getMessage()
        );
    }
    return $response;
}

function getDisableDates() {
    try {
        require 'database.php';
        $query = "SELECT * FROM date_disabled";
        $result = mysqli_query($conn, $query);
        
        $dates = [];
        $i = 0;
        if($result->num_rows) {
            while($row = mysqli_fetch_assoc($result)) {
                $dates[$i]['id'] = (int) $row['id'];
                $dates[$i]['date'] = $row['date'];
                $i++;
            }
        }

        $conn->close();
        return $dates;
    } catch(Exception $e) {
        return $e->getMessage();
    }
}