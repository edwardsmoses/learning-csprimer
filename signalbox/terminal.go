package main

import (
	"fmt"
	"os"
	"os/signal"
	"syscall"

	"golang.org/x/sys/unix"
)

func getTerminalSize() (width, height int, err error) {
	ws, err := unix.IoctlGetWinsize(int(os.Stdout.Fd()), unix.TIOCGWINSZ)
	if err != nil {
		return 0, 0, err
	}
	return int(ws.Col), int(ws.Row), nil
}

func main() {
	fmt.Println("starting...")

	// Create a channel to receive OS signals
	sigs := make(chan os.Signal, 1)

	// Notify the channel when a SIGWINCH signal is received
	signal.Notify(sigs, syscall.SIGWINCH)

	// Infinite loop to keep the program running and listen for signals
	for {
		select {
		case <-sigs:
			width, height, err := getTerminalSize()
			if err != nil {
				fmt.Println("Error getting terminal size:", err)
			} else {
				fmt.Printf("Terminal resized! New dimensions: %dx%d\n", width, height)
			}
		}
	}
}
