//signin


const socket = io('/');
var videogrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');
myVideo.muted = true;

var peer = new Peer();
var userID;
const peers = {}

const sharescreen = ()=> {
    navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false
    }).then((screenStream)=>{
       addVideoStream(myVideo, screenStream);
       connectToNewUser(userID, screenStream);
    })
}

navigator.mediaDevices.getUserMedia({
    audio: false,
    video: true
}).then(async(stream) => {
    addVideoStream(myVideo, stream);

    peer.on('call', (call) => {
        console.log('inside answer')
        console.log(call);
        call.answer(stream); // Answer the call with an A/V stream.
        var video = document.createElement('video');

        call.on('stream', (userVideoStream)=> {
            // Show stream in some video/canvas element.
            addVideoStream(video, userVideoStream);
        });
        call.on('close', () => {
            video.remove()
          })
        
    })
    socket.on('user-connected', (userId) => {
        // console.log();
        userID = userId;
        console.log('Hii')
        connectToNewUser(userId, stream);
    })
})


peer.on('open', id => {
    console.log('your Id', id);
    socket.emit('join-room', RoomId, id);

})


socket.on('user-disconnected', userId => {
    if (peers[userId]) peers[userId].close()
  })
const connectToNewUser = async(userId, stream) => {
    console.log('user connected', userId);
    var video = document.createElement('video');
    var call = await peer.call(userId, stream);
    console.log(call);
    call.on('stream', userVideoStream => {
        console.log(userVideoStream)        // console.log('calling')
        addVideoStream(video, userVideoStream)
        // Show stream in some video/canvas element.
    });

    call.on('close', () => {
        video.remove()
      })
    
    peers[userId] = call
}
const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })
    videogrid.appendChild(video);
}
const addScreenStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })
    videogrid.appendChild(video);
}

let text = $("input");
// when press enter send message
$('html').keydown(function (e) {
  if (e.which == 13 && text.val().length !== 0) {
    socket.emit('message', text.val());
    text.val('')
  }
});
socket.on("createMessage", message => {
    console.log(message)
  $("ul").append(`<li class="message"><b>user</b><br/>${message}</li>`);
  scrollToBottom()
})
const scrollToBottom = () => {
    var d = $('.main__chat_window');
    d.scrollTop(d.prop("scrollHeight"));
  }

