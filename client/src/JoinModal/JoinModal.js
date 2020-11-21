import React, { useState } from 'react';
import './JoinModal.css';
import { Redirect } from 'react-router-dom';
const JoinModal = ({ show, onHide }) => {
    const classname = show ? 'joinDiv block' : 'joinDiv none';
    const [link, setLink] = useState('');
    const [redirect, setRedirect] = useState(false);
    const onClickHandle = () => {
        console.log(link.split('/')[3])
        setLink(link.split('/')[3]);
        setRedirect(true);
    }
    const redirectHandle = () => {
        return redirect && <Redirect to={'/' + link}></Redirect>
    }
    return <React.Fragment>
        {redirectHandle()}
        <div className={classname}>
            <div className='joinMain'>
        <div className='close' onClick={onHide}><i class="ri-close-line"></i></div>

                <p>Join Meeting</p>
                <input className='joinInput' type='text' placeholder='paste join link here' onChange={(e) => setLink(e.target.value)}></input>
                <button className='joinButton' onClick={onClickHandle}>Join</button>
            </div>
        </div>
    </React.Fragment>
}
export default JoinModal;