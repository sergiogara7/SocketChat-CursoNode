const { io } = require('../server');

const { Usuarios } = require('../clases/usuarios');
const { crearMensaje } = require('../utilidades/utilidades');

const usuarios = new Usuarios();

io.on('connection', (client) => {
    // -- 
    client.on('entrarChat', (data, callback) => {
        //
        if( !data.nombre || !data.sala){
            return callback('Error: El nombre/sala es necesario')
        }
        //
        client.join(data.sala);
        //
        usuarios.agregarPersona(client.id, data.nombre, data.sala);
        //
        console.log('Usuario conectado:', data.nombre, 'sala: ', data.sala);
        //
        client.broadcast.to(data.sala).emit('listaPersonas', usuarios.getPersonasPorSala(data.sala));
        //
        client.broadcast.to(data.sala).emit('crearMensaje', crearMensaje('Administrador', `${data.nombre} se unio`));
        //
        callback(usuarios.getPersonasPorSala(data.sala))
    })
    // -- 
    client.on('disconnect', () => {
        //
        let personaBorrada = usuarios.borrarPersona(client.id);
        //
        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${personaBorrada.nombre} salio`));
        //
        client.broadcast.to(personaBorrada.sala).emit('listaPersonas', usuarios.getPersonasPorSala(personaBorrada.sala));
    });
    // -- 
    client.on('crearMensaje', (data, callback) => {
        //
        let persona = usuarios.getPersona(client.id);
        //
        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        //
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);
        //
        callback(mensaje);
    })
    // -- 
    client.on('mensajePrivado', data => {
        //
        let persona = usuarios.getPersona(client.id);
        //
        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        //
        client.broadcast.to(data.para).emit('mensajePrivado', mensaje);

    })
});