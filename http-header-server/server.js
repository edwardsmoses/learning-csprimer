const net = require('node:net');

net.createServer(function(conn) {
    console.log('ECHO_SERVER: CONN: new connection');
    conn.on('ready', function() {
        console.log('ECHO_SERVER: CONN: started');
    });
    conn.on('end', function() {
        console.log('ECHO_SERVER: CONN: disconnected');
    });
    conn.on('data', function(data) {
        console.log('ECHO_SERVER: CONN: GOT DATA: ' + data);
        conn.write(data);
    });
}).listen(9999, function() {
    console.log('ECHO_SERVER STARTED');
});