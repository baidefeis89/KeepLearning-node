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


//Obtener apartado
router.get('/statistics', (req, res) => {
    console.log(req.user);
    if (req.user.admin)
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
    else 
        res.send(401, {ok: false, error: 'Unauthorized'});
})


module.exports = router;
