import struct

def encode(n):
    out = []
    while n > 0:
        part = n & 0x7f
        n >>= 7
        if(n > 0):
            part += 0x80 #using hexadecimal 
        out.append(part)
    return bytes(out)

def decode (varn):
    n = 0
    for b in reversed(varn): 
        n <<= 7
        n |= (b & 0x7f)
    return n


cases = ['1.uint64', '150.uint64', 'maxint.uint64']
for fname in cases: 
    with open (fname, 'rb') as f:
        n = struct.unpack('>Q', f.read())[0]
        print('protobuf', fname, n, encode(n), decode(encode(n)))


