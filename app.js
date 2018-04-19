const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const jwt = require('jsonwebtoken');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const cors = require('cors');

const CONSTANTES = require('./constantes');

const index = require('./routes/index');
const usuarios = require('./routes/usuarios');
const cursos = require('./routes/cursos');
const mensajes = require('./routes/mensajes');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/cursos');

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

app.use(cors());

app.use(fileUpload());
app.use(bodyParser.json());
//app.use(passport.initialize());

app.use(express.static(__dirname + '/public'));

app.use('/', index);
app.use('/usuarios', passport.authenticate('jwt', {session: false}), usuarios);
app.use('/cursos', passport.authenticate('jwt', {session: false}), cursos);
app.use('/mensajes', passport.authenticate('jwt', {session: false}), mensajes);

app.use( (req, res, next) => {
    res.status(404);
    res.send({ ok: false, error: 'URL not found'});
});

app.listen(8080);
