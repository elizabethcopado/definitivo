var socket = io.connect('http://localhost:5000');

var persona = document.getElementById('persona'),
    appChat = document.getElementById('app-chat'),
    panelBienvenida = document.getElementById('panel-bienvenida'),
    usuario = document.getElementById('usuario'),
    mensaje = document.getElementById('mensaje'),
    botonEnviar = document.getElementById('enviar'),
    escribiendoMensaje = document.getElementById('escribiendo-mensaje'),
    output = document.getElementById('output');

// Formulario de registro
var botonRegistrar = document.getElementById('registrar');
botonRegistrar.addEventListener('click', function() {
    var nombreDeUsuario = persona.value;
    var contraseña = document.getElementById('contraseña').value;
    
    if (nombreDeUsuario && contraseña) {
        socket.emit('register', {
            nombre: nombreDeUsuario,
            contraseña: contraseña
        });
    }
});

// Formulario de inicio de sesión
var botonIniciarSesion = document.getElementById('iniciarSesion');
botonIniciarSesion.addEventListener('click', function() {
    var nombreDeUsuario = document.getElementById('nombreInicio').value; // Cambiar a id correcto
    var contraseña = document.getElementById('contraseñaInicio').value; // Cambiar a id correcto
    
    if (nombreDeUsuario && contraseña) {
        socket.emit('login', {
            nombre: nombreDeUsuario,
            contraseña: contraseña
        });
    }
});

// Manejar el evento de enviar un mensaje
botonEnviar.addEventListener('click', function() {
    if (mensaje.value) {
        socket.emit('chat', {
            mensaje: mensaje.value,
            usuario: usuario.value
        });
    }
    mensaje.value = '';
});

// Indicar que el usuario está escribiendo
mensaje.addEventListener('keyup', function() {
    if (persona.value) {
        socket.emit('typing', {
            nombre: usuario.value,
            texto: mensaje.value
        });
    }
});

// Recibir y mostrar los mensajes en el chat
socket.on('chat', function(data) {
    escribiendoMensaje.innerHTML = '';
    output.innerHTML += '<p><strong>' + data.usuario + ': </strong>' + data.mensaje + '<p>';
});

// Mostrar quién está escribiendo
socket.on('typing', function(data) {
    if (data.texto) {
        escribiendoMensaje.innerHTML = '<p><em>' + data.nombre + ' está escribiendo un mensaje...</em></p>';
    } else {
        escribiendoMensaje.innerHTML = '';
    }
});

// Cargar todos los mensajes al ingresar al chat
socket.on('allMessages', function(messages) {
    messages.forEach(message => {
        output.innerHTML += `<p><strong>${message.usuario}: </strong>${message.mensaje}<p>`;
    });
});

// Manejar la respuesta de registro
socket.on('registerSuccess', function(data) {
    alert(data.mensaje);
    // Aquí puedes redirigir a la página de inicio de sesión si lo deseas
});

// Manejar la respuesta de inicio de sesión
socket.on('loginError', function(data) {
    alert(data.mensaje);
});

// Muestra el chat si el inicio de sesión es exitoso
socket.on('loginSuccess', function(data) {
    usuario.value = data.nombre; // Guardar el nombre de usuario para el chat
    panelBienvenida.style.display = 'none'; // Ocultar panel de bienvenida
    appChat.style.display = 'block'; // Mostrar el chat
});