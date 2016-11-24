/**
 * Created by goforu on 16-11-21.
 */
let app = require('./app');

let server = app.listen(8081, () => {
    let host = server.address().address;
    let port = server.address().port;
    console.log("listening at http://%s:%s", host, port);
});