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
    name: {
        type: String,
        required: true,
        trim: true
    },
    surname: {
        type: String,
        required: true,
        trim: true
    },
    avatar: {
        type: String,
        required: false,
        trim: true
    },
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'curso'
    }]
});

let Usuario = mongoose.model('usuario', usuarioSchema);

module.exports = Usuario;
