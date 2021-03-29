var express = require('express');
var router = express.Router();
var path = require('path');
const homeController = require('../controllers/homeController')

const Audio = require(path.join(__dirname, '..', 'models/audios'))

/* index: para todos los audios */
router.get('/', homeController.index);

// buscar un solo audio
router.get('/:id', homeController.audio);


// 
router.post('/', homeController.nuevo_audio);

router.put('/:id', homeController.editar_audio );

// eliminar un audio
router.delete('/:id', homeController.eliminar);

module.exports = router;
