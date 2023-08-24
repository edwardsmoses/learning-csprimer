package main

import (
	"bufio"
	"fmt"
	"io"
	"net"
	"strings"
	"sync"
)

var (
	SERVER_PORT = 9000
	CLIENT_PORT = ":9999"

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
	clientAddr := conn.RemoteAddr().String()
	fmt.Println("New connection from:", clientAddr)

	for {
		// Read the first line of the client's request to get the HTTP header info
		reader := bufio.NewReader(conn)
		data, err := reader.ReadString('\n')
		if err != nil {
			fmt.Println("Error reading from client:", err)
			return
		}

		headerInfo := parseHTTPHeader(data)
		fmt.Printf("HTTP Info: %+v\n", headerInfo)

		// Connect to the actual server
		destServerSocket, err := net.Dial("tcp", fmt.Sprintf("localhost:%d", SERVER_PORT))
		if err != nil {
			fmt.Println("Error connecting to proxy:", err)
			return
		}

		// Forward the first line of the client's request to the server
		_, err = destServerSocket.Write([]byte(data))
		if err != nil {
			fmt.Println("Error forwarding data to proxy:", err)
			destServerSocket.Close()
			return
		}

		var wg sync.WaitGroup
		wg.Add(2) // We have two goroutines

		// Goroutine to copy data from client (proxy) to server
		go func() {
			defer wg.Done()
			_, err := io.Copy(destServerSocket, reader)
			if err != nil {
				fmt.Println("Error forwarding data to proxy:", err)
			}
			destServerSocket.Close()
		}()

		// Goroutine to copy data from Server to client (proxy)
		go func() {
			defer wg.Done()
			_, err := io.Copy(conn, destServerSocket)
			if err != nil {
				fmt.Println("Error forwarding data to client:", err)
			}
		}()

		wg.Wait() // Wait for both goroutines to finish

		if headerInfo.connectionType != "Keep-Alive" {
			fmt.Println("Closing connection for client:", clientAddr)
			return
		}

		fmt.Println("Finished handling connection from:", clientAddr)
	}
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
