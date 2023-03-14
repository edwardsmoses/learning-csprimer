var fs = require('fs');

const buffer = fs.readFileSync("teapot.bmp")
console.log('buffer', buffer);
console.log('buffer length', buffer.length);
console.log('buffer type', buffer.toString('utf8', 0, 2));


for(let i = 0; i < 20; i++){
    console.log('val', buffer[i]);
}
