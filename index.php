
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cut Barber | Login</title>
    
    <link rel="icon" href="build/img/logo-vb4.png" type="favicon" />
    <link rel="preconnect" href="https://fonts.gstatic.com"> 
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;700;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="build/css/all.min.css">
    <link rel="stylesheet" href="build/css/normalize.css">
    <!-- <link rel="stylesheet" href="build/css/sweetalert2.min.css"> -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11.0.17/dist/sweetalert2.min.css">
    <link rel="stylesheet" href="build/css/app.css">
</head>
<body>
    <div class="loader">
        <img class="loader-img" src="build/img/rolling.gif" />
        <p>
            Descargando ticket...
        </p>
    </div>

    <section class="page" id="page">
        <div class="container division">
            <div class="container-image"></div>

            <div class="container-main">
                <div class="bar">
                    <div class="bar-image">
                        <a>Cut Barber</a>
                        <img src="build/img/logo-vb4.png"/>
                    </div>
                </div>  

                <nav class="buttons-app">
                    <a data-type="services" class="btn bg-blue">Servicios</a>
                    <a data-type="form" class="btn">Turno</a>
                    <a data-type="resume" class="btn">Resumen</a>
                </nav>

                <div class="sections">
                    <div class="services show" id="services">
                        <h1 class="title">
                            Servicios
                            <span>Seleccioná los servicios que deseas</span>
                        </h1>
                        <div class="container-services">
                        </div>
                    </div> <!-- .servivios -->

                    <div class="form" id="form">
                        <h1 class="title">
                            Formulario
                            <span>Ingresá tu nombre, fecha y hora que deseas el turno</span>
                        </h1>
                        <form class="container-form">
                            <div>
                                <label for="name">Nombre</label>
                                <input type="text" 
                                       id="name" 
                                       placeholder="Tu Nombre" 
                                       name="name" />
                            </div>

                            <div>
                                <label for="date">Fecha</label>
                                <input type="date" 
                                       id="date" 
                                       name="date" 
                                       min
                                       placeholder="dd/mm/aaaa"
                                       />
                            </div>

                            <div>
                                <label for="time">Hora</label>
                                <div class="times"></div>
                            </div>
                        </form>
                    </div> <!-- .formulario -->

                    <div class="resume" id="resume">
                        <h1 class="title">
                            Resumen 
                        </h1>
                        
                        <div class="container-resume"></div>

                    </div>
                </div>

                <nav class="buttons-control">
                    <a href="#" class="btn" id="prev"><i class="fas fa-angle-double-left"></i></a>
                    <a href="#" class="btn" id="next"><i class="fas fa-angle-double-right"></i></a>
                </nav>
            </div>
        </div>
    </section>
    <script type="text/javascript" src="build/js/jquery.min.js"></script>
    <!-- <script type="text/javascript" src="build/js/sweetalert2.all.min.js"></script> -->
    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/sweetalert2@11.0.17/dist/sweetalert2.all.min.js"></script>
    <!-- <script type="text/javascript" src="https://raw.githack.com/eKoopmans/html2pdf/master/dist/html2pdf.bundle.js"></script> -->
    <script type="text/javascript" src="build/js/html2pdf.bundle.js"></script>
    <script type="text/javascript" src="build/js/scripts.js"></script>
</body>
</html>