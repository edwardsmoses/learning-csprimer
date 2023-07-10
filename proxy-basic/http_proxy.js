const net = require('node:net');

//original port
const serverPort = 9000;

net.createServer(function (conn) {
    conn.on('ready', function () {
        console.log('ECHO_SERVER: CONN: started');
    });

    //connect to the proxy host,
    //ommiting server, the 'net' connect library assumes localhost when only the port is present
    const proxySocket = net.connect(serverPort, () => {
        // Log the connection details
        console.log('Client connected:', conn.remoteAddress, conn.remotePort);
        console.log('Proxying to:', serverPort);

        // Forward data from the client to the proxy host
        conn.pipe(proxySocket);

        // Forward data from the proxy host to the client
        proxySocket.pipe(conn);
    });

    // Log any errors with the proxy connection
    proxySocket.on('error', (error) => {
        console.error('Proxy socket error:', error);
        conn.end();
    });


    // Handle data received from the client
    conn.on('data', (data) => {

        //return a valid HTTP response with a JSON content-type and body
        conn.write(
            'HTTP/1.0 200 OK\r\n' +
            'Content-Type: application/json\r\n' +
            '\r\n'
        );


        // Parse the client request
        const request = parseRequest(data.toString());

        // Log the request details
        console.log('Request Method:', request.method);
        console.log('Request URL:', request.url);
        console.log('Request Headers:', request.headers);

        // Forward the modified request to the proxy host
        proxySocket.write(data);

          //return the headers.. as json 
          conn.write(
            `me \r\n` +
            '\r\n'
        );

        //end the connection
        conn.end();
    });

    // Log when the client socket is closed
    conn.on('close', () => {
        console.log('Client disconnected:', conn.remoteAddress, conn.remotePort);
    });

    // Log any errors with the client socket
    conn.on('error', (error) => {
        console.error('Client socket error:', error);
        proxySocket.end();
    });


}).listen(9999, function () {
    console.log('ECHO_SERVER STARTED');
});


// Helper function to parse an HTTP request
function parseRequest(requestString) {
    const lines = requestString.split('\r\n');

    const [method, url, version] = lines[0].split(' ');

    const headers = {};
    for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === '') break; // Headers end with an empty line
        const [name, value] = lines[i].split(': ');
        headers[name.toLowerCase()] = value;
    }

    return {
        method,
        url,
        version,
        headers
    };
}