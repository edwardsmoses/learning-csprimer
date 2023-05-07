import socket

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.connect(('142.250.66.238', 80)) #connecting to google's ip
print(s.send(b'GET /\n'))
print(s.recv(1024))