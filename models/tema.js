const mongoose = require('mongoose');

let temaSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true,
        trim: true
    },
    descripcion: String,
    apartados: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'apartado',
        trim: true,
        match: /^\d{9}$/
    }],
    mensajes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'mensaje',
        trim: true,
        match: /^\d{9}$/
    }]
});

let Tema = mongoose.model('tema', temaSchema);
module.exports = Tema;
