const dgram = require('node:dgram');


/* commands i'm using:
dig google.com - send a dns query
tcpdump -i eth0 -w dns.pcap port 53 - capture the dns queries into a pcap file for later analysis
tcpdump -qns 0 -X -r dns.pcap - analysing the pcap file to see the queries that were sent
tshark -r dns.pcap - another analyzer. 
 */

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
});

readline.question(`What's the address we want to query? \t`, address => {
    console.log(`Hi ${address}!`);
    readline.close();

    sendDNSQuery(address)
        .then((parsedResponse) => {
            console.log('Parsed DNS response:', parsedResponse);
        })
        .catch((error) => {
            console.error('DNS query failed:', error);
        });
});


const dnsServer = '8.8.8.8'; // DNS server IP address
const dnsPort = 53; // DNS server port

// Function to create DNS query packet
function createDNSQueryPacket(transactionId, flags, questions, domainName) {
    const packet = Buffer.alloc(12 + domainName.length + 2 + 4);

    // Set transaction ID
    packet.writeUInt16BE(transactionId, 0);

    // Set flags
    packet.writeUInt16BE(flags, 2);

    // Set question count
    packet.writeUInt16BE(questions, 4);

    // Set other fields to zero
    packet.writeUInt16BE(0, 6);
    packet.writeUInt16BE(0, 8);
    packet.writeUInt16BE(0, 10);

    // Write domain name
    const domainParts = domainName.split('.');
    let offset = 12;
    domainParts.forEach((part) => {
        packet.writeUInt8(part.length, offset++);
        packet.write(part, offset, part.length, 'ascii');
        offset += part.length;
    });

    // Set end of domain name
    packet.writeUInt8(0, offset++);

    // Set question type to A (IPv4 address)
    packet.writeUInt16BE(1, offset);
    offset += 2;

    // Set question class to IN (Internet)
    packet.writeUInt16BE(1, offset);

    return packet;
}

// Helper function to parse DNS response
function parseDNSResponse(response) {
    const transactionId = response.readUInt16BE(0); // Get transaction ID from response
    const flags = response.readUInt16BE(2); // Get flags from response

    const answersCount = response.readUInt16BE(6); // Get number of answers in the response

    const parsedResponse = {
        transactionId,
        flags,
        answers: [],
        aRecords: [],
    };

    let currentPosition = 12; // Start position for answers in the response

    // Parse each answer
    for (let i = 0; i < answersCount; i++) {
        const answer = {};

        // Read the name from the response
        const name = readName(response, currentPosition);
        answer.name = name.name;
        currentPosition = name.nextPosition;

        // Read the type and class from the response
        answer.type = response.readUInt16BE(currentPosition);
        answer.class = response.readUInt16BE(currentPosition + 2);
        currentPosition += 4;

        // Read the TTL (Time to Live) from the response
        answer.ttl = response.readUInt32BE(currentPosition);
        currentPosition += 4;

        // Read the data length from the response
        const dataLength = response.readUInt16BE(currentPosition);
        currentPosition += 2;

        // Read the data (IP address in this case) from the response
        console.log('what is you', answer);
        answer.data = `${response[currentPosition]}.${response[currentPosition + 1]}.${response[currentPosition + 2]}.${response[currentPosition + 3]}`;
        parsedResponse.aRecords.push(answer.data);


        currentPosition += dataLength;

        parsedResponse.answers.push(answer);
    }



    return parsedResponse;
}

// Helper function to read domain name from the DNS response
function readName(response, position) {
    let name = '';
    let currentPosition = position;
    let jumped = false;

    let length = response[currentPosition];

    while (length !== 0) {
        if ((length & 0xc0) === 0xc0) {
            const offset = ((length & 0x3f) << 8) + response[currentPosition + 1];
            if (!jumped) {
                position += 2;
                jumped = true;
            }
            currentPosition = offset;
        } else {
            name += response.toString('ascii', currentPosition + 1, currentPosition + 1 + length) + '.';
            currentPosition += length + 1;
        }

        length = response[currentPosition];
    }

    if (!jumped) {
        currentPosition++;
    }

    return {
        name: name.toLowerCase(),
        nextPosition: currentPosition
    };
}

// Function to send DNS query and parse the response
function sendDNSQuery(domainName) {
    return new Promise((resolve, reject) => {
        const client = dgram.createSocket('udp4');

        const transactionId = Math.floor(Math.random() * 65536);
        const flags = 0x0100;
        const questions = 1;

        const packet = createDNSQueryPacket(transactionId, flags, questions, domainName);

        client.send(packet, 0, packet.length, dnsPort, dnsServer, (error) => {
            if (error) {
                reject(error);
            }
        });

        client.on('message', (response) => {
            const parsedResponse = parseDNSResponse(response);
            resolve(parsedResponse);
            client.close();
        });

        client.on('error', (error) => {
            reject(error);
            client.close();
        });
    });
}

