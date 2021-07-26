let page = 1;
let message = '';

const appointment = {
    name: '',
    date: '',
    time: '',
    services: []
}

document.addEventListener('DOMContentLoaded', function () {
    if(window.location.pathname === '/' || window.location.href.indexOf('index')) {
        initApp();
    }
});

function initApp() {
    showSection();
    showServices();
    pagerButtons();
    next();
    prev();
    showSummary();
    // Almacenar Nombre
    shiftName();
    // Almacenar Fecha
    shiftDate();
    // Deshabitlitar fecha anteiores+
    disablePreviousDate();
}

function pagerButtons() {
    const prev = document.querySelector('#prev');
    const next = document.querySelector('#next');
    if (page === 1) {
        prev.classList.add('hidden');
        next.classList.remove('hidden');
    } else if (page === 3) {
        next.classList.add('hidden');
        prev.classList.remove('hidden');
        showSummary(); // Estamos en la pagina 3, carga el resumen de la cita   
    } else if (page < 1 || page > 3) {
        return;
    } else {
        prev.classList.remove('hidden');
        next.classList.remove('hidden');
    }
}

function showSection() {
    const btnApp = document.querySelectorAll('.buttons-app a');
    btnApp.forEach(element => {
        element.addEventListener('click', otherSection);
    });
}

function otherSection(e) {
    e.preventDefault();
    const sections = document.querySelectorAll('.sections > div');

    if (!e.target.classList.contains('bg-blue')) {
        document.querySelectorAll('.buttons-app .btn').forEach( btn => {
            (btn.classList.contains('bg-blue')) ? btn.classList.remove('bg-blue') : null;
        });
        
        e.target.classList.add('bg-blue');
        sections.forEach(element => {
            if (element.id == e.target.dataset.type) {
                if (element.id === 'services') {
                    page = 1;
                } if (element.id === 'form') {
                    page = 2;
                } if (element.id === 'resume') {
                    page = 3;
                }
                pagerButtons();
                element.classList.add('show')
            } else {
                element.classList.remove('show');
            }
        });
    }
}

async function showServices() { // Funcion asincrona
    try {
        const urlSer = 'http://192.168.100.218:3000/inc/json/services.php';
        const urlCat = 'http://192.168.100.218:3000/inc/json/categories.php';

        const serviceRs = await fetch(urlSer);
        const categoRs = await fetch(urlCat);

        const serviceDb = await serviceRs.json();
        const categoryDb = await categoRs.json();

        categoryDb.forEach(category => {
            const { id, name, enabled } = category;

            if(enabled === 1) {
                const categoryDiv = document.createElement('DIV');
                categoryDiv.classList.add('category', id);
                categoryDiv.dataset.idCategory = id;

                const titleCat = document.createElement('H3');
                titleCat.classList.add('title-category');
                titleCat.textContent = name;

                document.querySelector('.container-services').appendChild(titleCat);
                document.querySelector('.container-services').appendChild(categoryDiv);
            }
        });

        const containers = document.querySelectorAll('.category');

        serviceDb.forEach(service => {
            const { category, id, name, price, enabled } = service;
            
            if(enabled === 1) {
                const nameService = document.createElement('P');
                nameService.classList.add('name-service');
                nameService.textContent = name;

                const priceService = document.createElement('P');
                priceService.classList.add('price-service');
                priceService.textContent = `$ ${price}`;

                const icon = document.createElement('I');
                icon.classList.add('fas', 'fa-check');


                const serviceDiv = document.createElement('DIV');
                serviceDiv.classList.add('service');
                serviceDiv.dataset.idService = id;
                serviceDiv.onclick = selectService;


                serviceDiv.appendChild(nameService);
                serviceDiv.appendChild(priceService);
                serviceDiv.appendChild(icon);

                containers.forEach(container => {
                    if (category === parseInt(container.dataset.idCategory)) {
                        container.appendChild(serviceDiv);
                    }
                });
            }
            
        });

    } catch (error) {
        console.log(error);
    }
}

function selectService(e) {
    let service;

    service = e.target;
    if (e.target.tagName === 'P') {
        service = e.target.parentElement;
    } else {
        service = e.target;
    }

    if (service.classList.contains('selected')) {
        service.classList.remove('selected');

        const id = parseInt(service.dataset.idService);
        removeService(id);
    } else {
        service.classList.add('selected');
        let serviceObj = {
            id: parseInt(service.dataset.idService),
            name: service.firstElementChild.textContent,
            price: service.firstElementChild.nextElementSibling.textContent
        }
        addService(serviceObj);
    }
}

// Agregar un servicio
function addService(serviceObj) {
    const { services } = appointment;
    appointment.services = [...services, serviceObj];
}

// Eliminar un servicio
function removeService(id) {
    const {services} = appointment;
    appointment.services = services.filter( service => service.id !== id );    
}

// Proxima pagina
function next() {
    const next = document.querySelector('#next');
    next.addEventListener('click', (e) => {
        e.preventDefault();
        page++;
        sectionStep();
    });
}

// Anterior pagina
function prev() {
    const prev = document.querySelector('#prev');
    prev.addEventListener('click', (e) => {
        e.preventDefault();
        page--;
        sectionStep();
    });
}

// Paso de seccion
function sectionStep() {
    var idSection = '';
    const btns = document.querySelectorAll('.buttons-app > a');
    const sections = document.querySelectorAll('.sections > div');
    btns.forEach((element, index) => {
        if (index === (page - 1)) {
            element.classList.add('bg-blue');
            idSection = element.getAttribute('data-type');
        } else {
            element.classList.remove('bg-blue');
        }
    });
    sections.forEach(element => {
        if (element.getAttribute('id') === idSection) {
            element.classList.add('show');
        } else {
            element.classList.remove('show');
        }
    });
    pagerButtons();
}

// Mostrar resumen
function showSummary() {
    // Destructuring
    const {name, date, time, services } = appointment;

    const summarySection = document.querySelector('.container-resume');
    const resumeTitle = document.querySelector('.resume .title');

    if(document.querySelector('.download-ticket')) {
        document.querySelector('.download-ticket').remove();
    }
    
    const download = document.createElement('DIV');
    download.classList.add('download-ticket');
    download.innerHTML = '<p>Comprobante de reservación - <span> Cut Barber </span> </p>'

    const logoDiv = document.createElement('DIV');
    logoDiv.classList.add('image');
    logoDiv.innerHTML = '<img src="build/img/logo-vb4.png" />';

    download.appendChild(logoDiv);

    if (document.querySelector('.info-appoint')) {
        document.querySelector('.info-appoint').remove();
    }

    const resume = document.createElement('DIV');
    resume.classList.add('info-appoint');

    const info = document.createElement('DIV');
    const image = document.createElement('DIV');

    info.classList.add('info');
    image.classList.add('image');

    const nameAppoint = document.createElement('P');
    nameAppoint.classList.add('name-appoint');
    nameAppoint.innerHTML = `Nombre: <span>${name}</span>`;

    const dateAppoint = document.createElement('P');
    dateAppoint.classList.add('date-appoint');
    dateAppoint.innerHTML = `Fecha: <span>${date}</span>`;

    const timeAppoint = document.createElement('P');
    timeAppoint.classList.add('time-appoint');
    timeAppoint.innerHTML = `Hora: <span>${time}</span>`;

    priceText = calculateTotalPrice(services);

    const totalPricePg = document.createElement('P');
    totalPricePg.classList.add('total-price');

    if (services.length > 0) {
        totalPricePg.innerHTML =  `Precio total <span>$ ${priceText}</span>`;
        totalPricePg.dataset.totalPrice = priceText;
    } else {
        totalPricePg.innerHTML =  `Debes seleccionar servicios`;
    }

    info.appendChild(nameAppoint);
    info.appendChild(dateAppoint);
    info.appendChild(timeAppoint);
    info.appendChild(totalPricePg);

    const img = document.createElement('IMG');
    img.setAttribute('src', 'build/img/mascara.png');
    const imgText = document.createElement('P');
    imgText.textContent = 'Usar barbijo';

    image.appendChild(imgText);
    image.appendChild(img);

    resume.appendChild(info);
    resume.appendChild(image);
    /* Resumen servicios */
    if (document.querySelector('.info-services')){
        document.querySelector('.info-services').remove();
    }


    const resumeService = document.createElement('DIV');
    resumeService.classList.add('info-services');
    

    services.forEach( service => {
        const serviceDiv = document.createElement('DIV');
        serviceDiv.classList.add('service');
        serviceDiv.classList.add('selected');

        const nameService = document.createElement('P');
        nameService.classList.add('name-service');
        nameService.textContent = service.name;

        const priceService = document.createElement('P');
        priceService.classList.add('price-service');
        priceService.textContent = service.price;

        const icon = document.createElement('I');
        icon.classList.add('fas', 'fa-check');

        serviceDiv.appendChild(nameService);
        serviceDiv.appendChild(priceService);
        serviceDiv.appendChild(icon);

        resumeService.appendChild(serviceDiv);
    }); 
    
    // Limpiar el HTML previo
    while(  resumeTitle.firstChild.nextSibling ) {
        resumeTitle.firstChild.nextSibling.remove();
    }

    if(Object.values(appointment).includes('') || services.length === 0) {
        message = '';
        const resumeInfo = document.querySelector('.resume .title');
        const span = document.createElement('SPAN');
        
        var none = [];
        (name.trim() === '') ? none.push('nombre') : null;
        (date === '') ? none.push('Fecha') : null;
        (time === '') ? none.push('Hora') : null;
        (services.length === 0) ? none.push('servicios') : null;

        if(none.length === 0) {
            message = 'Todos los datos son correctos'
        } else if(none.length === 1) {
            message = `Faltan datos de ${none[0]}`;
        } else if(none.length === 2) {
            message = `Faltan datos de ${none[0]} y ${none[1]}`;
        } else if(none.length === 3) {
            message = `Faltan datos de ${none[0]}, ${none[1]} y ${none[2]}`;
        } else if(none.length === 4) {
            message = `Faltan datos de ${none[0]}, ${none[1]}, ${none[2]} y ${none[3]}`;
        }
        
        span.textContent = message;
        resumeInfo.appendChild(span);
        return;
    } 

    
    // Mostrar resumen
    const span = document.createElement('SPAN');
    span.textContent = 'Datos completados correctamente, obtenga el ticket de su turno';
    resumeTitle.appendChild(span);
    
    // Creación del boton confirmar
    if(document.querySelector('.confirm-button')) {
        document.querySelector('.confirm-button').remove();
    }
    const divButton = document.createElement('DIV');
    divButton.classList.add('confirm-button');

    const button = document.createElement('BUTTON');
    button.classList.add('btn');
    button.textContent = 'Confirmar';
    divButton.appendChild(button);
    divButton.onclick = shiftConfirm
    
    if(document.querySelector('.container-resume h2')) {
        document.querySelectorAll('.container-resume h2').forEach(element => {
            element.remove();
        });
    }
    
    const thIn = document.createElement('H2');
    thIn.textContent = 'Información de Turno';

    const thIs = document.createElement('h2');
    thIs.textContent = 'Servicios';



    summarySection.appendChild(download);
    summarySection.appendChild(thIn);
    summarySection.appendChild(resume);
    summarySection.appendChild(thIs); 
    summarySection.appendChild(resumeService);
    document.querySelector('#resume').appendChild(divButton);
}

function shiftConfirm() {
    const name = appointment.name;
    const date = appointment.date;
    const timeId = parseInt(document.querySelector('.time-selected').dataset.idTime);
    const services = appointment.services;
    const totalPrice = document.querySelector('.total-price').dataset.totalPrice;

    var xhr = new XMLHttpRequest();

    var data = new FormData();
    data.append('name', name);
    data.append('date', date);
    data.append('time', timeId);
    data.append('totalPrice', totalPrice);
    services.forEach( service => {
        data.append('services[]', service.id);    
    });

    xhr.open('POST', 'inc/models/model.php', true);

    xhr.onload = function() {
        if(this.status === 200) {
            const response = JSON.parse(xhr.responseText);
            
            if (response.response == 'ok') {
                
                const loader = document.querySelector('.loader');
                loader.classList.add('show-loader');
                document.querySelector('.page').style.opacity = '0.3';
                setTimeout( () => {
                    downloadTicket();
                }, 1200);

                setTimeout(() => {
                    loader.classList.remove('show-loader');
                    lastAlert(
                        'Turno reservado', 
                        'Gracias por elegir Cut Barber',
                        'success',
                        'OK! <i class="fas fa-thumbs-up"></i>'
                    );
                }, 3100);
            } else {

            }
        }
    }

    xhr.send(data);
}

function downloadTicket() {

    const element = document.querySelector('.container-resume');
    element.style.height = '559px';
    element.style.width = '100%';
    var opt = {
        margin:       0,
        filename:     'ticket.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 3 },
        jsPDF:        { unit: 'in', format: 'a6', orientation: 'portrait' }
    };

    // New Promise-based usage:
    html2pdf().set(opt).from(element).save();

    // Old monolithic-style usage:
    html2pdf(element, opt);
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
        console.log(e);
        if(e.isConfirmed) {
            window.location.href = 'http://192.168.100.218:3000/'
        }
    })
}

function calculateTotalPrice(services) {
    var totalPrice = 0;
    services.forEach( service => {
        price = service.price.split(' ');
        totalPrice += parseFloat(price[1]);
    });
    return totalPrice;
}

function shiftName() {
    const nameInput = document.querySelector('#name');

    nameInput.addEventListener('input', e => {
        const name = e.target.value.trim();

        if (name === '' || name.length < 4) {
            showAlert('Nombre no válido', 'error');
        } else {
            const alert = document.querySelector('.alert');
            if (alert) {
                alert.remove();
            }
            appointment.name = name;

        }
    });
}

function showAlert( message, typeAlert ) {

    // Si hay una alerta previa, entonces no crear otra
    const alertPrev = document.querySelector('.alert');
    if (alertPrev) {
        return;
    }
    const alert = document.createElement('DIV');
    alert.textContent = message;
    alert.classList.add('alert');

    if (typeAlert == 'error') {
        alert.classList.add('error');
    }
    // Insert HTML
    const form = document.querySelector('.form');
    form.appendChild(alert);

    // Eliminar la alerta después de 3 segundos
    setTimeout(() => {
        alert.remove();
    }, 3800);  
}

function shiftDate() {
    const dateInput = document.querySelector('#date');
    dateInput.addEventListener('input', e => {

        const day = new Date(e.target.value).getUTCDay();
        if([0].includes(day)) {
            e.preventDefault();
            dateInput.value = '';
            showAlert('No trabajamos los domingos, selecciona nuevamente', 'error');
        } else {
            if (document.querySelector('.time')) {
                document.querySelectorAll('.time').forEach( element => {
                    element.remove();
                });
            }
            const data = new FormData();
            data.append('date', dateInput.value);
            data.append('action', 'verify');
            
            // Consultamos si la fecha seleccionada está habilitada como franco o no
            const xhr = new XMLHttpRequest();
            xhr.open('POST', 'inc/models/model_date.php', true);
            xhr.onload = function() {
                if(this.status === 200) {
                    
                    const response = JSON.parse(xhr.responseText);
                    
                    if(response.response === 'disable') {
                        appointment.date = '';
                        showAlert(`Disculpe, no trabajamos el ${dateInput.value}. Seleccione otra fecha`, 'error');
                        appointment.time = '';
                        return;
                    } else {
                        appointment.date = dateInput.value;
                        appointment.time = '';
                        console.log(appointment.date);
                        viewTimes();
                    }
                }
            }
            xhr.send(data);
        }
    });
}


function format(date){
    return date.replace(/^(\d{4})-(\d{2})-(\d{2})$/g,'$3-$2-$1');
}

async function viewTimes() {
    const date = appointment.date;

    const xhr = new XMLHttpRequest();

    const data = new FormData();
    data.append('date', date);

    xhr.open('POST', 'inc/json/times.php', true);


    xhr.onload = function() {
        if(this.status === 200) {
           timesEnableds = JSON.parse(xhr.responseText);
           try {

                var currentDate = new Date();
                var day = currentDate.getDate();
                var month = currentDate.getMonth()+1;
                var year = currentDate.getFullYear();
                var hour = currentDate.getHours();
                currentDate = `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`;
                

                timesEnableds.forEach( timeValues => {
                const {id, time, disabled} = timeValues;
                var cond = 0;
                const timeValue = document.createElement('P');
                // const timeId = documen.createElement('P');
                timeValue.textContent = time.slice(0,5);
                
                const timeDiv = document.createElement('DIV');
                timeDiv.classList.add('time');

                var hoursTime =  parseInt(time.split(':')[0]);
                timeDiv.dataset.idTime = id;
                timeDiv.appendChild(timeValue);

                if(currentDate === date && hour >= hoursTime) {
                    cond = 1;
                }
                
                if (disabled === 1 || cond === 1) {
                    timeDiv.classList.add('time-noselected-important');
                    
                    const banIcon = document.createElement('I');
                    if(disabled === 1 && cond === 1) {
                        banIcon.classList.add('fas', 'fa-ban');
                        timeDiv.onclick = noSelectTime;
                    } 
                    if(disabled === 1 && cond === 0) {
                        banIcon.classList.add('fas', 'fa-ban');
                        timeDiv.onclick = noSelectTime;
                    }
                    if(disabled === 0 && cond === 1) {
                        banIcon.classList.add('fas', 'fa-exclamation');
                        timeDiv.onclick = afterSelectTime;
                    }
                    
                    timeDiv.appendChild(banIcon);
                } else {
                    timeDiv.classList.add('enabled');
                    timeDiv.onclick = selectTime;
                    const timeIcon = document.createElement('I');
                    timeIcon.classList.add('far', 'fa-clock');
                    timeDiv.appendChild(timeIcon);
                }
                
                document.querySelector('.times').appendChild(timeDiv);
            });
        } catch (error) {
            console.log(error);
        }
        }
    }

    xhr.send(data);
}   

function selectTime(e) {
    var time;
    if(e.target.tagName === 'P') {
        time = e.target.parentElement;    
    } else {
        time = e.target;
    }
    if (time.classList.contains('time-selected')) {
        time.classList.remove('time-selected');
        document.querySelectorAll('.enabled').forEach( time => {
            time.onclick = selectTime;
            appointment.time = '';
            time.classList.remove('time-noselected');
        });
    } else {
        time.classList.add('time-selected');
        document.querySelectorAll('.enabled').forEach( time => {
            if (!time.classList.contains('time-selected')) {
                time.onclick = null;    
                time.classList.add('time-noselected');
            }
        });
        appointment.time = time.firstChild.textContent;
    }
}

function noSelectTime() {
    showAlert('Este horario ya está reservado, elige otro', 'error');
}

function afterSelectTime() {
    showAlert('Ya es tarde para elegir este horario', 'error');
}

function disablePreviousDate() {
    const dateInput = document.querySelector('#date');
    const dateNow = new Date();
    const year = dateNow.getFullYear();
    const month = dateNow.getMonth() + 1;
    const day = dateNow.getDate();
    
    // Formato deseado
    const disableDate = `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`;
    dateInput.min = disableDate;
}


