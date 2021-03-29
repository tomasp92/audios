var express = require('express');
var router = express.Router();
var path = require('path');
const homeController = require('../controllers/homeController')
const multer = require('multer')
const Audio = require(path.join(__dirname, '..', 'models/audios'))

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(__dirname,'../../public/uploads'))
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
  })
   
  let upload = multer({ storage: storage })



/* index: para todos los audios */
router.get('/', homeController.index);

/* buscar audios con filtros */
router.get('/:filtro', homeController.filtro);

// buscar un solo audio
router.get('/:id', homeController.audio);


//  guardar un nuevo audio
router.post('/', upload.single('audio'), homeController.nuevo_audio);

router.put('/:id', homeController.editar_audio );

// eliminar un audio
router.delete('/:id', homeController.eliminar);

module.exports = router;
