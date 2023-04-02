var fs = require('fs');

let indexPos = 2;



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
        console.log(line[0]);
        

        const truncatedLine = lineBuffer.filter((_, i) => i !== 0);
        


        return [...truncatedLine, 0x0a]; //add the delimiter...
    });


    fs.writeFile("expected_mine", Buffer.from(expectedLines.flat()), () => {
        console.log('wrote to expected successfully');
    });

}


const buffer = fs.readFileSync("cases")
truncate(buffer);
