package main

//PLAN to implement persistent connections with the proxy server:
// Objective; Extend proxy to respect keep alive semantics
// Non-objective: Maintain connection with the origin server

// Keep alive semantics:
// HTTP /1.0
// Close unless Connection: Keep-Alive header is present

// HTTP /1.1
// Keep-Alive (connection remains open) unless Connection: Close header is present

// HTTP /2.0 and /3.0 - not supported

// Steps:
// 1. DONE: Parse the HTTP request to determine the version of HTTP, and the Connection header
// 2. Create a map of connections with the key as the client address and the value as the connection
// 3. Check if the connection exists in the map
// 4. If it does, then use the existing connection to forward the request
// 5. If it does not, then create a new connection and add it to the map
// 6. Close the connection when the client disconnects
// 7. Remove the connection from the map when the client disconnects
// 8. Use a mutex to lock the map when adding or removing connections
// 9. Use a mutex to lock the map when reading or writing to the connection

import (
	"bufio"
	"fmt"
	"io"
	"net"
	"strings"
	"sync"
)

var (
	SERVER_PORT         = 9000
	CLIENT_PORT         = ":9999"
	existingConnections = make(map[string]net.Conn)
	mutex               = &sync.Mutex{}
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

	clientAddr := conn.RemoteAddr().String()

	var proxySocket net.Conn
	var connectionExists bool
	var err error

	fmt.Println("Existing connections", existingConnections)

	reader := bufio.NewReader(conn)
	httpHeader, err := reader.ReadString('\n')
	if err != nil {
		fmt.Println("Client disconnected:", clientAddr)
		return
	}

	headerInfo := parseHTTPHeader(httpHeader) // Assuming you have this function from previous examples
	fmt.Printf("HTTP Info: %+v\n", headerInfo)

	if headerInfo.connectionType == "Keep-Alive" {
		mutex.Lock()
		proxySocket, connectionExists = existingConnections[clientAddr]
		mutex.Unlock()
	}

	fmt.Println("Connection exists:", connectionExists)

	if !connectionExists {
		proxySocket, err = net.Dial("tcp", fmt.Sprintf("localhost:%d", SERVER_PORT))
		if err != nil {
			fmt.Println("Error connecting to proxy:", err)
			return
		}

		if headerInfo.connectionType == "Keep-Alive" {
			mutex.Lock()
			existingConnections[clientAddr] = proxySocket
			fmt.Println("we are here creating a new coonnection", clientAddr, proxySocket.LocalAddr(), existingConnections)
			mutex.Unlock()
		}
	}

	defer func() {
		if headerInfo.connectionType == "Keep-Alive" {
			mutex.Lock()
			delete(existingConnections, clientAddr)
			mutex.Unlock()
		}
		proxySocket.Close()
	}()

	fmt.Println("Client connected:", clientAddr)
	fmt.Println("Proxy in-progress to:", SERVER_PORT)

	var wg sync.WaitGroup
	wg.Add(2) // We have two goroutines

	go func() {
		defer wg.Done()
		_, err := io.Copy(proxySocket, conn)
		if err != nil {
			fmt.Println("Error forwarding data to proxy:", err)
		}
	}()

	go func() {
		defer wg.Done()
		_, err := io.Copy(conn, proxySocket)
		if err != nil {
			fmt.Println("Error forwarding data to client:", err)
		}
	}()

	wg.Wait() // Wait for both goroutines to finish

}

type HTTPHeaderInfo struct {
	connectionType string
	httpVersion    string
}

func parseHTTPHeader(data string) HTTPHeaderInfo {
	//parse the HTTP request to determine the version of HTTP, and the Connection header
	info := HTTPHeaderInfo{
		connectionType: "",
		httpVersion:    "",
	}

	lines := strings.Split(data, "\n")
	for _, line := range lines {
		if strings.Contains(line, "HTTP/") {
			parts := strings.Fields(line)
			for _, part := range parts {
				if strings.HasPrefix(part, "HTTP/") {
					info.httpVersion = part
					break
				}
			}
		} else if strings.HasPrefix(strings.ToLower(line), "connection:") {
			info.connectionType = strings.TrimSpace(strings.Split(line, ":")[1])
		}
	}

	// Handle Keep-Alive semantics
	switch info.httpVersion {
	case "HTTP/1.0":
		if info.connectionType != "Keep-Alive" {
			info.connectionType = "Close"
		}
	case "HTTP/1.1":
		if info.connectionType == "" {
			info.connectionType = "Keep-Alive"
		}
	}

	return info

}
