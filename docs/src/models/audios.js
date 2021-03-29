const mongoose = require('mongoose');
const { Schema } = mongoose;

// modelo de audio
const AudioSchema = new Schema({
    fecha: {type: Date, default:Date.now},
    titulo: { type: String, required:true}
});

module.exports = mongoose.model('Audio', AudioSchema); 