/**
 * Created by goforu on 16-11-23.
 */
let express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    expressBrowserify = require('express-browserify'),
    fs = require('fs');

let auth = require('./auth');

app.use(bodyParser.text());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/js/main.js', expressBrowserify('src/main.js', {
    watch: process.env.NODE_ENV !== 'production'
}));

app.post('/api/token', (req, res) => {
    //req.get('type')
    auth.getToken(JSON.parse(req.body).type, function(err, token) {
        if (err)
            next(err);
        else
            res.send(token);
    });
});

module.exports = app;