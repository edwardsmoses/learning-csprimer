import struct

def conceal (val): 
    print("val", val, type(val));
    return val

def reveal (val):
    print('reveal val', val, type(val));
    return val

print(struct.pack('d', float('nan')))

concealed = conceal("hello world");
print("revealed", reveal(concealed));