import sys
import time
import termios
import tty 

# one keystroke at a time
tty_attrs = termios.tcgetattr(0)
tty.setcbreak(0)

def run():
    while True:
        ch = sys.stdin.read(1)
        print (ch)
        num = int(ch)
        if '1' <= ch <= '9':
            while (num > 0):
                sys.stdout.buffer.write(b'\x07')
                sys.stdout.flush()
                time.sleep(2)
                num -= 1;

try:
    run()
finally:
    termios.tcsetattr(0, termios.TCSADRAIN, tty_attrs)


# for line in sys.stdin:
#   num = int(line)
#   while (num > 0): 
#     print('beep') 
#     sys.stdout.buffer.write(b'\x07')
#     sys.stdout.flush()
#     time.sleep(2)
#     num -= 1;

