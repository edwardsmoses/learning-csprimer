const net = require('node:net');

//original server
const serverHost = "0.0.0.0";
const serverPort = 9000;


net.createServer(function (conn) {
    conn.on('ready', function () {
        console.log('ECHO_SERVER: CONN: started');
    });

    conn.on('data', function (data) {
        console.log('ECHO_SERVER: CONN: GOT DATA: ' + data);
    });

    //connect to the proxy host
    const proxySocket = net.connect(serverHost, serverPort, () => {
        // Log the connection details
        console.log('Client connected:', clientSocket.remoteAddress, clientSocket.remotePort);
        console.log('Proxying to:', proxyHost, proxyPort);

        // Forward data from the client to the proxy host
        clientSocket.pipe(proxySocket);

        // Forward data from the proxy host to the client
        proxySocket.pipe(clientSocket);
    });

    // Log any errors with the proxy connection
    proxySocket.on('error', (error) => {
        console.error('Proxy socket error:', error);
        clientSocket.end();
    });

}).listen(9999, function () {
    console.log('ECHO_SERVER STARTED');
});
