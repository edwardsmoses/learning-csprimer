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


let d = 0;
let grid = [];

//separate into chunks of three pixels
while (d < pixelData.length) {
    j = d, temp = []
    while (j < d + 3) {
        temp.push(pixelData[j])
        j++;
    }
    grid.push(temp);
    d += 3;
}

//then rotate... 

var newGrid = [];
var rowLength = Math.sqrt(grid.length);
newGrid.length = grid.length

for (var i = 0; i < grid.length; i++)
{
    //convert to x/y
    var x = i % rowLength;
    var y = Math.floor(i / rowLength);

    //find new x/y
    var newX = rowLength - y - 1;
    var newY = x;

    //convert back to index
    var newPosition = newY * rowLength + newX;
    newGrid[newPosition] = grid[i];
}


fs.writeFile('rotated_mine.bmp', Buffer.from([...buffer.slice(0, readOffset), ...newGrid.flat()]), () => {
    console.log('rotated mine successfully');
    const rotatedBuffer = fs.readFileSync("rotated_mine.bmp")
    
    console.log('rotated_test file type', rotatedBuffer.toString('utf8', 0, 2));
    console.log('rotated_test width/height', rotatedBuffer.readInt32LE(18));
    console.log('rotated_test width/height', rotatedBuffer.readInt32LE(22));
});


