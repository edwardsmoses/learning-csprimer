import sys
import time
import curses
import tty 

tty.setcbreak(0)

while True:
   ch = sys.stdin.read(1)
   print (ch)


# for line in sys.stdin:
#   num = int(line)
#   while (num > 0): 
#     print('beep') 
#     sys.stdout.buffer.write(b'\x07')
#     sys.stdout.flush()
#     time.sleep(2)
#     num -= 1;

