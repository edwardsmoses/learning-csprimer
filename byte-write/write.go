package main

import (
	"fmt"
	"os"
)

var (
	file, err = os.Create("one_byte_by_byte")
)

func main() {
	fmt.Println("Hello, Byte write!")
	writeByte()
	checkFileStat()
}

func writeByte() {
	if err != nil {
		fmt.Println("Error: ", err)
		return
	}
	defer file.Close()

	byteToWrite := []byte{
		0x53, //write S as a byte
	}
	_, err = file.Write(byteToWrite)

	if err != nil {
		fmt.Println("Error: ", err)
		return
	}

	fmt.Println("Wrote 1 byte to file")
}

func checkFileStat() {

	stat, _err := os.Stat(file.Name())

	if _err != nil {
		fmt.Println("Error: ", _err)
		return
	}

	fmt.Println("File Name: ", stat.Name())
	fmt.Println("Size: ", stat.Size())
}
