const net = require('node:net');

net.createServer(function (conn) {
    conn.on('ready', function () {
        console.log('ECHO_SERVER: CONN: started');
    });
}).listen(9999, function () {
    console.log('ECHO_SERVER STARTED');
});