import struct

def conceal (val): 
    bs = val.encode('utf8')
    n = len(bs)

    first = b'\x7f'
    second = (0xf8 ^ n).to_bytes(1, 'big')
    padding = b'\x00' * (6 - n)
    payload = bs
    
    return struct.unpack('>d', first + second + padding + payload)[0]


def reveal (val):
    print('reveal val', val, type(val));
    return val

print(struct.pack('d', float('nan')))

concealed = conceal("hello");
print("revealed", reveal(concealed));