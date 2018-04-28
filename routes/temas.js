const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const passport = require('passport');

const router = express.Router();

const Curso = require('../models/curso');
const Tema = require('../models/tema');
const Apartado = require('../models/apartado');

const constantes = require('../constantes');


//Obtener tema
router.get('/apartados/:id', (req, res) => {
    Apartado.findById(req.params.id).then(
        resultado => {
            if (resultado != null) res.send({ok: true, result: resultado})
            else res.send({ok: true, result: {}})
        },
        error => res.send({ok: false, error: error})
    )
})

//Crear apartado y añadirlo a un tema
router.post('/apartados/:id', (req, res) => {
    let fileName = null;
    
    if (req.files) {
        fileName = new Date().getTime() + '.' + req.files.video.mimetype.split('/')[1];
        
        req.files.video.mv('./public/uploads/' + fileName, error => {
            if (error) console.log('Error:', error);
        })
    }

    let apartado = new Apartado({
        title: req.body.title,
        video: fileName ? fileName : null
    });
    
    apartado.save().then(
        resultado => {
            Tema.findByIdAndUpdate(req.params.id, {"$push": {paragraphs: apartado.id}}).then(
                response => res.send({ok: true, result: apartado}),
                error => res.send({ok: false, error: error})
            )
        },
        error => res.send({ok: false, error: error})
    )
})

//Creacion de tema y añadido al curso
router.post('/:id', (req, res) => {
    let tema = new Tema({
        title: req.body.title,
        description: req.body.description
    });

    tema.save().then(
        resultado => {
            Curso.findByIdAndUpdate(req.params.id, { "$push": { topics: tema.id } }).then(
                response => res.send({ok: true, result: tema}),
                error => res.send({ok: false, error: error})
            )
        },
        error => res.send({ok: false, error: error})
    )
})

module.exports = router;
