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

	fmt.Println("depth:", depth, (*int)(unsafe.Pointer(address))-(*int)(unsafe.Pointer(&depth)))

	overflow(depth+1, address)
}
