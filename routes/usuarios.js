const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const router = express.Router();
const Usuario = require('../models/usuario');

const constantes = require('../constantes');

router.post('/login', (req, res) => {
    if (!req.body.email || !req.body.password) 
        res.send({ok: false, error: 'Nombre de usuario y contraseña requerido'})
    else {
        Usuario.findOne({email: req.body.email}).then( resultado => {
            bcrypt.compare(req.body.password, resultado.password).then(
                response => {
                    if (response) res.send({ok: true, token: generarToken(resultado.id)});
                    else res.send({ok: false, error: 'Nombre de usuario o contraseña incorrecto'});
                }
            )
        })
    }
})

router.post('/registro', (req, res) => {
    if (!req.body.email) res.send({ok: false, error: 'El email es obligatorio'});
    else if (!req.body.password) res.send({ok: false, error: 'La contraseña es obligatoria'});
    else if (!req.body.nombre) res.send({ok: false, error: 'El nombre es obligatorio'});
    else if (!req.body.apellidos) res.send({ok: false, error: 'El apellido es obligatorio'});
    else {
        let usuario = new Usuario({
            email: req.body.email,
            nombre: req.body.nombre,
            apellidos: req.body.apellidos,
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
