package main

import (
	"bufio"
	"fmt"
	"os"
)

func readFromTerminal() {
	reader := bufio.NewReader(os.Stdin)
	cmdString, err := reader.ReadString('\n')
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
	}

	fmt.Println("You typed: ", cmdString)

}

func main() {
	fmt.Println("starting the shell...")

	readFromTerminal()
}
