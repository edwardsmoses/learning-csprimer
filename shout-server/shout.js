console.log('starting');

const dgram = require('node:dgram');


const server = dgram.createSocket('udp4');

server.on('error', (err) => {
    console.error(`server error:\n${err.stack}`);
    server.close();
});

server.on('message', (msg, rinfo) => {
    console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
    server.send('HELLO', rinfo.port, rinfo.address);
});

server.on('listening', () => {
    const address = server.address();
    console.log(`server listening ${address.address}:${address.port}`);
});

server.on('connect', () => {
    const address = server.address();
    console.log(`server connected to from ${address.address}:${address.port}`);
});

server.on('close', () => {
    const address = server.address();
    console.log(`client closed connection - ${address.address}:${address.port}`);
});

server.bind(8888);
