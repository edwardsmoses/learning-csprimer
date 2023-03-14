var fs = require('fs');

fs.open('teapot.bmp', 'r', function(status, fd) {
    if (status) {
        console.log(status.message);
        return;
    }
    var buffer = Buffer.alloc(1000);
    fs.read(fd, buffer, 0, 100, 0, function(err, num) {
        console.log(buffer);
        console.log('encoded lenght', buffer.length);

        console.log('encoded type', buffer.toString('utf-8', 0, 2));
        console.log('encoded filesize', buffer.toString('utf-8', 3, 5));

    });
});