const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const passport = require('passport');

const router = express.Router();

const Curso = require('../models/curso');
const Tema = require('../models/tema');
const Apartado = require('../models/apartado');
const Usuario = require('../models/usuario');

const constantes = require('../constantes');

//TODO implement middleware to check admin
router.use((req, res, next) => {
    if (req.user.admin) {
        next();
    } else {
        res.send(401, {ok: false, error: 'Unauthorized'});
    }
});

//Obtener apartado
router.get('/statistics', (req, res) => {
    Curso.find().populate({
        path: 'topics',
        model: 'tema',
        populate: {
            path: 'paragraphs',
            select: 'title visits',
            model: 'apartado'   
        }
    }).then( 
        response => res.send({ok: true, result: response}),
        err => res.send({ok: false, error: err})
    )
});

//Create course
router.post('/course', (req, res) => {
    console.log(req.body);
    let fileName = null;
    
    const curso = new Curso({
        title: req.body.title,
        description: req.body.description,
        creator: req.user.id,
        image: ''
    })

    if (req.files) {
        fileName = new Date().getTime() + '.' + req.files.image.mimetype.split('/')[1];
        
        req.files.image.mv('./public/uploads/' + fileName, error => {
            if (error) console.log('Error:', error);
        })
    }

    curso.image = fileName ? fileName : 'default.jpg';

    curso.save().then(
        resultado => res.send({ok: true, result: resultado}),
        error => res.send({ok: false, error: error})
    )
})

//Update course
router.put('/course', (req, res) => {
    //TODO implementar imagen
    Curso.findByIdAndUpdate(req.body._id, {$set: {...req.body}}, {new: true}).then(
        resultado => {console.log(resultado);res.send({ok: true, result: resultado})},
        error => res.send({ok:false, error: error})
    )
})

//Creacion de tema y añadido al curso
router.post('/course/:id/topic', (req, res) => {
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

//Crear apartado y añadirlo a un tema
router.post('/topic/:id/paragraph', (req, res) => {
    console.log(req.body);
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


module.exports = router;
