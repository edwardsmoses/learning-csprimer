import struct

def encode(n):
    out = []
    while n > 0:
        part = n % 128  #TODO bitmask for possible speed
        n >>= 7
        if(n > 0):
            part += 0b10000000
        out.append(part)
    return bytes(out)


with open ('150.uint64', 'rb') as f:
    n = struct.unpack('>Q', f.read())[0]
    print('encoded', encode(n))

