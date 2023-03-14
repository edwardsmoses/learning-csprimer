var fs = require('fs');

const buffer = fs.readFileSync("teapot.bmp")
console.log('buffer', buffer);
console.log('buffer length', buffer.length);
console.log('file type', buffer.toString('utf8', 0, 2));
console.log('file sizes', buffer.readUInt32LE(2));
console.log('reserved', buffer.readUInt32LE(4));


console.log('file size', (() => {
    let size = 0;
    [2,3,4,5].map((i) => {
        size += buffer[i];
    })
    return size;
})());


for(let i = 0; i < 20; i++){
    console.log('val', buffer[i]);
}
