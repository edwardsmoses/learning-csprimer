; ------------ 
; Writes "Hello, World" to the console using only system calls. Runs on 64-bit linux only. 
; To assemble and run:
;
; nasm -felf64 hello.asm && ld hello.o && ./a.out
; -------


global _start


_start: 