var fs = require('fs');

let indexPos = 2;

const rotate_buffer = (buffer, rotatedFileName) => {

    console.log(rotatedFileName, 'buffer', buffer);
    console.log(rotatedFileName, 'buffer length', buffer.length);
    console.log(rotatedFileName, 'file type', buffer.toString('utf8', 0, 2));
    console.log(rotatedFileName, 'file sizes', buffer.slice(indexPos, indexPos += 4));
    console.log(rotatedFileName, 'reserved', buffer.slice(indexPos, indexPos += 2));
    console.log(rotatedFileName, 'reserved second', buffer.slice(indexPos, indexPos += 2));
    console.log(rotatedFileName, 'width/height', buffer.readInt32LE(18));
    console.log(rotatedFileName, 'width/height', buffer.readInt32LE(22));

    const readOffset = buffer.readUInt32LE(indexPos);
    const offset = buffer.slice(indexPos, indexPos += 4);

    console.log(rotatedFileName, 'dataOffset', indexPos, offset, readOffset);

    console.log(rotatedFileName, 'pixel first read', buffer.slice(readOffset, readOffset + 3));
    console.log(rotatedFileName, 'pixel second read', buffer.slice(readOffset + 3, readOffset + 6));
    console.log(rotatedFileName, 'pixel third read', buffer.slice(readOffset + 9, readOffset + 12));

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

    for (var i = 0; i < grid.length; i++) {
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
    
    fs.writeFile(rotatedFileName, Buffer.from([...buffer.slice(0, readOffset), ...newGrid.flat()]), () => {
        console.log("\n", "-------------");

        console.log('rotated mine successfully', rotatedFileName);
        const rotatedBuffer = fs.readFileSync(rotatedFileName)

        console.log(rotatedFileName, 'buffer length', rotatedBuffer.length);
        console.log(rotatedFileName, 'rotated_test file type', rotatedBuffer.toString('utf8', 0, 2));
        console.log(rotatedFileName, 'rotated_test width/height', rotatedBuffer.readInt32LE(18));
        console.log(rotatedFileName, 'rotated_test width/height', rotatedBuffer.readInt32LE(22));
        console.log("\n", "-------------");

    });

}


const buffer = fs.readFileSync("teapot.bmp")
rotate_buffer(buffer, "rotated_mine.bmp")

const stretch_buffer = fs.readFileSync("stretch-goal.bmp")
rotate_buffer(stretch_buffer, "rotated_stretch.bmp")
