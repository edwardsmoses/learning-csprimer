const net = require('node:net');

/* commands i'm using:
dig google.com - send a dns query
tcpdump -i eth0 -w dns.pcap port 53 - capture the dns queries into a pcap file for later analysis
tcpdump -qns 0 -X -r dns.pcap - analysing the pcap file to see the queries that were sent
 */

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
});

readline.question(`What's the address we want to query? \t`, address => {
    console.log(`Hi ${address}!`);
    readline.close();
});


