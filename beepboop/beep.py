import sys
import time
import curses
import tty 

# one keystroke at a time
tty.setcbreak(0)

while True:
   ch = sys.stdin.read(1)
   num = int(ch)
   if '1' <= ch <= '9':
      while (num > 0):
         sys.stdout.buffer.write(b'\x07')
         sys.stdout.flush()
         time.sleep(2)
         num -= 1;
   print (ch)


# for line in sys.stdin:
#   num = int(line)
#   while (num > 0): 
#     print('beep') 
#     sys.stdout.buffer.write(b'\x07')
#     sys.stdout.flush()
#     time.sleep(2)
#     num -= 1;

