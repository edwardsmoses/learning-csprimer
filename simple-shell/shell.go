package main

import (
	"bufio"   // Import for buffered I/O
	"bytes"   // Import for manipulating bytes
	"fmt"     // Import for I/O formatting
	"io"      // Import for I/O interfaces
	"os"      // Import for interacting with the operating system
	"os/exec" // Import for executing external commands
	"strings" // Import for string manipulation
)

// readFromTerminal reads a line of input from the terminal and returns it as a string.
func readFromTerminal() string {
	// bufio.NewReader creates a new reader that reads from standard input
	reader := bufio.NewReader(os.Stdin)
	// ReadString reads until the first occurrence of '\n' in the input, then returns a line of text
	cmdString, err := reader.ReadString('\n')
	if err != nil {
		// Print error to the standard error stream
		fmt.Fprintln(os.Stderr, err)
	}
	// TrimSuffix removes the newline character from the end of the input line
	return strings.TrimSuffix(cmdString, "\n")
}

// execPipeline executes a series of piped commands.
func execPipeline(commands [][]string) {
	var err error
	var output bytes.Buffer // Buffer to keep the output of each command
	var input io.Reader     // Reader for the input of each command

	for i, command := range commands {
		// Executing the command based on the first element (command name) and the rest (arguments)
		cmd := exec.Command(command[0], command[1:]...)

		if i > 0 {
			// For commands after the first, use the previous command's output as input
			cmd.Stdin = input
		}

		if i < len(commands)-1 {
			// For all but the last command, store output to pass to the next command
			output.Reset()
			cmd.Stdout = &output
		} else {
			// For the last command, direct output to standard output
			cmd.Stdout = os.Stdout
		}

		// Direct standard error of the command to the standard error of the program
		cmd.Stderr = os.Stderr
		// Run the command
		err = cmd.Run()
		if err != nil {
			// If there is an error, print it to standard error and exit the function
			fmt.Fprintln(os.Stderr, err)
			return
		}

		// Prepare the output of the current command to be used as input for the next
		input = bytes.NewReader(output.Bytes())
	}
}

// parseCommand splits the command string into a slice of command slices.
func parseCommand(cmdString string) [][]string {
	// Split the command string by the pipe character
	parts := strings.Split(cmdString, "|")
	var commands [][]string // Slice to hold the parsed commands

	for _, part := range parts {
		// Split each part into its command and arguments, and append to the commands slice
		commands = append(commands, strings.Fields(strings.TrimSpace(part)))
	}

	return commands
}

// main is the entry point of the program.
func main() {
	for {
		// Print a custom prompt
		fmt.Print("$ eddy@shell:~ ")

		// Read a command string from the terminal
		cmdString := readFromTerminal()

		// Special case to exit the shell
		if cmdString == "exit" {
			os.Exit(0)
		}

		// Parse the command string into a slice of command slices
		commands := parseCommand(cmdString)
		// Execute the parsed commands as a pipeline
		execPipeline(commands)
	}
}
