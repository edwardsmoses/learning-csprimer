package main

import (
	"fmt"
)

func main() {
	fmt.Println("Hello, Overflow!")
	overflow(0)
}

func overflow(depth int) {
	fmt.Println("depth:", depth, &depth)
	overflow(depth + 1)
}
