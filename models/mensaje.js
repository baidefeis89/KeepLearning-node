const mongoose = require('mongoose');

let mensajeSchema = new mongoose.Schema({
    asunto: {
        type: String,
        required: true,
        trim: true
    },
    texto: {
        type: String,
        required: true,
        trim: true
    },
    creador: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        trim: true,
        match: /^\d{9}$/
    },
    respuestas: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'mensaje',
        trim: true,
        match: /^\d{9}$/
    }]
});

let Mensaje = mongoose.model('mensaje', mensajeSchema);

module.exports = Mensaje;
