<?php
session_start();
if(!isset($_SESSION['admin'])) {
    header('Location: /');
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cut Barber | Administrador</title>
    
    <link rel="icon" href="build/img/logo-3.ico" type="favicon" />
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;700;900&display=swap" rel="stylesheet">    
    <link rel="stylesheet" href="build/css/all.min.css">
    <link rel="stylesheet" href="build/css/normalize.css">
    <link rel="stylesheet" href="build/css/sweetalert2.min.css">
    <link rel="stylesheet" href="build/css/app.css">
</head>
<body>
    <section class="page-admin">
        <div class="banner">
            <div class="banner-img">
                <img src="build/img/logo-vb4.png" />
            </div>
            <div class="banner-title">
                <h1>
                    Administración
                </h1>
            </div>
        </div>

        <div class="admin">
            
            <div class="buttons-app-admin">
                <a class="btn use" data-type="view-shifts">Turnos</a>
                <a class="btn use" data-type="settings">Configurar <i class="fas fa-cog"></i></a>
                <a href="/logout.php" class="btn">Salir</a>
            </div>

            <div class="sections">
                <div class="view-shifts" id="view-shifts">
                    <h1 class="title">
                        Turnos <span>Selecciona la fecha para ver los turnos de ese día</span>
                    </h1>
                    <div class="container-shifts">
                        <div class="box-date">
                            <input type="date" name="date" id="date" />
                            <!-- <p class="date">Fecha: </p> -->
                        </div>
                        <div class="shifts">
                        </div>
                    </div>
                </div>

                <div class="settings" id="settings">
                    <h1 class="title">
                        Configuración
                        <span>Edita tus servicios y sus precio, a la vez que tus categorias</span>
                    </h1>

                    <div class="container-settings">
                        <div class="buttons-settings">
                            <button class="btn" data-id="add-service">Agregar Servicio(s)</button>
                            <button class="btn" data-id="edit-service">Editar Servicio(s)</button>
                            <button class="btn" data-id="add-category">Agregar Categoría(s)</button>
                            <button class="btn" data-id="edit-category">Editar Categoría(s)</button>
                            <button class="btn" data-id="edit-date">Editar día de franco</button>
                        </div> 

                        <div class="action-setting">
                            <div class="setting" id="add-service">
                                <h3>
                                    Agregar Servicio
                                </h3>
                                <form id="form-add-service">
                                    <div class="box-select-categories-add-service">
                                        <label>Categoria</label>
                                        <select id="select-category-add-service"></select>
                                    </div>
                                    
                                    <div class="inputs">
                                        <label for="add-name">Nombre del Servicio</label>
                                        <input type="text" id="add-name" name="add-name" />
                                    </div>
                                    <div class="inputs">
                                        <label for="add-price">Precio del Servicio</label>
                                        <input type="number" step="any" id="add-price" name="add-price" />
                                    </div>

                                    <div class="btn-setting">
                                        
                                        <input type="hidden" name="add-action" id="add-action" value="add" />
                                        <input class="btn" type="submit" value="Agregar"/>
                                    </div>
                                </form>
                            </div> <!-- #add-service -->

                            <div class="setting" id="edit-service">
                                <h3>Editar Servicio</h3>
                                <div class="select-service">
                                    <select id="select-edit-category">
                                        <option disabled>-- Elije el servicio a editar --</option>
                                    </select>
                                </div>
                                <div class="delete-service" >
                                    <button data-action="delete" class="btn">
                                    </button>
                                </div> 

                                <form id="form-edit-service">
                                    <div class="box-select-categories-edit-service">
                                        <label>Categoria</label>
                                        <select id="select-category-edit-service"></select>
                                    </div>
                                    
                                    <div class="inputs">
                                        <label for="edit-name">Nombre del Servicio</label>
                                        <input type="text" id="edit-name" name="edit-name" />
                                    </div>
                                    <div class="inputs">
                                        <label for="edit-price">Precio del Servicio</label>
                                        <input type="number" step="any" id="edit-price" name="edit-price" />
                                    </div>

                                    <div class="btn-setting">
                                        <input class="btn" type="submit" value="Editar" />
                                        <input type="hidden" id="edit-id"  value="" />
                                        <input type="hidden" name="edit-action" id="edit-action" value="edit" />
                                    </div>
                                </form> 
                            </div> <!-- #edit-service -->

                            <div class="setting" id="add-category">
                                <h3>Agregar Categoría</h3>

                                <form id="form-add-category">
                                    <div class="inputs">
                                        <label for="add-name-category">Nombre categoría</label>
                                        <input type="text" id="add-name-category" name="add-name-category" />
                                    </div>

                                    <div class="btn-setting">
                                        <input class="btn" type="submit" value="Agregar" />
                                        <input type="hidden" id="add-action-category" value="add-category" />
                                    </div>  
                                </form>
                            </div> <!-- #add-category -->

                            <div class="setting" id="edit-category">
                                <h3>
                                    Editar Categoría
                                </h3>
                                
                                <div class="delete-category" >
                                    <button data-action="delete" class="btn">
                                    </button>
                                </div> 

                                <form id="form-edit-category">
                                    <div class="box-select-categories-edit-category">
                                        <label>Categoria</label>
                                        <select></select>
                                    </div>
                                    <div class="inputs">
                                        <label for="edit-name-category">Nombre categoría</label>
                                        <input type="text" id="edit-name-category" name="edit-name-category" />
                                    </div>

                                    <div class="btn-setting">
                                        <input class="btn" type="submit" value="Editar" />
                                        <input type="hidden" id="edit-action-category" value="edit-category" />
                                        <input type="hidden" id="edit-id-category" value="" />;
                                    </div>
                                </form>
                            </div> <!-- #edit-category -->

                            <div class="setting" id="edit-date">
                                <h3>Deshibilitar y habilitar días de trabajo</h3>
                                
                                <div class="box-dates">
                                    <form id="form-edit-date">
                                        <div class="inputs">
                                            <label for="disable-date-input">Selecciona una fecha</label>
                                            <input type="date" id="disable-date-input" name="disable-date-input" />
                                        </div>

                                        <div class="btn-setting">
                                            <input type="submit" class="btn" value="Deshabilitar fecha" />
                                            <input type="hidden" id="disable-date-action" value="disable" />
                                        </div>
                                    </form>

                                    <div class="list-dates">
                                        <p>Días deshabilitados</p>
                                        <ul></ul>
                                    </div>
                                </div>
                            </div> <!-- #edit-date -->

                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    </section>


    <script type="text/javascript" src="build/js/jquery.min.js"></script>
    <script type="text/javascript" src="build/js/sweetalert2.all.min.js"></script>
    <script type="text/javascript" src="build/js/admin.js"></script>
</body>
</html>