import React, { useState } from 'react';
import {Redirect} from 'react-router-dom';
import signin from './signin4.png';
import './SignIn.css';
const SignIn = ()=>{
  const [redirect, setRedirect] = useState(false);
  const [error, setError] = useState('');
  const onChangeHandle = (e)=> {
    sessionStorage.setItem('UserName', JSON.stringify(e.target.value));
  }
  const onClickHandle = (e)=> {
    e.preventDefault();
    console.log(JSON.parse(sessionStorage.getItem('UserName')))
    if(JSON.parse(sessionStorage.getItem('UserName')) == null){
      setError('Name is required');
    } else {
      setRedirect(true)
    }
  }

  const redirectHandle = ()=>{
    return redirect && <Redirect to='/'></Redirect>
  }
 
  return(
    <React.Fragment>
      {redirectHandle()}
      <div className='signinmain'>
        <div className='logo'>MINI MEET</div>
        <div className='signinDiv'>
          {/* <h1>WELCOME</h1> */}
          <form>
            <p>Enter your name</p>
            <input type='text' onChange={onChangeHandle}></input>
            <button onClick={onClickHandle}>Go To Home</button>
          </form>
        </div>
      </div>

    </React.Fragment>
  )
}
export default SignIn;