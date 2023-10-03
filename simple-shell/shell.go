package main

import (
	"bufio"
	"fmt"
	"os"
	"os/exec"
	"strings"
)

func readFromTerminal() string {
	reader := bufio.NewReader(os.Stdin)
	cmdString, err := reader.ReadString('\n')
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
	}

	return cmdString
}

func execCommand(command string) {
	commandString := strings.TrimSuffix(command, "\n")
	cmd := exec.Command(commandString)
	cmd.Stderr = os.Stderr
	cmd.Stdout = os.Stdout
	cmd.Run()
}

func main() {
	fmt.Println("starting the shell...")

	cmdString := readFromTerminal()
	execCommand(cmdString) //exec the command
}
