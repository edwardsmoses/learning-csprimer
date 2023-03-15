var fs = require('fs');

let indexPos = 2;

const buffer = fs.readFileSync("teapot.bmp")
console.log('buffer', buffer);
console.log('buffer length', buffer.length);
console.log('file type', buffer.toString('utf8', 0, 2));
console.log('file sizes', buffer.slice(indexPos, indexPos += 4));
console.log('reserved', buffer.slice(indexPos, indexPos += 2));
console.log('reserved second', buffer.slice(indexPos, indexPos += 2));

const readOffset = buffer.readInt16LE(indexPos);
const offset = buffer.slice(indexPos, indexPos += 4);

console.log('dataOffset', indexPos, offset, readOffset);

console.log('pixel first readings', buffer.slice(offset, offset + 20));
