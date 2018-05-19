const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const passport = require('passport');
const fs = require('fs');

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
        image: 'default.jpg'
    })

    curso.save().then(
        resultado => res.send({ok: true, result: resultado}),
        error => res.send({ok: false, error: error})
    )
})

//Update course
router.put('/course', (req, res) => {
    let {image, ...data} = {...req.body};

    if (req.files) {
        let fileName = new Date().getTime() + '.' + req.files.image.mimetype.split('/')[1];
        
        req.files.image.mv('./public/img/' + fileName, error => {
            if (error) console.log('Error:', error);
        })

        data.image = fileName;
    } 

    Curso.findByIdAndUpdate(req.body._id, {$set: {...data}}, {new: true}).then(
        resultado => res.send({ok: true, result: resultado}),
        error => res.send({ok:false, error: error})
    )
})

router.put('/course/reorder', (req, res) => {
    let data = req.body;
    data.topics = data.topics.map( t => t._id );
    console.log(data.topics);
    Curso.findByIdAndUpdate(data._id, { $set: {topics: data.topics}}).then(
        result => res.send({ok:true, result:result}),
        error => res.send({ok:false, error: error})
    );
})

router.put('/topic/reorder', (req, res) => {
    let data = req.body.paragraphs.map( p => p._id );

    Tema.findByIdAndUpdate(req.body._id, { $set: {paragraphs: data} }).then(
        result => res.send({ok: true}),
        error => res.send({ok: false, error: error})
    )
})

router.delete('/course/:id', (req, res) => {
    console.log('delete:',req.params.id);
    Curso.findByIdAndRemove(req.params.id).then(
        response => {
            res.send({ok: true});
            response.topics.map( t => {
                Tema.findByIdAndRemove(t).then( tema => {
                    tema.paragraphs.map( p => Apartado.findByIdAndRemove(p).exec() )
                })
            });
        },
        error => res.send({ok: false, error: error})
    )
})

router.delete('/paragraph/:id', (req, res) => {
    Apartado.findByIdAndRemove(req.params.id).then(
        response => res.send({ok: true}),
        error => req.send({ok: false, error: error})
    )
})

router.delete('/topic/:id', (req, res) => {
    Tema.findByIdAndRemove(req.params.id).then(
        response => res.send({ok: true}),
        error => req.send({ok: false, error: error})
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

//Crear apartado y añadirlo a un tema
router.post('/topic/:id/extra', (req, res) => {
    console.log(req.body);
    let data;

    let fileName = null;
    
    if (req.files) {
        fileName = new Date().getTime() + '.' + req.files.File.mimetype.split('/')[1];
        
        req.files.File.mv('./public/uploads/' + fileName, error => {
            if (error) console.log('Error:', error);
        })

        data = {
            title: req.body.title,
            file: fileName
        };

        Tema.findByIdAndUpdate(req.params.id, {"$push": {extra: data}}, {new: true}).then(
            response => res.send({ok: true, result: response}),
            error => res.send({ok: false, error: error})
        )
    } else res.send({ok: false, error: 'File required'});

});

router.delete('/topic/:idtopic/extra/:idextra', (req, res) => {
    Tema.findByIdAndUpdate(req.params.idtopic, {"$pull": {extra: {_id: req.params.idextra}}}).then(
        response => res.send({ok: true}),
        error => res.send({ok: false, error: error})
    )
})

router.get('/messages-number', (req, res) => {
    Apartado.find().populate('messages').then(
        response => {
            let data = response.map( apartado => apartado.messages )
                .filter( messages => messages.length > 0)
                .map( x => x.filter( messages => messages.responses.length == 0))
                .reduce( (r1, r2) =>  r1 + r2.length, 0)

            res.send({ok: true, result: data})
        },
        error => res.send({ok: false, error: error})
    )
})

router.get('/messages', (req, res) => {
    Apartado.find().populate({
        path: 'messages',
        model: 'mensaje',
        populate: {
            path: 'creator',
            select: 'name surname avatar',
            model: 'usuario'   
        }
    }).then(
        response => {
            let data = [];
            response.map( apartado => apartado.messages )
                .filter( messages => messages.length > 0)
                .map( x => x.filter( messages => messages.responses.length == 0))
                .map( x => data.push(...x))
                
            res.send({ok: true, result: data})
        },
        error => res.send({ok: false, error: error})
    )
})
module.exports = router;
