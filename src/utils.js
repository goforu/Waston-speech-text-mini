/**
 * Created by goforu on 16-11-23.
 */
exports.getToken = (type, callback) =>{
    let url = '/api/token';
    let tokenRequest = new XMLHttpRequest();
    tokenRequest.open('POST', url, true);
    tokenRequest.onreadystatechange = () => {
        if (tokenRequest.readyState === 4) {
            if (tokenRequest.status === 200) {
                callback(tokenRequest.responseText);
            } else {
                let error = 'Cannot reach server';
                if (tokenRequest.responseText) {
                    try {
                        error = JSON.parse(tokenRequest.responseText);
                    } catch (e) {
                        error = tokenRequest.responseText;
                    }
                }
                callback(null, error);
            }
        }
    };
    // tokenRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    tokenRequest.send(JSON.stringify({type}));
    // tokenRequest.send(`type=${type}`);
};