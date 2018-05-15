const mongoose = require('mongoose');
const Topic = require('./tema');

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
    }],
    image: {
        type: String,
        required: false,
        trim: true
    }
});

let Curso = mongoose.model('curso', cursoSchema);

module.exports = Curso;
