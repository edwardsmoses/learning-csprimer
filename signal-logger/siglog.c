#include <signal.h>
#include <stdio.h>
#include <stdint.h>
#include <unistd.h>
#include <stdlib.h>
#include <string.h>

volatile uint64_t handled = 0;

void handle(int sig) {
  handled |= (1 << sig);
  printf("Caught %d: %s (%d total)\n", sig, strsignal(sig),
         __builtin_popcount(handled));
  if(sig == SIGINT || sig == SIGTERM) {
           exit(0);
  }
}

int main(int argc, char* argv[]) {
    // Register all valid signals
    for (int i = 0; i < NSIG; i++) {
        signal(i, handle);
    }

    //create child process and immediately exit
    if (0 == fork()){
      exit(0);
    }

    // spin
    for (;;)
      sleep(1);
}
