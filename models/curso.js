const mongoose = require('mongoose');

let cursoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usuario',
        required: true
    },
    description: {
        type: String,
        required: true,
        trim: true,
        minlength: 10
    },
    topics: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tema',
        trim: true,
        match: /^\d{9}$/
    }]
});

let Curso = mongoose.model('curso', cursoSchema);

module.exports = Curso;
