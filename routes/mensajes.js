const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const router = express.Router();

const Mensaje = require('../models/mensaje');
const Tema = require('../models/tema');

//Crear mensaje
router.post('/nuevo/:id', (req, res) => {
    let mensaje = new Mensaje({
        asunto: req.body.asunto,
        texto: req.body.texto,
        creador: req.user.id
    });

    mensaje.save().then(
        resultado => {
            Tema.findByIdAndUpdate(req.params.id, {"$push": {mensajes: mensaje.id}}).then(
                response => res.send({ok: true, result: resultado}),
                error => res.send({ok: false, error: error})
            )
        },
        error => res.send({ok: false, error: error})
    )
})

//Responder mensaje
router.post('/respuestas/:id', (req, res) => {
    let mensaje = new Mensaje({
        asunto: req.body.asunto,
        texto: req.body.texto,
        creador: req.user.id
    });

    mensaje.save().then(
        resultado => {
            Mensaje.findByIdAndUpdate(req.params.id, {"$push": {respuestas: mensaje.id}}).then(
                response => res.send({ok: true, result: resultado}),
                error => res.send({ok: false, error: error})
            )
        },
        error => res.send({ok: false, error: error})
    )    
})

//Obtener respuestas de un mensaje
router.get('/respuestas/:id', (req, res) => {
    Mensaje.findById(req.params.id).populate('respuestas').then(
        resultado => res.send({ok: true, result: resultado}),
        error => res.send({ok: false, error: error})
    )
})

//Obtener mensajes de un tema
router.get('/tema/:id', (req, res) => {
    //TODO Obtener las respuestas de cada uno de los mensajes
    Tema.findById(req.params.id).populate('mensajes').then(
        resultado => res.send({ok: true, result: resultado}),
        error => res.send({ok: false, error: error})
    )
})

module.exports = router;
