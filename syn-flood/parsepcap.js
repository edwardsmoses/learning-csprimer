var fs = require('fs');

let indexPos = 0;

const parsePCAP = (buffer) => {

    const firstByte = buffer.readUInt32LE(indexPos);
    console.log('first byte', firstByte);

    const secondByte = buffer.readUInt32LE(indexPos + 4);
    console.log('first byte', secondByte);

    const thirdByte = buffer.readUInt32LE(indexPos + 8);
    console.log('first byte', thirdByte);


}


const buffer = fs.readFileSync("synflood.pcap")
parsePCAP(buffer)

