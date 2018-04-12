const mongoose = require('mongoose');

let apartadoSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true,
        trim: true
    },
    video: {
        type: String,
        required: false,
        trim: true
    }
});

let Apartado = mongoose.model('apartado', apartadoSchema);
module.exports = Apartado;
