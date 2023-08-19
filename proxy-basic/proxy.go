package main

import (
	"bufio"
	"fmt"
	"io"
	"net"
)

var (
	SERVER_PORT = 9000
	CLIENT_PORT = ":9999"
)

func main() {
	fmt.Println("Hello, Proxy Server!")
	startProxyServer()
}

func startProxyServer() {
	listener, err := net.Listen("tcp", CLIENT_PORT)
	if err != nil {
		fmt.Println("Error listening:", err)
		return
	}

	defer listener.Close()

	fmt.Println("Listening on " + CLIENT_PORT)

	for {
		conn, err := listener.Accept()
		if err != nil {
			fmt.Println("Error accepting: ", err)
			continue
		}
		go handleConnection(conn)
	}
}

func handleConnection(conn net.Conn) {
	defer conn.Close()

	proxySocket, err := net.Dial("tcp", fmt.Sprintf("localhost:%d", SERVER_PORT))
	if err != nil {
		fmt.Println("Error connecting to proxy:", err)
		return
	}
	defer proxySocket.Close()

	fmt.Println("Client connected:", conn.RemoteAddr())
	fmt.Println("Proxying to:", SERVER_PORT)

	go func() {
		_, err := io.Copy(proxySocket, conn)
		if err != nil {
			fmt.Println("Error forwarding data to proxy:", err)
		}
	}()

	go func() {
		_, err := io.Copy(conn, proxySocket)
		if err != nil {
			fmt.Println("Error forwarding data to client:", err)
		}
	}()

	reader := bufio.NewReader(conn)
	for {
		data, err := reader.ReadString('\n')
		if err != nil {
			fmt.Println("Client disconnected:", conn.RemoteAddr())
			return
		}

		//logging the request
		fmt.Println("Request String:", data)

		_, err = proxySocket.Write([]byte(data))
		if err != nil {
			fmt.Println("Error forwarding modified request to proxy:", err)
			return
		}
	}
}
