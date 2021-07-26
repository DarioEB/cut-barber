
document.addEventListener('DOMContentLoaded', () => {
    initLogin();

    viewPassword();
});

function initLogin() {
    const formLogin = document.querySelector('#form-login');
    
    formLogin.addEventListener('submit', login);

}

function viewPassword() {
    const btnView = document.querySelector('.password .far');
    const input = document.querySelector('.password input');
    var count = 0;
    btnView.addEventListener('click', (e) => {
        e.preventDefault();
        if(count===0) {
            input.setAttribute('type', 'text');
            count = 1;
        } else {
            input.setAttribute('type', 'password');
            count = 0;
        }
    });
}

function showAlert(message, type) {

    if(document.querySelector('.alert')) {
        document.querySelector('.alert').remove();
    }

    const alert = document.createElement('DIV');
    alert.classList.add('alert');
    alert.classList.add(type);

    const text = document.createElement('P');
    text.textContent = message;

    alert.appendChild(text);
    
    document.querySelector('.login').appendChild(alert);

    setTimeout( () => {
        alert.remove();
    }, 3800);
}

function login(e) {
    e.preventDefault();

    // Obteniendo datos
    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;

    // Validacion
    if (username === '' || password === '') {
        showAlert('Ninguno de los campos puede estar vacio', 'error');
    } else {
        const data = new FormData();

        data.append('username', username);
        data.append('password', password);

        initSesion(data); 
    }
}

function initSesion(data) {
    const xhr = new XMLHttpRequest();

    xhr.open('POST', 'inc/models/model_login.php', true);

    xhr.onload = function() {
        if(this.status === 200) {
            const response = JSON.parse(xhr.responseText);
            if(response.response == 'ok') {
                lastAlert(
                    'Datos correctos', 
                    'Sesion Administración iniciada', 
                    'success', 
                    'Ir al panel'
                );
            } else {
                showAlert('Datos ingresados incorrectos', 'error');
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
        console.log(e);
        if(e.isConfirmed) {
            window.location.href = 'http://192.168.100.218:3000/admin.php'
        }
    })
}

