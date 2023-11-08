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

func execCommand(arrCommandStr []string) {
	cmd := exec.Command(arrCommandStr[0], arrCommandStr[1:]...)
	cmd.Stderr = os.Stderr
	cmd.Stdout = os.Stdout

	err := cmd.Run()
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
	}
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

		cmd := exec.Command(arrCommandStr[0], arrCommandStr[1:]...)
		cmd.Stderr = os.Stderr
		cmd.Stdin = stdin

		stdoutReader, stdoutWriter := io.Pipe()
		cmd.Stdout = stdoutWriter

		err := cmd.Start()
		if err != nil {
			fmt.Fprintln(os.Stderr, err)
			return
		}

		stdin = stdoutReader
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
			execCommand(cmdString)            //exec the command
		}
	}
}
