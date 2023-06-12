const net = require('node:net');

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
});

readline.question(`What's the address we want to query? \t`, address => {
    console.log(`Hi ${address}!`);
    readline.close();
});

