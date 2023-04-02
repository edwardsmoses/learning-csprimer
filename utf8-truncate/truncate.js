var fs = require('fs');

let indexPos = 2;

const truncate = (rBuffer) => {

    const buffer = Buffer.from(rBuffer);
    console.log("utf8", buffer);
    console.log('buffer length', buffer.length);


    //split in lines of text .. 
    // the lines are seperated using LF ('Line feed'), and the hex code is 0A
    const lines = [];
    
    buffer.map((byte) => {
        if(byte === 0x0a){
            console.log('line delimiter found');
        }
    });
    



    fs.writeFile("expected_mine", Buffer.from(buffer), () => {
        

        console.log('wrote to expected successfully');
        
    });

}


const buffer = fs.readFileSync("cases")
truncate(buffer);
