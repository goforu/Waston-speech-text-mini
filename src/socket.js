/**
 * Created by goforu on 16-11-22.
 */

let websocket;

function initParams(params) {
    let {type, token, blob, textNode, callback} = params;
    switch (type) {
        case 'text':
            // let model = 'zh-CN_BroadbandModel';
            let model = 'en-US_BroadbandModel';
            return{
                wsURI:`wss://stream.watsonplatform.net/speech-to-text/api/v1/recognize?watson-token=${token}&model=${model}`,
                events:{
                    onopen:function (evt) {
                        let message = {
                            action: 'start',
                            'content-type': 'audio/wav',
                            continuous: true,
                            interim_results: true
                        };
                        websocket.send(JSON.stringify(message));

                        // Prepare and send the audio file.
                        websocket.send(blob);

                        websocket.send(JSON.stringify({action: 'stop'}));
                    },
                    onmessage:function (evt) {
                        let data = JSON.parse(evt.data);
                        if(data.results) textNode.value = data.results[0].alternatives[0].transcript;
                    }
                }
            };
            break;
        case 'voice':
            let audioParts = [];
            let format = 'audio/ogg;codecs=opus';
            let finalAudio;
            let voice = 'en-US_AllisonVoice';
            return{
                wsURI:`wss://stream.watsonplatform.net/text-to-speech/api/v1/synthesize?voice=${voice}&watson-token=${token}`,
                events: {
                    onopen: function (evt) {
                        let message = {
                            text: textNode.value,
                            accept: format
                        };
                        // The service currently accepts a single message per WebSocket connection.
                        websocket.send(JSON.stringify(message));
                    },
                    onmessage: function (evt) {
                        if (typeof evt.data === 'string') {
                            console.log('Received string message: ', evt.data)
                        } else {
                            console.log('Received ' + evt.data.size + ' binary bytes', evt.data.type);
                            audioParts.push(evt.data);
                        }
                    },
                    onclose: function (evt) {
                        console.log('WebSocket closed', evt.code, evt.reason);
                        finalAudio = new Blob(audioParts, {type: format});
                        console.log('final audio: ', finalAudio);
                        callback && callback(finalAudio);
                    }
                }
            };
            break
    }
}

exports.initSocket = options => {
    let config = initParams(options);
    websocket = new WebSocket(config.wsURI);
    websocket.onerror = function (evt) {
        console.log('WebSocket error', evt);
    };
    for(let e in config.events){
        websocket[e]=config.events[e];
    }
};

// let token = "{authentication-token}";