const net = require('node:net');

net.createServer(function (conn) {
    conn.on('ready', function () {
        console.log('ECHO_SERVER: CONN: started');
    });
    conn.on('data', function (data) {
        console.log('ECHO_SERVER: CONN: GOT DATA: ' + data);

        conn.write(
            'HTTP/1.0 200 OK\r\n' +
            '\r\n'
        );
        conn.end();
    });
    conn.on('end', function () {
        console.log('ECHO_SERVER: CONN: disconnected');
    });
}).listen(9999, function () {
    console.log('ECHO_SERVER STARTED');
});