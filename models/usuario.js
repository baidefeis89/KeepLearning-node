const mongoose = require('mongoose');

let usuarioSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    apellidos: {
        type: String,
        required: true,
        trim: true
    },
    cursos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'curso'
    }]
});

let Usuario = mongoose.model('usuario', usuarioSchema);

module.exports = Usuario;
