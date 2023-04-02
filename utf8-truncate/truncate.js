var fs = require('fs');

let indexPos = 2;



function isHighSurrogate(codePoint) {
  return codePoint >= 0xd800 && codePoint <= 0xdbff;
}

function isLowSurrogate(codePoint) {
  return codePoint >= 0xdc00 && codePoint <= 0xdfff;
}

// Truncate string by size in bytes
function truncateLine(string, byteLength) {
    // console.log('in function', string);
  var charLength = string.length;
  var curByteLength = 0;
  var codePoint;
  var segment;

  for (var i = 0; i < charLength; i += 1) {
    codePoint = string.charCodeAt(i);
    segment = string[i];

    if (isHighSurrogate(codePoint) && isLowSurrogate(string.charCodeAt(i + 1))) {
      i += 1;
      segment += string[i];
    }

    // curByteLength += getLength(segment);

    if (curByteLength === byteLength) {
      return string.slice(0, i + 1);
    }
    else if (curByteLength > byteLength) {
      return string.slice(0, i - segment.length + 1);
    }
  }

  return string;
};


const truncate = (rBuffer) => {

    const buffer = Buffer.from(rBuffer);
    // console.log("utf8", buffer);
    // console.log('buffer length', buffer.length);


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
        // console.log('line', index, 'number', numberOfBytesToTruncate);


        const nLine =  truncateLine(line.filter((_, i) => i != 0).toString('utf-8'), numberOfBytesToTruncate);
        // console.log('nLine', nLine, line.filter((_, i) => i != 0).toString('utf-8'),);

        // console.log('truncated line', index, line);

        return Buffer.from(nLine);
    });

    // console.log('newLines', newLines);

    const expectedLine = newLines.map((line) => {
        return [...Buffer.from(line), 0x0a]
    })



    fs.writeFile("expected_mine", Buffer.from(expectedLine.flat()), () => {
        console.log('wrote to expected successfully');
    });

}


const buffer = fs.readFileSync("cases")
truncate(buffer);
