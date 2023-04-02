var fs = require('fs');

const truncateLine = (stringBuffer, number) => {
    if (number >= stringBuffer.length) {
        return stringBuffer;
    }

    while (number > 0 && (stringBuffer[number] & 0xc0) == 0x80) {
        number -= 1;
    }
    return stringBuffer.slice(0, number);
}


const truncate = (rBuffer) => {

    const buffer = Buffer.from(rBuffer);

    //split in lines of text |
    // lines are separated using LF ('Line feed'), and the hex code is 0A
    const lines = [];
    let line = [];

    buffer.map((byte) => {
        if (byte !== 0x0a) {
            line.push(byte);
        } else {
            lines.push(line);
            line = [];
        }
    });

    //map the lines, 
    //to truncate
    const expectedLines = lines.map((line, index) => {
        const lineBuffer = Buffer.from(line);

        const truncatedLine = lineBuffer.filter((_, i) => i !== 0);
        const numberOfBytesToTruncate = line[0];

        return [...truncateLine(truncatedLine, numberOfBytesToTruncate), 0x0a]; //add the delimiter...
    });


    fs.writeFile("expected_mine", Buffer.from(expectedLines.flat()), () => {
        console.log('wrote to expected successfully');
    });

}


const buffer = fs.readFileSync("cases")

truncate(buffer);
