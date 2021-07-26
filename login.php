<?php 
    session_start();
    if(isset($_SESSION['admin'])) {
        header('Location: admin.php');
    }
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cut Barber | Login</title>
    
    <link rel="icon" href="build/img/logo-3.ico" type="favicon" />
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;700;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="build/css/all.min.css">
    <link rel="stylesheet" href="build/css/normalize.css">
    <link rel="stylesheet" href="build/css/sweetalert2.min.css">
    <link rel="stylesheet" href="build/css/app.css">
</head>
<body>
    <section class="page-login">
        <div class="banner">
            <div class="banner-img">
                <img src="build/img/logo-vb4.png" />
            </div>
            <div class="banner-title">
                <h1>
                    Login Administrador
                </h1>
            </div>
        </div>
        <div class="login">
            <form class="form-login" id="form-login" method="POST">
                <div>
                    <label for="username">Usuario Administrador</label>
                    <input type="text" id="username" name="username">
                </div>
                <div class="password">
                    <label for="password">Contraseña</label>
                    <input type="password" id="password" name="password">}
                    <span class="far fa-eye"></span>
                </div>

                <div class="btn-login">
                    <input type="submit" class="btn" value="Ingresar" />
                </div>
            </form>
        </div>
    </section>
    
    <script type="text/javascript" src="build/js/sweetalert2.all.min.js"></script>
    <script type="text/javascript" src="build/js/login.js"></script>
</body>

<html>