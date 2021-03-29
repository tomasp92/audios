const mongoose = require('mongoose')

// guardar base de datos en una constante para que si cambio el link solo hacerlo aqui
const URI = 'mongodb://localhost/mern-tasks'

mongoose.connect(URI)
.then(db => console.log('DB conectada'))
.catch(err=> console.error(err));

module.exports = mongoose;