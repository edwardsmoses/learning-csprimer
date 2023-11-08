package main

import (
	"bufio"
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

	cmdString = strings.TrimSuffix(cmdString, "\n")

	return cmdString
}

func execCommand(cmdString string) {
	arrCommandStr := strings.Fields(cmdString)

	cmd := exec.Command(arrCommandStr[0], arrCommandStr[1:]...)
	cmd.Stderr = os.Stderr
	cmd.Stdout = os.Stdout

	err := cmd.Run()
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
	}
}

func execAppSpecificCommand(cmdString string) {

	arrCommandStr := strings.Fields(cmdString)

	switch arrCommandStr[0] {
	case "exit":
		os.Exit(0)
	}
}

func execPipeline(pipeline []string) {
	var stdin io.Reader

	var cmdList []*exec.Cmd
	var err error

	for _, cmdString := range pipeline {
		arrCommandStr := strings.Fields(cmdString)

		cmd := exec.Command(arrCommandStr[0], arrCommandStr[1:]...)
		cmd.Stderr = os.Stderr

		if stdin != nil {
			cmd.Stdin, err = cmdList[len(cmdList)-1].StdoutPipe()
			if err != nil {
				fmt.Fprintln(os.Stderr, err)
				return
			}
		}

		stdoutReader, stdoutWriter := io.Pipe()
		cmd.Stdout = stdoutWriter

		err = cmd.Start()
		if err != nil {
			fmt.Fprintln(os.Stderr, err)
			return
		}

		cmdList = append(cmdList, cmd)

		go func() {
			defer stdoutWriter.Close()
			io.Copy(os.Stdout, stdoutReader)
		}()

		stdin = stdoutReader
	}

	for _, cmd := range cmdList {
		err = cmd.Wait()
		if err != nil {
			fmt.Fprintln(os.Stderr, err)
			return
		}
	}
}

func main() {
	for {
		fmt.Print("$ eddy@shell:~ ")

		cmdString := readFromTerminal()

		if strings.Contains(cmdString, "|") {
			pipeline := strings.Split(cmdString, "|")

			for i, cmd := range pipeline {
				pipeline[i] = strings.TrimSpace(cmd)
			}

			execPipeline(pipeline)
		} else {
			execAppSpecificCommand(cmdString) //exec app specific command if match
			execCommand(cmdString)            //exec the command
		}
	}
}
