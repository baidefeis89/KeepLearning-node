const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const router = express.Router();

const Mensaje = require('../models/mensaje');
const Tema = require('../models/tema');
const Apartado = require('../models/apartado');
const Usuario = require('../models/usuario');

//Crear mensaje
router.post('/nuevo/:id', (req, res) => {
    let mensaje = new Mensaje({
        subject: req.body.subject,
        text: req.body.text,
        creator: req.user.id
    });

    // mensaje.save().then(
    //     resultado => {
    //         Apartado.findByIdAndUpdate(req.params.id, {"$push": {messages: mensaje.id}}).then(
    //             response => res.send({ok: true, result: resultado}),
    //             error => res.send({ok: false, error: error})
    //         )
    //     },
    //     error => res.send({ok: false, error: error})
    // )

    mensaje.save().then(
        async resultado => {
            await Apartado.findByIdAndUpdate(req.params.id, {"$push": {messages: mensaje.id}});
            let user = await Usuario.findById(resultado.creator);
            let respuesta = {...resultado._doc};
            respuesta.creator = {
                _id: user.id,
                name: user.name,
                surname: user.surname,
                avatar: user.avatar
            }
            res.send({ok: true, result: respuesta});
        },
        error => res.send({ok: false, error: error})
    )
})

//Responder mensaje
router.post('/respuestas/:id', (req, res) => {
    let mensaje = new Mensaje({
        subject: req.body.subject || 'default',
        text: req.body.text,
        creator: req.user.id
    });

    mensaje.save().then(
        // resultado => {
        //     Mensaje.findByIdAndUpdate(req.params.id, {"$push": {responses: mensaje.id}}).then(
        //         response => res.send({ok: true, result: resultado}),
        //         error => res.send({ok: false, error: error})
        //     )
        // }
        async resultado => {
            await Mensaje.findByIdAndUpdate(req.params.id, {"$push": {responses: mensaje.id}});
            let user = await Usuario.findById(resultado.creator);
            let respuesta = {...resultado._doc};
            respuesta.creator = {
                _id: user.id,
                name: user.name,
                surname: user.surname,
                avatar: user.avatar
            }
            console.log(respuesta);
            res.send({ok: true, result: respuesta});
        },
        error => res.send({ok: false, error: error})
    )    
})

//Obtener respuestas de un mensaje
router.get('/respuestas/:id', (req, res) => {
    Mensaje.findById(req.params.id).populate('responses').then(
        resultado => res.send({ok: true, result: resultado}),
        error => res.send({ok: false, error: error})
    )
})

//Obtener mensajes de un tema
router.get('/tema/:id', (req, res) => {
    //TODO Obtener las respuestas de cada uno de los mensajes
    Tema.findById(req.params.id).populate('messages').then(
        resultado => res.send({ok: true, result: resultado}),
        error => res.send({ok: false, error: error})
    )
})

module.exports = router;
