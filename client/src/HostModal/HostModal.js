import React, { useState } from 'react';
import './HostModal.css';
import axios from 'axios';
const HostModal = ({show, onHide})=> {
    const classname = show? 'joinDiv block': 'joinDiv none';

    const [room, setRoom] = useState('');
    const onCreateLinkHandle = (e)=> {
        e.preventDefault();
        axios.get('api/createRoom')
        .then(data=> {
            console.log(data);
            setRoom(data.data.room);
            sessionStorage.setItem('roomId', JSON.stringify(data.data.room));
        })
    }


    const showLink = ()=> {
        if(room!==''){
            let link = `https://${window.location.hostname}/${room}`
            return (
                <div style={{display:'flex', justifyContent:'center', maxHeight:'35px', margin:'0 20px 30px 20px'}}>
            {/* <input className='createInput' type='text' value={link} readOnly={true}></input> */}
            <textarea id="link" rows="1" cols="35">{link}</textarea>
            <button id='copyButton' onClick={copy}>Copy</button>
            </div>
            )
        }
        
    }

    const copy = () => {
        var copyText = document.getElementById("link");
        var btn = document.getElementById("copyButton");
    
        copyText.select();
        document.execCommand("Copy");
        // alert("Copied to clipboard!");
        btn.innerHTML = 'Copied'
    
      }
    return <div className={classname}>

    <div className='joinMain'>
        <div className='close' onClick={onHide}><i class="ri-close-line"></i></div>
        <p>Host Meeting</p>
        <button className='createButton' onClick={onCreateLinkHandle}>Create Link</button>
        {showLink()}
    </div>
</div>
}
export default HostModal;