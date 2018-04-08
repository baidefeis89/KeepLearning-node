const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const jwt = require('jsonwebtoken');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');

const CONSTANTES = require('./constantes');

mongoose.Promise = global.Promise;
mongoose.connect('mongdb://localhost:27017/cursos');

passport.use(new Strategy({secretOrKey: CONSTANTES.secreto, jwtFromRequest:
    ExtractJwt.fromAuthHeaderAsBearerToken()}, (payload, done) => {
        if (payload.id) {
            return done(null, {id: payload.id});
        } else {
            return done(new Error("Usuario incorrecto"), null);
        }
    }
));

let app = express();

app.use(fileUpload());
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

app.use( (req, res, next) => {
    res.status(404);
    res.send({ ok: false, error: 'URL not found'});
});

app.listen(8080);
