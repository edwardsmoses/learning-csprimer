const net = require('node:net');

net.createServer(function (conn) {
    conn.on('ready', function () {
        console.log('ECHO_SERVER: CONN: started');
    });
    conn.on('data', function (data) {
        console.log('ECHO_SERVER: CONN: GOT DATA: ' + data);

        //return a valid HTTP response with a JSON content-type and body
        conn.write(
            'HTTP/1.0 200 OK\r\n' +
            'Content-Type: application/json\r\n' +
            '\r\n'
        );


        //parse the headers into a JSON object
        const regex = /^(.*?):\s(.*?)$/gm;
        const matches = data.toString().matchAll(regex);
        const result = {};

        for (const match of matches) {
            const key = match[1];
            const value = match[2];
            result[key] = value;
        }

        const jsonString = JSON.stringify(result);

        //return the headers.. as json 
        conn.write(
            `${jsonString} \r\n` +
            '\r\n'
        );

        //end the connection
        conn.end();
    });
    conn.on('end', function () {
        console.log('ECHO_SERVER: CONN: disconnected');
    });
}).listen(9999, function () {
    console.log('ECHO_SERVER STARTED');
});