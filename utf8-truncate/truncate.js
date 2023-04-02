var fs = require('fs');

let indexPos = 2;

const truncate = (rBuffer) => {

    const buffer = Buffer.from(rBuffer);
    console.log("utf8", buffer);
    console.log('buffer length', buffer.length);


    //split in lines of text .. 
    // the lines are separated using LF ('Line feed'), and the hex code is 0A
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
    const newLines = lines.map((line, index) => {
        const numberOfBytesToTruncate = line[0];
        console.log('line', index, 'number', numberOfBytesToTruncate);
        
        line.splice(0, 1).splice(0, numberOfBytesToTruncate);

        console.log('truncated line', index, line);

        return line;
    });

    const expectedLine = newLines.map((line) => {
        line.push(0x0a); //add the line delimiter.. 
    })

    

    fs.writeFile("expected_mine", Buffer.from(expectedLine), () => {
        console.log('wrote to expected successfully');
    });

}


const buffer = fs.readFileSync("cases")
truncate(buffer);
