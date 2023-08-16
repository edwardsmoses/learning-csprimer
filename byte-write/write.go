package main

import (
	"fmt"
	"os"
	"syscall"
)

var (
	file, err              = os.Create("one_byte_by_byte")
	file_current_size      int64
	file_current_blocks    int64
	how_many_bytes_written int64
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

	ONE_MEGABYTE := 1 << 20
	for i := 0; i < ONE_MEGABYTE; i++ {
		_, err = file.Write([]byte{
			0x53, //write S as a byte
		})

		if err != nil {
			fmt.Println("Error: ", err)
			return
		}

		how_many_bytes_written += 1
	}

}

func checkFileStat() {

	prev_blocks := file_current_blocks

	var stat syscall.Stat_t
	syscall.Stat(file.Name(), &stat)

	file_current_size = stat.Size
	file_current_blocks = stat.Blocks

	if file_current_blocks > prev_blocks {
		fmt.Println("File ", file.Name(), "has current size", stat.Size, " and has blocks: ", file_current_blocks, " and on disk: ", file_current_blocks*512)
	}

}
