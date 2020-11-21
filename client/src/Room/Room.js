import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Peer from 'peerjs';
import './Room.css';
import { Link, Redirect } from 'react-router-dom'
const ENDPOINT = 'http://localhost:3030';

let socket = io();
let myId;
let myVideoStream;

const Room = ({ location }) => {
    let peer = new Peer();
    let peers = {};
    let screenPeers = {};
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [message, setMessage] = useState('');
    const [redirect, setRedirect] = useState(false);
    const [messages, setMessages] = useState([]);

    const [isSentByCurrentUser, setIsSentByCurrentUser] = useState(false)
    useEffect(() => {
        const myVideo = document.createElement('video');
        var room = location.pathname.split('/')[1];
        let uservideoStream;

        let userVideo;
        peer.on('open', id => {
            console.log('your Id', id);
            myId = id;
            socket.emit('join-room', { room: room, userId: id, name: JSON.parse(sessionStorage.getItem('UserName')) })
        })
        navigator.mediaDevices.enumerateDevices()
            .then(function (devices) {
                console.log(devices);
                devices.forEach(function (device) {
                    
                    console.log(device.kind + ": " + device.label +
                        " id = " + device.deviceId);
                });
            })
            .catch(function (err) {
                console.log(err.name + ": " + err.message);
            });

        
        navigator.mediaDevices.getUserMedia({
            audio: {
                autoGainControl: false,
                echoCancellation: false,
                googAutoGainControl: false,
                noiseSuppression: false
            },
            video: true
        }).then(stream => {
            myVideoStream = stream;
            console.log('my video stream is', myVideoStream)
            addVideoStream(myVideo, stream);

            // peer.on('open', id => {
            //     console.log('your Id', id);
            //     myId = id;
            //     socket.emit('join-room', { room: room, userId: id, name: JSON.parse(sessionStorage.getItem('UserName')) })
            // })

            socket.on('user-video', (userId) => {
                console.log('user video', userId);
                connectToNewUser(userId, stream)
            })

            peer.on('call', (call) => {
                console.log('inside answer')
                console.log(call);
                console.log(call.peer);
                peers[call.peer] = call;
                console.log(stream.getVideoTracks());

                var video = document.createElement('video');

                call.answer(stream);
                call.on('stream', (userVideoStream) => {
                    uservideoStream = userVideoStream;
                    userVideo = video
                    addVideoStream(video, userVideoStream);
                });
                call.on('close', () => {
                    console.log('close answer')
                    video.remove()
                })
            })
        })
        socket.on('user-connected', (users) => {
            console.log(users);
            let onlineusers = users.users.filter(user => user.id !== myId);
            console.log(onlineusers);
            setOnlineUsers(onlineusers);
        })
        socket.on('user-disconnected', (userId) => {
            console.log(userId, 'disconnected');
            console.log(peers);
            if (peers[userId]) {
                console.log(peers);
                peers[userId].close();
            }
        })
        socket.on('removedScreen', (msg) => {
            console.log(msg);
            userVideo.remove();
            // uservideoStream.getVideoTracks()[0].onended = ()=> {
            //     console.log('Inside on ended');
            //    userVideo.remove();
            // }
        })
    }, [])

    useEffect(() => {
        socket.on('createMessage', (data) => {
            console.log(data);

            let objCpy = {
                name: data.name,
                msg: data.message
            }
            setMessages(messages => [...messages, objCpy])

            if (data.name == JSON.parse(sessionStorage.getItem('UserName'))) {
                console.log('its me');
                setIsSentByCurrentUser(true)
            } else {
                setIsSentByCurrentUser(false)
            }
        })
    }, [])
    const disconnectHandle = () => {
        socket.emit('disconnect');
        setRedirect(true)
    }
    const onRedirectHandle = () => {
        // return redirect && <Redirect to='/end'></Redirect>
    }
    const addVideoStream = (video, stream) => {
        let videogrid = document.getElementById('video-grid');

        //    video.style.width = '500px'
        video.srcObject = stream;
        video.addEventListener('loadedmetadata', () => {
            video.play();
        })
        videogrid.appendChild(video);
        console.log(stream.getVideoTracks());
        stream.getVideoTracks()[0].onended = () => {
            // setStopShare(true);
            video.remove();
        }
    }
    const connectToNewUser = (userId, stream) => {
        console.log('user connected', userId);
        var video = document.createElement('video');
        var call = peer.call(userId, stream);
        console.log(call);
        call.on('stream', userVideoStream => {
            console.log(userVideoStream)        // console.log('calling')
            addVideoStream(video, userVideoStream)
            // Show stream in some video/canvas element.
        });
        call.on('close', () => {
            console.log('inside connect to user close')
            video.remove()
        })
        peers[userId] = call;
        console.log(peers);
    }
    const connectScreen = (userId, stream) => {
        console.log('user connected', userId);
        console.log(stream.getVideoTracks())
        var video = document.createElement('video');
        var call = peer.call(userId, stream);
        console.log(call);

        call.on('close', () => {
            console.log('inside screenn connect to user close')
            video.remove()
        })
        screenPeers[userId] = call;
        console.log(screenPeers);
    }


    const shareScreen = () => {
        const myVideo = document.createElement('video');
        navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: false
        }).then(screenStream => {
            addVideoStream(myVideo, screenStream);
            console.log(screenStream.getVideoTracks())
            screenStream.getVideoTracks()[0].onended = () => {
                // setStopShare(true);
                myVideo.remove();
                socket.emit('removeScreen', myId);
            }
            onlineUsers.forEach(user => {
                connectScreen(user.id, screenStream);
            })

            // peer.on('call', (call) => {
            //     console.log('inside answer screen')
            //     console.log(call);
            //     call.answer(screenStream);
            //     screenPeers[call.peer] = call; // Answer the call with an A/V stream.
            //     var video = document.createElement('video');
            //     call.on('stream', (userVideoStream) => {
            //         // Show stream in some video/canvas element.
            //         addVideoStream(video, userVideoStream);
            //     });
            //     call.on('close', () => {
            //         console.log('close answer')
            //         video.remove()
            //     })
            // })
        })
    }

    const muteUnmute = () => {
        console.log(myVideoStream)
        const enabled = myVideoStream.getAudioTracks()[0].enabled;
        if (enabled) {
            myVideoStream.getAudioTracks()[0].enabled = false;
            setUnmuteButton();
        } else {
            setMuteButton();
            myVideoStream.getAudioTracks()[0].enabled = true;
        }
    }

    const playStop = () => {
        console.log('object')
        let enabled = myVideoStream.getVideoTracks()[0].enabled;
        if (enabled) {
            myVideoStream.getVideoTracks()[0].enabled = false;
            setPlayVideo()
        } else {
            setStopVideo()
            myVideoStream.getVideoTracks()[0].enabled = true;
        }
    }
    const setStopVideo = () => {
        const html = `
          <i class="fas fa-video"></i>
          <span>Stop Video</span>
        `
        document.querySelector('.main__video_button').innerHTML = html;
    }

    const setPlayVideo = () => {
        const html = `
        <i class="stop fas fa-video-slash"></i>
          <span>Play Video</span>
        `
        document.querySelector('.main__video_button').innerHTML = html;
    }

    const onMessageSend = (e) => {
        socket.emit('message', message);
        e.target.value = ''
    }
    const onChangeHandle = (e) => {
        setMessage(e.target.value);
    }
    const setMuteButton = () => {
        const html = `
          <i class="fas fa-microphone"></i>
          <span>Mute</span>
        `
        document.querySelector('.main__mute_button').innerHTML = html;
    }

    const setUnmuteButton = () => {
        const html = `
          <i class="unmute fas fa-microphone-slash"></i>
          <span>Unmute</span>
        `
        document.querySelector('.main__mute_button').innerHTML = html;
    }
    return <React.Fragment>
        {onRedirectHandle()}
        <div class="main">
            <div class="main__left">
                <div class="main__videos">
                    <div id="video-grid">

                    </div>
                </div>
                <div class="main__controls">
                    <div class="main__controls__block">
                        <div onClick={muteUnmute} class="main__controls__button main__mute_button">
                            <i class="fas fa-microphone"></i>
                            <span>Mute</span>
                        </div>
                        <div onClick={playStop} class="main__controls__button main__video_button" >
                            <i class="fas fa-video"></i>
                            <span>Stop Video</span>
                        </div>
                    </div>
                    <div class="main__controls__block">
                        <div class="main__controls__button" onClick={shareScreen}>
                            <i class="far fa-share-square"></i>
                            <span>Share Screen</span>
                        </div>


                    </div>
                    <div class="main__controls__block" >
                        <div class="main__controls__button">
                            <a href='/end'>
                                <span class="leave_meeting" onClick={disconnectHandle}>Leave Meeting</span>

                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="main__right">

                <div className='chatandusers'>
                    <ul class="nav nav-tabs">
                        <li class="active"><a data-toggle="tab" href="#menu1">Partcipants</a></li>
                        <li><a data-toggle="tab" href="#menu2">Chat</a></li>
                    </ul>

                    <div class="tab-content">

                        <div id="menu2" class="tab-pane fade">
                            <div className='main__chat_window'>
                                {messages.map((message) => {
                                    console.log(isSentByCurrentUser);
                                    return <div className='messageDiv flexStart'>
                                        <div className='sender'>{message.name}</div>
                                        <div className='message'>{message.msg}</div>
                                    </div>
                                })}
                            </div>
                            <div class="main__message_container">
                                <input id="chat_message" type="text"
                                    placeholder="Type message here..."
                                    onChange={onChangeHandle}
                                    onKeyPress={event => event.key === 'Enter' ? onMessageSend(event) : null}>
                                </input>
                            </div>
                        </div>
                        <div id="menu1" class="tab-pane fade in active">
                            {onlineUsers.map(u => {
                                return <div className='userWrapper'>
                                    <div className='userprofile'><i class="ri-user-fill"></i></div>
                                    <div className='userInfo'><p id='username'>{u.name}</p></div>
                                </div>
                            })}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </React.Fragment>
}
export default Room;
