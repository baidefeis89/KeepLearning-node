const mongoose = require('mongoose');

let temaSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: String,
    paragraphs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'apartado',
        trim: true,
        match: /^\d{9}$/
    }],
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'mensaje',
        trim: true,
        match: /^\d{9}$/
    }]
});

let Tema = mongoose.model('tema', temaSchema);
module.exports = Tema;
