var fs = require("fs");
var cssString = fs.readFileSync("./simple.css").toString('utf-8');

console.log(cssString);