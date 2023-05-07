const dgram = require('node:dgram');

const server = dgram.createSocket('udp4');
server.on('message', (msg, rinfo) => {
    console.log(`server got msg from ${rinfo.address}:${rinfo.port}`);
    server.send(`HELLO ${msg}`, rinfo.port, rinfo.address);
});
server.bind(8888);
