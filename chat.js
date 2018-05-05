const express = require('express');
const socketIo = require('socket.io');
const Curso = require('./models/curso');

let app = express();
let io = socketIo().listen(app.listen(8000));

// let cursos = [];

(async () => {
    let cursos = await Curso.find();
    //c.map( curso => cursos.push(curso.id));
    io.on('connection', (socket) => {
        socket.emit('conectado');
    
        cursos.map( c => {
            socket.on('message' + c.id, datos => {
                socket.broadcast.emit('msg' + c.id, datos)
            })
        })
       
    })
})()



// io.on('connection', (socket) => {
//     socket.emit('conectado');

//     socket.on('message', datos => {
//         console.log(datos);
//         socket.broadcast.emit('msg', datos);
//     })
// })

module.exports = app;

// private sockets(): void {
//     this.io = socketIo(this.server);
// }

// private listen(): void {
//     this.server.listen(this.port, () => {
//         console.log('Running server on port %s', this.port);
//     });

//     this.io.on('connect', (socket: any) => {
//         console.log('Connected client on port %s.', this.port);
//         socket.on('message', (m: Message) => {
//             console.log('[server](message): %s', JSON.stringify(m));
//             this.io.emit('message', m);
//         });

//         socket.on('disconnect', () => {
//             console.log('Client disconnected');
//         });
//     });
// }
