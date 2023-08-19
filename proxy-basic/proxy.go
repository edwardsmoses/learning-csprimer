package main

import (
	"bufio"
	"fmt"
	"net"
	"strings"
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
		_, err := conn.WriteTo(proxySocket)
		if err != nil {
			fmt.Println("Error forwarding data to proxy:", err)
		}
	}()

	go func() {
		_, err := proxySocket.WriteTo(conn)
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

		request := parseRequest(data)
		fmt.Println("Request Method:", request.method)
		fmt.Println("Request URL:", request.url)
		fmt.Println("Request Headers:", request.headers)

		_, err = proxySocket.Write([]byte(data))
		if err != nil {
			fmt.Println("Error forwarding modified request to proxy:", err)
			return
		}
	}
}

type httpRequest struct {
	method  string
	url     string
	version string
	headers map[string]string
}

func parseRequest(requestString string) httpRequest {
	lines := strings.Split(requestString, "\r\n")

	parts := strings.Split(lines[0], " ")
	method, url, version := parts[0], parts[1], parts[2]

	headers := make(map[string]string)
	for i := 1; i < len(lines); i++ {
		if lines[i] == "" {
			break
		}
		parts := strings.SplitN(lines[i], ": ", 2)
		headers[strings.ToLower(parts[0])] = parts[1]
	}

	return httpRequest{
		method:  method,
		url:     url,
		version: version,
		headers: headers,
	}
}
