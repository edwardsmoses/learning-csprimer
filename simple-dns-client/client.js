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
// Helper function to parse DNS response
// DNS response parsing function
function parseDNSResponse(dnsResponse) {

    const recordData = dnsResponse.slice(12); // Skip the DNS header
    let offset = 0;
  
    // Skip the question section
    while (recordData[offset] !== 0) {
      offset += 1 + recordData[offset];
    }
    offset += 5; // Skip the question section's type and class fields
  
    // Parse the answer section
    const answerType = recordData.readUInt16BE(offset);
    const answerClass = recordData.readUInt16BE(offset + 2);
    const ttl = recordData.readUInt32BE(offset + 4);
    const dataLength = recordData.readUInt16BE(offset + 10);
    const ipAddress = recordData.slice(offset + 12, offset + 16).join('.');
  
    // Return the parsed A record information
    return {
      type: answerType,
      class: answerClass,
      ttl,
      ipAddress
    };

  }
  
  // Helper function to read domain names
  function readDomainName(buffer, offset) {
    let name = '';
    let length = buffer[offset];
    let position = offset + 1;
  
    while (length !== 0) {
      if ((length & 0xC0) === 0xC0) {
        const pointer = ((length & 0x3F) << 8) | buffer[position];
        name += readDomainName(buffer, pointer);
        position++;
        break;
      }
  
      name += buffer.toString('utf8', position, position + length) + '.';
      position += length;
      length = buffer[position];
    }
  
    return name;
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
        console.log('what is the packet', packet);

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

