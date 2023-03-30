var fs = require('fs');

let indexPos = 0;

const parsePCAP = (rbuffer) => {

    const buffer = Buffer.from(rbuffer);

    const firstByte = buffer.readUInt32LE(indexPos);
    console.log('first byte', firstByte);

    const secondByte = buffer.readUInt32LE(indexPos + 4);
    console.log('first byte', secondByte);

    const thirdByte = buffer.readUInt32LE(indexPos + 8);
    console.log('first byte', thirdByte);

    console.log('header bytes', buffer.slice(0, 24))

    //does the File header match the Magic Number
    console.log('Is File Byte Ordering Correct', buffer.slice(0, 4), buffer.readUInt32LE(indexPos) == 0xa1b2c3d4);

    indexPos += 4; //increase index position

    //read the protocol 'Major version' and 'Minor version'
    console.log('Pcap Protocol version ' + buffer.readInt16LE(indexPos) + "." + buffer.readInt16LE(indexPos += 2))

    //read the link layer header type value
    indexPos += 4;
    console.log('is Link Layer header type match Loopback interface', buffer.slice(indexPos -4, indexPos), buffer.readUInt32LE(indexPos) == 0);

    //read the link layer header value
    indexPos += 4;
    console.log('Link Layer Header Value match IPv4', buffer.readInt32LE(indexPos))

    


}


const buffer = fs.readFileSync("synflood.pcap")
parsePCAP(buffer)

