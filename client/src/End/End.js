/* global gapi */
import React, { useEffect, useState } from 'react'
import './End.css';
import end from './end2.png';
import {Link} from 'react-router-dom'
const End = () => {
    return(
        <React.Fragment>
            <h1 style={{textAlign:'center'}}>Meeting Ended</h1>
            <div style={{marginTop:'30px',display:'flex', justifyContent:'center', alignItems:'center'}}>
                <img src={end} style={{width:'40%', height:'50vh'}}></img>
            </div>
            <div style={{width:'100%',marginTop:'30px',display:'flex', justifyContent:'center', alignItems:'center'}}>
            <Link to='/'><button style={{padding:'10px 24px', border:'none', outline:'none', backgroundColor:'#2F2E41', borderRadius:'15px', color:'#fff'}}>Go To Home</button></Link>
                
            </div>
        </React.Fragment>
    )
}
export default End