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
    const width = buffer.readInt32LE(18);

    console.log(rotatedFileName, 'dataOffset', indexPos, offset, readOffset);

    console.log(rotatedFileName, 'pixel first read', buffer.slice(readOffset, readOffset + 3));
    console.log(rotatedFileName, 'pixel second read', buffer.slice(readOffset + 3, readOffset + 6));
    console.log(rotatedFileName, 'pixel third read', buffer.slice(readOffset + 9, readOffset + 12));

    const pixelData = buffer.slice(readOffset);

    let rotated_pixels = [];
    let number = 0;
    Array(width).fill(0).map((_, ty) => {
        Array(width).fill(0).map((__, tx) => {
            const sy = tx;
            const sx = width - ty - 1;

            const n = readOffset + 3 * (sy * width + sx)
            
            try {
                rotated_pixels.push(...buffer.slice(n, n + 3));
            } catch (error) {
                console.log('known', error);
            }
           
        })
    });

    console.log(number)

    console.log('rotated pixels', rotated_pixels.length, pixelData.length);

    fs.writeFile(rotatedFileName, Buffer.from([...buffer.slice(0, readOffset), ...rotated_pixels]), () => {
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
