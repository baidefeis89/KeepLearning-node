const mongoose = require('mongoose');

let mensajeSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: true,
        trim: true
    },
    text: {
        type: String,
        required: true,
        trim: true
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        trim: true,
        match: /^\d{9}$/
    },
    responses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'mensaje',
        trim: true,
        match: /^\d{9}$/
    }]
});

let Mensaje = mongoose.model('mensaje', mensajeSchema);

module.exports = Mensaje;
