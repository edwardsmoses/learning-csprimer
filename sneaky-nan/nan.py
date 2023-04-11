import struct

def conceal (val): 
    print("concealed val", val)

    bs = val.encode('utf8')
    n = len(bs)

    first = b'\x7f'
    second = (0xf8 ^ n).to_bytes(1, 'big')
    padding = b'\x00' * (6 - n)
    payload = bs

    nan = struct.unpack('>d', first + second + padding + payload)[0];
    print("nan val", type(nan))
    
    return nan;


def reveal (val):
    bs = struct.pack('>d', val)
    n = bs[1] & 0x07
    return bs[-n:].decode('utf8')
    


concealed = conceal("hello");
print("revealed", reveal(concealed));

concealed = conceal("secret");
print("revealed", reveal(concealed));

concealed = conceal("none");
print("revealed", reveal(concealed));