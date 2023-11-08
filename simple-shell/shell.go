package main

import (
	"bufio"
	"fmt"
	"io"
	"os"
	"os/exec"
	"strings"
)

func readFromTerminal() []string {
	reader := bufio.NewReader(os.Stdin)
	cmdString, err := reader.ReadString('\n')
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
	}

	cmdString = strings.TrimSuffix(cmdString, "\n")

	arrCommandStr := strings.Fields(cmdString)
	return arrCommandStr
}

func execCommand(arrCommandStr []string, stdin io.Reader) io.Reader {
	cmd := exec.Command(arrCommandStr[0], arrCommandStr[1:]...)
	cmd.Stderr = os.Stderr

	if stdin != nil {
		cmd.Stdin = stdin
	}

	stdout, err := cmd.StdoutPipe()
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		return nil
	}

	err = cmd.Run()
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		return nil
	}

	return stdout
}

func execAppSpecificCommand(arrCommandStr []string) {
	switch arrCommandStr[0] {
	case "exit":
		os.Exit(0)
	}
}

func execPipeline(pipeline []string) {
	var stdin io.Reader

	for _, cmdString := range pipeline {
		arrCommandStr := strings.Fields(cmdString)

		stdout := execCommand(arrCommandStr, stdin)
		if stdout == nil {
			return
		}

		stdin = stdout
	}

	io.Copy(os.Stdout, stdin)
}

func main() {
	for {
		fmt.Print("$ eddy@shell:~ ")

		cmdString := readFromTerminal()

		if strings.Contains(cmdString[0], "|") {
			pipeline := strings.Split(strings.Join(cmdString, " "), "|")
			execPipeline(pipeline)
		} else {
			execAppSpecificCommand(cmdString) //exec app specific command if match
			execCommand(cmdString, nil)       //exec the command
		}
	}
}
