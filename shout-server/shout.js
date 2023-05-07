console.log('starting');

const net = require('node:net');

const server = net.createServer((socket) => {
    socket.end('goodbye\n');
})

server.on('listening', () => {
   console.log('started listening');
});

server.on('connection', () => {
    console.log('connection noticed');
 });

server.on('error', (err) => {
    // Handle errors here.
    throw err;
});

// Grab an arbitrary unused port.
server.listen({
    port: 8888,
    host: '127.0.0.1',
    
}, () => {
    console.log('opened server on', server.address());
}); 