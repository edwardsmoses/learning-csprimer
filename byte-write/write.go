package main

import (
	"fmt"
	"os"
)

var (
	file, err         = os.Create("one_byte_by_byte")
	file_current_size int64
)

func main() {
	fmt.Println("Hello, Byte write!")
	go writeByte()

	//create infinite loop that checks when file size has increased
	for {
		checkFileStat()
	}
}

func writeByte() {
	if err != nil {
		fmt.Println("Error: ", err)
		return
	}
	defer file.Close()

	//create an array of 1mb bytes to write to file
	byteToWrite := make([]byte, 1024*1024)

	for i := 0; i < len(byteToWrite); i++ {
		_, err = file.Write([]byte{
			0x53, //write S as a byte
		})

		if err != nil {
			fmt.Println("Error: ", err)
			return
		}
	}

}

func checkFileStat() {

	stat, _err := os.Stat(file.Name())

	if _err != nil {
		fmt.Println("Error: ", _err)
		return
	}

	prev_size := file_current_size
	file_current_size = stat.Size()
	if file_current_size > prev_size {
		fmt.Println("File ", stat.Name(), "has increased to", file_current_size, "from ", prev_size)
	}
}