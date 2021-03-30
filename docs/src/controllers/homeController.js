var path = require('path');
const Audio = require(path.join(__dirname, '..', 'models/audios'))

const homeController={
    index: async(req, res) => {
        const audios = await Audio.find();
        console.log(audios);
        res.json(audios)
      },

    // filtro: async(req, res) =>{
    //   let qs = req.query
    //   const audios = await Audio.find({
    //     title: /qs/i
    // }).exec(function(err, audios) {
    //     if (err) throw err;
         
    //     console.log(audios);
        
    // });
    // res.json(audios);
    // },

    audio: async(req, res) => {
        const audio = await Audio.findById(req.params.id);
        console.log("llego")
        res.json(audio)},

    nuevo_audio:    async(req, res) => {
            const { titulo } = req.body;
            const audio = new Audio({ titulo });
            console.log(audio);
            await audio.save(); 
            res.json({status: 'audio guardado'});
        },

    editar_audio: async(req, res) => {
        const { titulo } = req.body;
        const newAudio = {titulo};
        await Audio.findByIdAndUpdate(req.params.id, newAudio)
        res.json({status: 'audio actualizado'});
      }, 

    eliminar : async(req, res) => {
        await Audio.findByIdAndRemove(req.params.id);
        res.json({status: 'audio eliminado'});
      }
    
}

module.exports = homeController;