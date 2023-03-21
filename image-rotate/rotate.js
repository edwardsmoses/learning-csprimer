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


const pixelData = buffer.slice(readOffset);

let i = 1;
const blackPixelData = pixelData.map(() => {
    const pixel = i % 2 == 0 ? 0xff : 0x00;
    i++;
    return pixel;
})

const rotatedPixelData = pixelData.reverse();


let d = 0;
let res = [];

while (d < pixelData.length) {
    j = d, temp = []
    while (j < d + 3) {
        temp.push(pixelData[j])
        j++;
    }
    res.push(temp);
    d += 3;
}

const reversed_Res = res[0].map((val, index) => res.map(row => row[index]).reverse())


fs.writeFile('rotated_new_test.bmp', Buffer.from([...buffer.slice(0, readOffset), ...reversed_Res.flat()]), () => {
    console.log('rotated new_1 successfully');
    const rotatedBuffer = fs.readFileSync("rotated_new_test.bmp")
    console.log('rotated_test buffer', rotatedBuffer);
    console.log('rotated_test buffer length', rotatedBuffer.length);
    console.log('rotated_test file type', rotatedBuffer.toString('utf8', 0, 2));
    console.log('rotated_test width/height', rotatedBuffer.readInt32LE(18));
    console.log('rotated_test width/height', rotatedBuffer.readInt32LE(22));
});

fs.writeFile('rotated_test.bmp', Buffer.from([...buffer.slice(0, readOffset), ...rotatedPixelData]), () => {
    console.log('rotated successfully');
    const rotatedBuffer = fs.readFileSync("rotated_test.bmp")
    console.log('rotated_test buffer', rotatedBuffer);
    console.log('rotated_test buffer length', rotatedBuffer.length);
    console.log('rotated_test file type', rotatedBuffer.toString('utf8', 0, 2));
    console.log('rotated_test width/height', rotatedBuffer.readInt32LE(18));
    console.log('rotated_test width/height', rotatedBuffer.readInt32LE(22));
});


// fs.writeFile('blank_white_black.bmp', Buffer.from([...buffer.slice(0, readOffset), ...blackPixelData]), () => {
//     console.log('saved successfully');
//     const blankBuffer = fs.readFileSync("blank_black.bmp")
//     console.log('blankBuffer buffer', blankBuffer);
//     console.log('blankBuffer buffer length', blankBuffer.length);
//     console.log('blankBuffer file type', blankBuffer.toString('utf8', 0, 2));
//     console.log('blankBuffer width/height', blankBuffer.readInt32LE(18));
//     console.log('blankBuffer width/height', blankBuffer.readInt32LE(22));
// });
