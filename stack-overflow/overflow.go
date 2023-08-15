package main

import (
	"fmt"
	"unsafe"
)

func main() {
	fmt.Println("Hello, Overflow!")
	start()
}

func start() {
	depth := 0
	fmt.Println("start")
	overflow(depth, &depth)
}

func overflow(depth int, address *int) {

	if depth%10000 == 0 {
		fmt.Println("frame depth:", depth, address, unsafe.Pointer(&depth))
	}

	overflow(depth+1, address)
}
