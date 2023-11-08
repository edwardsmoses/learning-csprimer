package main

import (
	"bufio"
	"bytes"
	"fmt"
	"io"
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

	return strings.TrimSuffix(cmdString, "\n")
}

func execPipeline(commands [][]string) {
	var err error
	var output bytes.Buffer
	var input io.Reader

	for i, command := range commands {
		cmd := exec.Command(command[0], command[1:]...)

		if i > 0 {
			// Set the input of the current command to be the output of the previous command
			cmd.Stdin = input
		}

		if i < len(commands)-1 {
			// Save the output for the next command in the pipeline
			output.Reset()
			cmd.Stdout = &output
		} else {
			// Last command, output to stdout
			cmd.Stdout = os.Stdout
		}

		cmd.Stderr = os.Stderr
		err = cmd.Run()
		if err != nil {
			fmt.Fprintln(os.Stderr, err)
			return
		}

		input = bytes.NewReader(output.Bytes())
	}
}

func parseCommand(cmdString string) [][]string {
	parts := strings.Split(cmdString, "|")
	var commands [][]string

	for _, part := range parts {
		commands = append(commands, strings.Fields(strings.TrimSpace(part)))
	}

	return commands
}

func main() {
	for {
		fmt.Print("$ eddy@shell:~ ")

		cmdString := readFromTerminal()

		if cmdString == "exit" {
			os.Exit(0)
		}

		commands := parseCommand(cmdString)
		execPipeline(commands)
	}
}
