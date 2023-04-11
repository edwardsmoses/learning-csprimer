import struct

def conceal (val): 
    bs = val.encode('utf8')
    print("val", val, type(val), bs, len(bs));


    first = b'\x7f'
    second = (0xf8 ^ len(bs)).to_bytes(1, 'big')
    padding = b'\0x00' * (6 - len(bs))
    payload = bs
    
    print('padding', len(first), len(second), len(padding), len(first + second + padding + payload))
    return struct.unpack('>d', first + second + padding + payload)[0]


def reveal (val):
    print('reveal val', val, type(val));
    return val

print(struct.pack('d', float('nan')))

concealed = conceal("hello");
print("revealed", reveal(concealed));