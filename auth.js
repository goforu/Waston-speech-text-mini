/**
 * Created by goforu on 16-11-24.
 */

let vcapServices = require('vcap_services'),
    extend = require('util')._extend,
    watson = require('watson-developer-cloud');

let config;
let authService;
// Replace credentials below with yours
function runAuth(type){
    switch (type) {
        // Speech-to-text
        case 'text':
            config = {
                version:'v1',
                url: 'https://stream.watsonplatform.net/speech-to-text/api',
                username: process.env.STT_USERNAME || '<username1>',
                password: process.env.STT_PASSWORD || '<password1>'
            };
            auth(config, 'speech_to_text');
            break;
        // Text-to-speech
        case 'voice':
            config = {
                version:'v1',
                url: 'https://stream.watsonplatform.net/text-to-speech/api',
                username: process.env.STT_USERNAME || '<username2>',
                password: process.env.STT_PASSWORD || '<password2>'
            };
            auth(config, 'text_to_speech');
            break
    }
}

function auth(options, type) {
    config = extend(options, vcapServices.getCredentials(type));
    authService = watson.authorization(config);
}

function getToken (type, callback){
    runAuth(type);
    authService.getToken({url: config.url}, callback);
}

module.exports = {
    runAuth,
    getToken
};
