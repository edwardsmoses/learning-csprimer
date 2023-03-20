var fs = require('fs');

let indexPos = 2;

const buffer = fs.readFileSync("teapot.bmp")
console.log('buffer', buffer);
console.log('buffer length', buffer.length);
console.log('file type', buffer.toString('utf8', 0, 2));
console.log('file sizes', buffer.slice(indexPos, indexPos += 4));
console.log('reserved', buffer.slice(indexPos, indexPos += 2));
console.log('reserved second', buffer.slice(indexPos, indexPos += 2));
console.log('width/height', buffer.readInt32LE(18));
console.log('width/height', buffer.readInt32LE(22));




const readOffset = buffer.readUInt32LE(indexPos);
const offset = buffer.slice(indexPos, indexPos += 4);

console.log('dataOffset', indexPos, offset, readOffset);

console.log('pixel first read', buffer.slice(readOffset, readOffset + 3));
console.log('pixel second read', buffer.slice(readOffset + 3, readOffset + 6));


const blackPixels = [];


console.log('u', buffer.slice(readOffset).length);
const pixelData = buffer.slice(readOffset);
const blackPixelData = pixelData.map((pixel) => {
    // console.log('what', pixel);
    return 0x00;
})

// for (let i = 0; i < buffer.slice(readOffset).length; i++) {
//     blackPixels.push(0x00);
// }


console.log('length black pixels', blackPixels.length, blackPixelData.length);

fs.writeFile('blank_black.bmp', Buffer.from([...buffer.slice(0, readOffset), ...blackPixelData]), () => {
    console.log('saved successfully');
    const blankBuffer = fs.readFileSync("blank_black.bmp")
    console.log('blankBuffer buffer', blankBuffer);
    console.log('blankBuffer buffer length', blankBuffer.length);
    console.log('blankBuffer file type', blankBuffer.toString('utf8', 0, 2));
    console.log('blankBuffer width/height', blankBuffer.readInt32LE(18));
    console.log('blankBuffer width/height', blankBuffer.readInt32LE(22));
});
