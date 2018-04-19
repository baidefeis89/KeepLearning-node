const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const passport = require('passport');

const router = express.Router();

const Curso = require('../models/curso');
const Tema = require('../models/tema');
const Apartado = require('../models/apartado');

const constantes = require('../constantes');

//Obtener cursos
router.get('/', (req, res) => {
    Curso.find().then( 
        resultado => res.send({ok: true, result: resultado}),
        error => res.send({ok: false, error: error})
    );
});

//Creacion del curso
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    let curso = new Curso({
        titulo: req.body.titulo,
        creador: req.user.id
    })

    curso.save().then(
        resultado => res.send({ok: true}),
        error => res.send({ok: false, error: error})
    )
})

//Obtener apartados de un tema
router.get('/temas/apartados/:id', (req, res) => {
    Tema.findById(req.params.id).populate('apartados').then(
        resultado => res.send({ok: true, result: resultado.apartados}),
        error => res.send({ok: false, error: error})
    )
})

//Crear apartado y añadirlo a un tema
router.post('/temas/apartados/:id', (req, res) => {
    
    //TODO implementar subida de video
    let apartado = new Apartado({
        titulo: req.body.titulo,
        video: req.body.video
    })

    apartado.save().then(
        resultado => {
            Tema.findByIdAndUpdate(req.params.id, {"$push": {apartados: apartado.id}}).then(
                response => res.send({ok: true, result: apartado}),
                error => res.send({ok: false, error: error})
            )
        },
        error => res.send({ok: false, error: error})
    )
})

//Creacion de tema y añadido al curso
router.post('/:id/temas', passport.authenticate('jwt', {session: false}), (req, res) => {
    let tema = new Tema({
        titulo: req.body.titulo,
        descripcion: req.body.descripcion
    });

    tema.save().then(
        resultado => {
            Curso.findByIdAndUpdate(req.params.id, { "$push": { temas: tema.id } }).then(
                response => res.send({ok: true, result: tema}),
                error => res.send({ok: false, error: error})
            )
        },
        error => res.send({ok: false, error: error})
    )
})

router.get('/:id/temas', (req, res) => {
    (async () => {
        const curso = await Curso.findById(req.params.id);
        curso.temas = await Promise.all(
            curso.temas.map( tema => Tema.findById(tema).populate('apartados') )
        );

        res.send({ok: true, result: curso});

    })().catch( err => res.send({ok: false, error: err}))
})

//Obtener temas de un curso
router.get('/:id', (req, res) => {
    Curso.findById(req.params.id).populate('temas').then(
        resultado => res.send({ok: true, result: resultado}),
        error => res.send({ok: false, error: error})
    )
})




module.exports = router;
