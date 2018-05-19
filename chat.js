const express = require('express');
const socketIo = require('socket.io');
const Curso = require('./models/curso');

let app = express();
let io = socketIo().listen(app.listen(8000));

(async () => {
    let cursos = await Curso.find();
    io.on('connection', (socket) => {
        socket.emit('conectado');
    
        cursos.map( c => {
            socket.on('message' + c.id, datos => {
                socket.broadcast.emit('msg' + c.id, datos)
            })
        })
       
    })
})()

module.exports = app;
