import sys
import time
import curses


# for line in sys.stdin:
#   num = int(line)
#   while (num > 0): 
#     print('beep') 
#     sys.stdout.buffer.write(b'\x07')
#     sys.stdout.flush()
#     time.sleep(2)
#     num -= 1;


def main(win):
    win.nodelay(True)
    key=""
    while 1:          
        try:  
           # one key stroke a time               
           key = win.getkey()         
           win.clear()                
           win.addstr(str(key)) 

           if key == os.linesep:
              break           
        except Exception as e:
           # No input   
           pass  
             

curses.wrapper(main)
