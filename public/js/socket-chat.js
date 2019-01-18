var socket = io();

var params = new URLSearchParams( window.location.search );

if(!params.has('nombre') || !params.has('sala')){
    window.location = 'index.html';
    throw new Error('El nombre y sala es necesario');
}

var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
}

socket.on('connect', function() {
    //
    console.log('Conectado al servidor');
    //
    socket.emit('entrarChat', usuario, (resp) => {
        console.log(resp);
    });
});

socket.on('disconnect', function() {
    console.log('Perdimos conexión con el servidor');
});

socket.on('crearMensaje', (data) => {
    console.log(data);
})

socket.on('listaPersonas', (data) => {
    console.log(data);
})

socket.on('mensajePrivado', (data) => {
    console.log('M.Privado: ', data);
})

// ---------------------- enviar

// -- 

