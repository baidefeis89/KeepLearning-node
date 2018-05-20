const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const passport = require('passport');

const Curso = require('../models/curso');
const Usuario = require('../models/usuario');
const Config = require('../models/config');
const constantes = require('../constantes');


router.get('/cursos', (req, res) => {
    Curso.find().populate('temas').then(
        resultado => res.send({ok: true, result: resultado}),
        error => res.send({ok: false, error: error})
    )
})

router.get('/auth/token', (req, res) => {
    let token = req.headers['authorization'];

    if (checkToken(token)) res.send({ok: true});
    else res.send({ok: false});
})

router.get('/auth/admin', passport.authenticate('jwt', {session: false}), (req, res) => {
    console.log(req.user);
    if (req.user && req.user.admin) {
        res.send({ok: true})
    } else {
        res.send(401, {ok: false, error: 'Unauthorized'});
    }
})

router.get('/auth/settings', (req, res) => {
    Config.find().then( 
        response => res.send({ok: true, result: response[0].isPublic}),
        error => res.send({ok: false, error: error})
    )
})

router.post('/auth/login', (req, res) => {
    if (!req.body.email || !req.body.password) 
        res.send({ok: false, error: 'Nombre de usuario y contraseña requerido'})
    else {
        Usuario.findOne({email: req.body.email}).then( resultado => {
            console.log(resultado);
            if (!resultado) {
                res.send({ok: false, error: 'Nombre de usuario o contraseña incorrecto'})
                return;
            }
            bcrypt.compare(req.body.password, resultado.password).then( response => {
                if (response) res.send({ok: true, token: generarToken(resultado.id, resultado.admin), admin: resultado.admin});
                else res.send({ok: false, error: 'Nombre de usuario o contraseña incorrecto'});
            })
        })
    }
})

router.post('/auth/registro', (req, res) => {
    if (!req.body.email) res.send({ok: false, error: 'El email es obligatorio'});
    else if (req.body.email != req.body.email2) res.send({ok: false, error: 'Los emails deben ser iguales'})
    else if (!req.body.password) res.send({ok: false, error: 'La contraseña es obligatoria'});
    else if (req.body.password !== req.body.password2) res.send({ok: false, error: 'Las contraseñas deben ser iguales'})
    else if (!req.body.name) res.send({ok: false, error: 'El nombre es obligatorio'});
    else if (!req.body.surname) res.send({ok: false, error: 'El apellido es obligatorio'});
    else {
        Config.find().then( response => {
            if (!response[0].isPublic && response[0].key != req.body.key) {
                res.send({ok: false, error: 'La clave del registro no es válida, contacte con el administrador'})
            } else {
                let fileName = null;
            
                if (req.files) {
                    fileName = new Date().getTime() + '.' + req.files.avatar.mimetype.split('/')[1];
                    
                    req.files.avatar.mv('./public/img/' + fileName, error => {
                        if (error) console.log('Error:', error);
                    })
                }else fileName = "profile-default.jpg";
        
                let usuario = new Usuario({
                    email: req.body.email,
                    name: req.body.name,
                    surname: req.body.surname,
                    password: req.body.password,
                    avatar: fileName,
                    admin: false
                });
        
                bcrypt.hash(req.body.password, constantes.saltRounds).then( resultado => {
                    usuario.password = resultado;
                    
                    usuario.save().then(
                        resultado => res.send({ok: true, token: generarToken(resultado.id, resultado.admin)}),
                        error => {
                            if (error.code == 11000) res.send({ok: false, error: 'Ese email ya está registrado'})
                            else res.send({ok: false, error: error})
                        }
                            
                    )
                    
                })

            }
        })
    }
})

module.exports = router;

function generarToken(id, admin) {
    let token = jwt.sign({id: id, admin: admin}, constantes.secreto, {expiresIn: '1 day'});
    return token;
}

function checkToken(token) {
    try {
        jwt.verify(token.split(' ')[1], constantes.secreto);
        return true;
    } catch (e) {
        return false;
    }
}
