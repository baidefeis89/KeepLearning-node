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
router.get('/:id', (req, res) => {
    Apartado.findByIdAndUpdate(req.params.id, {$inc: { visits: 1 }}).populate({
        path: 'messages',
        model: 'mensaje',
        populate: [{
            path: 'creator',
            select: 'name surname avatar',
            model: 'usuario'
        },
        {
            path: 'responses',
            model: 'mensaje',
            populate: {
                path: 'creator',
                select: 'name surname avatar',
                model: 'usuario'   
            }
        }]
    }).then(
        resultado => {
            if (resultado != null) res.send({ok: true, result: resultado})
            else res.send({ok: true, result: {}})
        },
        error => res.send({ok: false, error: error})
    )

    /*async () => {
        let apartado = await Apartado.findById(req.params.id).populate('messages');
        let usuarios = await Promise.all(apartado.messages.map(
            msg => Usuario.findById(msg.creator)
        ));

        apartado.messages.map(
            msg => 
        )
    }*/
})


module.exports = router;
