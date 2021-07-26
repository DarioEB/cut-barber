document.addEventListener('DOMContentLoaded', function() {
    initAdmin();
});

function initAdmin() {
    eventSections(); 
    viewShiftDate();
    inputDate();
    // Eventos configuración
    eventSettings();
    // Eventos Submit
    document.querySelector('#form-add-service').addEventListener('submit', addService);
    document.querySelector('#form-edit-service').addEventListener('submit', editService);
    document.querySelector('#form-add-category').addEventListener('submit', addCategory);
    document.querySelector('#form-edit-category').addEventListener('submit', editCategory);
    document.querySelector('#form-edit-date').addEventListener('submit', disableDate);
}


function eventSections() {
    const buttonsAppAdmin = document.querySelectorAll('.buttons-app-admin .use');

    /*** Indicamos que el boton turnos turnos y su seccion se vean desde el inicio ***/
    const btnShifts = document.querySelector('.buttons-app-admin .use').classList.add('bg-blue');
    const sectionView = document.querySelector('.sections > div').classList.add('show');

    buttonsAppAdmin.forEach( btn => {
        btn.addEventListener('click', viewSection);
    });
}

function viewSection(e) {
    e.preventDefault();

    document.querySelectorAll('.buttons-app-admin .use').forEach(btn => {
        btn.classList.remove('bg-blue');
    });

    e.target.classList.add('bg-blue');

    const sections = document.querySelectorAll('.sections > div');
    const sectionView = e.target.getAttribute('data-type');

    sections.forEach( section => {
        (section.id === sectionView) 
        ? section.classList.add('show') 
        : section.classList.remove('show');
    });
}

function viewShiftDate(date = '') {
    var today = '';
    if(date === '') {
        const newDate = new Date();
        day = newDate.getDate();
        month = newDate.getMonth()+1;
        year = newDate.getFullYear();
        today = `${year}-${(month < 10) ? '0'+month: month}-${(day < 10) ? '0'+day : day}`;
    } else {
        today = date;
    }
    
    const inputDate = document.querySelector('#date');
    inputDate.setAttribute('value', today);

    requestShifts(today);
}

function requestShifts(today) {

    const data = new FormData();
    data.append('date', today);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'inc/json/shifts.php', true);

    xhr.onload = function() {
        if(this.status === 200) {
            const shifts = JSON.parse(xhr.responseText);
            
            if(document.querySelector('.shift')) {
                document.querySelectorAll('.shift').forEach( element => {
                    element.remove();
                });
            }
            
            if(shifts.length === 0) {
                showAlert('Todavía no hay turnos cargados para este día', 'error', '.shifts');
                return;
            } 
            shifts.forEach( shift => {
                
                const {id, name, time, total_price, done, services} = shift;

                const shiftDiv = document.createElement('DIV');
                shiftDiv.classList.add('shift');

                const info = document.createElement('DIV');
                info.classList.add('shift-info');

                const validated = document.createElement('DIV');
                validated.classList.add('shift-validated');

                const shiftDataDiv = document.createElement('DIV');
                shiftDataDiv.classList.add('shift-data');

                const timePara = document.createElement('P');
                timePara.textContent = time.substr(0, 5);

                const namePara = document.createElement('P');
                namePara.textContent = name;

                const span = document.createElement('SPAN');
                span.classList.add('fas', 'fa-ellipsis-h');
                span.onclick = viewServices;
                shiftDataDiv.appendChild(timePara);
                shiftDataDiv.appendChild(namePara);
                shiftDataDiv.appendChild(span);

                const button = document.createElement('BUTTON');
                var value;
                if(done === 0) {
                    button.classList.add('btn', 'no-done');
                    button.textContent = 'Pendiente';
                    value = 1;
                } else {
                    button.classList.add('btn', 'done');
                    button.textContent = 'Realizado';
                    value = 0;
                }

                button.dataset.shiftId = id;
                button.dataset.shiftValue = value;
                button.onclick = status;

                const shiftServiceDiv = document.createElement('DIV');
                shiftServiceDiv.classList.add('shift-services');
                services.forEach(service => {   
                    const nameService = document.createElement('P');
                    nameService.textContent = service;
                    shiftServiceDiv.appendChild(nameService);
                });

                const totalPrice = document.createElement('P');
                totalPrice.textContent = `Precio total: $ ${total_price}`;
                shiftServiceDiv.appendChild(totalPrice);
                
                // Agregado final
                info.appendChild(shiftDataDiv);
                info.appendChild(shiftServiceDiv);
                validated.appendChild(button);

                shiftDiv.appendChild(info);
                shiftDiv.appendChild(validated);

                document.querySelector('.shifts').appendChild(shiftDiv);
            });
        }
    }
    xhr.send(data);
}

function status(e) {
    const shiftId = parseInt(e.target.dataset.shiftId);
    const doneValue = parseInt(e.target.dataset.shiftValue);

    const data = new FormData();
    data.append('shift_id', shiftId);
    data.append('done', doneValue);

    const xhr = new XMLHttpRequest();

    xhr.open('POST', 'inc/models/model_done.php', true);

    xhr.onload = function() {
        if(this.status === 200) {
            const response = JSON.parse(xhr.responseText);
            if(response.response == 'ok') {
                if(e.target.classList.contains('no-done')) {
                    e.target.classList.remove('no-done');
                    e.target.classList.add('done');
                    e.target.textContent = 'Realizado';
                    e.target.dataset.shiftId = shiftId;
                    e.target.dataset.shiftValue = 0;
                } else {
                    e.target.classList.remove('done');
                    e.target.classList.add('no-done');
                    e.target.textContent = 'Pendiente';
                    e.target.dataset.shiftId = shiftId;
                    e.target.dataset.shiftValue = 1;
                }
            }
        }
    }

    xhr.send(data);
}

function viewServices(e) {
    const services = e.target.parentElement.nextElementSibling;

    if(services.classList.contains('show')) {
        services.classList.remove('show');
    } else {
        document.querySelectorAll('.shift-services').forEach(element => {
            (element.classList.contains('show')) 
            ? element.classList.remove('show') 
            : '';
        });

        services.classList.add('show');
    }
}

function inputDate() {    
    document.querySelector('#date').addEventListener('input', (e) => {
        if(e.target.value === '') {
            showAlert('Las fecha ingresada no es correcta', 'error');
        } else {
            viewShiftDate(e.target.value);
        }
    });
}

function showAlert(message, type, box) {
    if(document.querySelector('.alert')) {
        document.querySelector('.alert').remove();
    }
    const alert = document.createElement('DIV');
    alert.classList.add('alert');
    alert.classList.add(type);

    const text = document.createElement('P');
    text.textContent = message;

    alert.appendChild(text);
    
    document.querySelector(`${box}`).appendChild(alert);

    setTimeout( () => {
        alert.remove();
    }, 3000);
}

/*** Eventos de configuración ***/
function eventSettings() {
    const btnSettings = document.querySelectorAll('.buttons-settings .btn');

    btnSettings.forEach(btn => {
        btn.addEventListener('click', viewSetting)
    });
}

function viewSetting(e) {
    e.preventDefault();
    if(!e.target.classList.contains('bg-blue')) {
        document.querySelectorAll('.buttons-settings .btn').forEach(btn => {
            (btn.classList.contains('bg-blue')) ? btn.classList.remove('bg-blue') : '';
        });
        e.target.classList.add('bg-blue');

        const id = e.target.dataset.id;
        
        editionSectionShow(id);
    }
}

function editionSectionShow(id) {
    const sections = document.querySelectorAll('.setting');
    sections.forEach( section => {
        (section.classList.contains('show')) ? section.classList.remove('show') : '';
    });
    const viewSection = document.querySelector(`#${id}`);
    viewSection.classList.add('show');

    if(id === 'add-service') {
        getCategories(0, 'box-select-categories-add-service');
    } else if(id === 'edit-service') {
        getServices();
    } else if(id === 'edit-category') {
        getCategoriesEdit();
    } else if(id === 'edit-date') {
        getDisableDates();
    }
}

async function getServices() {
    try {
        const urlServices = 'http://192.168.100.218:3000/inc/json/services.php';
        const fetchServices = await fetch(urlServices);
        const services = await fetchServices.json();

        if(document.querySelector('.select-service select option')) {
            document.querySelectorAll('.select-service select option').forEach(option => {
                option.remove();
            })
        }

        const select = document.querySelector('.select-service select');

        select.addEventListener('input', viewDataService);

        const option = document.createElement('OPTION');
        option.setAttribute('selected', '');
        option.setAttribute('disabled', '');
        option.textContent = '-- Seleccione el servicio a editar --';

        select.appendChild(option);
        services.forEach(service => {
            const {id, name} = service;

            const option = document.createElement('OPTION');
            option.setAttribute('value', id);
            option.textContent = name;
            select.appendChild(option);
        })
    } catch (error) {
        console.log(error);
    }
}

function viewDataService(e) {

    const serviceId = e.target.value;

    const data = new FormData();
    data.append('service_id', serviceId);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'inc/json/service.php', true);
    xhr.onload = function() {
        if(this.status === 200) {
            // console.log(JSON.parse(xhr.responseText));
            const response = JSON.parse(xhr.responseText)[0];
            const {id, name, price, category, enabled} = response;

            document.querySelector('#edit-name').value = name;
            document.querySelector('#edit-price').value = price;
            document.querySelector('#edit-id').value = id;

            getCategories(parseInt(category), 'box-select-categories-edit-service');

            document.querySelector('.delete-service').classList.add('show');
            const btn = document.querySelector('.delete-service .btn');
            btn.dataset.serviceId = id;
            btn.dataset.serviceName = name;
            if(enabled === 1) {
                btn.innerHTML = 'Deshabilitar <i class="fas fa-ban"></i>'
                btn.dataset.value = 0;
            } else {
                btn.innerHTML = 'Habilitar <i class="fas fa-check-circle"></i>'
                btn.dataset.value = 1;
            }
            btn.onclick = disabledService;
            // document.querySelector('#edit-service #form-edit-service').insertBefore(deleteDiv);
        }
    }
    xhr.send(data);
}

async function getCategories(categoryId = 0, selectType) {
    try {
        const urlCategories = 'http://192.168.100.218:3000/inc/json/categories.php';
        const fetchCategories = await fetch(urlCategories);
        const categories = await fetchCategories.json();

        if(document.querySelector(`.${selectType} select option`)) {
            document.querySelectorAll(`.${selectType} select option`).forEach(option => {
                option.remove();
            })
        }

        const select = document.querySelector(`.${selectType} select`);

        const option = document.createElement('OPTION');
        option.setAttribute('selected', '');
        option.setAttribute('disabled', '');
        option.setAttribute('value', '0');
        option.setAttribute('name', 'add-category');
        option.textContent = '-- Seleccione la categoría --';

        select.appendChild(option);
        categories.forEach(category => {
            const {id, name} = category;

            const option = document.createElement('OPTION');

            option.setAttribute('value', id);
            option.textContent = name;

            (id === categoryId) ? option.setAttribute('selected', '') : '';

            select.appendChild(option);
        });
    } catch(error) {
        console.log(error);
    }
}

async function getCategoriesEdit() {
    try {
        const urlCategories = 'http://192.168.100.218:3000/inc/json/categories.php';
        const fetchCategories = await fetch(urlCategories);
        const categories = await fetchCategories.json();

        if(document.querySelector('.box-select-categories-edit-category select option')) {
            document.querySelectorAll('.box-select-categories-edit-category select option').forEach(option => {
                option.remove();
            })
        }

        const select = document.querySelector('.box-select-categories-edit-category select');
        
        const option = document.createElement('OPTION');
        option.setAttribute('selected', '');
        option.setAttribute('disabled', '');
        option.setAttribute('value', '0');
        option.textContent = '-- Elija la categoría a editar --';

        select.addEventListener('input', viewDataCategory);
        
        select.appendChild(option);
        console.log(categories);
        categories.forEach( category => {
            const { id, name, enabled } = category;

            const option = document.createElement('OPTION');
            option.setAttribute('value', id);
            option.textContent = name;
            
            // option.addEventListener
            select.appendChild(option);
        });
    } catch (error) {
        console.log(error);
    }
}

async function getDisableDates() {
    try {
        const url = 'http://192.168.100.218:3000/inc/json/dates.php';
        const fetDates = await fetch(url);
        const dates = await fetDates.json();

        if(document.querySelector('.item-date')) {
            document.querySelectorAll('.item-date').forEach( item => {
                item.remove();
            });
        }

        console.log(dates);

        const listDates = document.querySelector('.list-dates ul');

        dates.forEach(dat => {
            const {id, date} = dat;
            // console.log(date);
            const li = document.createElement('LI');
            li.classList.add('item-date');

            const p = document.createElement('P');
            p.textContent = format(date);

            const btn = document.createElement('BUTTON');
            btn.classList.add('btn');
            btn.textContent = 'Habilitar';

            btn.dataset.idDisable = id;
            btn.onclick = enableDate;

            li.appendChild(p);
            li.appendChild(btn);

            listDates.appendChild(li);
        });
    } catch (error) {
        console.log(error);
    }
}


function format(date){
    return date.replace(/^(\d{4})-(\d{2})-(\d{2})$/g,'$3-$2-$1');
}

function viewDataCategory(e) {
    const id = e.target.value;

    const data = new FormData();
    data.append('id', id);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'inc/json/category.php', true);
    xhr.onload = function() {
        if(this.status === 200) {
            const category = JSON.parse(xhr.responseText)[0];
            const { enabled, id, name  } = category;

            document.querySelector('#edit-name-category').value = name;
            document.querySelector('#edit-id-category').value = id;

            document.querySelector('.delete-category').classList.add('show');
            const btn = document.querySelector('.delete-category .btn');
            btn.dataset.categoryId = id;
            btn.dataset.categoryName = name;

            if(enabled === 1) {
                btn.innerHTML = 'Deshabilitar <i class="fas fa-ban"></i>'
                btn.dataset.value = 0;
            } else {
                btn.innerHTML = 'Habilitar <i class="fas fa-check-circle"></i>'
                btn.dataset.value = 1;
            }

            btn.onclick = disabledCategory;
        }
    }
    xhr.send(data);
}

// Eventos Submit - Settings
function addService(e) {
    e.preventDefault();

    const name = document.querySelector('#add-name').value;
    const price = document.querySelector('#add-price').value;
    const category = document.querySelector('#select-category-add-service').value;
    const action = document.querySelector('#add-action').value;

    if(name.trim() === '' || price.trim() === '' || category === '0' || action != 'add') {
        showAlert('Todos los campos son obligatorios', 'error', '.action-setting');
    } else {
        // Envio de datos al modelo
        const data = new FormData();

        data.append('action', action);
        data.append('name', name);
        data.append('price', price);
        data.append('category', category);

        sendData(data, 'model_service');
    }
}

function editService(e) {
    e.preventDefault();

    const name = document.querySelector('#edit-name').value,
          price = document.querySelector('#edit-price').value,
          category = document.querySelector('#select-category-edit-service').value,
          action = document.querySelector('#edit-action').value,
          id = document.querySelector('#edit-id').value;

    if(name.trim() === '' || price.trim() === '' || category === '0' || action != 'edit') {
        showAlert('Todos los campos son obligatorios', 'error', '.action-setting');
    } else {
        const data = new FormData();

        data.append('action', action);
        data.append('name', name);
        data.append('price', price);
        data.append('category', category);
        data.append('id', id);

        sendData(data, 'model_service');
    }    
}

function disabledService(e) {
    const serviceId = e.target.dataset.serviceId;
    const action = e.target.dataset.action;
    const name = e.target.dataset.serviceName;
    const enabled = e.target.dataset.value;
    // console.log(action);
    if(!isNaN(serviceId) || action != 'delete') {
        // console.log('Es un numero');
        const data = new FormData();
        data.append('action', action);
        data.append('id', serviceId);
        data.append('name', name);
        data.append('enabled', enabled);

        sendData(data, 'model_service');
    } else {
        showAlert('Los datos del documento fueron modificados', 'error', '.action-setting');
    }
}



/** AJAX para categorias **/
function addCategory(e) {
    e.preventDefault();

    const name = document.querySelector('#add-name-category').value;
    const action = document.querySelector('#add-action-category').value;

    console.log(name + ' ' + action);
    if(name.trim() === '' || action.trim() !== 'add-category') {
        showAlert('Indica el nombre de la categoría', 'error', '.action-setting');
    } else {
        const data = new FormData();

        data.append('name', name);
        data.append('action', action);

        sendData(data, 'model_category');
    }
}

function editCategory(e) {
    e.preventDefault();

    const name = document.querySelector('#edit-name-category').value;
    const categoryId = document.querySelector('#edit-id-category').value;
    const action = document.querySelector('#edit-action-category').value;

    if(name.trim() === '' || isNaN(categoryId) || parseInt(categoryId) === 0 || action != 'edit-category') {
        showAlert('El campo nombre está vacio o los datos son incorrectos', 'error', '.action-setting');
    } else {
        const data = new FormData();

        data.append('name', name);
        data.append('id', categoryId);
        data.append('action', action);

        sendData(data, 'model_category');
    }
}

function disabledCategory(e) {
    const categoryId = e.target.dataset.categoryId;
    const action = e.target.dataset.action;
    const name = e.target.dataset.categoryName;
    const enabled = e.target.dataset.value;

    if(!isNaN(categoryId) || action != 'delete') {
        const data = new FormData();
        data.append('action', action);
        data.append('id', categoryId);
        data.append('name', name);
        data.append('enabled', enabled);

        sendData(data, 'model_category');
    } else {
        showAlert('Los datos del documento fueron modificados', 'error', '.action-setting');   
    }
}

function disableDate(e) {
    e.preventDefault();

    const date = document.querySelector('#disable-date-input').value;
    const action = document.querySelector('#disable-date-action').value;

    // console.log(date);

    if(date === '' || action !== 'disable') {
        showAlert('Debe seleccionar una fecha', 'error', '.action-setting');
    } else {
        const data = new FormData();
        
        data.append('date', date);
        data.append('action', action);
        console.log(...data);
        sendData(data, 'model_date');
    }
}

function enableDate(e) {
    const id = e.target.dataset.idDisable;
    const action = 'enable'; 
    const element = e.target.parentElement;

    if(!isNaN(id)) {
        const data = new FormData();
        data.append('id', id);
        data.append('action', action);
        
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'inc/models/model_date.php', true);
        xhr.onload = function() {
            if(this.status === 200) {
                const response = JSON.parse(xhr.responseText);
                if(response.response === 'ok') {
                    element.remove();
                }
            }
        }
        xhr.send(data);
    }

}



function sendData(data, file) {
    // Creación de AJAX
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `inc/models/${file}.php`, true);
    xhr.onload = function() {
        if(this.status === 200) {
            // console.log(xhr.responseText);
            const response = JSON.parse(xhr.responseText);
            // console.log(response);
            if(response.response === 'ok') {

                document.querySelector('#form-add-service').reset();
                lastAlert(
                    response.title,
                    response.text,
                    'success',
                    'Ok!'
                );
            }
        }
    }
    xhr.send(data);
}

function lastAlert(title, text, icon, btnText) {
    Swal.fire({
        title: title,
        text: text,
        icon: icon,
        background: '#000',
        allowOutsideClick: false,
        confirmButtonText: btnText,
        customClass: {
            popup: 's-container',
            title: 's-title',
            htmlContainer: 's-text',
            confirmButton: 's-btn',
        },
        showClass: {
            popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
        }
    }).then( e => {
        
        if(e.isConfirmed) {
            window.location.href = 'http://192.168.100.218:3000/admin.php'
        }
    })
}

