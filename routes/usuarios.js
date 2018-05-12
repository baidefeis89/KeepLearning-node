const express = require('express');
const fs = require('fs');
const bcrypt = require('bcrypt');

const router = express.Router();
const Usuario = require('../models/usuario');
const constantes = require('../constantes');

router.get('/me', (req, res) => {
    Usuario.findById(req.user.id).then(
        result => res.send({ok: true, result: {email: result.email, name: result.name, surname: result.surname, avatar: result.avatar}}),
        err => res.send({ok: false, error: err})
    )
})

router.get('/:id', (req, res) => {
    Usuario.findById(req.params.id).then(
        result => res.send({ok: true, result: {email: result.email, name: result.name, surname: result.surname, avatar: result.avatar}}),
        err => res.send({ok: false, error: err})
    )
})

router.put('/me', (req, res) => {
    let data = {
        email: req.body.email,
        name: req.body.name,
        surname: req.body.surname
    };
    Usuario.findByIdAndUpdate(req.user.id, data).then(
        result => res.send({ok:true}),
        err => res.send({ok:false, error: err})
    )
})

router.put('/me/avatar', (req, res) => {
    let user = req.body;

    if (req.files){
        let fileName = new Date().getTime() + '.jpg';

        req.files.image.mv('./public/img/' + fileName, error => {
            if (error) res.status(500).send('Error uploading file') 

            user.avatar = fileName; 
        });
    } else if (user.avatar){
        user.avatar = guardarImagen(user.avatar);
    }
    console.log(user.avatar);
    Usuario.findByIdAndUpdate(req.user.id, {$set: {avatar: user.avatar}}).then(
        result => res.send({ok:true}),
        err => res.send({ok:false, error: err})
    )
})

router.put('/me/password', (req, res) => {
    bcrypt.hash(req.body.password, constantes.saltRounds).then( resultado => {
        console.log(resultado);
        Usuario.findByIdAndUpdate(req.user.id, {$set: {password: resultado}}).then(
            result => {
                console.log(result);
                res.send({ok:true})},
            err => res.send({ok:false, error: err})
        )  
    })
})

module.exports = router;

function guardarImagen(image) {
    image = image.replace(/^data:image\/png;base64,/, "");
    image = image.replace(/^data:image\/jpg;base64,/, "");
    image = image.replace(/^data:image\/jpeg;base64,/, "");
    
    image = Buffer.from(image, 'base64');
    
    let nameFile = new Date().getTime() + '.jpg';

    fs.writeFile('./public/img/' + nameFile, image, err => console.log(err));
    
    return nameFile;
}