import React, { Component } from 'react';
import Nav from './Nav';

class App extends Component {
    
    constructor(){
        super();
        this.state = {
            titulo: '',
            id: '',
            
            audios: []
            
        };
        this.handleChange = this.handleChange.bind(this);
        this.addAudio = this.addAudio.bind(this);
        
    }
    
    // al hacer click eso que escuche se manda a mi servidor
    addAudio(evento){
        if(this.state._id){
            //actualizar titulo si existe id
            fetch(`/api/audios/${this.state._id}`, {
                method: 'PUT',
                body: JSON.stringify(this.state),
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json'
                }
            })
            .then(res=> res.json())
            .then(data => {
                console.log(data)
                //Mensaje al usuario en la pantalla
                M.toast({html: `Audio editado`});
                // Setear a vacio los datos del formulario
                this.setState({titulo:'',_id:'',audio: ''});
                this.obtenerAudios();
            })
            .catch(err=> console.log(err));
        }else{
            //agregar nuevo audio
            fetch('/api/audios',{
                method: 'POST',
                body: JSON.stringify(this.state),
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json'
                }
            })
            .then(res=> res.json())
            .then(data => {
                console.log(data)
                M.toast({html: `Audio guardado`});
                this.setState({titulo:'',_id:''});
                this.obtenerAudios();
            })
            .catch(err=> console.log(err));
        }
        
        evento.preventDefault();    
    }

    componentDidMount(){
        this.obtenerAudios();
        this.dispplayaudiooption();
    }

    dispplayaudiooption(){
        // listeners para comenzar a grabar, guardar o cancelar el audio
        var start = document.getElementById('btnStart');
        var stop = document.getElementById('btnStop');
        var cancel = document.getElementById('btnCancel');
        var video = document.getElementById('vid');
        var vidSave = document.getElementById('vid2');
        var timer = document.getElementById('timer');
        
        //  //activar segundero del audio
        //  var cronometro;
        //  function carga(){
        //     var contador_s = 0;
        //     var contador_m = 0;
        //     cronometro = setInterval(
        //             function(){ 
        //                 contador_s++;
        //                 if(contador_s==60)
        //                 {
        //                     contador_s =0;
        //                     contador_m = contador_m + 1;
        //                 }
        //                 console.log(contador_s)
        //                 // this.setState({
        //                 //     tiempo: `${contador_m}: ${+ contador_s}`
        //                 this.setState({
        //                     tiempo: `${contador_m}:${contador_s}`
        //                 }, 1000);
                
        //         })
        // }   
        
        // // detener la carga
        // function detenercarga(){
        //     clearInterval(cronometro);
        // }

        // mostrar botones
        stop.style.display = 'none';
        start.style.display = 'block';
        cancel.style.display = 'none';
        timer.style.display = 'none';
        video.style.display = 'none';
        
        let constraintObj = { 
            audio: true, 
            video: false
        }; 

        //handle older browsers that might implement getUserMedia in some way
        if (navigator.mediaDevices === undefined) {
            navigator.mediaDevices = {};
            navigator.mediaDevices.getUserMedia = function(constraintObj) {
                let getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
                if (!getUserMedia) {
                    return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
                }
                return new Promise(function(resolve, reject) {
                    getUserMedia.call(navigator, constraintObj, resolve, reject);
                });
            }
        }else{
            navigator.mediaDevices.enumerateDevices()
            .then(devices => {
                devices.forEach(device=>{
                    console.log(device.kind.toUpperCase(), device.label);
                    //, device.deviceId
                })
            })
            .catch(err=>{
                console.log(err.name, err.message);
            })
        }

        navigator.mediaDevices.getUserMedia(constraintObj)
        .then(function(mediaStreamObj) {
            //connect the media stream to the first video element
            let video = document.querySelector('video');
            if ("srcObject" in video) {
                video.srcObject = mediaStreamObj;
            } else {
                //old version
                video.src = window.URL.createObjectURL(mediaStreamObj);
            }
            
            // más listeners para guardar el audio
            let mediaRecorder = new MediaRecorder(mediaStreamObj);
            let chunks = [];
            
            
            start.addEventListener('click', (ev)=>{
                mediaRecorder.start();
                console.log(mediaRecorder.state);
                //carga();
                stop.style.display = 'block';
                start.style.display = 'none';
                cancel.style.display = 'block';
                timer.style.display = 'block';
                
            });
            cancel.addEventListener('click', (ev)=>{
                console.log("audio cancelado");
                console.log(mediaRecorder.state);
                //detenercarga();
            });
            stop.addEventListener('click', (ev)=>{
                mediaRecorder.stop();
                console.log(mediaRecorder.state);
                //detenercarga();
                stop.style.display = 'none';
                start.style.display = 'none';
                cancel.style.display = 'none';
                timer.style.display = 'none';
            });
            mediaRecorder.ondataavailable = function(ev) {
                chunks.push(ev.data);
            }
            mediaRecorder.onstop = (ev)=>{
                let blob = new Blob(chunks, { 'type' : 'audio/mp4;' });
                chunks = [];
                let videoURL = window.URL.createObjectURL(blob);
                vidSave.src = videoURL;
            }
        })
        .catch(function(err) { 
            console.log(err.name, err.message); 
        });

    }

    obtenerAudios(){
        fetch('/api/audios')
            .then(res=> res.json())
            .then(data=> {
                console.log(data);
                this.setState({audios: data});
                console.log(this.state.audios);
            });
    }


    deleteAudio(id){
        if (confirm('¿Estás seguro de querer eliminar este audio?')){
            fetch(`/api/audios/${id}`,{
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-type': 'application/json'
                }
            })
            .then(res=> res.json())
            .then(data =>{
                console.log(data);
                M.toast({html: 'Audio eliminado'});
                this.obtenerAudios();
            });
        }
    }

    editAudio(id){
    
        fetch(`/api/audios/${id}`)
            .then(res=> res.json())
            .then(data =>{
                console.log(data);
                this.setState({
                    titulo: data.titulo,
                    _id: data._id
                })
               
            });
    }
    


    // cuando el usuario tipea yo estoy escuchando lo que tipea
    handleChange(evento){
        const {name, value} = evento.target;
        this.setState({
            [name]: value
        })
    }

    

    render(){
        return(
            <div>
                {/* Navegación */}
                <Nav/>
                <div className="container">
                    <form onSubmit={this.addAudio}>
                        <div className="row">
                            <div className="input-field">
                                <input name= "titulo" onChange={this.handleChange} type="text" value={this.state.titulo} placeholder="Titulo del audio"/>
                            </div>
                        </div>
                        <div className="row">
                            <button id="btnStart" style={{margin:'4px'}} className="btn light-red darken-4">
                                <i className="material-icons">keyboard_voice</i>
                            </button><br/>
                            <button className="btn light-red darken-4" style={{margin:'4px'}} id="btnStop" >
                                <i className="material-icons">check</i>
                            </button>
                            <div id="timer">
                                <p><span id="minutos">grabando</span></p>
                            </div>
                            <button id="btnCancel" style={{margin:'4px'}} className="btn light-red darken-4">
                                <i className="material-icons">clear</i>
                            </button><br/>
                            <div>
                                <video id="vid" controls muted="muted"></video>
                                <audio id="vid2" controls style={{margin:'4px', float:'left', right:'0px'}}></audio>
                                
                            </div>
                        </div>
                        <div className="row">
                            <button className="btn light-red darken-4" type="submit">
                                Guardar audio
                            </button>
                        </div>
                    </form>
                    <hr/>   
                    <div className="row">
                        <table>
                            <thead>
                                <tr>
                                    <th>Titulo</th>
                                    <th>Audio</th>
                                    <th>Enviado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.audios.map(audio=>{
                                    return (
                                        <tr key={audio._id}>
                                            <td>{audio.titulo}</td>
                                            <td></td>
                                            <td>{audio.fecha}</td>
                                            <td>
                                                <button className="btn light-red darken-4" style={{margin:'4px'}} 
                                                onClick={()=> this.editAudio(audio._id)}>
                                                    <i className="material-icons">edit</i>
                                                </button>
                                                <button className="btn light-red darken-4" style={{margin:'4px'}} 
                                                onClick={() => this.deleteAudio(audio._id)}>
                                                    <i className="material-icons">delete</i>
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
    
};

export default App;