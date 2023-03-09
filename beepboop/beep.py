import sys
import time

for line in sys.stdin:
  num = int(line)
  while (num > 0): 
    print('beep') 
    sys.stdout.write('\a')
    sys.stdout.flush()
    time.sleep(2)
    num -= 1;


