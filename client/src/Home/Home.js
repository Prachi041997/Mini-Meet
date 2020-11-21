import React, { useState } from 'react';
import './Home.css';
import JoinModal from '../JoinModal/JoinModal';
import HostModal from '../HostModal/HostModal';
import home from './home.png';
const Home = ({location})=> {
    const [showJoin, setShowJoin] = useState(false);
    const [showCreate, setShowCreate] = useState(false);
    const onShowJoinHandle = ()=> {
        setShowJoin(true)
    }
    const showCreateHandle = ()=> {
        setShowCreate(true);
    }
    const onhideJoinHandle = ()=> {
        setShowJoin(false);
    }
    const onhideCreateHandle = ()=> {
        setShowCreate(false);
    }
  return(
     <React.Fragment>
    <div className='brand'>MINI MEET</div>  
     <div className='outerDiv'>
        <div className=' innerDiv flex'>
           <button onClick={showCreateHandle}>Host A Meeting</button>
           <button onClick={onShowJoinHandle} >Join A Meeting</button>
        </div>
        <div className='imageDiv'>
            <img src={home}></img>
        </div>
      </div>
      <JoinModal show={showJoin} onHide={onhideJoinHandle}></JoinModal>
      <HostModal show={showCreate} onHide={onhideCreateHandle}></HostModal>
     </React.Fragment>
  )
}
export default Home;
