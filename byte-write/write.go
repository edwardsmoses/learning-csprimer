package main

import (
	"fmt"
	"os"
)

func main() {
	fmt.Println("Hello, Byte write!")
	writeByte()
}

func writeByte() {
	file, err := os.Create("one_byte_by_byte")
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
