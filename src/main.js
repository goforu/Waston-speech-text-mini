/**
 * Created by goforu on 16-11-22.
 */
'use strict';

let playBtn = document.getElementById('play'),
    speakBtn = document.getElementById('speak'),
    upload = document.getElementById('upload'),
    textarea = document.getElementById('text');

let initSocket = require('./socket').initSocket,
    getToken = require('./utils').getToken;

playBtn.addEventListener('click', function (e) {
    if(upload.files && upload.files[0]){
        let blob = new Blob([upload.files[0]]);
        audio2text(blob);
        audioPlay(blob);
        // this.disabled = true;
    }else {
        alert('Please select an audio file .wav!');
    }
});

speakBtn.addEventListener('click', function (e) {
    text2audio();
});

function text2audio() {
    getToken('voice', (token, err)=>{
        if(token)
            initSocket({type:'voice', token, textNode: textarea, callback(blob){
                audioPlay(blob);
            }});
        else
            alert(err);
    });
}

function audio2text(blob) {
    getToken('text', (token, err)=>{
        if(token)
            initSocket({type:'text', blob, token, textNode: textarea});
        else
            alert(err);
    });
}

function audioPlay(blob) {
    let audio = new Audio();
    audio.src = URL.createObjectURL(blob);
    audio.play();
}