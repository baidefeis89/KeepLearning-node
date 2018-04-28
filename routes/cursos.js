const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const passport = require('passport');

const router = express.Router();

const Curso = require('../models/curso');
const Tema = require('../models/tema');
const Apartado = require('../models/apartado');

const constantes = require('../constantes');

//Creacion del curso
router.post('/', (req, res) => {
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
        resultado => res.send({ok: true}),
        error => res.send({ok: false, error: error})
    )
})

//Obtener curso completo
router.get('/:id', (req, res) => {
    (async () => {
        const curso = await Curso.findById(req.params.id);
        curso.topics = await Promise.all(
            curso.topics.map( tema => Tema.findById(tema).populate('paragraphs') )
        );

        res.send({ok: true, result: curso});

    })().catch( err => res.send({ok: false, error: err}));
})


module.exports = router;
