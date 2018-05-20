const mongoose = require('mongoose');

let configSchema = new mongoose.Schema({
    isPublic: {
        type: Boolean,
        required: true
    },
    key: {
        type: String,
        required: false
    }
});

let Config = mongoose.model('config', configSchema);

module.exports = Config;
