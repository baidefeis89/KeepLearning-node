const mongoose = require('mongoose');

let cursoSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true,
        trim: true
    },
    creador: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usuario',
        required: true
    },
    temas: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tema',
        trim: true,
        match: /^\d{9}$/
    }]
});

let Curso = mongoose.model('curso', cursoSchema);

module.exports = Curso;
