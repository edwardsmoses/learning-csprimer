var fs = require("fs");
var cssString = fs.readFileSync("./simple.css").toString('utf-8');

console.log(cssString);

const replaceHexWithRgb = (hexString) => {

    var hex = parseInt(hexString, 16);
  
    var r = (hex >> 16) & 255;
    var g = (hex >> 8) & 255;
    var b = hex & 255;

    return `rgb (${r} ${g} ${b})`
}

console.log('result', replaceHexWithRgb('fe030a'));


