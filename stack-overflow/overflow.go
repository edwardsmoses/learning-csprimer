package main

import (
	"fmt"
)

var (
	count int
)

func main() {
	fmt.Println("Hello, World!")
	overflow()
}

func overflow() {
	count += 1
	fmt.Println("Overflowing...", count)
	overflow()
}
