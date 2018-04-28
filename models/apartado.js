const mongoose = require('mongoose');

let apartadoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    video: {
        type: String,
        required: false,
        trim: true
    },
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'mensaje',
        trim: true,
        match: /^\d{9}$/
    }]
});

let Apartado = mongoose.model('apartado', apartadoSchema);
module.exports = Apartado;
