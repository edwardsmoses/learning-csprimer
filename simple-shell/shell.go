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

	err := cmd.Run()
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
	}
}

func main() {
	for {
		fmt.Print("$ eddy@shell:~ ")
		cmdString := readFromTerminal()
		execCommand(cmdString) //exec the command
	}
}
