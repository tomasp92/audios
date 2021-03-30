import React from 'react';

function TableBody(props){
    let audios = props.audios;
    if(audios.lenght == 1){
        let audio = audios;
        return(
            <tbody>
                <tr key={audio._id}>
                    <td><a href="#" onClick={()=>props.obtenerunAudio(audio._id)}>{audio.titulo}</a></td>
                    <td></td>
                    <td>{audio.fecha}</td>
                    <td>
                        <button className="btn light-red darken-4" style={{margin:'4px', "backgroundColor":"#BF0404"}} 
                        onClick={()=> props.editAudio(audio._id)}>
                            <i className="material-icons">edit</i>
                        </button>
                        <button className="btn light-red darken-4" style={{margin:'4px', "backgroundColor":"#BF0404"}} 
                        onClick={() => props.deleteAudio(audio._id)}>
                            <i className="material-icons">delete</i>
                        </button>
                    </td>
                </tr>
            </tbody>
        )
          
            
    }else{
        return(
            <tbody>
                {audios.map(audio=>{
                        return (
                            <tr key={audio._id}>
                                <td><a href="#" onClick={()=>props.obtenerunAudio(audio._id)}>{audio.titulo}</a></td>
                                <td></td>
                                <td>{audio.fecha}</td>
                                <td>
                                    <button className="btn light-red darken-4" style={{margin:'4px', "backgroundColor":"#BF0404"}} 
                                    onClick={()=> props.editAudio(audio._id)}>
                                        <i className="material-icons">edit</i>
                                    </button>
                                    <button className="btn light-red darken-4" style={{margin:'4px', "backgroundColor":"#BF0404"}} 
                                    onClick={() => props.deleteAudio(audio._id)}>
                                        <i className="material-icons">delete</i>
                                    </button>
                                </td>
                            </tr>
                        )
                    })
                }
                    
            </tbody>
                        
         )
    }
    
}
export default TableBody;