var fs = require('fs');

let indexPos = 2;

const buffer = fs.readFileSync("teapot.bmp")
console.log('buffer', buffer);
console.log('buffer length', buffer.length);
console.log('file type', buffer.toString('utf8', 0, 2));
console.log('file sizes', buffer.slice(indexPos, indexPos += 4));
console.log('reserved', buffer.slice(indexPos, indexPos += 2));
console.log('reserved second', buffer.slice(indexPos, indexPos += 2));

const readOffset = buffer.readUInt32LE(indexPos);
const offset = buffer.slice(indexPos, indexPos += 4);

console.log('dataOffset', indexPos, offset, readOffset);

console.log('pixel first read', buffer.slice(readOffset, readOffset + 3));
console.log('pixel second read', buffer.slice(readOffset + 3, readOffset + 6));
