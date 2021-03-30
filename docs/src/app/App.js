import React, { Component } from 'react';
// import TableBody from './TableBody';
import Nav from './Nav';

class App extends Component {
    
    constructor(){
        super();
        this.state = {
            titulo: '',
            id: '',
            audios: [],
            audio: '', 
            busqueda: ''        
        };
        this.handleChange = this.handleChange.bind(this);
        this.addAudio = this.addAudio.bind(this);
        
    }
    
    
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
            })
            .catch(err=> console.log(err));
        }else{
            //agregar nuevo audio
            
            // const formData = new FormData();
            // const fileField = document.querySelector('input[type="file"]');
            // console.log('form data antes de ponerle imagen' + FormData);
            // formData.append('avatar', fileField.files[0]);
            // console.log('form data despues de ponerle imagen' + FormData);

            // fetch('/api/audios', {
            // method: 'POST',
            // body: formData,
            // headers: {
            //     'Accept': 'application/json',
            //     'Content-type': 'application/json'
            // }
            // })
            // .then(response => response.json())
            // .then(data => {
            //     console.log(data)
            //     M.toast({html: `Audio guardado`});
            // })
            // .catch(error => {
            // console.error('Error:', error);
            // });


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
            })
            .catch(err=> console.log(err));
        }
        // Setear a vacio los datos del formulario
        this.setState({titulo:'',_id:'',audio: ''});
        this.obtenerAudios();
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
        
         // mostrar botones
        // function display() {
            stop.style.display = 'none';
            start.style.display = 'block';
            cancel.style.display = 'none';
            timer.style.display = 'none';
            video.style.display = 'none';
            vidSave.style.display = 'none';
    
        //    }
        //display();
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
                mediaRedia.Recorder.release();
                thcorder.stop();
                //display();
                stop.style.display = 'none';
                start.style.display = 'block';
                cancel.style.display = 'none';
                timer.style.display = 'none';
                video.style.display = 'none';
                vidSave.style.display = 'none';
                
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
                vidSave.style.display = 'block';
            });
            mediaRecorder.ondataavailable = function(ev) {
                chunks.push(ev.data);
            }
            mediaRecorder.onstop = (ev)=>{
                let blob = new Blob(chunks, { 'type' : 'audio/mp4;' });
                chunks = [];
                let videoURL = window.URL.createObjectURL(blob);
                vidSave.src = videoURL;
                this.audio = videoURL;
            }
        })
        .catch(function(err) { 
            console.log(err.name, err.message); 
        });

    }

    obtenerAudios(){
        fetch('/api/audios/')
            .then(res=> res.json())
            .then(data=> {
                console.log(data);
                this.setState({audios: data});
                console.log(this.state.audios);
            });
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
                console.log("fin primera funcion");
               
            });
        }
    obtenerunAudio(id){
        fetch(`/api/audios/${id}`)
            .then(res=> res.json())
            .then(data=> {
                console.log(data);
                this.setState({audios: data});
                console.log(this.state.audios);
            });
    }
    

    obtenerAudiosfiltrados(evento){
        console.log("query");
        console.log(this.state.busqueda);
        fetch(`/api/audios/${this.state.busqueda}`)
            .then(res=> res.json())
            .then(data=> {
                console.log(data);
                this.setState({audios: data});
                console.log(this.state.audios);
            });
        evento.preventDefault();
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
                    <form onSubmit={this.addAudio}  style={{"backgroundColor":"#F5C000"}}>
                        <div className="row">
                            <div className="input-field" >
                                <input style={{margin:'4px', "backgroundColor":"#BF0404"}} name= "titulo" onChange={this.handleChange} type="text" value={this.state.titulo} placeholder="Titulo del audio"/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col s1">
                                {/* boton para comenzar a grabar */}
                                <button id="btnStart" style={{margin:'4px', "backgroundColor":"#BF0404"}} className="btn light-red darken-4">
                                    <i className="material-icons">keyboard_voice</i>
                                </button><br/>
                            </div>
                            <div className="col s2">
                                {/* boton para finalizar grabación */}
                                <button className="btn light-red darken-4" style={{margin:'4px', "backgroundColor":"#BF0404"}} id="btnStop" >
                                    <i className="material-icons">check</i>
                                </button>
                            </div>
                            <div id="timer" className="col s2">
                                <span id="minutos" style={{margin:'4px', "color":"#BF0404"}}>grabando audio</span>
                            </div>
                            <div className="col s1">
                                {/* Para cancelar el audio */}
                                <button id="btnCancel" style={{margin:'4px', "backgroundColor":"#BF0404"}} className="btn light-red darken-4">
                                    <i className="material-icons">clear</i>
                                </button><br/>
                            </div>
                            <div className="col s5">
                                <video id="vid" controls muted="muted"></video>
                                <audio id="vid2" controls style={{margin:'4px'}}></audio>
                                {/* <input type="file" name="audio" /> */}
                                {/* style={{display:'none'}} */}
                                
                            </div>
                        </div>
                        <div className="row">
                            <button className="btn light-red darken-4" style={{margin:'4px', "backgroundColor":"#BF0404", left:"100px"}} type="submit">
                                Guardar audio
                            </button>
                        </div>
                    </form>
                    <hr/>
                    <div className="row">
                        <form method="get" onSubmit={this.obtenerAudiosfiltrados}>
                            <div className="input-field col s8" >
                                <input name= "busqueda" onChange={this.handleChange} type="text" value={this.state.busqueda} placeholder="Buscar por titulo"/>
                            </div>
                            <div className="input-field col s2">
                                <button className="btn light-red darken-4" style={{margin:'4px', "backgroundColor":"#BF0404", left:"100px"}} type="submit">
                                    Filtrar
                                </button>
                            </div>
                           
                        </form>
                    </div>   
                    <div className="row">
                        <table>
                            <thead>
                                <tr>
                                    <th>Titulo</th>
                                    <th>Audio</th>
                                    <th>Enviado</th>
                                </tr>
                            </thead>
                            {/* <TableBody audios={this.state.audios} obtenerunAudio= {this.obtenerunAudio} 
                            editAudio = {this.editAudio} deleteAudio = {this.deleteAudio} /> */}
                            <tbody>
                                {this.state.audios.map(audio=>{
                                    return (
                                        <tr key={audio._id}>
                                            <td><a href="#" onClick={()=>this.obtenerunAudio(audio._id)}>{audio.titulo}</a></td>
                                            <td></td>
                                            <td>{audio.fecha}</td>
                                            <td>
                                                <button className="btn light-red darken-4" style={{margin:'4px', "backgroundColor":"#BF0404"}} 
                                                onClick={()=> this.editAudio(audio._id)}>
                                                    <i className="material-icons">edit</i>
                                                </button>
                                                <button className="btn light-red darken-4" style={{margin:'4px', "backgroundColor":"#BF0404"}} 
                                                onClick={() => this.deleteAudio(audio._id)}>
                                                    <i className="material-icons">delete</i>
                                                </button>
                                            </td>
                                        </tr>
                                        )
                                    })
                                }
                            </tbody>

                        </table>
                    </div>
                </div>
            </div>
        )
    }
    
};

export default App;