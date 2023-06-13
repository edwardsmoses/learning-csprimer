const net = require('node:net');
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

    const client = dgram.createSocket('udp4');

    // Create DNS query packet
    const transactionId = Math.floor(Math.random() * 65536);
    const flags = 0x0100;
    const questions = 1;

    const packet = createDNSQueryPacket(transactionId, flags, questions, address);

    const dnsServer = '8.8.8.8'; // DNS server IP address
    const dnsPort = 53; // DNS server port

    client.send(packet, 0, packet.length, dnsPort, dnsServer, (error, response) => {
        console.error('DNS query failed:', error);
        console.error('DNS query response:', response);

        const parsedResponse = parseDNSResponse(response);
        console.log('in function: parsed DNS Response', parsedResponse);
    });

    client.on('message', (response) => {
        
        client.close();
    });

    client.on('error', (error) => {
        console.error('DNS query failed:', error);

        client.close();
    });




});



// Helper functions

// Create the DNS message header
function createHeader(transactionId, flags, questionCount) {
    const header = new Uint8Array(12);

    // Set transaction ID
    header[0] = (transactionId >> 8) & 0xff; // First 8 bits
    header[1] = transactionId & 0xff; // Last 8 bits

    // Set flags
    header[2] = (flags >> 8) & 0xff; // First 8 bits
    header[3] = flags & 0xff; // Last 8 bits

    // Set question count
    header[4] = (questionCount >> 8) & 0xff; // First 8 bits
    header[5] = questionCount & 0xff; // Last 8 bits

    // Set other header fields to zero

    return header;
}

// Create the DNS question section
function createQuestion(domainName, qtype, qclass) {
    const domainParts = domainName.split(".");
    const domainLength = domainParts.length;

    const question = new Uint8Array(domainLength + 5);

    let offset = 0;
    for (let i = 0; i < domainLength; i++) {
        const part = domainParts[i];
        const partLength = part.length;

        question[offset] = partLength; // Set the length of the domain part
        offset++;

        for (let j = 0; j < partLength; j++) {
            const charCode = part.charCodeAt(j);
            question[offset] = charCode; // Set the ASCII code of each character
            offset++;
        }
    }

    // Set null byte to terminate the domain name
    question[offset] = 0;

    // Set QTYPE and QCLASS
    question[offset + 1] = (qtype >> 8) & 0xff; // First 8 bits
    question[offset + 2] = qtype & 0xff; // Last 8 bits
    question[offset + 3] = (qclass >> 8) & 0xff; // First 8 bits
    question[offset + 4] = qclass & 0xff; // Last 8 bits

    return question;
}

// Helper function to create DNS query packet
function createDNSQueryPacket(transactionId, flags, questions, domainName) {

    const questionCount = 1; // Single question in the query

    // Step 2: DNS Question Section
    const qtype = 1; // A record query for IP address
    const qclass = 1; // IN class for internet

    // Step 3: Packet Formation
    const header = createHeader(transactionId, flags, questionCount);
    const question = createQuestion(domainName, qtype, qclass);

    // Combine header and question into a byte array
    const packet = new Uint8Array(header.length + question.length);
    packet.set(header);
    packet.set(question, header.length);

    // Step 4: Packet Serialization
    // const serializedPacket = Array.from(packet);

    // return serializedPacket

    console.log('packet query', packet);

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
        answers: []
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
        answer.data = response.slice(currentPosition, currentPosition + dataLength).join('.');

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

    const length = response[currentPosition];

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



