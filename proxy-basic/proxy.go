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

	//start listening to incoming requests
	listener, err := net.Listen("tcp", CLIENT_PORT)
	if err != nil {
		fmt.Println("Error listening:", err)
		return
	}

	defer listener.Close() //we want to close the requests at end..

	fmt.Println("Listening on " + CLIENT_PORT)

	//initiate listener to accept incoming requests on a loop
	for {
		conn, err := listener.Accept()
		if err != nil {
			fmt.Println("Error accepting: ", err)
			continue
		}
		go handleConnection(conn) //handle the connection in a separate goroutine
	}
}

func handleConnection(conn net.Conn) {
	defer conn.Close()

	//connect to the actual server on the SERVER_PORT
	proxySocket, err := net.Dial("tcp", fmt.Sprintf("localhost:%d", SERVER_PORT))
	if err != nil {
		fmt.Println("Error connecting to proxy:", err)
		return
	}
	defer proxySocket.Close() //close both the client and server connections at the end

	fmt.Println("Client connected:", conn.RemoteAddr())
	fmt.Println("Proxying to:", SERVER_PORT)

	//goroutine to copy data from client (proxy) to server
	go func() {
		_, err := io.Copy(proxySocket, conn)
		if err != nil {
			fmt.Println("Error forwarding data to proxy:", err)
		}
	}()

	//go routine to copy data from Server to client (proxy)
	go func() {
		_, err := io.Copy(conn, proxySocket)
		if err != nil {
			fmt.Println("Error forwarding data to client:", err)
		}
	}()

	//reading the data from client
	reader := bufio.NewReader(conn)
	for {
		data, err := reader.ReadString('\n')
		if err != nil {
			fmt.Println("Client disconnected:", conn.RemoteAddr())
			return
		}

		//logging the request
		fmt.Println("Request String:", data)

		//forward the received data from the Proxy Server to the Proxy Client
		_, err = proxySocket.Write([]byte(data))
		if err != nil {
			fmt.Println("Error forwarding modified request to proxy:", err)
			return
		}
	}
}
