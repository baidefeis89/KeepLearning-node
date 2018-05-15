const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const passport = require('passport');

const router = express.Router();

const Curso = require('../models/curso');
const Tema = require('../models/tema');
const Apartado = require('../models/apartado');

const constantes = require('../constantes');

//Obtener curso completo
// router.get('/:id', (req, res) => {
//     (async () => {
//         const curso = await Curso.findById(req.params.id);
//         curso.topics = await Promise.all(
//             curso.topics.map( tema => Tema.findById(tema).populate('paragraphs') )
//         );
//         console.log(curso);
//         res.send({ok: true, result: curso});

//     })().catch( err => res.send({ok: false, error: err}));
// })

router.get('/:id', (req, res) => {
    Curso.findById(req.params.id).populate({
        path: 'topics',
        model: 'tema',
        populate: {
            path: 'paragraphs',
            model: 'apartado'
        }
    }).then(
        response => res.send({ok: true, result: response}),
        err => res.send({ok: false, error: err})
    );
})

module.exports = router;
