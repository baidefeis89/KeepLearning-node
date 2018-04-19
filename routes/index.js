const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const Curso = require('../models/curso');
const Usuario = require('../models/usuario');
const constantes = require('../constantes');


router.get('/cursos', (req, res) => {
    Curso.find().populate('temas').then(
        resultado => res.send({ok: true, result: resultado}),
        error => res.send({ok: false, error: error})
    )
})

router.post('/auth/login', (req, res) => {
    if (!req.body.email || !req.body.password) 
        res.send({ok: false, error: 'Nombre de usuario y contraseña requerido'})
    else {
        Usuario.findOne({email: req.body.email}).then( resultado => {
            if (!resultado) {
                res.send({ok: false, error: 'Nombre de usuario o contraseña incorrecto'})
                return;
            }
            bcrypt.compare(req.body.password, resultado.password).then( response => {
                if (response) res.send({ok: true, token: generarToken(resultado.id)});
                else res.send({ok: false, error: 'Nombre de usuario o contraseña incorrecto'});
            })
        })
    }
})

router.post('/auth/registro', (req, res) => {
    if (!req.body.email) res.send({ok: false, error: 'El email es obligatorio'});
    else if (!req.body.password) res.send({ok: false, error: 'La contraseña es obligatoria'});
    else if (!req.body.name) res.send({ok: false, error: 'El nombre es obligatorio'});
    else if (!req.body.surname) res.send({ok: false, error: 'El apellido es obligatorio'});
    else {
        let usuario = new Usuario({
            email: req.body.email,
            name: req.body.name,
            surname: req.body.surname,
            password: req.body.password
        });

        bcrypt.hash(req.body.password, constantes.saltRounds).then( resultado => {
            usuario.password = resultado;
           
            usuario.save().then(
                resultado => res.send({ok: true, token: generarToken(resultado.id)}),
                error => res.send({ok: false, error: error})   
            )
            
        })

    }
})

module.exports = router;

function generarToken(id) {
    let token = jwt.sign({id: id}, constantes.secreto, {expiresIn: '1 day'});
    return token;
}
