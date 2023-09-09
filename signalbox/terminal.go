package main

import (
	"fmt"
	"os"
	"os/signal"
	"syscall"
)

func main() {
	fmt.Println("Hello, Terminal Resizer Listener!")

	// Create a channel to receive OS signals.
	sigChan := make(chan os.Signal, 1)

	// Notify the channel of the following signals.
	signal.Notify(sigChan, syscall.SIGWINCH)

	// Block until a signal is received.
	for {
		select {
		case <-sigChan:
			fmt.Println("Terminal is resized!")
		}
	}
}
